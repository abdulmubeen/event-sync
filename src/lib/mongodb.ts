import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://admin:admin@cluster0.myedu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: Cached | undefined;
}

const cached: Cached = global.mongoose || { conn: null, promise: null };

if (!cached) {
  global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      if (mongoose.connection.db) {
        console.log(
          "Connected to MongoDB database:",
          mongoose.connection.db.databaseName
        );
      }
      if (mongoose.connection.collections.favoriteevents) {
        console.log(
          "Collection name:",
          mongoose.connection.collections.favoriteevents.collectionName
        );
      }
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
