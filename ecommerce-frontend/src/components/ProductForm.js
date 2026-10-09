import { useState } from "react";

function ProductForm({
  categories = [],
  onSubmit,
  initialData = null
}) {
  const [name, setName] = useState(
    initialData?.name || ""
  );

  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  const [price, setPrice] = useState(
    initialData?.price || ""
  );

  const [stock, setStock] = useState(
    initialData?.stock || ""
  );

  const [status, setStatus] = useState(
    initialData?.status || "active"
  );

  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId?._id ||
    initialData?.categoryId ||
    ""
  );

  const [imageUrl, setImageUrl] = useState(
    initialData?.imageUrl || ""
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    const productData = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      status,
      categoryId,
      imageUrl
    };

    onSubmit(productData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="product-form"
    >
      <div className="form-row">
        <div className="form-group">
          <label>Product Name *</label>

          <input
            type="text"
            placeholder="Enter product name"
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
            placeholder="Enter product description..."
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Price *</label>

          <input
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(event) =>
              setPrice(event.target.value)
            }
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Stock *</label>

          <input
            type="number"
            placeholder="Enter stock quantity"
            value={stock}
            onChange={(event) =>
              setStock(event.target.value)
            }
            min="0"
            required
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
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>

        <div className="form-group">
          <label>Category *</label>

          <select
            value={categoryId}
            onChange={(event) =>
              setCategoryId(event.target.value)
            }
            required
          >
            <option value="">
              Select category
            </option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Image URL</label>

          <input
            type="url"
            placeholder="Paste product image URL"
            value={imageUrl}
            onChange={(event) =>
              setImageUrl(event.target.value)
            }
          />
        </div>
      </div>

      <button
        type="submit"
        className="create-product-btn"
      >
        {initialData
          ? "Update Product"
          : "Create Product"}
      </button>
    </form>
  );
}

export default ProductForm;