import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useSafeBack(fallbackHome = "/workspace/home") {
  const navigate = useNavigate();
  return () => {
    const idx =
      typeof window !== "undefined" && window.history.state
        ? window.history.state.idx
        : undefined;
    if (
      typeof window === "undefined" ||
      window.history.length <= 1 ||
      (typeof idx === "number" && idx <= 0)
    ) {
      navigate(fallbackHome, { replace: true });
    } else {
      navigate(-1);
    }
  };
}
