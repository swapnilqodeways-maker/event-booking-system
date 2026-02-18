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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-semibold text-gray-900">
            EventBook
          </Link>
          <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
        </div>

        <div className="card card-spacious">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="input"
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
                placeholder="password"
                className="input"
              />
              <p className="text-xs text-gray-400 mt-2">Use your account password to continue.</p>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full btn-primary"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <div className="mt-6">
          <div className="h-px bg-gray-200" />
        </div>

        <div className="mt-5 card card-tight">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Demo credentials
          </p>
          <div className="space-y-2">
            <button
              onClick={(e) => fillCredentials(e, "swapnil@gmail.com", "password123")}
              className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">Swapnil Patil</p>
                <p className="text-xs text-gray-400 mt-0.5">swapnil@gmail.com · password123</p>
              </div>
              <span className="text-xs text-indigo-500 font-semibold">Use</span>
            </button>
            <button
              onClick={(e) => fillCredentials(e, "vishal@gmail.com", "password456")}
              className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">Vishal Sharma</p>
                <p className="text-xs text-gray-400 mt-0.5">vishal@gmail.com · password456</p>
              </div>
              <span className="text-xs text-indigo-500 font-semibold">Use</span>
            </button>
          </div>
        </div>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError("")} />}
    </div>
  );
};

export default LoginPage;
