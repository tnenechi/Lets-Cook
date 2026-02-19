import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/register", { email, password });
      toast.success("Successfully registered!");
      await refreshUser();
      navigate("/");
    } catch (err: any) {
      const errMsg = err.response?.data?.message ?? "Registration failed";
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
          style={{ backgroundImage: "url('/images/register.jpg')" }}
        >
          <div className="absolute inset-0 bg-neutral/20" />
          <div className="z-10 text-white">
            <h3 className="mb-2">Let’s get started.</h3>
          </div>
        </div>

        {/* Form Column */}
        <div className="flex items-center justify-center p-10">
          <div className="w-full max-w-sm">
            <h2 className="mb-2">Register Account</h2>
            <p className="mb-6">Create your account to continue.</p>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* EMAIL */}
              <label className="input validator w-full">
                <input
                  type="email"
                  placeholder="youremail@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <div className="validator-hint hidden">
                Enter valid email address
              </div>

              {/* PASSWORD */}
              <label className="input validator w-full">
                <input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  minLength={8}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (confirmRef.current) {
                      if (confirmRef.current.value !== e.target.value) {
                        confirmRef.current.setCustomValidity(
                          "Passwords do not match",
                        );
                      } else {
                        confirmRef.current.setCustomValidity("");
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  className="text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </label>
              <p className="validator-hint hidden">
                Must be more than 8 characters, including at least one number,
                lowercase and uppercase letter
              </p>

              {/* CONFIRM PASSWORD */}
              <label className="input validator w-full ">
                <input
                  ref={confirmRef}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm password"
                  required
                  minLength={8}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordRef.current) {
                      if (passwordRef.current.value !== e.target.value) {
                        confirmRef.current?.setCustomValidity(
                          "Passwords do not match",
                        );
                      } else {
                        confirmRef.current?.setCustomValidity("");
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  className="text-gray-500"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </label>
              <p className="validator-hint hidden">Passwords do not match</p>

              <button
                type="submit"
                className="btn btn-block btn-primary"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            <p className="text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-info hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
