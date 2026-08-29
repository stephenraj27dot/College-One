"use client";

import { useState, useEffect } from "react";

export function useShortlist() {
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("tn_college_shortlist");
      if (stored) {
        setShortlist(JSON.parse(stored));
      }
    } catch {
      // Ignored in SSR or private mode
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const toggle = (collegeId: string) => {
    setShortlist((prev) => {
      let updated: string[];
      if (prev.includes(collegeId)) {
        updated = prev.filter((id) => id !== collegeId);
      } else {
        updated = [...prev, collegeId];
      }
      try {
        localStorage.setItem("tn_college_shortlist", JSON.stringify(updated));
      } catch {
        // Ignored
      }
      return updated;
    });
  };

  const isShortlisted = (collegeId: string) => shortlist.includes(collegeId);

  return {
    shortlist,
    count: shortlist.length,
    isLoaded,
    toggle,
    isShortlisted,
  };
}
