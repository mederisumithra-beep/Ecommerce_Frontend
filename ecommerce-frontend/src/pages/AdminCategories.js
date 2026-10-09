import { useEffect, useState } from "react";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");

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
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const clearForm = () => {
    setName("");
    setDescription("");
    setStatus("active");
    setEditingCategory(null);
  };

  const handleCreateCategory = (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const categoryData = {
      name,
      description,
      status
    };

    fetch("http://localhost:5000/category/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(categoryData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.category) {
          throw new Error(
            data.message || "Failed to create category"
          );
        }

        setMessage("Category created successfully");
        clearForm();
        setShowForm(false);
        fetchCategories();
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || "");
    setStatus(category.status);
    setShowForm(true);
    setMessage("");
    setError("");
  };

  const handleUpdateCategory = (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const categoryData = {
      name,
      description,
      status
    };

    fetch(`http://localhost:5000/category/${editingCategory._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(categoryData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.category) {
          throw new Error(
            data.message || "Failed to update category"
          );
        }

        setMessage("Category updated successfully");
        clearForm();
        setShowForm(false);
        fetchCategories();
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleDeleteCategory = (categoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) {
      return;
    }

    setMessage("");
    setError("");

    fetch(`http://localhost:5000/category/${categoryId}`, {
      method: "DELETE"
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.message) {
          throw new Error("Failed to delete category");
        }

        setMessage(data.message);
        fetchCategories();
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  if (loading) {
    return (
      <main className="admin-products">
        <h1>Admin Categories</h1>
        <p>Loading categories...</p>
      </main>
    );
  }

  return (
    <main className="admin-products">
      <h1>Admin Categories</h1>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <section className="create-product-section">
        <button
          className="create-product-toggle"
          onClick={() => {
            if (showForm) {
              clearForm();
            }

            setShowForm(!showForm);
            setMessage("");
            setError("");
          }}
        >
          {showForm ? "Close Form" : "Create Category"}
        </button>

        {showForm && (
          <form
            className="product-form"
            onSubmit={
              editingCategory
                ? handleUpdateCategory
                : handleCreateCategory
            }
          >
            <div className="form-row">
              <div className="form-group">
                <label>Category Name *</label>

                <input
                  type="text"
                  placeholder="Enter category name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  placeholder="Enter category description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status</label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="create-product-btn"
            >
              {editingCategory
                ? "Update Category"
                : "Create Category"}
            </button>
          </form>
        )}
      </section>

      <section className="products-table-section">
        {categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td>{category.name}</td>

                    <td>
                      {category.description || "-"}
                    </td>

                    <td>{category.status}</td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEditClick(category)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDeleteCategory(category._id)
                        }
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

export default AdminCategories;