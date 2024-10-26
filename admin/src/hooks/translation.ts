"use client";
import { useEffect, useState } from "react";

export const useGetCurrentLanguage = () => {
  const getLanguageFromPath = () => {
    if (typeof window !== "undefined" && window.location) {
      return window.location.pathname.split("/")[1];
    }
    return null;
  };

  const [currentLanguage, setCurrentLanguage] = useState(getLanguageFromPath());

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentLanguage(getLanguageFromPath());
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("pushstate", handleLocationChange);
    window.addEventListener("replacestate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("pushstate", handleLocationChange);
      window.removeEventListener("replacestate", handleLocationChange);
    };
  }, []);

  return { currentLanguage };
};
