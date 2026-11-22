import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  HostListener,
  output,
  input,
  ChangeDetectionStrategy,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationPaperComponent } from '../invitation-paper/invitation-paper.component';

type SceneStep = 'loading' | 'rolled' | 'unrolling' | 'text' | 'completed';

@Component({
  selector: 'app-intro-scene',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, InvitationPaperComponent],
  template: `
    <div
      class="scene-container"
      [class.scene-completed]="step() === 'completed'"
      [class.is-animating]="isAnimating()"
    >
      <!-- Background Faint Static Grain & Golden Halo behind letter (hardware-cached static texture) -->
      <div class="bg-grain" aria-hidden="true"></div>
      <div class="golden-glow" aria-hidden="true"></div>

      <!-- Skip Button -->
      @if (step() !== 'completed' && step() !== 'loading') {
        <button
          class="skip-btn"
          (click)="skip()"
          type="button"
          aria-label="Skip introduction animation"
        >
          <span>Skip</span> &rsaquo;&rsaquo;
        </button>
      }

      <!-- Centered Minimal Loader -->
      @if (step() === 'loading') {
        <div class="loader-overlay" aria-live="polite" aria-label="Loading invitation">
          <div class="spinner"></div>
        </div>
      }

      <!-- Camera Rig (moves scene up smoothly and exits off top screen during scroll transition) -->
      <div
        class="camera-rig"
        [style.transform]="cameraTransform()"
        [style.visibility]="exitProgress() >= 1 ? 'hidden' : 'visible'"
        [style.pointer-events]="exitProgress() >= 1 ? 'none' : 'auto'"
      >
        <!-- Desktop Tilt Stage -->
        <div
          class="tilt-stage"
          [style.transform]="tiltTransform()"
        >
          <!-- Scroll Assembly (Paper + Rods) -->
          <div class="scroll-assembly">

            <!-- Top Rod -->
            <div
              class="rod rod-top"
              [style.transform]="topRodTransform()"
              [style.opacity]="rodsOpacity()"
            >
              <div class="rod-roller roller-top">
                <img
                  src="assets/images/scroll-rod-top.webp"
                  alt=""
                  width="924"
                  height="160"
                  class="rod-img"
                  aria-hidden="true"
                />
              </div>
              <!-- Dynamic Parchment Curl Shadow traveling synchronously under top rod -->
              <div class="rod-curl-shadow curl-below" aria-hidden="true"></div>
            </div>

            <!-- Paper with synchronized clip-path from center outward and scroll-up roll from bottom -->
            <div
              class="paper-reveal-window"
              [style.clip-path]="paperClipPath()"
              [style.opacity]="rodsOpacity()"
            >
              <app-invitation-paper
                [animateText]="step() === 'text'"
                [textVisible]="isTextVisible()"
                [curling]="step() === 'unrolling'"
              />
            </div>

            <!-- Bottom Rod (rolls back up on user scroll) -->
            <div
              class="rod rod-bottom"
              [style.transform]="bottomRodTransform()"
              [style.opacity]="rodsOpacity()"
            >
              <!-- Dynamic Parchment Curl Shadow traveling synchronously above bottom rod -->
              <div class="rod-curl-shadow curl-above" aria-hidden="true"></div>

              <div class="rod-roller roller-bottom">
                <img
                  src="assets/images/scroll-rod-bottom.webp"
                  alt=""
                  width="924"
                  height="138"
                  class="rod-img"
                  aria-hidden="true"
                />
              </div>

              <!-- Royal Golden Rope hanging from bottom rod center with dynamic physics -->
              <div
                class="golden-rope-container"
                [style.transform]="goldenRopeTransform()"
                [style.opacity]="ropeOpacity()"
                (pointerdown)="onTasselPointerDown($event)"
                aria-label="Golden Royal Tassel"
              >
                <svg viewBox="0 0 100 84" width="100" height="84" class="golden-rope-svg">
                  <defs>
                    <!-- Metallic Royal Gold Gradient for cords and bells -->
                    <linearGradient id="tasselGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#fff3c4"/>
                      <stop offset="25%" stop-color="#fae09a"/>
                      <stop offset="50%" stop-color="#dfb25d"/>
                      <stop offset="75%" stop-color="#c6953f"/>
                      <stop offset="100%" stop-color="#7a4f10"/>
                    </linearGradient>

                    <!-- Silk Cord Shading Gradient -->
                    <linearGradient id="cordShadeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#fae09a"/>
                      <stop offset="35%" stop-color="#ffd56b"/>
                      <stop offset="70%" stop-color="#c6953f"/>
                      <stop offset="100%" stop-color="#69420d"/>
                    </linearGradient>
                  </defs>

                  <!-- Upper Anchor Loops (wrap firmly around bottom roller cylinder) -->
                  <path
                    d="M28 0 C28 14 44 20 50 25"
                    stroke="url(#tasselGoldGrad)"
                    stroke-width="3.2"
                    fill="none"
                    stroke-linecap="round"
                  />
                  <path
                    d="M72 0 C72 14 56 20 50 25"
                    stroke="url(#tasselGoldGrad)"
                    stroke-width="3.2"
                    fill="none"
                    stroke-linecap="round"
                  />

                  <!-- Hanging Tassel Arm (swings smoothly from anchor) -->
                  <g class="articulated-tassel-arm">
                    <!-- Top Antique Knot Ring / Rosette -->
                    <circle cx="50" cy="27" r="5" fill="url(#tasselGoldGrad)"/>
                    <circle cx="50" cy="27" r="2.4" fill="#180a0c"/>
                    <!-- Ring highlight collar -->
                    <ellipse cx="50" cy="32" rx="4.2" ry="2.2" fill="url(#tasselGoldGrad)"/>

                    <!-- Braided Connecting Stem Cord (solidly joins knot collar at y=32 to bell at y=52) -->
                    <rect x="48" y="31" width="4" height="23" rx="2" fill="url(#cordShadeGrad)"/>
                    <!-- Textured braid ridges -->
                    <path d="M48.5 36 L50 37.5 L51.5 36" stroke="#7a4f10" stroke-width="0.8" fill="none" opacity="0.6"/>
                    <path d="M48.5 41 L50 42.5 L51.5 41" stroke="#7a4f10" stroke-width="0.8" fill="none" opacity="0.6"/>
                    <path d="M48.5 46 L50 47.5 L51.5 46" stroke="#7a4f10" stroke-width="0.8" fill="none" opacity="0.6"/>
                    <path d="M48.5 51 L50 52.5 L51.5 51" stroke="#7a4f10" stroke-width="0.8" fill="none" opacity="0.6"/>

                    <!-- Articulated Tassel Bell & Silk Fringe (swings at cord junction) -->
                    <g class="tassel-bell-group" [style.transform]="tasselBellTransform()">
                      <!-- Fluted Golden Tassel Bell Cap -->
                      <path
                        d="M45.5 52 C45.5 50.5 54.5 50.5 54.5 52 L57 66 C57 67.5 43 67.5 43 66 Z"
                        fill="url(#tasselGoldGrad)"
                      />
                      <ellipse cx="50" cy="53" rx="4.8" ry="1.8" fill="#fff3c4" opacity="0.8"/>
                      <ellipse cx="50" cy="65.5" rx="6.8" ry="2.2" fill="#7a4f10" opacity="0.7"/>

                      <!-- Cascading Silk Fringe Threads with Dynamic Aerodynamic Flex -->
                      <g class="fringe-threads-group" [style.transform]="fringeFlexTransform()">
                        <path d="M44.5 66 C44.5 76 46 79 47 80" stroke="url(#tasselGoldGrad)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
                        <path d="M47 66 C47 77 48.5 80 49 81" stroke="url(#tasselGoldGrad)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
                        <path d="M50 66 L50 83" stroke="#fff3c4" stroke-width="2.2" stroke-linecap="round"/>
                        <path d="M53 66 C53 77 51.5 80 51 81" stroke="url(#tasselGoldGrad)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
                        <path d="M55.5 66 C55.5 76 54 79 53 80" stroke="url(#tasselGoldGrad)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Scroll Down Indicator when completed (hides immediately on scroll) -->
      @if (step() === 'completed' && scrollRoll() <= 0.01) {
        <div
          class="scroll-cue"
          aria-hidden="true"
        >
          <span>Scroll to explore</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cue-arrow">
            <path d="M7 10l5 5 5-5" />
          </svg>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
      width: 100%;
      min-height: 100vh;
      min-height: 100dvh;
      overflow: hidden;
      background: transparent;
    }

    .scene-container {
      position: relative;
      width: 100%;
      min-height: 100vh;
      min-height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      /* Mathematical sizing calculations based on royal scroll proportions */
      /* Mobile / Portrait: Rod is 92vw (handles clear edges with 4vw margin), height fits comfortably */
      --scroll-w: min(92vw, calc(85vh * 924 / 1200), 520px);
      --rod-w: var(--scroll-w);
      --paper-w: calc(var(--scroll-w) * 664 / 924);
      --paper-h: calc(var(--paper-w) * 914 / 664);
      --rod-top-h: calc(var(--scroll-w) * 160 / 924);
      --rod-bot-h: calc(var(--scroll-w) * 138 / 924);
      --overlap: calc(var(--scroll-w) * 6 / 924);

      /* Desktop / Laptop screens (769px and above): Scroll scales grandly to fill viewport height elegantly up to 740px */
      @media (min-width: 769px) {
        --scroll-w: min(88vw, calc(88vh * 924 / 1200), 740px);
      }

      /* Large desktop monitors (1440p and 4K): Expand up to 800px */
      @media (min-width: 1440px) {
        --scroll-w: min(85vw, calc(89vh * 924 / 1200), 800px);
      }
    }

    /* Background Aesthetics */
    .bg-vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 70% 65% at 50% 50%, rgba(52, 22, 16, 0.95) 0%, rgba(32, 14, 12, 0.9) 45%, #14080a 75%, #080304 100%);
      pointer-events: none;
      z-index: 1;
    }

    .golden-glow {
      position: absolute;
      width: min(90vw, 850px);
      height: min(90vh, 850px);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, rgba(212, 165, 90, 0.25) 0%, rgba(212, 165, 90, 0.1) 45%, transparent 75%);
      pointer-events: none;
      z-index: 2;

      @media (min-width: 769px) {
        width: min(90vw, 1100px);
        height: min(92vh, 1000px);
        background: radial-gradient(ellipse 65% 60% at 50% 50%, rgba(220, 170, 95, 0.28) 0%, rgba(212, 165, 90, 0.12) 48%, transparent 75%);
      }
    }

    .bg-grain {
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.05;
      pointer-events: none;
      z-index: 3;
    }

    /* Skip Button */
    .skip-btn {
      position: absolute;
      top: 24px;
      right: 24px;
      z-index: 40;
      background: rgba(30, 15, 10, 0.65);
      border: 1px solid rgba(212, 165, 90, 0.4);
      color: #f7e6c4;
      font-family: var(--font-caveat);
      font-size: 20px;
      font-weight: 600;
      padding: 7px 18px;
      border-radius: 20px;
      cursor: pointer;
      backdrop-filter: blur(4px);
      transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
      display: flex;
      align-items: center;
      gap: 4px;

      &:hover {
        background: rgba(42, 18, 12, 0.85);
        border-color: rgba(212, 165, 90, 0.8);
        transform: translateY(-1px);
      }
    }

    /* Centered Minimal Loader */
    .loader-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 50;
      background: #12080a;

      .spinner {
        width: 32px;
        height: 32px;
        border: 2px solid rgba(212, 165, 90, 0.2);
        border-top-color: #d4a55a;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Camera Rig */
    .camera-rig {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      will-change: transform;
    }

    /* Tilt Stage */
    .tilt-stage {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Scroll Assembly */
    .scroll-assembly {
      position: relative;
      width: var(--paper-w);
      height: var(--paper-h);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Paper Reveal Window */
    .paper-reveal-window {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      contain: paint;
      will-change: clip-path;
    }

    /* Rods (Top and Bottom) */
    .rod {
      position: absolute;
      left: 50%;
      width: var(--rod-w);
      z-index: 20;
      pointer-events: none;
      transition: opacity 0.3s ease;
      will-change: transform;

      &.rod-top {
        top: 0;
        height: var(--rod-top-h);
      }

      &.rod-bottom {
        bottom: 0;
        height: var(--rod-bot-h);
      }

      .rod-roller {
        position: relative;
        width: 100%;
        height: 100%;
        z-index: 2;
      }

      .rod-img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: fill;
        filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.4));
      }

      /* 3D Parchment Curl Shadows moving synchronously with the rods */
      .rod-curl-shadow {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: var(--paper-w);
        pointer-events: none;
        z-index: 1;

        &.curl-below {
          top: calc(100% - var(--overlap));
          height: 38px;
          background: linear-gradient(
            to bottom,
            rgba(15, 6, 2, 0.75) 0%,
            rgba(35, 15, 6, 0.4) 35%,
            rgba(50, 22, 10, 0.12) 70%,
            transparent 100%
          );
        }

        &.curl-above {
          bottom: calc(100% - var(--overlap));
          height: 38px;
          background: linear-gradient(
            to top,
            rgba(15, 6, 2, 0.75) 0%,
            rgba(35, 15, 6, 0.4) 35%,
            rgba(50, 22, 10, 0.12) 70%,
            transparent 100%
          );
        }
      }
    }

    /* Royal Golden Rope Hanging from Bottom Roller with Pendulum Physics */
    .golden-rope-container {
      position: absolute;
      top: calc(100% - 10px);
      left: 50%;
      width: 100px;
      height: 84px;
      transform-origin: 50px 0px;
      pointer-events: auto;
      cursor: grab;
      user-select: none;
      touch-action: none;
      z-index: 12;
      will-change: transform;
      contain: layout paint;
      transition: opacity 0.25s ease-out;

      &:active {
        cursor: grabbing;
      }

      .golden-rope-svg {
        display: block;
        margin: 0 auto;
        overflow: visible;
      }

      .tassel-bell-group {
        transform-origin: 50px 52px;
        transform-box: view-box;
        will-change: transform;
      }

      .fringe-threads-group {
        transform-origin: 50px 66px;
        transform-box: view-box;
        will-change: transform;
      }
    }

    /* Scroll Cue */
    .scroll-cue {
      position: absolute;
      bottom: clamp(10px, 1.8vh, 18px);
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      color: rgba(212, 165, 90, 0.7);
      font-family: var(--font-caveat);
      font-size: clamp(16px, 2.2cqw, 18px);
      letter-spacing: 0.04em;
      animation: cueBounce 2.2s ease-in-out infinite;
      z-index: 30;
      pointer-events: none;

      .cue-arrow {
        width: 18px;
        height: 18px;
      }
    }

    @keyframes cueBounce {
      0%, 100% {
        transform: translate(-50%, 0);
        opacity: 0.7;
      }
      50% {
        transform: translate(-50%, 6px);
        opacity: 1;
      }
    }
  `]
})
export class IntroSceneComponent implements OnInit, OnDestroy {
  readonly sceneCompleted = output<void>();

