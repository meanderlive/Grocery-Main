import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const normalizeCategory = (str) => str.toLowerCase().replace(/\s+/g, "-");

const ProductCategory = () => {
  const { category } = useParams();
  const { products } = useAppContext();
  
  console.log("ProductCategory Debug:", {
    category,
    productsCount: products.length,
    categories: categories.map(c => ({ path: c.path, normalized: normalizeCategory(c.path) }))
  });
  
  // Find the category object by normalized path
  const searchCategory = categories.find(
    (item) => normalizeCategory(item.path) === category
  );
  
  console.log("Search Category:", searchCategory);
  
  // Filter products by category (case-insensitive)
  const filteredProducts = products.filter(
    (product) => {
      const normalizedProductCategory = normalizeCategory(product.category);
      const normalizedSearchCategory = category;
      console.log(`Comparing: "${normalizedProductCategory}" with "${normalizedSearchCategory}"`);
      return normalizedProductCategory === normalizedSearchCategory;
    }
  );
  
  console.log("Filtered Products:", {
    count: filteredProducts.length,
    products: filteredProducts.map(p => ({ name: p.name, category: p.category, normalized: normalizeCategory(p.category) }))
  });
  
  return (
    <div className="mt-16 max-w-7xl mx-auto px-4">
      {searchCategory && (
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-medium">
            {searchCategory.text.toUpperCase()}
          </h1>
        </div>
      )}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h1 className="text-3xl md:text-4xl font-medium mb-4">
            No products found
          </h1>
          <p className="text-gray-500 mb-6">
            No products found for category: "{category}"
          </p>
          <p className="text-sm text-gray-400">
            Available categories: {categories.map(c => normalizeCategory(c.path)).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};
export default ProductCategory;
