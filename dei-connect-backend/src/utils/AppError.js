// A thrown AppError carries the HTTP status code it should map to, so
// controllers can just `throw new AppError("Post not found", 404)` and
// let the central error handler turn it into a clean JSON response.
export default class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
