exports.success = (result, statusCode) => {
  return {
    code: statusCode,
    status: "success",
    result: result,
  };
};

exports.error = (title, messageTh, messageEn, statusCode) => {
  const codes = [200, 201, 400, 401, 404, 403, 422, 500];
  const findCode = codes.find((code) => code == statusCode);

  if (!findCode) statusCode = 500;
  else statusCode = findCode;

  return {
    code: statusCode,
    status: "error",
    error: {
      title: title,
      messageTh: messageTh,
      messageEn: messageEn,
    },
  };
};
