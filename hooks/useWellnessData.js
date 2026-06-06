"use client";

import { useEffect, useState } from "react";
import { getAnalyses, getCheckIns } from "@/lib/storage";

export function useWellnessData() {
  const [entries, setEntries] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEntries(getCheckIns());
    setAnalyses(getAnalyses());
    setReady(true);
  }, []);

  return { entries, analyses, ready };
}