  // Scroll interactive inputs
  readonly scrollRoll = input<number>(0);
  readonly exitProgress = input<number>(0);
  readonly ropeProgress = input<number>(0);
  readonly scrollVelocity = input<number>(0);
  readonly isScrolled = input<boolean>(false);

  readonly step = signal<SceneStep>('loading');
  readonly unrollProgress = signal<number>(0);

  private mouseX = 0;
  private mouseY = 0;
  readonly tiltX = signal<number>(0);
  readonly tiltY = signal<number>(0);

  // Pointer tracking & velocity metrics
  private lastClientX = 0;
  private lastClientY = 0;
  private lastPointerTime = 0;
  private cursorVx = 0;
  private cursorVy = 0;
  private isTasselDragging = false;
  private dragStartX = 0;
  private dragStartAngle = 0;

  private timers: number[] = [];
  private unrollAnimId: number | null = null;

  readonly isAnimating = computed(() => {
    return this.step() === 'unrolling';
  });

  readonly isUnrolled = computed(() => {
    return this.step() === 'text' || this.step() === 'completed';
  });

  readonly isTextVisible = computed(() => {
    return this.step() === 'text' || this.step() === 'completed';
  });

  readonly rodsOpacity = computed(() => {
    return this.step() === 'loading' ? 0 : 1;
  });

