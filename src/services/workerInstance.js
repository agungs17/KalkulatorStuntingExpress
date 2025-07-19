import { Client } from "@upstash/qstash";
import config from "../configurations";
import { getBaseUrl } from "../helpers/url";

const qstash = new Client({
  token: config.upstashQStash.token
});

const workerInstance = async({req, path, body}) => {
  const baseUrl = getBaseUrl(req);
  return await qstash.publish({ url: `${baseUrl}${path}`, body});
};

export default workerInstance;