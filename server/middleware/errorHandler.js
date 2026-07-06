export default function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = err.isOperational ? err.message : "Something went wrong";

  if (statusCode === 500) console.error(err);

  res.status(statusCode).json({
    status: "error",
    code,
    message,
    ...(err.details ? { details: err.details } : {}),
  });
}