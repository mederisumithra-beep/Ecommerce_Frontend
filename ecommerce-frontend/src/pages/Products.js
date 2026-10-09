import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import allImage from "../images/category-Images/all.jpg";
import mobilesImage from "../images/category-Images/mobiles.jpg";
import headphonesImage from "../images/category-Images/Headphones.jpg";
import watchesImage from "../images/category-Images/watches.jpg";
import laptopImage from "../images/category-Images/laptops.jpg";
import mensImage from "../images/category-Images/mens.jpg";
import womensImage from "../images/category-Images/womens.jpg";
import skincareImage from "../images/category-Images/skincare.jpg";
import homeAppliancesImage from "../images/category-Images/homeappliances.jpg";
import boysFootwearImage from "../images/category-Images/boysfootwear.webp";
import girlsFootwearImage from "../images/category-Images/girlsfootwear.jpg";

function Products() {
  const navigate = useNavigate();

  const [backendCategories, setBackendCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/category/list")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();

        setBackendCategories(
          Array.isArray(data)
            ? data
            : data.categories || []
        );

        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const getCategoryImage = (categoryName) => {
    const key = categoryName.trim().toLowerCase();

    if (key === "all") {
      return allImage;
    }

    if (key.includes("watch")) {
      return watchesImage;
    }

    if (key.includes("mobile")) {
      return mobilesImage;
    }

    if (key.includes("headphone")) {
      return headphonesImage;
    }

    if (key.includes("laptop")) {
      return laptopImage;
    }

    if (key.includes("women")) {
      return womensImage;
    }

    if (key.includes("men")) {
      return mensImage;
    }

    if (
      key.includes("beauty") ||
      key.includes("face cream") ||
      key.includes("skin")
    ) {
      return skincareImage;
    }

    if (key.includes("home")) {
      return homeAppliancesImage;
    }

    if (key.includes("boys")) {
      return boysFootwearImage;
    }

    if (key.includes("girls")) {
      return girlsFootwearImage;
    }

    return null;
  };

  const categories = [
    "All",
    ...backendCategories
      .filter((item) => item.status === "active")
      .map((item) => item.name)
  ];

  const filteredCategories = categories.filter((item) => {
    return item
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const sortedCategories = [...filteredCategories].sort(
    (a, b) => {
      if (sort === "low-high") {
        return a.localeCompare(b);
      }

      if (sort === "high-low") {
        return b.localeCompare(a);
      }

      return 0;
    }
  );

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setMaxPrice("");
    setSort("");
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;

    setCategory(selectedCategory);

    if (selectedCategory !== "All") {
      navigate(
        `/products/category/${encodeURIComponent(
          selectedCategory
        )}`
      );
    }
  };

  const handleCategoryClick = (categoryName) => {
    if (categoryName === "All") {
      navigate("/products");
      return;
    }

    navigate(
      `/products/category/${encodeURIComponent(
        categoryName
      )}`
    );
  };

  if (loading) {
    return (
      <main className="container state-container">
        <div className="state-card">
          <div className="loading-spinner"></div>

          <h1>Loading Categories</h1>

          <p>
            Please wait while we load the available categories.
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container state-container">
        <div className="state-card error-state">
          <div className="state-icon">!</div>

          <h1>Something Went Wrong</h1>

          <p>
            We couldn't load the categories right now.
          </p>

          <span>{error}</span>

          <button
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container">

      <h1>Products</h1>

      <div className="product-filters">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <select
          value={category}
          onChange={handleCategoryChange}
        >
          {categories.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Maximum price"
          value={maxPrice}
          onChange={(event) =>
            setMaxPrice(event.target.value)
          }
        />

        <select
          value={sort}
          onChange={(event) =>
            setSort(event.target.value)
          }
        >
          <option value="">
            Sort By
          </option>

          <option value="low-high">
            A - Z
          </option>

          <option value="high-low">
            Z - A
          </option>
        </select>

        <button onClick={clearFilters}>
          Clear Filters
        </button>

      </div>

      <div className="category-section">

        <h2>Shop by Category</h2>

        {sortedCategories.length === 0 ? (
          <div className="empty-state">
            <div className="state-icon">⌕</div>

            <h3>No Categories Found</h3>

            <p>
              No categories match your search.
            </p>

            <button onClick={clearFilters}>
              Clear Search
            </button>
          </div>
        ) : (
          <div className="category-list">

            {sortedCategories.map((item) => (
              <div
                key={item}
                className={`category-card ${
                  category === item
                    ? "active"
                    : ""
                }`}
              >

                {getCategoryImage(item) ? (
                  <img
                    src={getCategoryImage(item)}
                    alt={item}
                    className="category-image"
                  />
                ) : (
                  <div className="category-image">
                    No Image
                  </div>
                )}

                <h3>{item}</h3>

                <button
                  onClick={() =>
                    handleCategoryClick(item)
                  }
                >
                  View Products
                </button>

              </div>
            ))}

          </div>
        )}

      </div>

    </main>
  );
}

export default Products;