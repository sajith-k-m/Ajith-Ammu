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
          <div
            class="golden-wave-crest-horizon"
            [style.transform]="waveCrestTiltTransform()"
          >
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
                <filter id="goldBeamGlow" x="-20%" y="-50%" width="140%" height="200%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <!-- Filled Liquid Wave Curve -->
              <path
                d="M0,45 C320,85 480,10 720,50 C960,90 1120,15 1440,45 L1440,122 L0,122 Z"
                fill="url(#veilPeachSilkFill)"
              />
              <!-- Wide Warm Golden Bloom -->
              <path
                d="M0,45 C320,85 480,10 720,50 C960,90 1120,15 1440,45"
                fill="none"
                stroke="rgba(245, 158, 11, 0.45)"
                stroke-width="8"
                filter="url(#goldBeamGlow)"
              />
              <!-- Crisp 24K Gold Foil Filament Beam -->
              <path
                d="M0,45 C320,85 480,10 720,50 C960,90 1120,15 1440,45"
                fill="none"
                stroke="url(#crestGoldBeam)"
                stroke-width="2.8"
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
          <div class="peach-veil-body">
            <div class="peach-silk-wave wave-1"></div>
            <div class="peach-silk-wave wave-2"></div>
            <div class="kasavu-watermark-lattice"></div>
            <div class="peach-gold-dust-sheen"></div>
          </div>
        </div>

        <!-- ReactBits Pro: Radiant Golden Dawn Bloom (peaking in mid-transition) -->
        <div
          class="golden-dawn-radiance-bloom"
          [style.opacity]="dawnBloomOpacity()"
          [style.transform]="dawnBloomTransform()"
        ></div>
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

    /* Base Dark Royal Atmosphere */
    .dark-atmosphere-layer {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background: radial-gradient(ellipse 75% 70% at 50% 50%, #2e1118 0%, #19080c 45%, #0d0406 80%, #060203 100%);
      z-index: 0;
      pointer-events: none;
      will-change: opacity;
      transition: opacity 0.15s ease-out;
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
      will-change: opacity;
      transition: opacity 0.2s linear;
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
        text-shadow: 0 0 10px #f59e0b, 0 0 20px #dfb25d;
        animation: crestSparklePulse 2.5s ease-in-out infinite alternate;

        &.g-1 { animation-delay: 0s; font-size: 14px; }
        &.g-2 { animation-delay: 0.5s; font-size: 18px; }
        &.g-3 { animation-delay: 1.1s; font-size: 20px; }
        &.g-4 { animation-delay: 0.3s; font-size: 16px; }
        &.g-5 { animation-delay: 0.8s; font-size: 14px; }
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
      background:
        radial-gradient(ellipse 80% 60% at 20% 15%, rgba(255, 240, 232, 0.98) 0%, transparent 60%),
        radial-gradient(ellipse 70% 60% at 85% 45%, rgba(254, 224, 210, 0.95) 0%, transparent 55%),
        radial-gradient(ellipse 90% 70% at 50% 85%, rgba(248, 204, 188, 0.85) 0%, transparent 65%),
        radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 248, 242, 0.7) 0%, transparent 70%),
        linear-gradient(180deg, #fdf5ef 0%, #fae6dc 25%, #f6d6c7 60%, #f0beab 100%);
      overflow: hidden;

      .peach-silk-wave {
        position: absolute;
        pointer-events: none;
        filter: blur(60px);
        border-radius: 50%;
        will-change: transform, opacity;
        
        &.wave-1 {
          top: -15%;
          left: -10%;
          width: 80vw;
          height: 60vh;
          background: radial-gradient(ellipse at center, rgba(255, 235, 224, 0.75) 0%, rgba(254, 215, 198, 0.45) 50%, transparent 75%);
          animation: silkWaveDrift1 22s ease-in-out infinite alternate;
        }

        &.wave-2 {
          bottom: -20%;
          right: -15%;
          width: 85vw;
          height: 70vh;
          background: radial-gradient(ellipse at center, rgba(252, 218, 201, 0.7) 0%, rgba(246, 195, 175, 0.35) 55%, transparent 75%);
          animation: silkWaveDrift2 26s ease-in-out infinite alternate;
        }
      }

      .kasavu-watermark-lattice {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.045;
        background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2396601a' fill-opacity='1'%3E%3Cpath d='M40 0 L45 20 L65 20 L50 32 L56 52 L40 40 L24 52 L30 32 L15 20 L35 20 Z' fill='none' stroke='%2396601a' stroke-width='0.8'/%3E%3Ccircle cx='40' cy='40' r='18' fill='none' stroke='%2396601a' stroke-width='0.7' stroke-dasharray='2,2'/%3E%3Ccircle cx='40' cy='40' r='6' fill='none' stroke='%2396601a' stroke-width='0.9'/%3E%3Cpolygon points='40,15 42,25 52,25 44,31 47,40 40,35 33,40 36,31 28,25 38,25' fill='%2396601a' opacity='0.5'/%3E%3Cpolygon points='0,0 2,10 12,10 4,16 7,25 0,20 -7,25 -4,16 -12,10 -2,10' fill='%2396601a' opacity='0.3'/%3E%3Cpolygon points='80,0 82,10 92,10 84,16 87,25 80,20 73,25 76,16 68,10 78,10' fill='%2396601a' opacity='0.3'/%3E%3Cpolygon points='0,80 2,90 12,90 4,96 7,105 0,100 -7,105 -4,96 -12,90 -2,90' fill='%2396601a' opacity='0.3'/%3E%3Cpolygon points='80,80 82,90 92,90 84,96 87,105 80,100 73,105 76,96 68,90 78,90' fill='%2396601a' opacity='0.3'/%3E%3C/g%3E%3C/svg%3E");
        background-size: 80px 80px;
      }

      .peach-gold-dust-sheen {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background: radial-gradient(circle 800px at 50% 30%, rgba(255, 245, 220, 0.35) 0%, transparent 70%);
        mix-blend-mode: soft-light;
      }
    }

    /* Golden Dawn Radiance Bloom */
    .golden-dawn-radiance-bloom {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 900px;
      height: 900px;
      margin-top: -450px;
      margin-left: -450px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 238, 190, 0.7) 0%, rgba(245, 175, 120, 0.35) 45%, rgba(223, 140, 95, 0.12) 65%, transparent 80%);
      filter: blur(80px);
      mix-blend-mode: screen;
      pointer-events: none;
      z-index: 2;
      will-change: opacity, transform;
      transition: opacity 0.15s ease-out;
    }

    @keyframes silkWaveDrift1 {
      0% { transform: translate3d(0, 0, 0) scale(1); }
      100% { transform: translate3d(5vw, 6vh, 0) scale(1.08); }
    }

    @keyframes silkWaveDrift2 {
      0% { transform: translate3d(0, 0, 0) scale(1); }
      100% { transform: translate3d(-6vw, -5vh, 0) scale(1.06); }
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

  // Wave crest dynamic tilt with scroll velocity
  readonly waveCrestTiltTransform = computed(() => {
    const vel = this.scrollVelocity();
    const skew = (-vel * 0.04).toFixed(2);
    return `skewY(${skew}deg)`;
  });

  // ReactBits Pro: Radiant Golden Dawn Bloom peaking at mid-transition
  readonly dawnBloomOpacity = computed(() => {
    const p = this.peachTransitionProgress();
    if (p <= 0 || p >= 1) return 0;
    return (Math.sin(Math.PI * p) * 0.55).toFixed(3);
  });

  readonly dawnBloomTransform = computed(() => {
    const p = this.peachTransitionProgress();
    const scale = (0.8 + (p * 0.45)).toFixed(2);
    return `scale(${scale})`;
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
    const now = performance.now();
    const dt = Math.max(16, now - this.lastScrollTime);

    // Smooth responsive lerp for high-FPS, zero-stutter feel
    this.currentY += diff * 0.28;
    this.scrollY.set(this.currentY);

    // Instantaneous velocity with direction
    const rawDy = this.currentY - this.lastScrollY;
    const instantVel = Math.max(-100, Math.min(100, (rawDy / dt) * 60));

    // Smooth physical momentum filter (liquid inertial damping)
    const prevVel = this.scrollVelocity();
    const smoothedVel = prevVel + (instantVel - prevVel) * 0.35;
    this.scrollVelocity.set(Math.abs(smoothedVel) < 0.05 ? 0 : smoothedVel);

    this.lastScrollY = this.currentY;
    this.lastScrollTime = now;

    // Check if both position and velocity have smoothly settled to rest
    if (Math.abs(diff) < 0.3 && Math.abs(this.scrollVelocity()) < 0.1) {
      this.currentY = this.targetY;
      this.scrollY.set(this.currentY);
      this.scrollVelocity.set(0);
      this.isTicking = false;
      return;
    }

    requestAnimationFrame(() => this.smoothScrollStep());
  }

  onSceneCompleted(): void {
    this.isScrollUnlocked.set(true);
  }
}
