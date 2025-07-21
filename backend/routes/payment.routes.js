import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus,
} from "../controller/payment.controller.js";

const router = express.Router();

// Create payment intent
router.post("/create-intent", authUser, createPaymentIntent);

// Confirm payment and create order
router.post("/confirm", authUser, confirmPayment);

// Get payment status
router.get("/status/:paymentIntentId", authUser, getPaymentStatus);

export default router; 