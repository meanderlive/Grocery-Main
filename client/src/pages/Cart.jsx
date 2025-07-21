import { useEffect, useState } from "react";
import { useAppContext, getImageUrl } from "../context/AppContext";
import { dummyAddress } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    products,
    navigate,
    cartCount,
    totalCartAmount,
    cartItems,
    setCartItems,
    removeFromCart,
    updateCartItem,
    axios,
    user,
  } = useAppContext();

  // state to store the products available in cart
  const [cartArray, setCartArray] = useState([]);
  // state to address
  const [address, setAddress] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  // state for selected address
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const getCart = () => {
    let tempArray = [];
    if (!cartItems || !products || products.length === 0) {
      setCartArray([]);
      return;
    }
    
    for (const key in cartItems) {
      const product = products.find((product) => product._id === key);
      if (product) {
        // Create a copy of the product to avoid modifying the original
        const productWithQuantity = { ...product, quantity: cartItems[key] };
        tempArray.push(productWithQuantity);
      }
    }
    setCartArray(tempArray);
  };

  const getAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddress(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (user) {
      getAddress();
    }
  }, [user]);

  useEffect(() => {
    if (products && products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);
  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }
      
      console.log("Placing order with data:", {
        items: cartArray.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        address: selectedAddress._id,
      });
      
      // place order with cod
      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });
        
        console.log("Order response:", data);
        
        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          console.log("Navigating to my-orders");
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      } else if (paymentOption === "Online") {
        // Show payment modal for online payment
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.message);
    }
  };

  const handleOnlinePayment = async () => {
    try {
      if (paymentMethod === "upi" && !upiId) {
        return toast.error("Please enter UPI ID");
      }
      if (paymentMethod === "card") {
        if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
          return toast.error("Please fill all card details");
        }
      }

      // Simulate payment processing
      toast.loading("Processing payment...");
      
      // Here you would integrate with actual payment gateway
      // For now, we'll simulate a successful payment
      setTimeout(async () => {
        try {
          const { data } = await axios.post("/api/order/cod", {
            items: cartArray.map((item) => ({
              product: item._id,
              quantity: item.quantity,
            })),
            address: selectedAddress._id,
          });
          
          if (data.success) {
            toast.dismiss();
            toast.success("Payment successful! Order placed.");
            setCartItems({});
            setShowPaymentModal(false);
            navigate("/my-orders");
          } else {
            toast.dismiss();
            toast.error(data.message);
          }
        } catch (error) {
          toast.dismiss();
          toast.error("Payment failed. Please try again.");
        }
      }, 2000);
      
    } catch (error) {
      toast.dismiss();
      toast.error("Payment failed. Please try again.");
    }
  };
  // Check if cart is empty
  const isCartEmpty = !cartItems || Object.keys(cartItems).length === 0;
  const isProductsLoading = !products || products.length === 0;
  
  return isCartEmpty ? (
    <div className="flex flex-col items-center justify-center py-16 max-w-6xl w-full px-6 mx-auto min-h-[60vh]">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-12 h-12 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" 
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to your cart to get started!</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  ) : isProductsLoading ? (
    <div className="flex flex-col items-center justify-center py-16 max-w-6xl w-full px-6 mx-auto min-h-[60vh]">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="animate-spin w-12 h-12 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Loading Products...</h2>
        <p className="text-gray-500">Please wait while we load your cart items.</p>
      </div>
    </div>
  ) : (
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-indigo-500">{cartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray && cartArray.length > 0 ? (
          cartArray.map((product, index) => (
            <div
              key={index}
              className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
            >
              <div className="flex items-center md:gap-6 gap-3">
                <div
                  onClick={() => {
                    navigate(`/product/${product.category}/${product._id}`);
                    scrollTo(0, 0);
                  }}
                  className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded cursor-pointer"
                >
                  <img
                    className="max-w-full h-full object-cover"
                    src={getImageUrl(product.image[0])}
                    alt={product.name || 'Product Image'}
                    onError={(e) => {
                      console.error("Cart image failed to load:", {
                        productName: product.name,
                        imagePath: product.image[0],
                        currentSrc: e.target.src
                      });
                      e.target.src = "https://via.placeholder.com/96x96?text=Product";
                      e.target.alt = `${product.name || 'Product'} - Image not available`;
                    }}
                    onLoad={() => {
                      console.log("Cart image loaded successfully:", {
                        productName: product.name,
                        imagePath: product.image[0]
                      });
                    }}
                  />
                </div>
                <div>
                  <p className="hidden md:block font-semibold">{product.name}</p>
                  <div className="font-normal text-gray-500/70">
                    <p>
                      Weight: <span>{product.weight || "N/A"}</span>
                    </p>
                    <div className="flex items-center">
                      <p>Qty:</p>
                      <select
                        onChange={(e) =>
                          updateCartItem(product._id, Number(e.target.value))
                        }
                        value={cartItems[product._id]}
                        className="outline-none"
                      >
                        {Array(
                          cartItems[product._id] > 9 ? cartItems[product._id] : 9
                        )
                          .fill("")
                          .map((_, index) => (
                            <option key={index} value={index + 1}>
                              {index + 1}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center">
                ₹{((product.offerPrice || product.price || 0) * product.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(product._id)}
                className="cursor-pointer mx-auto"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                    stroke="#FF532E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No items in cart</p>
          </div>
        )}

        <button
          onClick={() => navigate("/products")}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium"
        >
          <svg
            width="15"
            height="11"
            viewBox="0 0 15 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
              stroke="#615fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Continue Shopping
        </button>
      </div>
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />
        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.street},${selectedAddress.city},${selectedAddress.state},${selectedAddress.country}`
                : "No Address Found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-indigo-500 hover:underline cursor-pointer"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                {address.map((address, index) => (
                  <p
                    key={index}
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100"
                  >
                    {address.street}, {address.city}, {address.state},{" "}
                    {address.country},
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="text-indigo-500 text-center cursor-pointer p-2 hover:bg-indigo-500/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>₹{totalCartAmount()}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>₹{(totalCartAmount() * 2) / 100}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>₹{totalCartAmount() + (totalCartAmount() * 2) / 100}</span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition"
        >
          {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
        </button>
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Payment Details</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Total Amount: ₹{totalCartAmount() + (totalCartAmount() * 2) / 100}</p>
            </div>
            
            <div className="mb-4">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setPaymentMethod("upi")}
                  className={`flex-1 py-2 px-3 rounded border ${
                    paymentMethod === "upi" 
                      ? "border-indigo-500 bg-indigo-50 text-indigo-600" 
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  UPI
                </button>
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 py-2 px-3 rounded border ${
                    paymentMethod === "card" 
                      ? "border-indigo-500 bg-indigo-50 text-indigo-600" 
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  Card
                </button>
              </div>
              
              {paymentMethod === "upi" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                    <input
                      type="text"
                      placeholder="example@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                    <p>Popular UPI Apps:</p>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-white px-2 py-1 rounded text-xs">Google Pay</span>
                      <span className="bg-white px-2 py-1 rounded text-xs">PhonePe</span>
                      <span className="bg-white px-2 py-1 rounded text-xs">Paytm</span>
                      <span className="bg-white px-2 py-1 rounded text-xs">BHIM</span>
                    </div>
                  </div>
                </div>
              )}
              
              {paymentMethod === "card" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleOnlinePayment}
                className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Pay ₹{totalCartAmount() + (totalCartAmount() * 2) / 100}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
