export const getHeaders = (req) => {
  const authorization = req?.headers?.authorization || undefined;
  const deviceId = req?.headers?.["x-device-id"] || "NOT SET";
  const deviceName = req?.headers?.["x-device-name"] || "NOT SET";
  const appVersion = req?.headers?.["x-app-version"] || "NOT SET";
  const bulkToken = req?.headers?.["x-bulk-token"] || undefined;

  return { authorization, deviceId, deviceName, appVersion, bulkToken };
};
