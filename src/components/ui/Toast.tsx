"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { Notification, NotificationType, useNotifications } from "@/contexts/NotificationContext";

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
};

const bgColors = {
  success: "bg-green-500/10 border-green-500/20",
  error: "bg-red-500/10 border-red-500/20",
  info: "bg-blue-500/10 border-blue-500/20",
  warning: "bg-yellow-500/10 border-yellow-500/20",
};

export function Toast({ notification }: { notification: Notification }) {
  const { removeNotification } = useNotifications();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`
        flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg pointer-events-auto
        w-80 sm:w-96
        ${bgColors[notification.type]}
      `}
    >
      <div className="mt-0.5 shrink-0">{icons[notification.type]}</div>
      
      <div className="flex-1 min-w-0">
        {notification.title && (
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
            {notification.title}
          </h4>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug break-words">
          {notification.message}
        </p>
      </div>

      <button
        onClick={() => removeNotification(notification.id)}
        className="shrink-0 p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors"
      >
        <X size={16} className="text-gray-400" />
      </button>
    </motion.div>
  );
}
