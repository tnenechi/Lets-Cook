import {
  Form,
  Link,
  redirect,
  type ActionFunctionArgs,
} from "react-router-dom";
import api from "../api/client";
import toast from "react-hot-toast";

export async function registerAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (password !== confirmPassword) {
    toast.error("Passwords must match");
    return;
  }

  try {
    const res = await api.post("/auth/register", { email, password });
    if (!res.data.success) {
      return { error: res.data.data || "Registration failed" };
    }
    toast.success("Successfully registered!");
    return redirect("/login");
  } catch (err: any) {
    toast.error(err.response?.data?.message);
    return { error: err.response?.data?.data || "Registration failed" };
  }
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Gradient Column */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-gray-500 to-gray-700 text-white">
          <div>
            <p className="text-md opacity-80 mb-2">Let’s get started. 👨🏼‍🍳😊</p>
            <h1 className="text-3xl font-bold mb-4">CREATE ACCOUNT</h1>
          </div>
          <div />
        </div>

        {/* Form Column */}
        <div className="flex items-center justify-center p-10">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold mb-2 text-slate-800">
              Register Account
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Create your account to continue.
            </p>

            <Form method="post" className="space-y-4">
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="w-full border border-slate-300 rounded-md px-4 py-2 text-black! focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="w-full border border-slate-300 rounded-md px-4 py-2 text-black! focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                required
                className="w-full border border-slate-300 rounded-md px-4 py-2 text-black! focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-medium transition"
              >
                Register
              </button>
            </Form>

            <p className="text-sm text-center text-slate-600 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
