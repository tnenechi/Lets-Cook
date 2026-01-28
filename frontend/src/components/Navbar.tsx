import { useEffect, useState } from "react";
import { Form, Link } from "react-router";
import api from "../api/client";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.data.user);
      } catch {
        setUser(null);
      }
    };

    fetchMe();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="navbar bg-transparent shadow-sm px-9 justify-between">
      {/* LOGO */}
      <div>
        <Link to="/" className="text-[1rem] text-yellow-300">
          Let's Cook!
        </Link>
      </div>

      {/* SEARCH */}
      <Form action="/search" className="flex gap-2">
        <input
          name="ingredients"
          type="text"
          placeholder="e.g: chicken, tomato, cream, pasta"
          className="input input-bordered w-64 md:w-[30rem]"
        />
        <button type="submit" className="btn btn-secondary">
          Find recipes
        </button>
      </Form>

      {/* LOGIN */}
      <div className="">
        {!user ? (
          <Link to="/login" className="btn btn-outline btn-primary">
            Log In
          </Link>
        ) : (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
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
      </div>
    </div>
  );
};

export default Navbar;
