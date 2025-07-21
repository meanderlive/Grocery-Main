import Stripe from 'stripe';
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// Initialize Stripe only if API key is available
let stripe = null;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log("Stripe initialized successfully");
  } else {
    console.log("Stripe API key not found. Payment features will be simulated.");
  }
} catch (error) {
  console.error("Failed to initialize Stripe:", error.message);
  console.log("Payment features will be simulated.");
}

// Create payment intent for online payment
export const createPaymentIntent = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address } = req.body;
    
    if (!address || !items || items.length === 0) {
      return res.status(400).json({ 
        message: "Invalid order details", 
        success: false 
      });
    }
    
    // Calculate amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        amount += (product.offerPrice || product.price || 0) * item.quantity;
      }
    }
    
    // Add tax (2%)
    amount += Math.floor((amount * 2) / 100);
    
    if (!stripe) {
      // Simulate payment intent for development
      const mockPaymentIntent = {
        client_secret: 'mock_client_secret_' + Date.now(),
        id: 'mock_payment_intent_' + Date.now()
      };
      
      res.status(200).json({
        success: true,
        clientSecret: mockPaymentIntent.client_secret,
        amount: amount,
        paymentIntentId: mockPaymentIntent.id,
        isSimulated: true
      });
      return;
    }
    
    // Convert to cents for Stripe
    const amountInCents = Math.round(amount * 100);
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'inr',
      metadata: {
        userId: userId,
        addressId: address,
        items: JSON.stringify(items)
      }
    });
    
    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: amount,
      paymentIntentId: paymentIntent.id
    });
    
  } catch (error) {
    console.error("Payment intent creation error:", error);
    res.status(500).json({ 
      message: "Payment setup failed", 
      success: false 
    });
  }
};

// Confirm payment and create order
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, items, address } = req.body;
    const userId = req.user;
    
    if (!paymentIntentId || !items || !address) {
      return res.status(400).json({ 
        message: "Missing payment details", 
        success: false 
      });
    }
    
    // For simulated payments, skip verification
    if (!stripe || paymentIntentId.startsWith('mock_')) {
      console.log("Processing simulated payment:", paymentIntentId);
    } else {
      // Verify payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ 
          message: "Payment not completed", 
          success: false 
        });
      }
    }
    
    // Calculate amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        amount += (product.offerPrice || product.price || 0) * item.quantity;
      }
    }
    
    // Add tax (2%)
    amount += Math.floor((amount * 2) / 100);
    
    // Create order
    await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "Online",
      isPaid: true,
      paymentIntentId: paymentIntentId
    });
    
    res.status(201).json({ 
      message: "Order placed successfully", 
      success: true 
    });
    
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({ 
      message: "Order placement failed", 
      success: false 
    });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    
    if (!stripe || paymentIntentId.startsWith('mock_')) {
      // Return simulated status
      res.status(200).json({
        success: true,
        status: 'succeeded',
        amount: 0,
        isSimulated: true
      });
      return;
    }
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.status(200).json({
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100
    });
    
  } catch (error) {
    console.error("Payment status check error:", error);
    res.status(500).json({ 
      message: "Failed to check payment status", 
      success: false 
    });
  }
}; 