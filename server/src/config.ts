import "dotenv/config";

function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 8787),
  nodeEnv: process.env.NODE_ENV ?? "development",
  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  xBearerToken: process.env.X_BEARER_TOKEN ?? "",
  altura: {
    apiUrl: required("ALTURA_API_URL", process.env.ALTURA_API_URL),
    apiKey: required("ALTURA_API_KEY", process.env.ALTURA_API_KEY),
  },
} as const;

export const isXConfigured = config.xBearerToken.length > 0;
