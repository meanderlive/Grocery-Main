import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Helper function to get image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    console.warn("getImageUrl: No image path provided");
    return 'https://via.placeholder.com/200x200?text=No+Image';
  }
  
  try {
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a relative path starting with /, remove the leading slash
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const fullUrl = `${backendUrl}/images/${cleanPath}`;
    
    console.log("getImageUrl:", { 
      originalPath: imagePath, 
      cleanPath, 
      backendUrl, 
      fullUrl 
    });
    
    return fullUrl;
  } catch (error) {
    console.error("getImageUrl error:", error);
    return 'https://via.placeholder.com/200x200?text=Error';
  }
};

export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // check seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      setIsSeller(false);
    }
  };

  // fetch user auth status ,user Data and cart items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cart);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // fetch products
  const fetchProducts = async () => {
    try {
      console.log("fetchProducts: Starting to fetch products...");
      const { data } = await axios.get("/api/product/list");
      console.log("fetchProducts: Response received:", data);
      if (data.success) {
        console.log("fetchProducts: Setting products, count:", data.products?.length);
        setProducts(data.products || []);
      } else {
        console.error("fetchProducts: API returned error:", data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("fetchProducts: Error occurred:", error);
      toast.error(error.message);
    }
  };
  // add product to cart
  const addToCart = (itemId) => {
    if (!itemId) {
      toast.error("Invalid product");
      return;
    }
    
    let cartData = structuredClone(cartItems || {}); // safeguard for undefined

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success(`cart updated`);
  };

  // total cart items
  const cartCount = () => {
    let totalCount = 0;
    if (!cartItems) return 0;
    
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };
  // total cart amount
  const totalCartAmount = () => {
    let totalAmount = 0;
    if (!cartItems || !products) return 0;
    
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo && cartItems[items] > 0) {
        const price = itemInfo.offerPrice || itemInfo.price || 0;
        const itemTotal = cartItems[items] * price;
        totalAmount += itemTotal;
        console.log(`Item: ${itemInfo.name}, Qty: ${cartItems[items]}, Price: ${price}, Total: ${itemTotal}`);
      }
    }
    const finalTotal = Math.floor(totalAmount * 100) / 100;
    console.log('Total Cart Amount:', finalTotal);
    return finalTotal;
  };
  // remove product from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
      toast.success(`remove from cart`);
      setCartItems(cartData);
    }
  };
  useEffect(() => {
    fetchSeller();
    fetchProducts();
    fetchUser();
  }, []);

  // update database cart items
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });

        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems]);
  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    cartCount,
    totalCartAmount,
    axios,
    fetchProducts,
    setCartItems,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
