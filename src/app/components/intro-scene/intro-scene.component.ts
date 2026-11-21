import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  HostListener,
  output,
  input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationPaperComponent } from '../invitation-paper/invitation-paper.component';
import { ConnectionService } from '../../services/connection.service';

type SceneStep = 'loading' | 'rolled' | 'unrolling' | 'text' | 'completed';

@Component({
  selector: 'app-intro-scene',
  standalone: true,
  imports: [CommonModule, InvitationPaperComponent],
  template: `
    <div
      class="scene-container"
      [class.scene-completed]="step() === 'completed'"
      [class.is-animating]="isAnimating()"
    >
      <!-- Background Vignette & Faint Static Grain Overlay -->
      <div class="bg-vignette" aria-hidden="true"></div>
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

      <!-- Camera Rig (moves scene up slightly during user scroll) -->
      <div
        class="camera-rig"
        [style.transform]="cameraTransform()"
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

              <!-- Royal Golden Rope hanging from bottom rod center -->
              <div
                class="golden-rope-container"
                [style.transform]="goldenRopeTransform()"
                [style.opacity]="ropeProgress()"
                aria-hidden="true"
              >
                <svg viewBox="0 0 100 70" width="100" height="70" class="golden-rope-svg">
                  <defs>
                    <linearGradient id="ropeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#fae09a"/>
                      <stop offset="35%" stop-color="#dfb25d"/>
                      <stop offset="70%" stop-color="#c6953f"/>
                      <stop offset="100%" stop-color="#8d621b"/>
                    </linearGradient>
                  </defs>
                  <!-- Twin looped braided cords around rod shaft -->
                  <path d="M30 0 C30 16 46 22 50 28" stroke="url(#ropeGrad)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                  <path d="M70 0 C70 16 54 22 50 28" stroke="url(#ropeGrad)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                  <!-- Antique golden knot ring -->
                  <circle cx="50" cy="30" r="4.5" fill="url(#ropeGrad)"/>
                  <circle cx="50" cy="30" r="2.2" fill="#1e0c0e"/>
                  <!-- Hanging stem cord -->
                  <path d="M50 34.5 L50 56" stroke="url(#ropeGrad)" stroke-width="3" stroke-linecap="round"/>
                  <!-- Golden tassel bell -->
                  <path d="M46 56 C46 54.5 54 54.5 54 56 L56 68 C56 69.5 44 69.5 44 68 Z" fill="url(#ropeGrad)"/>
                  <!-- Tassel silk fringe -->
                  <line x1="47" y1="68" x2="47" y2="72" stroke="url(#ropeGrad)" stroke-width="1.2" stroke-linecap="round"/>
                  <line x1="50" y1="68" x2="50" y2="73.5" stroke="url(#ropeGrad)" stroke-width="1.4" stroke-linecap="round"/>
                  <line x1="53" y1="68" x2="53" y2="72" stroke="url(#ropeGrad)" stroke-width="1.2" stroke-linecap="round"/>
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
      background: #12080a;
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
      perspective: 1200px;
      transform-style: preserve-3d;
      transition: transform 0.15s ease-out;

      @media (max-width: 768px) {
        animation: mobileIdleSway 7s ease-in-out infinite alternate;
      }
    }

    @keyframes mobileIdleSway {
      0% {
        transform: rotate(-0.5deg);
      }
      100% {
        transform: rotate(0.5deg);
      }
    }

    /* Scroll Assembly */
    .scroll-assembly {
      position: relative;
      width: var(--paper-w);
      height: var(--paper-h);
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 16px 32px rgba(0, 0, 0, 0.6));
    }

    /* Paper Reveal Window */
    .paper-reveal-window {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      transition: opacity 0.3s ease;
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
          filter: blur(1px);
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
          filter: blur(1px);
        }
      }
    }

    /* Royal Golden Rope Hanging from Bottom Roller */
    .golden-rope-container {
      position: absolute;
      top: calc(100% - 10px);
      left: 50%;
      transform-origin: top center;
      transform: translateX(-50%) scaleY(0);
      opacity: 0;
      pointer-events: none;
      z-index: 10;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6));
      transition: opacity 0.1s ease-out;

      .golden-rope-svg {
        display: block;
        margin: 0 auto;
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
  private readonly connectionService = inject(ConnectionService);
  readonly sceneCompleted = output<void>();

  // Scroll interactive inputs
  readonly scrollRoll = input<number>(0);
  readonly ropeProgress = input<number>(0);
  readonly isScrolled = input<boolean>(false);

  readonly step = signal<SceneStep>('loading');
  readonly unrollProgress = signal<number>(0);

  private mouseX = 0;
  private mouseY = 0;
  readonly tiltX = signal<number>(0);
  readonly tiltY = signal<number>(0);

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
    if (this.step() === 'completed' && this.scrollRoll() > 0) {
      return `translate(0, ${(this.scrollRoll() * -80).toFixed(2)}px)`;
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

  readonly goldenRopeTransform = computed(() => {
    return `translateX(-50%) scaleY(${this.ropeProgress()})`;
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
    if (this.connectionService.shouldReduceOrSkip()) {
      this.skip();
      return;
    }

    this.preloadInitialAssets();
  }

  ngOnDestroy(): void {
    if (this.unrollAnimId) {
      cancelAnimationFrame(this.unrollAnimId);
      this.unrollAnimId = null;
    }
    this.clearAllTimers();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.step() !== 'completed' || typeof window === 'undefined') return;
    if (window.innerWidth <= 768) return;

    this.mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    this.mouseY = (event.clientY / window.innerHeight - 0.5) * 2;

    this.tiltX.set(Math.max(-3, Math.min(3, -this.mouseY * 3)));
    this.tiltY.set(Math.max(-3, Math.min(3, this.mouseX * 3)));
  }

  private preloadInitialAssets(): void {
    if (typeof window === 'undefined') {
      this.skip();
      return;
    }

    let loadedCount = 0;
    const requiredImages = [
      'assets/images/scroll-rod-top.webp',
      'assets/images/scroll-rod-bottom.webp',
      'assets/images/scroll-paper.webp'
    ];

    const checkReady = () => {
      loadedCount++;
      if (loadedCount >= requiredImages.length) {
        this.startSequence();
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
          this.skip();
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
}
