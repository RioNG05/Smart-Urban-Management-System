import { useEffect } from "react";

export default function useScrollEffect(callback) {
  useEffect(() => {
    window.addEventListener("scroll", callback);
    return () => window.removeEventListener("scroll", callback);
  }, [callback]);
}
