// src/hooks.js
import { useEffect, useRef, useState } from "react";

export function useHeadsObserver(headings: string[]) {
  const observer = useRef<IntersectionObserver | null>(null);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!headings || headings.length === 0) return;

    let visibleIds = new Set<string>();

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleIds.add(entry.target.id);
        } else {
          visibleIds.delete(entry.target.id);
        }
      });

      // Find the first heading in the order of the headings array that is visible
      const firstVisible = headings.find((id) => visibleIds.has(id));
      if (firstVisible) {
        setActiveId(firstVisible);
      }
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: "-110px 0px 0px 0px",
    });

    const elements = headings
      .map((id: string) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    elements.forEach((elem) => observer.current!.observe(elem));
    return () => observer.current?.disconnect();
  }, [headings]);

  return { activeId, setActiveId };
}
