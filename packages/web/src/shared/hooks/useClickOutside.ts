import { useEffect, useRef } from "react";

const useClickOutside = (closeModal: () => void) => {
  const containerRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const handleClickOutside = (event: MouseEvent) => {
        if (container && !container.contains(event.target as Node)) {
          closeModal();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [closeModal]);

  return { containerRef };
};

export default useClickOutside;
