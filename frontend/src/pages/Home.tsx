import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Home = () => {
  const { user } = useAuth();
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div className="hero min-h-screen relative overflow-hidden">
      {!videoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
          <h2>Setting the table...</h2>
        </div>
      )}

      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        onLoadedData={() => setVideoLoaded(true)}
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {videoLoaded && (
        <>
          <div className="hero-overlay"></div>

          <div className="hero-content text-neutral-content">
            <div className="max-w-md flex flex-col justify-center items-center">
              <h1 className="text-center md:whitespace-nowrap">
                Cook More. Waste Less.
              </h1>
              <h3 className="mb-5">Discover meals with what's on hand.</h3>
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
        </>
      )}
    </div>
  );
};

export default Home;
