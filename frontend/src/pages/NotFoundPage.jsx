import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="text-center">
        <p className="text-7xl font-semibold text-gray-300 select-none">404</p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2 mb-2">Page Not Found</h1>
        <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">
          Back to Events
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
