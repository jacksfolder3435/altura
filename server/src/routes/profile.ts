import { Router } from "express";
import { fetchAlturaHolder } from "../services/altura.js";
import { fetchXProfile } from "../services/x.js";
import { resolvePersona } from "../services/persona.js";
import { isXConfigured } from "../config.js";

export const profileRouter = Router();

/**
 * GET /api/profile/:username
 *
 * Returns the combined profile used by the frontend to render either the
 * standard "Digital DeFi Profile" card or the special "Platinum PNL" card
 * (when the user is an Altura holder).
 */
profileRouter.get("/profile/:username", async (req, res) => {
  const username = String(req.params.username ?? "").trim();
  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  try {
    // Fan-out: fetch X + Altura in parallel. Either one is allowed to fail
    // gracefully (X may not be configured yet, Altura may not have the user).
    const [xResult, alturaResult] = await Promise.allSettled([
      isXConfigured ? fetchXProfile(username) : Promise.resolve(null),
      fetchAlturaHolder(username),
    ]);

    const xProfile = xResult.status === "fulfilled" ? xResult.value : null;
    const altura =
      alturaResult.status === "fulfilled" ? alturaResult.value : null;

    if (xResult.status === "rejected") {
      console.error("[X API]", xResult.reason);
    }
    if (alturaResult.status === "rejected") {
      console.error("[Altura API]", alturaResult.reason);
    }

    // Run the data-driven persona engine
    const persona = resolvePersona(xProfile, altura);

    return res.json({
      username: username.replace(/^@/, ""),
      x: xProfile,
      altura,
      persona,
      cardType: altura?.isHolder ? "platinum" : "standard",
      xConfigured: isXConfigured,
    });
  } catch (err) {
    console.error("[profile]", err);
    return res.status(500).json({ error: "internal_error" });
  }
});
