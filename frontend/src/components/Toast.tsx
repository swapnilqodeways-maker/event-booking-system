interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="text-white opacity-70 hover:opacity-100 font-bold">
        ✕
      </button>
    </div>
  );
};

export default Toast;
