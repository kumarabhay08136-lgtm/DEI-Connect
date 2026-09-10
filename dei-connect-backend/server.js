import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`DEI Connect API running on http://localhost:${PORT}`);
  });

  // Fail loudly instead of leaving the process in a broken half-started state.
  process.on("unhandledRejection", (err) => {
    console.error("Unhandled promise rejection:", err);
    server.close(() => process.exit(1));
  });
}

start();
