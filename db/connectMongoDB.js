import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URL ||
        "mongodb+srv://pardhanmanish7887:jBpVeZtxbeqDp9xJ@test-usertrail.c8xfj.mongodb.net/userTrail"
    );
    console.log(`MongoDB connected`);
  } catch (error) {
    console.error(`Error connection to mongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectMongoDB;
