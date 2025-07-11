import config from "../configurations";
import formatResponse from "../helpers/formatResponse";
import { getCache } from "../services/cacheInstance";

const getCacheMiddleware = (keyBuilder) => {
  return async (req, res, next) => {
    if(!config.upstashRedis.useUpstashRedis) return next();
    try {
      const key = typeof keyBuilder === "function" ? keyBuilder(req) : keyBuilder;
      const cachedResult = await getCache(key);

      if (cachedResult !== null) return formatResponse({ req, res, ...cachedResult });
      next();
    } catch (err) {
      next();
    }
  };
};

export default getCacheMiddleware;