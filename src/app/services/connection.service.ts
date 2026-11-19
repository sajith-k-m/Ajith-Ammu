import { Injectable, signal } from '@angular/core';

interface NetworkInformation extends EventTarget {
  readonly saveData?: boolean;
  readonly effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
}

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  /**
   * Signal indicating whether slow connection or reduced motion is requested.
   * If true: skip unroll animation, show open scroll instantly with short fade, disable petals.
   */
  readonly shouldReduceOrSkip = signal<boolean>(false);

  constructor() {
    this.detectConnectionPreferences();
  }

  private detectConnectionPreferences(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const checkShouldSkip = (): boolean => {
      // 1. Check prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
      if (prefersReducedMotion) {
        return true;
      }

      // 2. Check NetworkInformation API if available (handles Safari where navigator.connection is undefined)
      const nav = navigator as Navigator & { connection?: NetworkInformation };
      const conn = nav.connection;

      if (conn) {
        if (conn.saveData === true) {
          return true;
        }
        if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g' || conn.effectiveType === '3g') {
          return true;
        }
      }

      return false;
    };

    this.shouldReduceOrSkip.set(checkShouldSkip());

    // Listen for changes if supported
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener?.('change', () => {
        this.shouldReduceOrSkip.set(checkShouldSkip());
      });

      const nav = navigator as Navigator & { connection?: NetworkInformation };
      nav.connection?.addEventListener?.('change', () => {
        this.shouldReduceOrSkip.set(checkShouldSkip());
      });
    } catch {
      // Graceful fallback for older browsers
    }
  }
}
