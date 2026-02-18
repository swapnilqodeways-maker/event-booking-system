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

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-indigo-700 flex-col justify-between p-12">
        <Link to="/" className="text-2xl font-extrabold text-white">
          Event<span className="text-indigo-200">Book</span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Discover and book<br />amazing events
          </h2>
          <p className="text-indigo-200 text-lg">
            From tech summits to music festivals — find your next experience.
          </p>
        </div>
        <p className="text-indigo-300 text-sm">© 2026 EventBook</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link to="/" className="text-2xl font-extrabold text-indigo-700 lg:hidden">
              Event<span className="text-indigo-400">Book</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-4">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to continue to your account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-bold tracking-wide transition-colors shadow-sm mt-2"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError("")} />}
    </div>
  );
};

export default LoginPage;
