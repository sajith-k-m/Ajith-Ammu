import { Component, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroSceneComponent } from './components/intro-scene/intro-scene.component';
import { DetailsSectionComponent } from './components/details-section/details-section.component';
import { FloatingDecorationsComponent } from './components/floating-decorations/floating-decorations.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    IntroSceneComponent,
    DetailsSectionComponent,
    FloatingDecorationsComponent
  ],
  template: `
    <main class="page-wrapper" [class.scroll-unlocked]="isScrollUnlocked()">
      
      <!-- Interactive 3D Floating Elements & Ambient Bokeh Engine (reacts to scroll & mouse) -->
      <app-floating-decorations
        [scrollY]="scrollY()"
        [scrollVelocity]="scrollVelocity()"
      />

      <!-- Fixed Intro Scene (Letter unrolls, then rolls up & floats off top screen) -->
      <div
        class="intro-scene-fixed-layer"
        [class.hidden-after-exit]="exitProgress() >= 1"
        [style.pointer-events]="introPointerEvents()"
      >
        <app-intro-scene
          [scrollRoll]="scrollRoll()"
          [exitProgress]="exitProgress()"
          [ropeProgress]="ropeProgress()"
          [scrollVelocity]="scrollVelocity()"
          [isScrolled]="scrollY() > 10"
          (sceneCompleted)="onSceneCompleted()"
        />
      </div>

      <!-- Scroll Spacer for the 850px Intro Choreography -->
      <div
        class="intro-scroll-track-spacer"
        [style.height.px]="isScrollUnlocked() ? 850 : 0"
        aria-hidden="true"
      ></div>

      <!-- Grand Luxury Wedding Content Experience (Flows naturally down the page) -->
      <div
        class="luxury-content-wrapper"
        [class.interactive]="detailsInteractive()"
        [style.opacity]="detailsOpacity()"
        [style.transform]="detailsTransform()"
        [style.pointer-events]="detailsInteractive() ? 'auto' : 'none'"
      >
        <app-details-section
          [scrollY]="scrollY()"
          [scrollVelocity]="scrollVelocity()"
        />
      </div>

    </main>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      min-height: 100dvh;
      background-color: var(--bg-deep, #0a0406);
      color: var(--text-cream, #fbf5e8);
      font-family: var(--font-sans);
    }

    .page-wrapper {
      position: relative;
      width: 100%;
      min-height: 100vh;
      min-height: 100dvh;

      &:not(.scroll-unlocked) {
        height: 100vh;
        height: 100dvh;
        overflow: hidden;
      }

      &.scroll-unlocked {
        overflow-x: clip;
        overflow-y: visible;
      }
    }

    /* Fixed Intro Scene Layer */
    .intro-scene-fixed-layer {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 25;
      overflow: hidden;
      transition: opacity 0.4s ease-out;

      &.hidden-after-exit {
        visibility: hidden;
        pointer-events: none !important;
        opacity: 0;
      }
    }

    /* Spacer for the 850px scroll choreography */
    .intro-scroll-track-spacer {
      width: 100%;
      pointer-events: none;
      will-change: height;
    }

    /* Luxury Content Container */
    .luxury-content-wrapper {
      position: relative;
      width: 100%;
      min-height: 100vh;
      z-index: 30;
      box-sizing: border-box;
      pointer-events: none;

      &.interactive {
        pointer-events: auto;
      }
    }
  `]
})
export class AppComponent {
  readonly isScrollUnlocked = signal<boolean>(false);
  readonly scrollY = signal<number>(0);
  readonly scrollVelocity = signal<number>(0);

  // Scroll phase choreography
  private readonly ROLL_3_4_Y = 380;     // 0 to 380px -> paper rolls up from 0% to 75%
  private readonly EXIT_END_Y = 850;     // 380px to 850px -> balance 1/4 rolls up (0.75 -> 1.0), letter exits off top

