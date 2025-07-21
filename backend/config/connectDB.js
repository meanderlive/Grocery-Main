import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/grocery-app";
    
    if (!process.env.MONGO_URI) {
      console.log("⚠️  MONGO_URI not found in environment variables");
      console.log("📝 Using default MongoDB URI:", mongoUri);
      console.log("💡 Create a .env file with your MongoDB connection string");
    }
    
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    console.log("💡 Make sure MongoDB is running and the connection string is correct");
    console.log("📝 You can create a .env file with: MONGO_URI=your_mongodb_connection_string");
    
    // Don't exit the process, let it continue with simulated features
    console.log("🔄 Continuing with limited functionality...");
  }
};