  readonly cameraTransform = computed(() => {
    if (this.step() === 'completed') {
      const exit = this.exitProgress();
      if (exit > 0) {
        // Smoothly glides upwards in tandem with the rising elements and exits off top screen
        return `translate3d(0, ${(-exit * 52).toFixed(2)}vh, 0)`;
      }
      if (this.scrollRoll() > 0) {
        return `translate3d(0, ${(this.scrollRoll() * -20).toFixed(2)}px, 0)`;
      }
    }
    return null;
  });

  readonly paperClipPath = computed(() => {
    if (this.step() === 'loading' || this.step() === 'rolled') {
      return 'inset(50% 0 50% 0)';
    }
    if (this.step() === 'unrolling') {
      const insetY = ((1 - this.unrollProgress()) * 50).toFixed(4);
      return `inset(${insetY}% 0 ${insetY}% 0)`;
    }
    if (this.step() === 'completed' && this.scrollRoll() > 0) {
      return `inset(0% 0% ${(this.scrollRoll() * 100).toFixed(4)}% 0%)`;
    }
    return null;
  });

  readonly topRodTransform = computed(() => {
    if (this.step() === 'loading' || this.step() === 'rolled') {
      return `translate(-50%, calc(-100% + var(--overlap) + (var(--paper-h) / 2)))`;
    }
    if (this.step() === 'unrolling') {
      const offset = (1 - this.unrollProgress()).toFixed(4);
      return `translate(-50%, calc(-100% + var(--overlap) + ${offset} * (var(--paper-h) / 2)))`;
    }
    return `translate(-50%, calc(-100% + var(--overlap)))`;
  });

