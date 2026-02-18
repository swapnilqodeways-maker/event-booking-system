const Toast = ({ message, type, onClose }) => {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-semibold max-w-sm border ${
        type === "success"
          ? "bg-green-600 text-white border-green-700"
          : "bg-red-600 text-white border-red-700"
      }`}
    >
      <span>{type === "success" ? "OK" : "Error"}</span>
      <span className="flex-1 font-medium">{message}</span>
      <button onClick={onClose} className="text-white/80 hover:text-white ml-1">
        x
      </button>
    </div>
  );
};

export default Toast;
