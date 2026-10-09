import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function CategoryProducts() {
  const { categoryName } = useParams();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 6;

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const categoryResponse = await fetch(
          "http://localhost:5000/category/list"
        );

        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch categories");
        }

        const categoryData = await categoryResponse.json();

        const categories = Array.isArray(categoryData)
          ? categoryData
          : categoryData.categories || [];

        const selectedCategory = categories.find(
          (item) =>
            item.name.toLowerCase() ===
            decodeURIComponent(categoryName).toLowerCase()
        );

        if (!selectedCategory) {
          throw new Error("Category not found");
        }

        setCategory(selectedCategory);

        const productResponse = await fetch(
          `http://localhost:5000/category/${selectedCategory._id}/products`
        );

        if (!productResponse.ok) {
          throw new Error("Failed to fetch category products");
        }

        const productData = await productResponse.json();

        setProducts(
          Array.isArray(productData)
            ? productData
            : productData.products || []
        );

        setCurrentPage(1);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  const totalPages = Math.ceil(
    products.length / productsPerPage
  );

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const currentProducts = products.slice(
    startIndex,
    startIndex + productsPerPage
  );

  if (loading) {
    return (
      <main className="container">
        <h1>Loading...</h1>
        <p>Loading category products...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <h1>Category Products</h1>
        <p>{error}</p>

        <Link to="/products">
          <button>Back to Products</button>
        </Link>
      </main>
    );
  }

  return (
    <main className="container">

      <div className="category-products-header">

        <Link to="/products" className="back-to-categories">
  ← Back to Categories
</Link>

        <h1>
          {category?.name} Products
        </h1>

        <p>
          Showing {currentProducts.length} of{" "}
          {products.length} products
        </p>

      </div>

      {products.length === 0 ? (
        <div>
          <p>
            No products available in this category.
          </p>
        </div>
      ) : (
        <>

          <div className="product-grid">

            {currentProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                category={product.categoryId?.name || category?.name}
                imageUrl={product.imageUrl}
              />
            ))}

          </div>

          {totalPages > 1 && (
            <div className="pagination">

              <button
                onClick={() =>
                  setCurrentPage((page) => page - 1)
                }
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((page) => page + 1)
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>

            </div>
          )}

        </>
      )}

    </main>
  );
}

export default CategoryProducts;