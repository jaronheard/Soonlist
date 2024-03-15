"use client";

import { useEffect } from "react";

export const ScrollToTop = () => {
  useEffect(() => {
    if (window) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return <></>;
};
