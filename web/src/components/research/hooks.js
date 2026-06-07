import { useEffect, useRef, useState } from 'react';

// Reveal-on-scroll: returns [ref, visible]. Element fades/slides in once.
export function useInView(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px', ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// Scroll-spy: given a list of section ids, returns the id currently in view.
export function useScrollSpy(ids, offset = 120) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const handler = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) current = id;
      }
      setActive(current);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [ids.join('|'), offset]);
  return active;
}

// Count-up animation for a numeric value once the element is in view.
export function useCountUp(target, { duration = 1200, decimals = 0, start = 0 } = {}) {
  const [ref, visible] = useInView();
  const [value, setValue] = useState(start);
  useEffect(() => {
    if (!visible) return;
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(start + (target - start) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, target]);
  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  return [ref, display, visible];
}