  readonly bottomRodTransform = computed(() => {
    if (this.step() === 'loading' || this.step() === 'rolled') {
      return `translate(-50%, calc(100% - var(--overlap) - (var(--paper-h) / 2)))`;
    }
    if (this.step() === 'unrolling') {
      const offset = (1 - this.unrollProgress()).toFixed(4);
      return `translate(-50%, calc(100% - var(--overlap) - ${offset} * (var(--paper-h) / 2)))`;
    }
    if (this.step() === 'completed' && this.scrollRoll() > 0) {
      return `translate(-50%, calc(100% - var(--overlap) - (${this.scrollRoll().toFixed(4)} * var(--paper-h))))`;
    }
    return `translate(-50%, calc(100% - var(--overlap)))`;
  });

  // Physical pendulum and elastic simulation for the hanging string/tassel
  private ropeAngle = 0;
  private ropeAngleVel = 0;
  private ropeSecondaryAngle = 0;
  private ropeSecondaryVel = 0;
  private ropeStretch = 1;
  private ropeStretchVel = 0;
  private ropeUnfurl = 0;
  private lastScrollRoll = 0;
  private lastPhysicsTime = 0;
  private physicsAnimId: number | null = null;

  readonly ropeAngleSignal = signal<number>(0);
  readonly ropeSecondaryAngleSignal = signal<number>(0);
  readonly ropeStretchSignal = signal<number>(1);
  readonly ropeUnfurlProgress = signal<number>(0);

