import mongoose from "mongoose";
import Product from "./models/product.model.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/grocery";

async function seedProducts() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    // Read products from JSON
    const productsPath = path.join(path.resolve(), "./models/groceryproducts.json");
    const productsData = JSON.parse(fs.readFileSync(productsPath, "utf-8"));

    // Remove all existing products
    await Product.deleteMany({});
    // Insert new products
    await Product.insertMany(productsData);
    console.log("Products seeded successfully");
    process.exit();
  } catch (err) {
    console.error("Error seeding products:", err);
    process.exit(1);
  }
}

seedProducts(); 