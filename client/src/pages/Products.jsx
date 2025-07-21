import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";

const Products = () => {
  const { products } = useAppContext();

  console.log("Products page debug:", {
    productsCount: products?.length || 0,
    products: products?.slice(0, 3) || [],
    hasProducts: !!products
  });

  if (!products || products.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="animate-spin w-12 h-12 text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Loading Products...</h2>
          <p className="text-gray-500">Please wait while we fetch the products.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl lg:text-4xl font-medium mb-8">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products
          .filter((product) => product.inStock === undefined || product.inStock)
          .map((product, index) => (
            <ProductCard key={product._id || index} product={product} />
          ))}
      </div>
    </div>
  );
};
export default Products;
