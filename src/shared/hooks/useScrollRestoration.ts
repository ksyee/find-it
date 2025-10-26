import { RefObject, useEffect, useLayoutEffect } from 'react';

const STORAGE_PREFIX = 'scroll-pos:';

const useScrollRestoration = (
  containerRef: RefObject<HTMLElement>,
  key: string
) => {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const element = containerRef.current;
    if (!element) return;

    const storageKey = `${STORAGE_PREFIX}${key}`;
    const savedPosition = sessionStorage.getItem(storageKey);

    if (savedPosition === null) return;

    const top = Number(savedPosition);
    if (Number.isNaN(top)) return;

    let frameId: number | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let intervalId: number | null = null;

    const applyScrollPosition = () => {
      frameId = window.requestAnimationFrame(() => {
        element.scrollTop = top;
      });
    };

    const tryRestoreImmediately = () => {
      if (element.scrollHeight > element.clientHeight) {
        applyScrollPosition();
        return true;
      }
      return false;
    };

    if (!tryRestoreImmediately()) {
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          if (tryRestoreImmediately()) {
            resizeObserver?.disconnect();
            resizeObserver = null;
          }
        });
        resizeObserver.observe(element);
      } else {
        intervalId = window.setInterval(() => {
          if (tryRestoreImmediately()) {
            if (intervalId !== null) {
              window.clearInterval(intervalId);
              intervalId = null;
            }
          }
        }, 100);
      }
    }

    const handleBeforeUnload = () => {
      sessionStorage.removeItem(storageKey);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      resizeObserver?.disconnect();
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [containerRef, key]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const element = containerRef.current;
    if (!element) return;

    const storageKey = `${STORAGE_PREFIX}${key}`;
    let frameId: number | null = null;

    const handleScroll = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      frameId = window.requestAnimationFrame(() => {
        sessionStorage.setItem(storageKey, String(element.scrollTop));
        frameId = null;
      });
    };

    element.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      element.removeEventListener('scroll', handleScroll);
      sessionStorage.setItem(storageKey, String(element.scrollTop));
    };
  }, [containerRef, key]);
};

export default useScrollRestoration;
