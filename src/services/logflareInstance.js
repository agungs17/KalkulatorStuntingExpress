import config from "../configurations";
import dayjs from "../helpers/dayjsLocale";

const logflareInstance = async (logData) => {
  try {
    const localDateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const payload = {
      event_message: logData.event_message || "No path provided",
      metadata: { ...logData.metadata, local_date_time : localDateTime } || {},
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
