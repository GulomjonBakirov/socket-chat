import mongoose, { ConnectOptions } from "mongoose";

async function connectDB() {
  console.log("MONGO_URI: ", process.env.MONGO_STR);

  return mongoose
    .connect(process.env.MONGO_STR, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.error("Database error", error);
      process.exit(1);
    });
}

export { connectDB };
