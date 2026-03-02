import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "./authService";

function SignUpForm({ switchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await registerUser({ name, email, password });

      setSuccess(true);

      setTimeout(() => {
        switchToLogin();
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-8 shadow-2xl">

      <h2 className="text-2xl font-bold text-slate-900">
        Create your account
      </h2>

      <p className="text-sm text-slate-500 mt-2">
        Start generating AI-powered campaigns.
      </p>

      {/* Error */}
      {error && (
        <div className="mt-4 px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mt-4 px-4 py-2 rounded-lg bg-green-100 text-green-700 text-sm">
          Account created successfully. Please log in.
        </div>
      )}

      <div className="mt-8 space-y-5">

        {/* Name */}
        <div>
          <label className="text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-slate-700">
            Password
          </label>

          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 transition pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

      </div>

      <p className="text-sm text-slate-600 mt-6 text-center">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="text-slate-900 font-medium hover:underline"
        >
          Log in
        </button>
      </p>

    </div>
  );
}

export default SignUpForm;