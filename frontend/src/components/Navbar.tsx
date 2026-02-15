import { Form, Link, redirect } from "react-router";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import ThemeController from "./ThemeController";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

const Navbar = () => {
  const { user, refreshUser } = useAuth();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");

    const handleResize = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      refreshUser();
      return redirect("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      <nav className="navbar bg-base-100  shadow-sm justify-between items-center px-x-xs sm:px-x-sm ">
        {/* LOGO */}
        <div>
          <Link to="/" className="text-base-content">
            <h2 className="logo">Let's Cook</h2>
          </Link>
        </div>

        {/* DESKTOP SEARCH */}
        {!isMobile && <SearchBar />}

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center gap-2 sm:gap-5">
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="sm:hidden btn btn-ghost btn-circle"
            aria-label="Search"
          >
            <svg
              className="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </g>
            </svg>
          </button>

          {!user ? (
            <Link to="/login" className="btn btn-primary text-primary-content">
              Log In
            </Link>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
                title="You"
              >
                <div className="w-10 rounded-full">
                  <img alt="profile" src="/images/profile.png" />
                </div>
              </div>
              <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge badge-info badge-soft badge-sm">
                      Coming
                    </span>
                  </a>
                </li>
                <li>
                  <Link to="/my-recipes">Saved recipes</Link>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          )}
          <ThemeController />
        </div>
      </nav>

      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-base-100 flex items-center justify-center px-6">
          <button
            onClick={() => setMobileSearchOpen(false)}
            className="absolute top-5 right-5 text-3xl"
            aria-label="Close"
          >
            <MdClose />
          </button>

          <SearchBar />
        </div>
      )}
    </>
  );
};

const SearchBar = () => {
  return (
    <Form action="/search" className="flex gap-2 items-center">
      <label className="input w-72 md:w-[30rem] bg-base-200 text-base-content">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          type="search"
          required
          name="ingredients"
          placeholder="e.g: chicken, tomato, cream, pasta"
        />
      </label>
    </Form>
  );
};

export default Navbar;
