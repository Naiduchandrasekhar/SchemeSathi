import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ message, type = "info", onClose, duration = 3000 }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-500/20",
    error: "border-rose-500/20",
    info: "border-blue-500/20",
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border bg-bg-secondary p-4 pr-10 text-sm font-semibold text-text-main shadow-xl shadow-black/10 backdrop-blur-md max-w-sm transition-all duration-300 ${borders[type]}`}
          role="alert"
        >
          {icons[type]}
          <span className="leading-snug">{message}</span>
          <button
            onClick={onClose}
            className="absolute right-3 top-4 cursor-pointer text-text-dim hover:text-text-main transition-colors"
            aria-label="Close notification"
          >
            <X size={15} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
