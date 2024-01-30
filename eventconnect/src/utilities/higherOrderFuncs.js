import { useRef } from "react";

//standard debouncer
export function debouncer(func, timeout) {
  const timer = useRef(null);
  return function () {
    const args = arguments;
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
