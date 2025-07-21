import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { useAppContext, getImageUrl } from "../context/AppContext";

const SingleProduct = () => {
  const { id } = useParams();
  const { products, addToCart, removeFromCart, cartItems, navigate } = useAppContext();
  const [quantity, setQuantity] = useState(1);
  
  console.log("SingleProduct Debug:", {
    id,
    productsCount: products.length,
    product: products.find(p => p._id === id)
  });
  
  const product = products.find((product) => product._id === id);
  const [thumbnail, setThumbnail] = useState(product?.image[0] || null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (product) {
      setThumbnail(product.image[0] || null);
      setRelatedProducts(
        products.filter(
          (p) => p.category === product.category && p._id !== product._id
        ).slice(0, 5)
      );
    }
  }, [id, product, products]);

  const handleAddToCart = () => {
    if (product) {
      // Add the specified quantity to cart
      for (let i = 0; i < quantity; i++) {
        addToCart(product._id);
      }
    }
  };

  const handleBuyNow = () => {
    if (product) {
      // Add to cart first
      handleAddToCart();
      // Navigate to cart
      navigate("/cart");
    }
  };

  if (!product) {
    // Check if products are still loading
    if (products.length === 0) {
      return (
        <div className="mt-16 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="animate-spin w-12 h-12 text-indigo-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Loading Product...</h2>
            <p className="text-gray-500">Please wait while we fetch the product details.</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="mt-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/products"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 max-w-6xl mx-auto px-4">
      <p className="text-sm text-gray-600 mb-4">
        <Link to="/" className="hover:text-indigo-500">Home</Link> / 
        <Link to="/products" className="hover:text-indigo-500"> Products</Link> /
        <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-indigo-500"> {product.category}</Link> /
        <span className="text-indigo-500"> {product.name}</span>
      </p>
      
      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {product.image && product.image.length > 0 ? (
              product.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className="border max-w-20 border-gray-300 rounded overflow-hidden cursor-pointer hover:border-indigo-500 transition-colors"
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`${product.name} - Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("SingleProduct thumbnail failed to load:", {
                        productName: product.name,
                        imagePath: image,
                        index: index + 1
                      });
                      e.target.src = "https://via.placeholder.com/80x80?text=Image";
                      e.target.alt = `${product.name} - Thumbnail ${index + 1} not available`;
                    }}
                    onLoad={() => {
                      console.log("SingleProduct thumbnail loaded:", {
                        productName: product.name,
                        imagePath: image,
                        index: index + 1
                      });
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="border max-w-20 border-gray-300 rounded overflow-hidden">
                <img
                  src="https://via.placeholder.com/80x80?text=No+Images"
                  alt="No product images available"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="border border-gray-300 max-w-96 rounded overflow-hidden">
            <img
              src={getImageUrl(thumbnail)}
              alt={`${product.name} - Main Image`}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("SingleProduct main image failed to load:", {
                  productName: product.name,
                  imagePath: thumbnail
                });
                e.target.src = "https://via.placeholder.com/400x400?text=Product+Image";
                e.target.alt = `${product.name} - Main image not available`;
              }}
              onLoad={() => {
                console.log("SingleProduct main image loaded:", {
                  productName: product.name,
                  imagePath: thumbnail
                });
              }}
            />
          </div>
        </div>
        
        {/* Product details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-3 text-gray-800">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description.join(", ")}</p>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl text-indigo-600 font-bold">₹{product.offerPrice}</span>
            <span className="text-xl line-through text-gray-400">₹{product.price}</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
              {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
            </span>
          </div>
          
          <div className="flex items-center gap-2 mb-6">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="rating"
                  className="w-5"
                />
              ))}
            <span className="text-gray-600">(4.0)</span>
          </div>
          
          {/* Quantity selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <img src={assets.cart_icon} alt="cart" className="w-5 h-5" />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>
          
          {/* Cart quantity indicator */}
          {cartItems?.[product._id] && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-6">
              <p className="text-indigo-800 text-sm">
                <span className="font-medium">{cartItems[product._id]}</span> item(s) in cart
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200"
                >
                  Remove from Cart
                </button>
                <button
                  onClick={() => navigate("/cart")}
                  className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                >
                  View Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {relatedProducts.map((prod, idx) => (
              <ProductCard key={idx} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
