// Wraps an async route handler so rejected promises are forwarded to
// Express's error middleware instead of crashing the process or needing
// a try/catch block in every single controller.
export default function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
