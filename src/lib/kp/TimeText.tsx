import { useEffect, useState } from "react";
import { fmtTime } from "./store";

// Client-only time renderer to avoid SSR/CSR hydration mismatches when
// timestamps come from Date.now() at module load.
export function TimeText({ ts }: { ts: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? fmtTime(ts) : ""}</>;
}
