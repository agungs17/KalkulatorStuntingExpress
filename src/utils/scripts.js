import config from "../configurations";

export function formatResponse({
  identifier = 'Response',
  res,
  code = 200,
  data = null,
  msgSuccess = 'Permintaan berhasil.',
  msgError = 'Sepertinya ada yang tidak beres.',
  msgEmpty = 'Data tidak di temukan.',
}) {
  let status = code;
  let message = '';
  let finalData = null;

  if ([200, 201, 204].includes(status)) {
    if (Array.isArray(data) && data.length === 0) {
      status = 404;
      message = msgEmpty;
    } else {
      message = msgSuccess;
      finalData = data;
    }
  } else {
    message = msgError;
  }

  const result = {
    status,
    message,
    data: finalData,
  };

  if (config.logging === 'development') {
    console.log(`[${identifier}]`, result);
  }

  return res.status(status).json(result);
}