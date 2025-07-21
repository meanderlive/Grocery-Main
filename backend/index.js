import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDB.js";
dotenv.config();
import userRoutes from "./routes/user.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

import { connectCloudinary } from "./config/cloudinary.js";

const app = express();

// Connect to database first
await connectDB();

// Connect to Cloudinary
try {
  await connectCloudinary();
  console.log("Cloudinary connected successfully");
} catch (error) {
  console.error("Cloudinary connection failed:", error.message);
  console.log("Continuing without Cloudinary...");
}

// allow multiple origins
const allowedOrigins = ["http://localhost:5173"];
//middlewares
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Api endpoints
app.use("/images", express.static("uploads"));
console.log("Static file serving configured for /images -> uploads directory");

// Test endpoint to list available images
app.get("/test-images", (req, res) => {
  const fs = require('fs');
  const path = require('path');
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const files = fs.readdirSync(uploadsDir);
    res.json({ 
      message: "Available images", 
      count: files.length, 
      files: files.slice(0, 10), // Show first 10 files
      uploadsDir: uploadsDir,
      staticPath: "/images"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint to check if a specific image exists
app.get("/test-image/:filename", (req, res) => {
  const fs = require('fs');
  const path = require('path');
  try {
    const filename = req.params.filename;
    const filePath = path.join(process.cwd(), 'uploads', filename);
    const exists = fs.existsSync(filePath);
    res.json({ 
      filename,
      exists,
      filePath,
      url: `/images/${filename}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🖼️  Image test: http://localhost:${PORT}/test-images`);
});
