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
          <!-- Intro Scene with Scroll Unrolling, Roll-up & Golden Rope -->
          <app-intro-scene
            [scrollRoll]="scrollRoll()"
            [ropeProgress]="ropeProgress()"
            [isScrolled]="scrollY() > 10"
            (sceneCompleted)="onSceneCompleted()"
          />

          <!-- Details Section Suspended Like a Rope of the Letter -->
          <div
            class="suspended-details-wrapper"
            [class.interactive]="detailsInteractive()"
            [style.opacity]="detailsOpacity()"
            [style.transform]="detailsTransform()"
          >
            <!-- Hanging Golden Silk Cord Connector -->
            <div class="suspension-cord" aria-hidden="true">
              <div class="cord-thread"></div>
            </div>

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

    .suspended-details-wrapper {
      position: absolute;
      top: 48%;
      left: 0;
      right: 0;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 35;
      pointer-events: none;
      transition: opacity 0.15s ease-out;

      &.interactive {
        pointer-events: auto;
      }

      @media (min-width: 768px) {
        top: 46.5%;
      }
    }

    .suspension-cord {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 26px;
      margin-top: -8px;
      margin-bottom: -6px;

      .cord-thread {
        width: 2.2px;
        height: 100%;
        background: linear-gradient(
          to bottom,
          #fae09a 0%,
          #dfb25d 30%,
          #c6953f 70%,
          #8d621b 100%
        );
        box-shadow: 0 0 6px rgba(223, 178, 93, 0.4);
      }
    }
  `]
})
export class AppComponent {
  readonly isScrollUnlocked = signal<boolean>(false);
  readonly scrollY = signal<number>(0);

  // Maximum scroll range for roll-up & details reveal
  private readonly ROLL_END_Y = 350;      // 0 to 350px -> 0.0 to 0.75 (3/4 portion)
  private readonly ROPE_START_Y = 220;    // 220px to 360px -> rope extends
  private readonly ROPE_END_Y = 360;
  private readonly DETAILS_START_Y = 340; // 340px to 700px -> details glide up & emerge
  private readonly DETAILS_END_Y = 700;

  readonly trackHeight = computed(() => {
    return this.isScrollUnlocked() ? '250vh' : '100vh';
  });

  readonly scrollRoll = computed(() => {
    const y = this.scrollY();
    if (y <= 0) return 0;
    if (y >= this.ROLL_END_Y) return 0.75;
    return (y / this.ROLL_END_Y) * 0.75;
  });

  readonly ropeProgress = computed(() => {
    const y = this.scrollY();
    if (y <= this.ROPE_START_Y) return 0;
    if (y >= this.ROPE_END_Y) return 1;
    return (y - this.ROPE_START_Y) / (this.ROPE_END_Y - this.ROPE_START_Y);
  });

  readonly detailsProgress = computed(() => {
    const y = this.scrollY();
    if (y <= this.DETAILS_START_Y) return 0;
    if (y >= this.DETAILS_END_Y) return 1;
    return (y - this.DETAILS_START_Y) / (this.DETAILS_END_Y - this.DETAILS_START_Y);
  });

  readonly detailsOpacity = computed(() => {
    return this.detailsProgress();
  });

  readonly detailsInteractive = computed(() => {
    return this.detailsProgress() > 0.4;
  });

  readonly detailsTransform = computed(() => {
    const p = this.detailsProgress();
    const y = this.scrollY();
    // Glide up from 80px offset to 0 as detailsProgress goes from 0 to 1
    const baseOffset = (1 - p) * 80;
    // Extra scroll beyond DETAILS_END_Y for comfortable reading on short mobile screens
    const extraScroll = Math.max(0, y - this.DETAILS_END_Y);
    const extraOffset = Math.min(180, extraScroll * 0.45);
    const finalY = baseOffset - extraOffset;
    return `translate3d(0, ${finalY}px, 0)`;
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
