import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-700 sticky top-0 z-40 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold text-white tracking-tight">
          Event<span className="text-indigo-200">Book</span>
        </Link>

        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-sm text-indigo-100 hover:text-white font-medium transition-colors"
          >
            Events
          </Link>

          {user && (
            <Link
              to="/bookings"
              className="text-sm text-indigo-100 hover:text-white font-medium transition-colors"
            >
              My Bookings
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-indigo-100 font-medium">
                {user.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-1.5 rounded-lg font-medium transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm bg-white text-indigo-700 hover:bg-indigo-50 px-5 py-2 rounded-lg font-semibold transition-colors shadow-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
