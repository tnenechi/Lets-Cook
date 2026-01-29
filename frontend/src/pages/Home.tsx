import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="hero min-h-screen relative overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay"></div>

      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="md:whitespace-nowrap">Cook More. Waste Less.</h1>
          <p className="mb-5">Discover meals with what's on hand.</p>
          {!user ? (
            <Link
              to="/register"
              className="btn btn-primary text-primary-content"
            >
              <p>Join now for free!</p>
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
