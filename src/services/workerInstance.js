import { Client } from "@upstash/qstash";
import config from "../configurations";
import { getBaseUrl } from "../helpers/url";

const worker = new Client({
  token: config.upstashQStash.token
});

const workerInstance = async ({ req, path, body }) => {
  const baseUrl = getBaseUrl(req);
  return await worker.publish({
    url: `${baseUrl}${path}`,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "X-Secret-Key" : config.secretKey
    },
  });
};


export default workerInstance;