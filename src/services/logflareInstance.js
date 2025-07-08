import config from "../configurations";

const logflareInstance = async (logData) => {
  try {
    const payload = {
      event_message: logData.event_message || "No path provided",
      metadata: logData.metadata || {},
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
