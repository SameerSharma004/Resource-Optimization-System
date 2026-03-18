import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 2,
    });

    lenisInstance = lenis;

    const onUpdate = (time) => {
      lenis.raf(time * 1000);
    };

    // Sync Lenis with GSAP ticker
    gsap.ticker.add(onUpdate);
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger in sync with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      lenis.destroy();
      lenisInstance = null;
      gsap.ticker.remove(onUpdate);
    };
  }, []);
}

// Exported for programmatic scrolling (e.g. back to top)
export function scrollTo(target, options = {}) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { duration: 1.4, ...options });
  }
}
