import multer from "multer";

// Translates known Mongoose/Multer/JWT error shapes into a clean,
// consistent JSON response: { message, errors? }. Anything unrecognised
// falls back to a generic 500 so internals never leak to the client.
export default function errorHandler(err, req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong on the server.";
  let errors;

  if (err instanceof multer.MulterError) {
    statusCode = 400;
    message =
      err.code === "LIMIT_FILE_SIZE" ? "That file is too large." : "File upload failed.";
  } else if (err.name === "ValidationError") {
    // Mongoose schema validation error
    statusCode = 400;
    errors = Object.values(err.errors).map((e) => e.message);
    message = "Please check the fields you submitted.";
  } else if (err.code === 11000) {
    // Mongoose duplicate key error (e.g. email already registered)
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "value";
    message = `That ${field} is already in use.`;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid session — please log in again.";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired — please log in again.";
  }

  if (process.env.NODE_ENV !== "production" && statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    message,
    ...(errors ? { errors } : {}),
    ...(process.env.NODE_ENV !== "production" && statusCode === 500 ? { stack: err.stack } : {}),
  });
}
