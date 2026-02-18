import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="text-center">
        <p className="text-9xl font-extrabold text-indigo-100 select-none">404</p>
        <h1 className="text-2xl font-bold text-gray-900 -mt-4 mb-2">Page Not Found</h1>
        <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm"
        >
          Back to Events
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
