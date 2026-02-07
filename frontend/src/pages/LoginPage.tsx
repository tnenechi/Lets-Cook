import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/login", { email, password });
      await refreshUser();
      navigate("/");
    } catch (err: any) {
      console.log("Login error:", err);
      const errMsg = err.response?.data?.message ?? "Something went wrong.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-5xl rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Column */}
        <div
          className="hidden md:flex flex-col justify-between p-10 bg-cover bg-center relative"
          style={{ backgroundImage: "url('/images/chicken2.jpg')" }}
        >
          <div className="absolute inset-0 bg-neutral/40" />
          <div className="z-10 text-white">
            <h1 className="mb-4">WELCOME BACK</h1>
            <h3 className="mb-2">Nice to see you again! 😊</h3>
          </div>
        </div>

        {/* Form Column */}
        <div className="flex items-center justify-center p-10">
          <div className="w-full max-w-sm">
            <h2 className="mb-2">Login Account</h2>
            <p className="mb-6">Please enter your credentials to continue.</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <label className="input w-full">
                <input
                  type="email"
                  placeholder="youremail@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="input w-full">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <button
                type="submit"
                className="btn btn-block btn-primary"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center mt-4">
              Don’t have an account?{" "}
              <Link to="/register" className="text-info hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
