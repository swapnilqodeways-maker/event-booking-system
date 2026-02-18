import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (e, prefillEmail, prefillPassword) => {
    e.preventDefault();
    setEmail(prefillEmail);
    setPassword(prefillPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-extrabold text-indigo-600">
            EventBook
          </Link>
          <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <div className="mt-5 bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Demo credentials
          </p>
          <div className="space-y-2">
            <button
              onClick={(e) => fillCredentials(e, "alice@example.com", "password123")}
              className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition group"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">Alice Johnson</p>
                <p className="text-xs text-gray-400 mt-0.5">alice@example.com · password123</p>
              </div>
              <span className="text-xs text-indigo-500 font-semibold opacity-0 group-hover:opacity-100 transition">
                Use →
              </span>
            </button>
            <button
              onClick={(e) => fillCredentials(e, "bob@example.com", "password456")}
              className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition group"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">Bob Smith</p>
                <p className="text-xs text-gray-400 mt-0.5">bob@example.com · password456</p>
              </div>
              <span className="text-xs text-indigo-500 font-semibold opacity-0 group-hover:opacity-100 transition">
                Use →
              </span>
            </button>
          </div>
        </div>

      </div>

      {error && <Toast message={error} type="error" onClose={() => setError("")} />}
    </div>
  );
};

export default LoginPage;
