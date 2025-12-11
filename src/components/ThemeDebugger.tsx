"use client";

import { useSettings } from "@/contexts/SettingsContext";
import { useEffect, useState } from "react";

export function ThemeDebugger() {
  const { settings } = useSettings();
  const [htmlClass, setHtmlClass] = useState("");

  useEffect(() => {
    const checkClass = () => {
      const hasClass = document.documentElement.classList.contains("dark");
      setHtmlClass(hasClass ? "HAS dark class" : "NO dark class");
    };
    
    checkClass();
    const interval = setInterval(checkClass, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-400 text-black p-3 rounded-lg text-xs font-mono shadow-lg z-50">
      <div>Setting: {settings.theme}</div>
      <div>HTML: {htmlClass}</div>
    </div>
  );
}
