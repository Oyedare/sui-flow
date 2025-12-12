"use client";

import { useEffect, useState, useCallback } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useSettings } from "@/contexts/SettingsContext";

export function useOnboarding() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    const seen = localStorage.getItem("sui-flow-onboarding-seen");
    if (seen) {
      setHasSeenOnboarding(true);
    }
  }, []);

  const startTour = useCallback(() => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: true,
      doneBtnText: "Done",
      nextBtnText: "Next",
      prevBtnText: "Previous",
      progressText: "{{current}} of {{total}}",
      steps: [
        {
          element: "#dashboard-header",
          popover: {
            title: "Welcome to Sui Flow 🌊",
            description: "Your comprehensive privacy-first dashboard for the Sui ecosystem. Let's take a quick tour!",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#net-worth-card",
          popover: {
            title: "Net Worth & Assets",
            description: "View your total portfolio value, SUI balance, and asset breakdown at a glance.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#dashboard-tabs",
          popover: {
            title: "Powerful Features",
            description: "Switch between DeFi management, Transaction History, Tax Reports, and Analytics.",
            side: "bottom",
            align: "start",
          },
        },
        {
          element: "#settings-tab-btn",
          popover: {
            title: "Customization",
            description: "Change your currency, theme mode, and accent color here.",
            side: "left",
            align: "start",
          },
        },
      ],
      onDestroyed: () => {
        localStorage.setItem("sui-flow-onboarding-seen", "true");
        setHasSeenOnboarding(true);
      },
    });

    driverObj.drive();
  }, []);

  return {
    hasSeenOnboarding,
    startTour,
  };
}
