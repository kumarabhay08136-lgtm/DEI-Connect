import mongoose from "mongoose";

export default async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.error(
      "\n❌ MONGO_URI is not set.\n" +
        "   Open dei-connect-backend/.env and set MONGO_URI to your MongoDB connection string.\n" +
        "   Local Mongo:  mongodb://127.0.0.1:27017/dei_connect\n" +
        "   Atlas:        mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/dei_connect\n"
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.warn(`⚠️  Primary MongoDB connection failed: ${err.message}`);
    console.log("   Attempting fallback to local MongoDB at mongodb://127.0.0.1:27017/dei_connect ...");
    try {
      const fallbackConn = await mongoose.connect("mongodb://127.0.0.1:27017/dei_connect", {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ Fallback MongoDB connected: ${fallbackConn.connection.host}/${fallbackConn.connection.name}`);
    } catch (fallbackErr) {
      console.error(
        `\n❌ Both primary and fallback MongoDB connections failed: ${fallbackErr.message}\n` +
          "   Check that:\n" +
          "   1. MongoDB is actually running (if local: is `mongod` started?)\n" +
          "   2. MONGO_URI in dei-connect-backend/.env is correct\n" +
          "   3. If using Atlas: your IP is allowed in Network Access\n"
      );
      process.exit(1);
    }
  }

  // Catch connection drops *after* the initial successful connect (e.g. the
  // Mongo server restarts, or a network blip) so they show up in the logs
  // instead of silently breaking every request that follows.
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected.");
  });
}
