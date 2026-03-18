import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Fade-up entrance for any element(s) on scroll.
 * @param {React.RefObject} ref - ref of the container
 * @param {string} selector - CSS selector for children to animate
 * @param {object} options - overrides for gsap.fromTo
 */
export function useScrollFadeUp(ref, selector = null, options = {}) {
  useEffect(() => {
    if (!ref.current) return;
    const targets = selector
      ? ref.current.querySelectorAll(selector)
      : [ref.current];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: options.duration ?? 0.85,
          ease: options.ease ?? 'power3.out',
          stagger: options.stagger ?? 0.08,
          scrollTrigger: {
            trigger: ref.current,
            start: options.start ?? 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [ref, selector, options.duration, options.ease, options.stagger, options.start]);
}

/**
 * Slide-in from left for hero name letters.
 */
export function useHeroEntrance(ref, options = {}) {
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, x: -80, skewX: -8 },
        {
          opacity: 1,
          x: 0,
          skewX: 0,
          duration: options.duration ?? 1.2,
          ease: 'expo.out',
          delay: options.delay ?? 0.2,
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [ref, options.duration, options.delay]);
}

/**
 * Stagger children elements on scroll (for lists).
 */
export function useStaggerReveal(ref, selector, options = {}) {
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const items = ref.current.querySelectorAll(selector);
      gsap.fromTo(
        items,
        { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' },
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0 0 0% 0)',
          duration: options.duration ?? 0.7,
          ease: options.ease ?? 'power3.out',
          stagger: options.stagger ?? 0.1,
          scrollTrigger: {
            trigger: ref.current,
            start: options.start ?? 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [ref, selector]);
}

/**
 * Parallax scroll effect.
 */
export function useParallax(ref, amount = 60) {
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: 0 },
        {
          y: -amount,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [ref, amount]);
}

/**
 * GSAP number counter animation on scroll.
 */
export function useCountUp(ref, target, suffix = '', options = {}) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: options.duration ?? 1.8,
        ease: options.ease ?? 'power2.out',
        onUpdate: () => {
          el.textContent = Math.floor(obj.val) + suffix;
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [ref, target, suffix]);
}

/**
 * Horizontal marquee / ticker — GSAP-driven for GPU-accelerated smoothness.
 */
export function useTicker(ref, speed = 1) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    let x = 0;
    let ticker;

    const run = () => {
      x -= speed;
      const half = el.scrollWidth / 2;
      if (Math.abs(x) >= half) x = 0;
      gsap.set(el, { x });
      ticker = requestAnimationFrame(run);
    };
    ticker = requestAnimationFrame(run);

    return () => cancelAnimationFrame(ticker);
  }, [ref, speed]);
}
