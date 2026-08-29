"use client";

import { useState, useEffect } from "react";
import { DetailedCollege } from "@/types";

export function useCompare(maxCount = 4) {
  const [compareList, setCompareList] = useState<DetailedCollege[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("tn_college_compare");
      if (stored) {
        setCompareList(JSON.parse(stored));
      }
    } catch {
      // Ignored
    }
  }, []);

  const saveToStorage = (list: DetailedCollege[]) => {
    try {
      localStorage.setItem("tn_college_compare", JSON.stringify(list));
    } catch {
      // Ignored
    }
  };

  const toggleCompare = (college: DetailedCollege) => {
    setCompareList((prev) => {
      let updated: DetailedCollege[];
      if (prev.some((c) => c.id === college.id)) {
        updated = prev.filter((c) => c.id !== college.id);
      } else {
        if (prev.length >= maxCount) {
          alert(`You can compare up to ${maxCount} colleges at a time.`);
          return prev;
        }
        updated = [...prev, college];
      }
      saveToStorage(updated);
      return updated;
    });
  };

  const removeFromCompare = (collegeId: string) => {
    setCompareList((prev) => {
      const updated = prev.filter((c) => c.id !== collegeId);
      saveToStorage(updated);
      return updated;
    });
  };

  const clear = () => {
    setCompareList([]);
    try {
      localStorage.removeItem("tn_college_compare");
    } catch {
      // Ignored
    }
  };

  const isInCompare = (collegeId: string) =>
    compareList.some((c) => c.id === collegeId);

  return {
    compareList,
    count: compareList.length,
    canAdd: compareList.length < maxCount,
    toggleCompare,
    removeFromCompare,
    clear,
    isInCompare,
  };
}
