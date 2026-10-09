import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = () => {
    fetch("http://localhost:5000/product/list")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const fetchCategories = () => {
    fetch("http://localhost:5000/category/list")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data.categories);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleCreateProduct = (productData) => {
    setMessage("");
    setError("");

    fetch("http://localhost:5000/product/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.product) {
          throw new Error(data.message || "Failed to create product");
        }

        setMessage("Product created successfully");
        setShowForm(false);
        fetchProducts();
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
    setMessage("");
    setError("");
  };

  const handleUpdateProduct = (productData) => {
    setMessage("");
    setError("");

    fetch(`http://localhost:5000/product/${editingProduct._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.product) {
          throw new Error(data.message || "Failed to update product");
        }

        setMessage("Product updated successfully");
        setEditingProduct(null);
        setShowForm(false);
        fetchProducts();
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleDeleteProduct = (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    setMessage("");
    setError("");

    fetch(`http://localhost:5000/product/${productId}`, {
      method: "DELETE"
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.product) {
          throw new Error(data.message || "Failed to delete product");
        }

        setMessage("Product deleted successfully");
        fetchProducts();
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  if (loading) {
    return (
      <main className="admin-products">
        <h1>Admin Products</h1>
        <p>Loading products...</p>
      </main>
    );
  }

  if (error && products.length === 0) {
    return (
      <main className="admin-products">
        <h1>Admin Products</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="admin-products">
      <h1>Admin Products</h1>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <section className="create-product-section">
        <button
          className="create-product-toggle"
          onClick={() => {
            setShowForm(!showForm);
            setEditingProduct(null);
            setMessage("");
            setError("");
          }}
        >
          {showForm ? "Close Form" : "Create Product"}
        </button>

        {showForm && (
          <ProductForm
            categories={categories}
            initialData={editingProduct}
            onSubmit={
              editingProduct
                ? handleUpdateProduct
                : handleCreateProduct
            }
          />
        )}
      </section>

      <section className="products-table-section">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>

                    <td>Rs {product.price}</td>

                    <td>{product.categoryId?.name}</td>

                    <td>{product.stock}</td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditProduct(product)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminProducts;