export function success(res, data, meta = {}, statusCode = 200) {
  return res.status(statusCode).json({
    status: "success",
    code: "OK",
    data,
    meta: { timestamp: new Date().toISOString(), ...meta },
  });
}

export function created(res, data, meta = {}) {
  return success(res, data, meta, 201);
}

export function noContent(res) {
  return res.status(204).send();
}