  readonly ropeOpacity = computed(() => {
    if (this.step() === 'loading' || this.step() === 'rolled') return 0;
    if (this.step() === 'unrolling') {
      const p = this.unrollProgress();
      if (p <= 0.75) return 0;
      return Math.min(1, (p - 0.75) / 0.25);
    }
    return 1;
  });

  readonly goldenRopeTransform = computed(() => {
    const angle = this.ropeAngleSignal();
    const unfurl = this.ropeUnfurlProgress();
    const stretch = this.ropeStretchSignal();
    const stretchY = unfurl * stretch;
    const stretchX = stretchY > 0.05 ? Math.max(0.65, Math.min(1.35, 1 / Math.sqrt(stretchY))) : 1;
    return `translateX(-50%) rotate(${angle.toFixed(2)}deg) scale(${stretchX.toFixed(3)}, ${stretchY.toFixed(3)})`;
  });

  readonly tasselBellTransform = computed(() => {
    const secondaryAngle = this.ropeSecondaryAngleSignal();
    return `rotate(${secondaryAngle.toFixed(2)}deg)`;
  });

  readonly fringeFlexTransform = computed(() => {
    const diff = this.ropeSecondaryAngleSignal() - this.ropeAngleSignal();
    const flexSkew = Math.max(-14, Math.min(14, diff * 0.45));
    return `skewX(${flexSkew.toFixed(2)}deg)`;
  });

