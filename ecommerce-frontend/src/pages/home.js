import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      <section className="hero-section">

        <div className="hero-content">

          <p className="hero-small">
            WELCOME TO MYSTORES
          </p>

          <h1>
            The Essence of
            <br />
            <span>Elegant Shopping</span>
          </h1>

          <p className="hero-description">
            Discover premium products carefully selected
            <br />
            for your everyday lifestyle.
          </p>

          <Link to="/login" className="hero-button">
            Shop Now →
          </Link>

        </div>

      </section>
    </main>
  );
}

export default Home;