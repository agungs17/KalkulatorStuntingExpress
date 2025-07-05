import config from "../configurations";

const formatResponse = ({
  req = {},
  res = {},
  code,
  data,
  error,
  message
}) => {
  const msgSuccess = "Permintaan berhasil.";
  const msgError = "Sepertinya ada yang tidak beres.";
  const path = req?.path || "UnknownPath";

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

  return res.status(code).json(result);
};

export default formatResponse;