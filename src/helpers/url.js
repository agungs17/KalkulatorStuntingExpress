export const getBaseUrl = (req) => {
  if (!req) throw new Error("req is required getBaseUrl");

  const protocol = req?.protocol || "http";
  const host = req?.headers?.host;
  return host ? `${protocol}://${host}` : null;
};
