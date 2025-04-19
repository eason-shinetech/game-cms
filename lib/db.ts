import mongoose from "mongoose";

const MONGODB_URI =  process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("请定义MONGODB_URI环境变量");
}

interface CachedMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

interface GlobalWithMongoose {
  mongoose: CachedMongoose;
}

const globalWithMongoose = global as unknown as GlobalWithMongoose;

// 确保在热更新时保留连接缓存
const cached = globalWithMongoose.mongoose || { conn: null, promise: null };

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then(mongoose => {
      console.log("✅ 数据库连接成功");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

// 在开发模式下保留全局缓存
if (process.env.NODE_ENV !== "production") {
  globalWithMongoose.mongoose = cached;
}

export default dbConnect;
