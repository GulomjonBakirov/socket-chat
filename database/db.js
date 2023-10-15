import mongoose from "mongoose";

async function connectDB() {
  console.log("MONGO_URI: ", process.env.MONGO_URI);

  const { connection } = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`mongodb connected: ${connection.host}`);
}

export { connectDB };
