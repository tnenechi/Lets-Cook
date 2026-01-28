import {
  Form,
  Link,
  redirect,
  type ActionFunctionArgs,
} from "react-router-dom";
import api from "../api/client";
import toast from "react-hot-toast";

export async function loginAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  try {
    const res = await api.post("/auth/login", { email, password });
    if (!res.data.success) {
      toast.error(res?.data?.message);
      return { error: res.data.data || "Invalid credentials" };
    }

    return redirect("/");
  } catch (err: any) {
    toast.error(err.response?.data?.message);
    return { error: err.response?.data?.data || "Invalid credentials" };
  }
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Gradient Column */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-gray-500 to-gray-700 text-white">
          <div>
            <h1 className="text-3xl font-bold mb-4">WELCOME BACK</h1>
            <p className="text-md opacity-80 mb-2">Nice to see you again! 😊</p>
          </div>
          <div />
        </div>

        {/* Form Column */}
        <div className="flex items-center justify-center p-10">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold mb-2 text-slate-800">
              Login Account
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Please enter your credentials to continue.
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
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-medium transition"
              >
                Login
              </button>
            </Form>

            <p className="text-sm text-center text-slate-600 mt-4">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
