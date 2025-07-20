import { Client } from "@upstash/qstash";
import config from "../configurations";
import { getBaseUrl } from "../helpers/url";

const worker = new Client({
  token: config.upstashQStash.token,
});

const workerInstance = async ({ req, path, body, onFailed = () => {} }) => {
  const baseUrl = getBaseUrl(req);
  try {
    if(config.logging) console.log(`QStash success [${path}] : `, body);
    return await worker.publish({
      url: `${baseUrl}${path}`,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "X-Secret-Key": config.secretKey
      },
    });
  } catch (error) {
    if(config.logging) console.log(`QStash failed [${path}] : ${error.message}`);
    onFailed({req, path, body});
  }
};

export default workerInstance;
