import { Router, type Request } from "express";
import crypto from "node:crypto";
import { recordShare, listAllShares } from "../services/db.js";
import { config, isDatabaseConfigured } from "../config.js";

export const shareRouter = Router();

/** Stable, anonymous IP fingerprint so we don't store raw IPs. */
function hashIp(req: Request): string | null {
  const ip =
    (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ??
    req.socket.remoteAddress ??
    null;
  if (!ip) return null;
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

const VALID_SOURCES = new Set(["vault", "x", "fallback"]);

/**
 * POST /api/share
 *
 * Body:
 *   {
 *     username: string,
 *     archetype: { key, name, source },
 *     trigger?: string,
 *     isHolder: boolean,
 *     pnlUSD?: number | null,
 *     costBasisUSD?: number | null,
 *     walletAddress?: string | null
 *   }
 *
 * Records a single raffle entry. The frontend calls this when the user
 * clicks "Share on X" so we know they completed the share intent.
 */
shareRouter.post("/share", async (req, res) => {
  if (!isDatabaseConfigured) {
    return res.status(503).json({ error: "share_tracking_disabled" });
  }

  const body = req.body ?? {};
  const username = String(body.username ?? "").trim().replace(/^@/, "");
  const archetype = body.archetype ?? {};

  if (!username || username.length < 2) {
    return res.status(400).json({ error: "invalid_username" });
  }
  if (
    !archetype.key ||
    !archetype.name ||
    !VALID_SOURCES.has(archetype.source)
  ) {
    return res.status(400).json({ error: "invalid_archetype" });
  }

  try {
    const id = await recordShare({
      username,
      archetypeKey: String(archetype.key),
      archetypeName: String(archetype.name),
      archetypeSource: archetype.source,
      isHolder: Boolean(body.isHolder),
      pnlUSD: body.pnlUSD != null ? Number(body.pnlUSD) : null,
      costBasisUSD: body.costBasisUSD != null ? Number(body.costBasisUSD) : null,
      walletAddress: body.walletAddress ?? null,
      ipHash: hashIp(req),
      userAgent: (req.headers["user-agent"] as string | undefined) ?? null,
      trigger: body.trigger ?? null,
    });
    return res.json({ ok: true, id });
  } catch (err) {
    console.error("[share]", err);
    return res.status(500).json({ error: "internal_error" });
  }
});

/**
 * GET /api/admin/shares.csv
 * Header: Authorization: Bearer <ADMIN_TOKEN>
 *
 * Exports all shares as CSV for the raffle draw.
 */
shareRouter.get("/admin/shares.csv", async (req, res) => {
  const auth = req.headers.authorization ?? "";
  const expected = `Bearer ${config.adminToken}`;
  if (!config.adminToken || auth !== expected) {
    return res.status(401).json({ error: "unauthorized" });
  }
  if (!isDatabaseConfigured) {
    return res.status(503).json({ error: "share_tracking_disabled" });
  }

  try {
    const rows = await listAllShares();
    const header =
      "id,username,archetype_key,archetype_name,archetype_source,is_holder,pnl_usd,cost_basis_usd,wallet_address,trigger,shared_at";
    const csvRows = rows.map((r) =>
      [
        r.id,
        csvEscape(r.username),
        csvEscape(r.archetype_key),
        csvEscape(r.archetype_name),
        csvEscape(r.archetype_source),
        r.is_holder,
        r.pnl_usd ?? "",
        r.cost_basis_usd ?? "",
        csvEscape(r.wallet_address ?? ""),
        csvEscape(r.trigger ?? ""),
        r.shared_at.toISOString(),
      ].join(","),
    );
    const body = [header, ...csvRows].join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="altura-persona-shares-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
    );
    return res.send(body);
  } catch (err) {
    console.error("[admin shares]", err);
    return res.status(500).json({ error: "internal_error" });
  }
});

function csvEscape(value: string): string {
  if (value == null) return "";
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