  readonly tiltTransform = computed(() => {
    if (this.step() !== 'completed') {
      return '';
    }
    const x = this.tiltX();
    const y = this.tiltY();
    if (x === 0 && y === 0) return '';
    return `perspective(1200px) rotateX(${x}deg) rotateY(${y}deg)`;
  });

  ngOnInit(): void {
    this.startPhysicsLoop();
    this.preloadInitialAssets();
  }

  ngOnDestroy(): void {
    if (this.unrollAnimId) {
      cancelAnimationFrame(this.unrollAnimId);
      this.unrollAnimId = null;
    }
    if (this.physicsAnimId) {
      cancelAnimationFrame(this.physicsAnimId);
      this.physicsAnimId = null;
    }
    this.clearAllTimers();
  }

  @HostListener('window:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (typeof window === 'undefined') return;
    const clientX = event.clientX;
    const clientY = event.clientY;
    const now = performance.now();
    const dt = this.lastPointerTime > 0 ? Math.max(0.005, (now - this.lastPointerTime) * 0.001) : 0.016;
    this.lastPointerTime = now;

    const rawVx = this.lastClientX > 0 ? (clientX - this.lastClientX) / dt : 0;
    const rawVy = this.lastClientY > 0 ? (clientY - this.lastClientY) / dt : 0;
    this.lastClientX = clientX;
    this.lastClientY = clientY;

    // Filtered cursor velocity (smoothing)
    this.cursorVx += (rawVx - this.cursorVx) * 0.35;
    this.cursorVy += (rawVy - this.cursorVy) * 0.35;

    // Stage 3D tilt (only when completed on larger screens for letter perspective)
    if (this.step() === 'completed') {
      this.mouseX = (clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = (clientY / window.innerHeight - 0.5) * 2;
      if (window.innerWidth > 768) {
        this.tiltX.set(Math.max(-3, Math.min(3, -this.mouseY * 3)));
        this.tiltY.set(Math.max(-3, Math.min(3, this.mouseX * 3)));
      }
    }

    // Direct Tassel Drag if active
    if (this.isTasselDragging) {
      const deltaX = clientX - this.dragStartX;
      this.ropeAngle = Math.max(-48, Math.min(48, this.dragStartAngle + deltaX * 0.25));
      this.ropeAngleVel = 0;
      return;
    }

    // Interactive Proximity & Aerodynamic Breeze Impulse:
    // Determine approximate distance from cursor to bottom roller tassel
    const ropeAnchorX = window.innerWidth / 2;
    const ropeAnchorY = window.innerHeight * 0.78;
    const dx = clientX - ropeAnchorX;
    const dy = clientY - ropeAnchorY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // If cursor is within 320px radius of tassel, apply strong tactile deflection
    if (dist < 320) {
      const proximity = 1 - (dist / 320);
      const pushForce = (this.cursorVx * 0.055) * (proximity * proximity);
      this.ropeAngleVel += pushForce;

      const verticalBreeze = Math.abs(this.cursorVy) * 0.001 * proximity;
      this.ropeStretchVel += verticalBreeze;
    } else {
      // Ambient room air current from general cursor movement
      const ambientBreeze = Math.max(-14, Math.min(14, this.cursorVx * 0.003));
      this.ropeAngleVel += ambientBreeze * 0.25;
    }
  }

  @HostListener('window:pointerup', ['$event'])
  @HostListener('window:pointercancel', ['$event'])
  onPointerUp(event: PointerEvent): void {
    if (this.isTasselDragging) {
      this.isTasselDragging = false;
      // Impart release velocity for free pendulum swing
      this.ropeAngleVel = Math.max(-65, Math.min(65, this.cursorVx * 0.15));
    }
  }

  onTasselPointerDown(event: PointerEvent): void {
    if (this.step() !== 'completed' && this.step() !== 'text') return;
    this.isTasselDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartAngle = this.ropeAngle;
    try {
      (event.target as HTMLElement).setPointerCapture(event.pointerId);
    } catch {}
    event.stopPropagation();
  }

  private preloadInitialAssets(): void {
    if (typeof window === 'undefined') {
      this.finishIntro();
      return;
    }

    let started = false;
    const triggerStart = () => {
      if (started) return;
      started = true;
      this.startSequence();
    };

    // Safety timeout: start sequence within 400ms even on slow networks
    const fallbackTimer = window.setTimeout(triggerStart, 400);

    let loadedCount = 0;
    const requiredImages = [
      'assets/images/scroll-rod-top.webp',
      'assets/images/scroll-rod-bottom.webp',
      'assets/images/scroll-paper.webp'
    ];

    const checkReady = () => {
      loadedCount++;
      if (loadedCount >= requiredImages.length) {
        clearTimeout(fallbackTimer);
        triggerStart();
      }
    };

    requiredImages.forEach(src => {
      const img = new Image();
      img.src = src;
      if (img.complete) {
        checkReady();
      } else {
        img.onload = checkReady;
        img.onerror = () => {
          // Never skip on image error: proceed so letter renders gracefully
          checkReady();
        };
      }
    });
  }

  private startSequence(): void {
    // 1. Initial State: Closed scroll at center (rods touching)
    this.step.set('rolled');
    this.unrollProgress.set(0);

    // 2. Start unrolling after brief 350ms settle
    this.schedule(() => {
      this.step.set('unrolling');
      this.startUnrollAnimation();
    }, 350);
  }

  private startUnrollAnimation(): void {
    const duration = 1500;
    const startTime = performance.now();

    const animateFrame = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);
      // Physical cubic ease-out
      const p = 1 - Math.pow(1 - t, 3);
      this.unrollProgress.set(p);

      if (t < 1) {
        this.unrollAnimId = requestAnimationFrame(animateFrame);
      } else {
        this.unrollProgress.set(1);
        this.step.set('text');
        // Allow text reveal to complete (1200ms) before unlocking scroll
        this.schedule(() => {
          this.finishIntro();
        }, 1200);
      }
    };

