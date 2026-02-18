const Toast = ({ message, type, onClose }) => {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-semibold max-w-sm ${
        type === "success"
          ? "bg-green-600 text-white"
          : "bg-red-600 text-white"
      }`}
    >
      <span>{type === "success" ? "✓" : "✕"}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="text-white/70 hover:text-white ml-1 text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
