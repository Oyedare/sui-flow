"use client";

import { useNotifications } from "@/contexts/NotificationContext";
import { AnimatePresence } from "framer-motion";
import { Toast } from "./Toast";

export function ToastContainer() {
  const { notifications } = useNotifications();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 pointer-events-none p-4">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <Toast key={notification.id} notification={notification} />
        ))}
      </AnimatePresence>
    </div>
  );
}
