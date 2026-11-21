import { Component, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroSceneComponent } from './components/intro-scene/intro-scene.component';
import { DetailsSectionComponent } from './components/details-section/details-section.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IntroSceneComponent, DetailsSectionComponent],
  template: `
    <main class="page-wrapper" [class.scroll-unlocked]="isScrollUnlocked()">
      <div class="scroll-track" [style.height]="trackHeight()">
        <div class="sticky-viewport">
          <!-- Intro Scene with Scroll Unrolling, Roll-up & Smooth Top Exit -->
          <app-intro-scene
            [scrollRoll]="scrollRoll()"
            [exitProgress]="exitProgress()"
            [ropeProgress]="ropeProgress()"
            [isScrolled]="scrollY() > 10"
            (sceneCompleted)="onSceneCompleted()"
          />

          <!-- Full Screen Details Presentation (Rises from below as letter exits top) -->
          <div
            class="details-page-wrapper"
            [class.interactive]="detailsInteractive()"
            [style.opacity]="detailsOpacity()"
            [style.transform]="detailsTransform()"
            [style.pointer-events]="detailsInteractive() ? 'auto' : 'none'"
            [style.visibility]="detailsProgress() > 0 ? 'visible' : 'hidden'"
          >
            <!-- Event Details (Countdown, Location, RSVP, Footer) -->
            <app-details-section />
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      min-height: 100dvh;
      background-color: #12080a;
      color: #f7e6c4;
      font-family: var(--font-invitation);
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
        overflow: visible;
      }
    }

    .scroll-track {
      position: relative;
      width: 100%;
      will-change: height;
    }

    .sticky-viewport {
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
    }

    .details-page-wrapper {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100vh;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 35;
      padding: 24px 20px;
      box-sizing: border-box;
      will-change: transform, opacity;
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

  // Scroll phase choreography
  private readonly ROLL_3_4_Y = 380;     // 0 to 380px -> paper rolls up from 0% to 75% (3/4 portion)
  private readonly EXIT_END_Y = 850;     // 380px to 850px -> balance 1/4 rolls up (0.75 -> 1.0), letter exits off top, details enters

  readonly trackHeight = computed(() => {
    return this.isScrollUnlocked() ? '240vh' : '100vh';
  });

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
    return Math.min(1, p * 1.5);
  });

  readonly detailsInteractive = computed(() => {
    return this.detailsProgress() >= 0.85;
  });

  readonly ropeProgress = computed(() => {
    const y = this.scrollY();
    if (y <= 180) return 0;
    if (y >= this.ROLL_3_4_Y) return 1;
    return (y - 180) / (this.ROLL_3_4_Y - 180);
  });

  readonly detailsTransform = computed(() => {
    const p = this.detailsProgress();
    const y = this.scrollY();
    if (p <= 0) {
      return 'translate3d(0, 70vh, 0)';
    }
    // Rises smoothly from 70vh below to 0vh (exact full screen center) as p goes 0 to 1
    const baseTranslateVh = (1 - p) * 70;
    
    // Once fully in view (y > EXIT_END_Y), allow gentle upward scrolling for natural browsing
    let extraOffsetPx = 0;
    if (y > this.EXIT_END_Y) {
      const extra = y - this.EXIT_END_Y;
      extraOffsetPx = Math.min(160, extra * 0.45);
    }
    
    return `translate3d(0, calc(${baseTranslateVh.toFixed(2)}vh - ${extraOffsetPx.toFixed(1)}px), 0)`;
  });

  private targetY = 0;
  private currentY = 0;
  private isTicking = false;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (typeof window !== 'undefined' && this.isScrollUnlocked()) {
      this.targetY = window.scrollY;
      if (!this.isTicking) {
        this.isTicking = true;
        requestAnimationFrame(() => this.smoothScrollStep());
      }
    }
  }

  private smoothScrollStep(): void {
    const diff = this.targetY - this.currentY;
    if (Math.abs(diff) < 0.3) {
      this.currentY = this.targetY;
      this.scrollY.set(this.currentY);
      this.isTicking = false;
      return;
    }

    // Smooth responsive lerp for high-FPS, zero-stutter feel
    this.currentY += diff * 0.28;
    this.scrollY.set(this.currentY);
    requestAnimationFrame(() => this.smoothScrollStep());
  }

  onSceneCompleted(): void {
    this.isScrollUnlocked.set(true);
  }
}
