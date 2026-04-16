/**
 * Avatar proxy.
 *
 * The X profile_image_url points at pbs.twimg.com which doesn't return CORS
 * headers, so the browser can't load it onto a <canvas> via crossOrigin
 * (the canvas becomes "tainted" and toBlob() throws). We need to capture
 * the card to PNG for the share/copy flow, so we proxy the image through
 * our own origin where we control the CORS headers.
 *
 * GET /api/avatar?u=<encoded-twitter-image-url>
 *   - Only fetches whitelisted hosts (pbs.twimg.com, abs.twimg.com)
 *   - Streams the bytes back with same content-type and a 1-day cache
 *   - Adds Access-Control-Allow-Origin: * so browsers can canvas-paint it
 */
import { Router } from "express";

export const avatarRouter = Router();

const ALLOWED_HOSTS = new Set([
  "pbs.twimg.com",
  "abs.twimg.com",
  "ton.twimg.com",
]);

avatarRouter.get("/avatar", async (req, res) => {
  const raw = String(req.query.u ?? "");
  if (!raw) {
    return res.status(400).json({ error: "missing_u" });
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return res.status(400).json({ error: "invalid_url" });
  }

  if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname)) {
    return res.status(400).json({ error: "host_not_allowed" });
  }

  try {
    const upstream = await fetch(url.toString(), {
      // Don't forward cookies / referer
      headers: { "User-Agent": "altura-persona-bot" },
    });
    if (!upstream.ok || !upstream.body) {
      return res.status(upstream.status).json({ error: "upstream_error" });
    }

    res.setHeader(
      "Content-Type",
      upstream.headers.get("content-type") ?? "image/jpeg",
    );
    res.setHeader("Cache-Control", "public, max-age=86400, immutable");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    const buf = Buffer.from(await upstream.arrayBuffer());
    return res.send(buf);
  } catch (err) {
    console.error("[avatar proxy]", err);
    return res.status(502).json({ error: "fetch_failed" });
  }
});
