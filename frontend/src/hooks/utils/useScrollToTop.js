import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useScrollToTop(ref) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (ref?.current) {
      ref.current.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname, ref]);
}