import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// Place order COD: /api/order/place
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address } = req.body;
    
    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }
    
    // calculate amount using items
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        amount += (product.offerPrice || product.price || 0) * item.quantity;
      }
    }

    // Add tax charge 2%
    amount += Math.floor((amount * 2) / 100);
    
    await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: "COD",
      isPaid: false,
    });
    
    res
      .status(201)
      .json({ message: "Order placed successfully", success: true });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// oredr details for individual user :/api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user;
    console.log("Fetching orders for user:", userId);
    
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    
    console.log("Found orders:", orders.length);
    
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get all orders for admin :/api/order/all
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