    this.unrollAnimId = requestAnimationFrame(animateFrame);
  }

  skip(): void {
    if (this.unrollAnimId) {
      cancelAnimationFrame(this.unrollAnimId);
      this.unrollAnimId = null;
    }
    this.clearAllTimers();
    this.unrollProgress.set(1);
    this.finishIntro();
  }

  private finishIntro(): void {
    this.step.set('completed');
    this.sceneCompleted.emit();
  }

  private schedule(fn: () => void, delayMs: number): void {
    const id = window.setTimeout(fn, delayMs);
    this.timers.push(id);
  }

  private clearAllTimers(): void {
    this.timers.forEach(id => clearTimeout(id));
    this.timers = [];
  }

  private ngZone = inject(NgZone);
  private lastRenderedRopeAngle = 0;
  private lastRenderedSecondaryAngle = 0;
  private lastRenderedStretch = 1;
  private lastRenderedUnfurl = 0;

  private startPhysicsLoop(): void {
    if (typeof window === 'undefined') return;
    this.ngZone.runOutsideAngular(() => {
      this.lastPhysicsTime = performance.now();
      const loop = (now: number) => {
        const rawDt = (now - this.lastPhysicsTime) * 0.001;
        this.lastPhysicsTime = now;
        const dt = Math.max(0.001, Math.min(0.04, rawDt));

        this.stepPhysics(dt, now);
        this.physicsAnimId = requestAnimationFrame(loop);
      };
      this.physicsAnimId = requestAnimationFrame(loop);
    });
  }

  private stepPhysics(dt: number, now: number): void {
    // When scene has completely exited off top of screen, pause physics calculation to save CPU/GPU
    if (this.exitProgress() >= 1) {
      return;
    }

    // 1. Unfurl progress when unrolling
    if (this.step() === 'unrolling') {
      const u = this.unrollProgress();
      if (u > 0.75) {
        const target = Math.min(1, (u - 0.75) / 0.25);
        this.ropeUnfurl += (target - this.ropeUnfurl) * Math.min(1, dt * 14);
      }
    } else if (this.step() === 'text' || this.step() === 'completed') {
      this.ropeUnfurl = 1;
    } else {
      this.ropeUnfurl = 0;
    }

    if (this.ropeUnfurl <= 0.01) {
      this.lastScrollRoll = this.scrollRoll();
      return;
    }

    // 2. Measure scroll velocity
    const currentRoll = this.scrollRoll();
    const rollDelta = currentRoll - this.lastScrollRoll;
    this.lastScrollRoll = currentRoll;
    const internalScrollVel = dt > 0 ? (rollDelta / dt) : 0;
    const extScrollVel = this.scrollVelocity() * 0.012;
    const effectiveScrollVel = Math.abs(extScrollVel) > Math.abs(internalScrollVel) ? extScrollVel : internalScrollVel;

    if (!this.isTasselDragging) {
      // 3. Stage tilt reaction & gravity target angle
      const stageTilt = this.tiltY(); // from mousemove or device tilt (-3 to +3 deg)
      const gravityTargetAngle = -stageTilt * 2.2;

      // 4. Ambient natural air current sway
      const timeSec = now * 0.001;
      const ambientSway = (Math.sin(timeSec * 1.5) * 2.0) + (Math.sin(timeSec * 2.7) * 1.0);

      // Dynamic scroll torque impulse
      // When bottom rod rolls up, inertia imparts a rotational kick
      const scrollImpulse = -effectiveScrollVel * 26;

      const netTargetAngle = gravityTargetAngle + ambientSway;

      // 5. Primary cord pendulum physics (damped harmonic oscillator)
      const springTorque = (netTargetAngle - this.ropeAngle) * 24;
      const dampingTorque = -this.ropeAngleVel * 3.8;
      const angularAccel = springTorque + dampingTorque + scrollImpulse;

      this.ropeAngleVel += angularAccel * dt;
      this.ropeAngle += this.ropeAngleVel * dt;
      this.ropeAngle = Math.max(-42, Math.min(42, this.ropeAngle));

      // 6. Secondary Tassel Bell Joint physics (articulated double pendulum lag & whip)
      const bellTargetAngle = this.ropeAngle * 1.45;
      const bellSpring = (bellTargetAngle - this.ropeSecondaryAngle) * 32;
      const bellDamping = -this.ropeSecondaryVel * 4.6;
      const bellAccel = bellSpring + bellDamping - (this.ropeAngleVel * 1.3);

      this.ropeSecondaryVel += bellAccel * dt;
      this.ropeSecondaryAngle += this.ropeSecondaryVel * dt;
      this.ropeSecondaryAngle = Math.max(-32, Math.min(32, this.ropeSecondaryAngle));

      // 7. Elastic stretch and bounce on vertical acceleration
      const scrollBounce = Math.min(0.28, Math.abs(effectiveScrollVel) * 0.14);
      const targetStretch = 1.0 + scrollBounce;
      const stretchForce = (targetStretch - this.ropeStretch) * 48;
      const stretchDamp = -this.ropeStretchVel * 7.8;
      this.ropeStretchVel += (stretchForce + stretchDamp) * dt;
      this.ropeStretch += this.ropeStretchVel * dt;
      this.ropeStretch = Math.max(0.85, Math.min(1.35, this.ropeStretch));
    }

    // 8. Update Angular signals only on meaningful delta to prevent continuous change detection churn
    const angleDiff = Math.abs(this.ropeAngle - this.lastRenderedRopeAngle);
    const secDiff = Math.abs(this.ropeSecondaryAngle - this.lastRenderedSecondaryAngle);
    const stretchDiff = Math.abs(this.ropeStretch - this.lastRenderedStretch);
    const unfurlDiff = Math.abs(this.ropeUnfurl - this.lastRenderedUnfurl);

    if (angleDiff > 0.05 || secDiff > 0.05 || stretchDiff > 0.005 || unfurlDiff > 0.01) {
      this.ropeAngleSignal.set(this.ropeAngle);
      this.ropeSecondaryAngleSignal.set(this.ropeSecondaryAngle);
      this.ropeStretchSignal.set(this.ropeStretch);
      this.ropeUnfurlProgress.set(this.ropeUnfurl);
      this.lastRenderedRopeAngle = this.ropeAngle;
      this.lastRenderedSecondaryAngle = this.ropeSecondaryAngle;
      this.lastRenderedStretch = this.ropeStretch;
      this.lastRenderedUnfurl = this.ropeUnfurl;
    }
  }
}
