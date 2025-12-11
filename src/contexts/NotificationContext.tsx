"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (type: NotificationType, message: string, title?: string) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback((type: NotificationType, message: string, title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, type, message, title }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
