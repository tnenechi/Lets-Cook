import { Form, Link } from "react-router";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import ThemeController from "./ThemeController";

const Navbar = () => {
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="navbar bg-base-100  shadow-sm justify-evenly items-center">
      {/* LOGO */}
      <div>
        <Link to="/" className="text-base-content flex items-center gap-1">
          <img src="/images/chef2.png" alt="" className="w-9 h-9" />
          <h2>Let's Cook!</h2>
        </Link>
      </div>

      {/* SEARCH */}
      <Form action="/search" className="flex gap-2 items-center">
        <label className="input w-72 md:w-[30rem] bg-base-300 text-base-content">
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

      {/* LOGIN */}
      <div className="flex items-center justify-center gap-4">
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
                <img alt="profile" src="/images/chef.png" />
              </div>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
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
    </div>
  );
};

export default Navbar;
