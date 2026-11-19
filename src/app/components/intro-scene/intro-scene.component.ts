import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  inject,
  signal,
  computed,
  HostListener,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationPaperComponent } from '../invitation-paper/invitation-paper.component';
import { ConnectionService } from '../../services/connection.service';

type SceneStep = 'loading' | 'rolled' | 'unrolling' | 'text' | 'camera' | 'completed';

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

      <!-- Tiny Centered Loader (Step 0) -->
      @if (step() === 'loading') {
        <div class="loader-overlay" aria-live="polite" aria-label="Loading invitation">
          <div class="spinner"></div>
        </div>
      }

      <!-- Camera Rig (moves the whole scene during Step 5) -->
      <div
        class="camera-rig"
        [class.camera-shifted]="isCameraShifted()"
        [class.camera-moving]="step() === 'camera'"
      >
        <!-- Desktop Tilt / Mobile Sway Container -->
        <div
          class="tilt-stage"
          [style.transform]="tiltTransform()"
        >
          <!-- Scroll Assembly (Paper + Rods + Rolled) -->
          <div class="scroll-assembly">

            <!-- Top Rod -->
            <div
              class="rod rod-top"
              [class.unrolled]="isUnrolled()"
              [class.unrolling]="step() === 'unrolling'"
            >
              <div class="rod-roller roller-top">
                <img
                  src="assets/images/rod.webp"
                  alt=""
                  width="952"
                  height="83"
                  class="rod-img"
                  aria-hidden="true"
                />
                <!-- Cylindrical surface highlight sweep for rolling realism -->
                <div
                  class="rod-surface-roll roll-up"
                  [style.-webkit-mask-image]="rodMaskUrl"
                  [style.mask-image]="rodMaskUrl"
                  aria-hidden="true"
                ></div>
              </div>
              <!-- Dynamic Parchment Curl Shadow traveling right under top rod -->
              <div class="rod-curl-shadow curl-below" aria-hidden="true"></div>
            </div>

            <!-- Paper with clip-path from center outward -->
            <div
              class="paper-reveal-window"
              [class.unrolled]="isUnrolled()"
              [class.unrolling]="step() === 'unrolling'"
            >
              <app-invitation-paper
                [animateText]="step() === 'text'"
                [textVisible]="isTextVisible()"
                [curling]="step() === 'unrolling'"
              />
            </div>

            <!-- Bottom Rod (reusing the same rod.webp image) -->
            <div
              class="rod rod-bottom"
              [class.unrolled]="isUnrolled()"
              [class.unrolling]="step() === 'unrolling'"
            >
              <!-- Dynamic Parchment Curl Shadow traveling right above bottom rod -->
              <div class="rod-curl-shadow curl-above" aria-hidden="true"></div>
              <div class="rod-roller roller-bottom">
                <img
                  src="assets/images/rod.webp"
                  alt=""
                  width="952"
                  height="83"
                  class="rod-img"
                  aria-hidden="true"
                />
                <!-- Cylindrical surface highlight sweep for rolling realism -->
                <div
                  class="rod-surface-roll roll-down"
                  [style.-webkit-mask-image]="rodMaskUrl"
                  [style.mask-image]="rodMaskUrl"
                  aria-hidden="true"
                ></div>
              </div>
            </div>

            <!-- Rolled Scroll (Visible during initial bob, fades out seamlessly as unrolling begins) -->
            <div
              class="rolled-scroll"
              [class.visible]="step() === 'rolled'"
              [class.unrolling]="step() === 'unrolling'"
              [class.faded-out]="isUnrolled()"
            >
              <img
                src="assets/images/rolled.webp"
                alt="Ammu & Ajith Wedding Scroll"
                width="990"
                height="120"
                class="rolled-img"
                fetchpriority="high"
              />
            </div>

          </div>
        </div>
      </div>

      <!-- Scroll Down Indicator when completed -->
      @if (step() === 'completed') {
        <div class="scroll-cue" aria-hidden="true">
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

      /* Sizing calculations based on 55% rod shaft width and trimmed dimensions */
      --paper-w: min(85vw, calc(84vh * 527 / 903), 520px);
      --paper-h: calc(var(--paper-w) * 903 / 527);
      --rod-w: calc(var(--paper-w) / 0.55);
      --rod-h: calc(var(--rod-w) * 83 / 952);
      --rolled-h: calc(var(--rod-w) * 120 / 990);
    }

    /* Background Aesthetics */
    .bg-vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 48%, rgba(42, 18, 12, 0.92) 0%, #12080a 75%, #080304 100%);
      pointer-events: none;
      z-index: 1;
    }

    .golden-glow {
      position: absolute;
      width: min(85vw, 650px);
      height: min(85vh, 700px);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, rgba(212, 165, 90, 0.22) 0%, rgba(212, 165, 90, 0.08) 50%, transparent 75%);
      pointer-events: none;
      z-index: 2;
    }

    /* Tiny static SVG feTurbulence grain data-URI (opacity 0.05, not animated) */
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
      transition: opacity 0.3s ease, transform 0.2s ease;
      display: flex;
      align-items: center;
      gap: 4px;

      &:hover {
        background: rgba(42, 18, 12, 0.85);
        border-color: rgba(212, 165, 90, 0.8);
        transform: translateY(-1px);
      }
    }

    /* Tiny Centered Loader */
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

    /* Camera Rig (Handles Step 5 camera move) */
    .camera-rig {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(0, 0) scale(1);
      transition: transform 1s ease-out;

      &.camera-shifted {
        transform: translate(-3%, 4%) scale(0.94);
        transition: none;
      }

      &.camera-moving {
        transform: translate(0, 0) scale(1);
        transition: transform 1s ease-out;
      }
    }

    .is-animating .camera-rig {
      will-change: transform;
    }

    /* Tilt Stage (Handles mouse tilt on desktop, idle sway on mobile) */
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

    /* Rolled Scroll (Step 1: 0 to 1.5s, top-down view, floating bob) */
    .rolled-scroll {
      position: absolute;
      top: 50%;
      left: 50%;
      width: var(--rod-w);
      height: var(--rolled-h);
      transform: translate(-50%, -50%);
      z-index: 25;
      opacity: 0;
      pointer-events: none;

      &.visible {
        opacity: 1;
        animation: rolledIn 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards, bobFloat 2.6s ease-in-out infinite alternate;
      }

      &.unrolling {
        animation: fadeOutRolled 0.4s ease-out forwards;
      }

      &.faded-out {
        display: none;
      }

      .rolled-img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: fill;
      }
    }

    @keyframes rolledIn {
      0% {
        transform: translate(-50%, -50%) scale(0.96);
        opacity: 0;
      }
      100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
    }

    @keyframes bobFloat {
      0% {
        transform: translate(-50%, calc(-50% - 3px));
      }
      100% {
        transform: translate(-50%, calc(-50% + 3px));
      }
    }

    @keyframes fadeOutRolled {
      0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(1.02);
      }
    }

    /* Paper Reveal Window (Unroll via clip-path) */
    .paper-reveal-window {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 15;
      /* Initial state: completely hidden and collapsed at center */
      opacity: 0;
      clip-path: inset(50% 0 50% 0);

      &.unrolling {
        animation: unrollPaper 2.8s cubic-bezier(0.45, 0, 0.25, 1) forwards;
      }

      &.unrolled {
        opacity: 1;
        clip-path: inset(0% 0 0% 0);
      }
    }

    .is-animating .paper-reveal-window {
      will-change: clip-path;
    }

    @keyframes unrollPaper {
      0% {
        opacity: 1;
        clip-path: inset(50% 0 50% 0);
      }
      100% {
        opacity: 1;
        clip-path: inset(0% 0 0% 0);
      }
    }

    /* Rods (Top and Bottom) - Mathematically aligned to wooden shaft with 4px overlap */
    .rod {
      position: absolute;
      left: 50%;
      width: var(--rod-w);
      height: var(--rod-h);
      z-index: 20;
      /* Hidden before unrolling starts - zero artifacts, no 3-roll glitch */
      opacity: 0;
      pointer-events: none;

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

      /* Cylindrical specular highlight & woodgrain sweep for true rotary realism */
      .rod-surface-roll {
        position: absolute;
        inset: 0;
        pointer-events: none;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        background: repeating-linear-gradient(
          to bottom,
          rgba(255, 248, 220, 0) 0px,
          rgba(255, 240, 200, 0.22) 5px,
          rgba(255, 255, 255, 0.65) 10px,
          rgba(255, 240, 200, 0.25) 15px,
          rgba(255, 248, 220, 0) 20px,
          rgba(20, 10, 4, 0.2) 25px,
          rgba(10, 4, 2, 0.55) 32px,
          rgba(20, 10, 4, 0.2) 38px,
          rgba(255, 248, 220, 0) 44px
        );
        background-size: 100% 44px;
        background-repeat: repeat-y;
        mix-blend-mode: overlay;
        opacity: 0;
        transition: opacity 0.4s ease;
      }

      &.unrolling .rod-surface-roll {
        opacity: 0.95;

        &.roll-up {
          animation: rollSurfaceUp 2.8s cubic-bezier(0.45, 0, 0.25, 1) forwards;
        }

        &.roll-down {
          animation: rollSurfaceDown 2.8s cubic-bezier(0.45, 0, 0.25, 1) forwards;
        }
      }

      /* Top Rod */
      &.rod-top {
        top: 0;
        transform: translate(-50%, calc(-100% + (var(--rod-h) * 0.193) + 4px + (var(--paper-h) / 2)));

        &.unrolling {
          animation: unrollTopRod 2.8s cubic-bezier(0.45, 0, 0.25, 1) forwards;
        }

        &.unrolled {
          opacity: 1;
          transform: translate(-50%, calc(-100% + (var(--rod-h) * 0.193) + 4px));
        }
      }

      /* Bottom Rod */
      &.rod-bottom {
        bottom: 0;
        transform: translate(-50%, calc(100% - (var(--rod-h) * 0.181) - 4px - (var(--paper-h) / 2)));

        &.unrolling {
          animation: unrollBottomRod 2.8s cubic-bezier(0.45, 0, 0.25, 1) forwards;
        }

        &.unrolled {
          opacity: 1;
          transform: translate(-50%, calc(100% - (var(--rod-h) * 0.181) - 4px));
        }
      }

      /* 3D Parchment Curl Shadows moving synchronously with the rods */
      .rod-curl-shadow {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: var(--paper-w);
        pointer-events: none;
        z-index: 1;
        opacity: 0.22;
        transition: opacity 0.5s ease-out;

        &.curl-below {
          top: calc(var(--rod-h) * 0.807 - 2px);
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
          bottom: calc(var(--rod-h) * 0.819 - 2px);
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

      &.unrolling .rod-curl-shadow {
        opacity: 1;
      }
    }

    .is-animating .rod {
      will-change: transform;
    }

    @keyframes unrollTopRod {
      0% {
        opacity: 1;
        transform: translate(-50%, calc(-100% + (var(--rod-h) * 0.193) + 4px + (var(--paper-h) / 2)));
      }
      100% {
        opacity: 1;
        transform: translate(-50%, calc(-100% + (var(--rod-h) * 0.193) + 4px));
      }
    }

    @keyframes unrollBottomRod {
      0% {
        opacity: 1;
        transform: translate(-50%, calc(100% - (var(--rod-h) * 0.181) - 4px - (var(--paper-h) / 2)));
      }
      100% {
        opacity: 1;
        transform: translate(-50%, calc(100% - (var(--rod-h) * 0.181) - 4px));
      }
    }

    @keyframes rollSurfaceUp {
      0% {
        background-position: 0 0px;
      }
      100% {
        background-position: 0 -264px;
      }
    }

    @keyframes rollSurfaceDown {
      0% {
        background-position: 0 0px;
      }
      100% {
        background-position: 0 264px;
      }
    }

    /* Scroll Cue */
    .scroll-cue {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: rgba(212, 165, 90, 0.7);
      font-family: var(--font-caveat);
      font-size: 19px;
      letter-spacing: 0.04em;
      animation: cueBounce 2.2s ease-in-out infinite;
      z-index: 30;
      pointer-events: none;

      .cue-arrow {
        width: 20px;
        height: 20px;
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

  readonly rodMaskUrl = 'url("assets/images/rod.webp")';
  readonly step = signal<SceneStep>('loading');
  private mouseX = 0;
  private mouseY = 0;
  readonly tiltX = signal<number>(0);
  readonly tiltY = signal<number>(0);

  private timers: number[] = [];

  readonly isAnimating = computed(() => {
    const s = this.step();
    return s !== 'loading' && s !== 'completed';
  });

  readonly isUnrolled = computed(() => {
    const s = this.step();
    return s === 'text' || s === 'camera' || s === 'completed';
  });

  readonly isTextVisible = computed(() => {
    const s = this.step();
    return s === 'text' || s === 'camera' || s === 'completed';
  });

  readonly isCameraShifted = computed(() => {
    const s = this.step();
    return s === 'rolled' || s === 'unrolling';
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

    this.preloadInitialAsset();
  }

  ngOnDestroy(): void {
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

  private preloadInitialAsset(): void {
    if (typeof window === 'undefined') {
      this.skip();
      return;
    }

    const rolledImg = new Image();
    rolledImg.src = 'assets/images/rolled.webp';

    const onRolledReady = () => {
      const rodImg = new Image();
      rodImg.src = 'assets/images/rod.webp';

      const paperImg = new Image();
      paperImg.src = 'assets/images/paper.webp';

      this.startSequence();
    };

    if (rolledImg.complete) {
      onRolledReady();
    } else {
      rolledImg.onload = onRolledReady;
      rolledImg.onerror = () => {
        this.skip();
      };
    }
  }

  private startSequence(): void {
    // 1. (0 to 1.5s) Rolled scroll centred, fading in with gentle scale & bob
    this.step.set('rolled');

    // 2. (at 1.5s) Unroll begins directly from the rolled scroll:
    // the rods move apart and the parchment unrolls between them with realistic physics
    this.schedule(() => {
      this.step.set('unrolling');
    }, 1500);

    // 3. (at 4.3s) Unroll completes (2.8s duration), rods settle, text reveals line by line
    this.schedule(() => {
      this.step.set('text');
    }, 4300);

    // 4. (at 6.8s) Camera move: drifts up & right, zooms in
    this.schedule(() => {
      this.step.set('camera');
    }, 6800);

    // 5. (~8.0s) Completed: unlock vertical page scroll
    this.schedule(() => {
      this.finishIntro();
    }, 8000);
  }

  skip(): void {
    this.clearAllTimers();
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