  // Paper roll: 0.0 to 0.75 in Phase 1 (0..380px), then 0.75 to 1.0 in Phase 2 (380..850px)
  readonly scrollRoll = computed(() => {
    const y = this.scrollY();
    if (y <= 0) return 0;
    if (y < this.ROLL_3_4_Y) {
      return (y / this.ROLL_3_4_Y) * 0.75;
    }
    if (y >= this.EXIT_END_Y) {
      return 1.0;
    }
    const phase2Progress = (y - this.ROLL_3_4_Y) / (this.EXIT_END_Y - this.ROLL_3_4_Y);
    return 0.75 + (phase2Progress * 0.25);
  });

  // Rolled letter exit progress: 0.0 during Phase 1, then 0.0 to 1.0 during Phase 2
  readonly exitProgress = computed(() => {
    const y = this.scrollY();
    if (y <= this.ROLL_3_4_Y) return 0;
    if (y >= this.EXIT_END_Y) return 1;
    return (y - this.ROLL_3_4_Y) / (this.EXIT_END_Y - this.ROLL_3_4_Y);
  });

  // Details section entry progress: 0.0 to 1.0 from 380px to 850px
  readonly detailsProgress = computed(() => {
    const y = this.scrollY();
    if (y <= this.ROLL_3_4_Y) return 0;
    if (y >= this.EXIT_END_Y) return 1;
    return (y - this.ROLL_3_4_Y) / (this.EXIT_END_Y - this.ROLL_3_4_Y);
  });

  readonly detailsOpacity = computed(() => {
    const p = this.detailsProgress();
    if (p <= 0) return 0;
    return Math.min(1, p * 1.4);
  });

  readonly detailsInteractive = computed(() => {
    return this.detailsProgress() >= 0.85;
  });

  readonly introPointerEvents = computed(() => {
    if (this.exitProgress() >= 1) return 'none';
    if (this.scrollY() > 380) return 'none';
    return 'auto';
  });

  readonly ropeProgress = computed(() => {
    const y = this.scrollY();
    if (y <= 180) return 0;
    if (y >= this.ROLL_3_4_Y) return 1;
    return (y - 180) / (this.ROLL_3_4_Y - 180);
  });

  readonly detailsTransform = computed(() => {
    const p = this.detailsProgress();
    if (p <= 0) {
      return 'translate3d(0, 60px, 0)';
    }
    if (p >= 1) {
      return null;
    }
    const offset = ((1 - p) * 60).toFixed(1);
    return `translate3d(0, ${offset}px, 0)`;
  });

  private targetY = 0;
  private currentY = 0;
  private isTicking = false;
  private lastScrollY = 0;
  private lastScrollTime = 0;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (typeof window !== 'undefined' && this.isScrollUnlocked()) {
      this.targetY = window.scrollY;
      if (!this.isTicking) {
        this.isTicking = true;
        this.lastScrollTime = performance.now();
        requestAnimationFrame(() => this.smoothScrollStep());
      }
    }
  }

  private smoothScrollStep(): void {
    const diff = this.targetY - this.currentY;
    if (Math.abs(diff) < 0.3) {
      this.currentY = this.targetY;
      this.scrollY.set(this.currentY);
      this.scrollVelocity.set(0);
      this.isTicking = false;
      return;
    }

    // Smooth responsive lerp for high-FPS, zero-stutter feel
    this.currentY += diff * 0.28;
    this.scrollY.set(this.currentY);

    const now = performance.now();
    const dt = Math.max(16, now - this.lastScrollTime);
    const dy = Math.abs(this.currentY - this.lastScrollY);
    const vel = Math.min(100, (dy / dt) * 60);
    this.scrollVelocity.set(vel);
    this.lastScrollY = this.currentY;
    this.lastScrollTime = now;

    requestAnimationFrame(() => this.smoothScrollStep());
  }

  onSceneCompleted(): void {
    this.isScrollUnlocked.set(true);
  }
}
