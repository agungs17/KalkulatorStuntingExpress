import config from "../configurations";
import { sanitizeObject } from "../helpers/string";
import { getBaseUrl } from "../helpers/url";

const logflareInstance = async (req, result) => {
  if (!config.logflare.useLogflare) return;

  const path = req?.originalUrl || req?.url || "UnknownPath";
  const fullPath = getBaseUrl(req) + path;

  const header = req?.headers || {};
  const body = sanitizeObject(req?.body, ["password", "old_password", "confirmation_password"], "***") || {};

  try {
    const payload = {
      event_message: fullPath || "No path provided",
      metadata: { header, body, result } || {},
    };

    const res = await fetch(`https://api.logflare.app/logs?source=${config.logflare.sourceToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": config.logflare.apiKey,
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if(config.nodeEnv === "dev") console.log("[Logflare Response]", json);
  } catch (err) {
    if(config.nodeEnv === "dev") console.error("[Logflare Logging Error]", err.message);
  }
};

export default logflareInstance;
