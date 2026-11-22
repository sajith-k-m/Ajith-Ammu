import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroSceneComponent } from './components/intro-scene/intro-scene.component';
import { DetailsSectionComponent } from './components/details-section/details-section.component';
import { FloatingDecorationsComponent } from './components/floating-decorations/floating-decorations.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IntroSceneComponent,
    DetailsSectionComponent,
    FloatingDecorationsComponent
  ],
  template: `
    <main class="page-wrapper" [class.scroll-unlocked]="isScrollUnlocked()">
      
      <!-- Base Dark Royal Atmosphere Layer (Letter backdrop) -->
      <div
        class="dark-atmosphere-layer"
        [style.opacity]="(1 - peachTransitionProgress()).toFixed(3)"
        aria-hidden="true"
      ></div>

      <!-- ReactBits Pro: Liquid Golden Silk Wave Curtain Metamorphosis -->
      <div
        class="liquid-silk-transition-stage"
        [style.opacity]="peachTransitionProgress() > 0 ? 1 : 0"
        aria-hidden="true"
      >
        <!-- The Rising Royal Peach Silk Curtain -->
        <div
          class="rising-peach-veil"
          [style.transform]="risingVeilTransform()"
        >
          <!-- Golden Shimmer Wave Crest Horizon Line -->
          <div class="golden-wave-crest-horizon">
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none" class="liquid-wave-svg" aria-hidden="true">
              <defs>
                <linearGradient id="crestGoldBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="rgba(223, 178, 93, 0)" />
                  <stop offset="12%" stop-color="#dfb25d" stop-opacity="0.6" />
                  <stop offset="28%" stop-color="#fff8db" stop-opacity="1" />
                  <stop offset="50%" stop-color="#f59e0b" stop-opacity="1" />
                  <stop offset="72%" stop-color="#fff8db" stop-opacity="1" />
                  <stop offset="88%" stop-color="#dfb25d" stop-opacity="0.6" />
                  <stop offset="100%" stop-color="rgba(223, 178, 93, 0)" />
                </linearGradient>
                <linearGradient id="veilPeachSilkFill" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stop-color="#fbeee4" stop-opacity="1" />
                  <stop offset="40%" stop-color="#fdf5ef" stop-opacity="1" />
                  <stop offset="100%" stop-color="#fdf5ef" stop-opacity="1" />
                </linearGradient>
              </defs>
              <!-- Filled Liquid Wave Curve -->
              <path
                d="M0,45 C320,85 480,10 720,50 C960,90 1120,15 1440,45 L1440,122 L0,122 Z"
                fill="url(#veilPeachSilkFill)"
              />
              <!-- Wide Warm Golden Halo Beam (Hardware-accelerated CSS stroke instead of live SVG filter) -->
              <path
                d="M0,45 C320,85 480,10 720,50 C960,90 1120,15 1440,45"
                fill="none"
                stroke="rgba(245, 158, 11, 0.4)"
                stroke-width="7"
                stroke-linecap="round"
              />
              <!-- Crisp 24K Gold Foil Filament Beam -->
              <path
                d="M0,45 C320,85 480,10 720,50 C960,90 1120,15 1440,45"
                fill="none"
                stroke="url(#crestGoldBeam)"
                stroke-width="2.6"
              />
            </svg>
            <div class="crest-sparkles">
              <span class="crest-glyph g-1">✦</span>
              <span class="crest-glyph g-2">✧</span>
              <span class="crest-glyph g-3">✦</span>
              <span class="crest-glyph g-4">✧</span>
              <span class="crest-glyph g-5">✦</span>
            </div>
          </div>

          <!-- Luminous Peach Body Fill extending beneath the crest -->
          <div class="peach-veil-body"></div>
        </div>
      </div>

      <!-- Interactive 3D Floating Elements & Ambient Bokeh Engine (reacts to scroll & mouse) -->
      <app-floating-decorations
        [scrollY]="scrollY()"
        [scrollVelocity]="scrollVelocity()"
        [peachProgress]="peachTransitionProgress()"
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
        [style.pointer-events]="detailsInteractive() ? 'auto' : 'none'"
      >
        <app-details-section />
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

    /* Base Dark Royal Atmosphere */
    .dark-atmosphere-layer {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background: radial-gradient(ellipse 75% 70% at 50% 50%, #2e1118 0%, #19080c 45%, #0d0406 80%, #060203 100%);
      z-index: 0;
      pointer-events: none;
    }

    /* ReactBits Pro: Liquid Golden Silk Transition Stage */
    .liquid-silk-transition-stage {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      z-index: 1;
      pointer-events: none;
      overflow: hidden;
    }

    .rising-peach-veil {
      position: absolute;
      top: -120px;
      left: 0;
      width: 100vw;
      height: calc(100vh + 140px);
      display: flex;
      flex-direction: column;
      will-change: transform;
      pointer-events: none;
    }

    .golden-wave-crest-horizon {
      position: relative;
      width: 100%;
      height: 120px;
      flex-shrink: 0;
      overflow: visible;
      will-change: transform;
      margin-bottom: -2px;

      .liquid-wave-svg {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 120px;
        display: block;
      }

      .crest-sparkles {
        position: absolute;
        top: 25px;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: space-around;
        pointer-events: none;
      }

      .crest-glyph {
        font-family: serif;
        font-size: 16px;
        color: #fff4d1;
        text-shadow: 0 0 6px rgba(245, 158, 11, 0.6);
        animation: crestSparklePulse 3s ease-in-out infinite alternate;

        &.g-1 { animation-delay: 0s; font-size: 14px; }
        &.g-2 { animation-delay: 0.5s; font-size: 18px; }
        &.g-3 { animation-delay: 1.1s; font-size: 20px; }
        &.g-4 { animation-delay: 0.3s; font-size: 16px; }
        &.g-5 { animation-delay: 0.8s; font-size: 14px; }
      }

      @media (max-width: 768px) {
        .crest-sparkles {
          display: none;
        }
      }
    }

    @keyframes crestSparklePulse {
      0% { opacity: 0.35; transform: scale(0.8) rotate(0deg); }
      100% { opacity: 1; transform: scale(1.25) rotate(25deg); }
    }

    .peach-veil-body {
      position: relative;
      flex: 1;
      width: 100%;
      background: linear-gradient(180deg, #fdf5ef 0%, #fae6dc 25%, #f6d6c7 60%, #f0beab 100%);
      overflow: hidden;
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
export class AppComponent implements OnInit, OnDestroy {
  readonly isScrollUnlocked = signal<boolean>(false);
  readonly scrollY = signal<number>(0);
  readonly scrollVelocity = signal<number>(0);

  private ngZone = inject(NgZone);
  private scrollUnlisten: (() => void) | null = null;

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

  readonly TRANSITION_START_Y = 220;
  readonly TRANSITION_END_Y = 820;

  // ReactBits Pro: Quintic smootherstep transition progress (0.0 to 1.0)
  readonly peachTransitionProgress = computed(() => {
    const y = this.scrollY();
    if (y <= this.TRANSITION_START_Y) return 0;
    if (y >= this.TRANSITION_END_Y) return 1;
    const t = (y - this.TRANSITION_START_Y) / (this.TRANSITION_END_Y - this.TRANSITION_START_Y);
    // Perlin's quintic smootherstep polynomial: 6t^5 - 15t^4 + 10t^3
    return t * t * t * (t * (t * 6 - 15) + 10);
  });

  // Rising peach silk veil transform
  readonly risingVeilTransform = computed(() => {
    const p = this.peachTransitionProgress();
    if (p <= 0) return 'translate3d(0, 105%, 0)';
    if (p >= 1) return 'translate3d(0, 0%, 0)';
    const translateYPercent = ((1 - p) * 105).toFixed(2);
    return `translate3d(0, ${translateYPercent}%, 0)`;
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

  private lastScrollY = 0;
  private lastScrollTime = 0;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.ngZone.runOutsideAngular(() => {
        const onScroll = () => {
          if (!this.isScrollUnlocked()) return;
          const scrollY = window.scrollY;
          this.scrollY.set(scrollY);

          // Measure kinetic velocity (capped and damped)
          const now = performance.now();
          const dt = Math.max(16, now - this.lastScrollTime);
          const rawDy = scrollY - this.lastScrollY;
          const instantVel = Math.max(-50, Math.min(50, (rawDy / dt) * 60));
          const prevVel = this.scrollVelocity();
          const smoothedVel = prevVel + (instantVel - prevVel) * 0.45;
          this.scrollVelocity.set(Math.abs(smoothedVel) < 0.1 ? 0 : smoothedVel);

          this.lastScrollY = scrollY;
          this.lastScrollTime = now;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        this.scrollUnlisten = () => window.removeEventListener('scroll', onScroll);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.scrollUnlisten) {
      this.scrollUnlisten();
    }
  }

  onSceneCompleted(): void {
    this.isScrollUnlocked.set(true);
  }
}
