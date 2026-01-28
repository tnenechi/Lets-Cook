import { Link } from "react-router";

const Home = () => {
  return (
    <div className="hero min-h-screen">
      <div className="hero-overlay"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Cook More. Waste Less.</h1>
          <p className="mb-5">Discover meals with what's on hand.</p>
          <Link to="/register" className="btn btn-primary text-primary-content">
            Join now for free!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
