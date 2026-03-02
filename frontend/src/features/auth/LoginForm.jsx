import { useState } from "react";
import { Eye, EyeOff, Github } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "./authService";

function LoginForm({ switchToSignup }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const data = await loginUser({ email, password });

      setSuccess(true);

      setTimeout(() => {
        login(data);
      }, 800);

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-8 shadow-2xl">

      <h2 className="text-2xl font-bold text-slate-900">
        Welcome back
      </h2>

      <p className="text-sm text-slate-500 mt-2">
        Log in to continue generating campaigns.
      </p>

      {/* Error Message */}
      {error && (
        <div className="mt-4 px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 px-4 py-2 rounded-lg bg-green-100 text-green-700 text-sm">
          Login successful ✓
        </div>
      )}

      <div className="mt-8 space-y-5">

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

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

      </div>

      {/* Divider */}
      <div className="my-6 flex items-center">
        <div className="flex-1 h-px bg-slate-200"></div>
        <span className="px-3 text-sm text-slate-500">or continue with</span>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3">

        {/* Google */}
        <button
          disabled
          className="w-full py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition text-sm font-medium flex items-center justify-center gap-3"
        >
          {/* Google SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="18"
            height="18"
          >
            <path fill="#EA4335" d="M24 9.5c3.1 0 5.8 1.1 7.9 3l5.9-5.9C33.7 2.4 29.2 0 24 0 14.6 0 6.6 5.5 2.7 13.5l6.9 5.3C11.6 13 17.3 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.5c-.5 2.8-2.1 5.2-4.4 6.9l6.8 5.3c4-3.7 6.2-9.1 6.2-16.7z"/>
            <path fill="#FBBC05" d="M9.6 28.8c-.6-1.8-1-3.7-1-5.8s.4-4 1-5.8l-6.9-5.3C1 16.1 0 20 0 24s1 7.9 2.7 11.1l6.9-6.3z"/>
            <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.8l-6.8-5.3c-2 1.3-4.6 2-9.2 2-6.7 0-12.4-3.5-14.4-8.3l-6.9 6.3C6.6 42.5 14.6 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        {/* GitHub */}
        <button
          disabled
          className="w-full py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition text-sm font-medium flex items-center justify-center gap-3"
        >
          <Github size={18} />
          Continue with GitHub
        </button>

      </div>

      <p className="text-sm text-slate-600 mt-6 text-center">
        Don't have an account?{" "}
        <button
          onClick={switchToSignup}
          className="text-slate-900 font-medium hover:underline"
        >
          Sign up
        </button>
      </p>

    </div>
  );
}

export default LoginForm;