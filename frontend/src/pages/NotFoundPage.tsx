import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-indigo-600 mb-4">404</h1>
        <p className="text-xl font-semibold text-gray-800 mb-2">Page Not Found</p>
        <p className="text-gray-500 text-sm mb-8">The page you are looking for does not exist.</p>
        <Link
          to="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          Back to Events
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
