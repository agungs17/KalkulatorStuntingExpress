import config from "../configurations";
import logflareInstance from "../services/logflareInstance";

const formatResponse = async({
  req = {},
  res = {},
  code,
  data,
  error,
  message
}) => {
  const msgSuccess = "Permintaan berhasil.";
  const msgError = "Sepertinya ada yang tidak beres.";
  const path = req?.originalUrl || req?.url || "UnknownPath";

  code = error ? code || 500 : code || 200;
  message = !error || code === 200 ? message || msgSuccess : message || msgError;

  let finalData = null;
  if (error && code !== 200) finalData = null;
  else finalData = data || null;

  let finalError = null;
  if (error) finalError = error?.message || error || null;

  const result = {
    code,
    message,
    data: finalData,
    error: finalError
  };

  if (config.logging) console.log(`[${path}]\r\n`, result);
  if (config.logflare.useLogflare) {
    const host = req?.headers?.host || "UnknownHost";
    const fullPath = `${req.protocol || "http"}://${host}${path}`;
    const header = req?.headers || {};
    await logflareInstance({
      event_message : fullPath,
      metadata : {
        header,
        result
      }});
  }

  return res.status(code).json(result);
};

export default formatResponse;