import { assets } from "../assets/assets";
import { useAppContext, getImageUrl } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate } = useAppContext();
  
  // Add error boundary for the component
  if (!product) {
    console.warn("ProductCard: No product provided");
    return null;
  }
  
  const handleProductClick = () => {
    try {
      const path = `/product/${product.category.toLowerCase()}/${product?._id}`;
      console.log("ProductCard Navigation:", {
        productId: product?._id,
        productName: product?.name,
        category: product?.category,
        path: path
      });
      navigate(path);
      scrollTo(0, 0);
    } catch (error) {
      console.error("ProductCard navigation error:", error);
    }
  };
  
  return (
    <div
      onClick={handleProductClick}
      className="border border-gray-500/20 rounded-md p-4 bg-white h-80 w-full max-w-64 flex flex-col hover:shadow-lg transition-shadow duration-300"
    >
      <div className="group cursor-pointer flex items-center justify-center h-40 mb-3">
        <img
          className="group-hover:scale-105 transition-transform duration-300 w-full h-full object-cover rounded-md"
          src={getImageUrl(product.image?.[0])}
          alt={product.name || 'Product Image'}
          onError={(e) => {
            console.error("ProductCard image failed to load:", {
              productName: product.name,
              imagePath: product.image?.[0],
              currentSrc: e.target.src
            });
            e.target.src = "https://via.placeholder.com/200x200?text=Product+Image";
            e.target.alt = `${product.name || 'Product'} - Image not available`;
          }}
          onLoad={() => {
            console.log("ProductCard image loaded successfully:", {
              productName: product.name,
              imagePath: product.image?.[0]
            });
          }}
        />
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <div className="text-gray-500/60 text-sm">
          <p className="text-xs uppercase tracking-wide text-indigo-600 font-medium mb-1">
            {product.category}
          </p>
          <p className="text-gray-700 font-medium text-base line-clamp-2 mb-2">
            {product.name}
          </p>
          <div className="flex items-center gap-0.5 mb-3">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="rating"
                  className="w-3"
                />
              ))}
            <p className="text-xs ml-1">(4)</p>
          </div>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-indigo-500">
              ₹{product.offerPrice}
            </p>
            <p className="text-gray-500/60 text-sm line-through">
              ₹{product.price}
            </p>
          </div>
          
          <div
            onClick={(e) => e.stopPropagation()}
            className="text-indigo-500"
          >
            {!cartItems?.[product?._id] ? (
              <button
                onClick={() => addToCart(product?._id)}
                className="flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-300 w-20 h-8 rounded text-indigo-600 font-medium cursor-pointer hover:bg-indigo-200 transition-colors"
              >
                <img src={assets.cart_icon} alt="cart icon" className="w-4 h-4" />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 w-20 h-8 bg-indigo-500/25 rounded select-none">
                <button
                  onClick={() => removeFromCart(product?._id)}
                  className="cursor-pointer text-md px-2 h-full hover:bg-indigo-100 rounded-l transition-colors"
                >
                  -
                </button>
                <span className="w-5 text-center text-sm font-medium">
                  {cartItems[product?._id]}
                </span>
                <button
                  onClick={() => addToCart(product?._id)}
                  className="cursor-pointer text-md px-2 h-full hover:bg-indigo-100 rounded-r transition-colors"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
