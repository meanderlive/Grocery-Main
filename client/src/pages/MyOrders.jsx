import { useContext, useEffect, useState } from "react";
import { AppContext, getImageUrl } from "../context/AppContext";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { axios, user, navigate } = useContext(AppContext);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders || []);
      } else {
        setError(data.message || "Failed to fetch orders");
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message || "Failed to fetch orders");
      toast.error(error.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Loading state
  if (loading) {
    return (
      <div className="mt-12 pb-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="animate-spin w-12 h-12 text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Loading Orders...</h2>
          <p className="text-gray-500">Please wait while we fetch your orders.</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-12 pb-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Error Loading Orders</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!myOrders || myOrders.length === 0) {
    return (
      <div className="mt-12 pb-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Orders Found</h2>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 pb-16">
      <div>
        <p className="text-2xl md:text-3xl font-medium">My Orders</p>
      </div>

      {myOrders.map((order, index) => (
        <div
          key={order._id || index}
          className="my-8 border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
        >
          <p className="flex justify-between items-center gap-6">
            <span>Order ID: {order._id}</span>
            <span>Payment: {order.paymentType}</span>
            <span>Total Amount: ₹{order.amount}</span>
          </p>
          
          {order.items && order.items.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className={`relative bg-white text-gray-800/70 ${
                order.items.length !== itemIndex + 1 && "border-b"
              } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 w-full max-w-4xl`}
            >
              <div className="flex items-center mb-4 md:mb-0">
                <div className="p-4 rounded-lg">
                  <img
                    src={getImageUrl(item.product?.image?.[0])}
                    alt={item.product?.name || 'Product Image'}
                    className="w-16 h-16 object-cover"
                    onError={(e) => {
                      console.error("Order image failed to load:", {
                        productName: item.product?.name,
                        imagePath: item.product?.image?.[0],
                        currentSrc: e.target.src
                      });
                      e.target.src = "https://via.placeholder.com/64x64?text=Product";
                      e.target.alt = `${item.product?.name || 'Product'} - Image not available`;
                    }}
                    onLoad={() => {
                      console.log("Order image loaded successfully:", {
                        productName: item.product?.name,
                        imagePath: item.product?.image?.[0]
                      });
                    }}
                  />
                </div>

                <div className="ml-4">
                  <h2 className="text-xl font-medium">{item.product?.name || 'Product Name Not Available'}</h2>
                  <p>{item.product?.category || 'Category Not Available'}</p>
                </div>
              </div>

              <div className="text-lg font-medium">
                <p>Quantity: {item.quantity || "1"}</p>
                <p>Status: {order.status || "Processing"}</p>
                <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              
              <p className="text-lg">
                Amount: ₹{((item.product?.offerPrice || item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
