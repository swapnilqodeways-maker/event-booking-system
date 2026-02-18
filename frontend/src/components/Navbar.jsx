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
    <nav className="bg-white/95 sticky top-0 z-40 border-b border-gray-200 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-gray-900 tracking-tight">
          EventBook
        </Link>

        <div className="flex items-center gap-5">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Events
          </Link>

          {user && (
            <Link
              to="/bookings"
              className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              My Bookings
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-sm font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-700 font-medium">
                {user.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-primary"
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
