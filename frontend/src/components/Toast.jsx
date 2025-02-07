/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react"; // Import success and error icons

const Toast = ({ message, type = "success", duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null; // Hide toast when time expires
  console.log("toast is working");

  return (
    <div
      className={`fixed bottom-5 right-5 flex items-center gap-3 px-4 py-2 rounded-lg shadow-lg transition-transform transform bg-black text-white z-100
      `}
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <XCircle className="w-5 h-5" />
      )}
      <span>{message}</span>
    </div>
  );
};

export default Toast;
