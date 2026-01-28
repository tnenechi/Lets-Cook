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
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-5xl rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Gradient Column */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-base-200 text-base-content">
          <div>
            <h1 className="text-3xl font-bold mb-4">WELCOME BACK</h1>
            <p className="text-md opacity-80 mb-2">Nice to see you again! 😊</p>
          </div>
          <div />
        </div>

        {/* Form Column */}
        <div className="flex items-center justify-center p-10">
          <div className="w-full max-w-sm ">
            <h2 className="text-2xl font-semibold mb-2 text-slate-800">
              Login Account
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Please enter your credentials to continue.
            </p>

            <Form method="post" className="space-y-4">
              {/* EMAIL */}
              <label className="input w-full">
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
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>
                <input
                  name="email"
                  type="email"
                  placeholder="youremail@gmail.com"
                  required
                />
              </label>

              {/* PASSWORD */}
              <label className="input w-full">
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
                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                    <circle
                      cx="16.5"
                      cy="7.5"
                      r=".5"
                      fill="currentColor"
                    ></circle>
                  </g>
                </svg>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                />
              </label>

              <button type="submit" className="btn btn-block btn-primary">
                Login
              </button>
            </Form>

            <p className="text-sm text-center text-slate-600 mt-4">
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
