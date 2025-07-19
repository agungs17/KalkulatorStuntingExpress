export const getHeaders = (req) => {
  const authorization = req?.headers?.authorization || undefined;
  const deviceId = req?.headers?.["x-device-id"] || "NOT SET";
  const deviceName = req?.headers?.["x-device-name"] || "NOT SET";
  const appVersion = req?.headers?.["x-app-version"] || "NOT SET";
  const secretKey = req?.headers?.["x-secret-key"] || undefined;

  return { authorization, deviceId, deviceName, appVersion, secretKey };
};
