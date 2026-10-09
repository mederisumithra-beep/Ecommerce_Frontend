import { Link } from "react-router-dom";

function ProductCard({
  id,
  name,
  price,
  category,
  image,
  imageUrl
}) {
  const productImage = imageUrl || image;

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img
          src={productImage}
          alt={name}
          className="product-card-image"
        />
      </div>

      <div className="product-info">
        <h3>{name}</h3>

        <p>{category}</p>

        <h4>
          Rs {price.toLocaleString("en-IN")}
        </h4>

        <Link to={`/products/${id}`}>
          <button>
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;