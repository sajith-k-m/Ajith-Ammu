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

type SceneStep = 'loading' | 'rolled' | 'crossfade' | 'unrolling' | 'text' | 'camera' | 'completed';

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
              [class.stacked]="step() === 'crossfade'"
              [class.hidden]="step() === 'loading' || step() === 'rolled'"
            >
              <img
                src="assets/images/rod.webp"
                alt=""
                width="952"
                height="83"
                class="rod-img"
                aria-hidden="true"
              />
            </div>

            <!-- Paper with clip-path from center outward -->
            <div
              class="paper-reveal-window"
              [class.unrolled]="isUnrolled()"
              [class.unrolling]="step() === 'unrolling'"
              [class.hidden]="step() === 'loading' || step() === 'rolled'"
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
              [class.stacked]="step() === 'crossfade'"
              [class.hidden]="step() === 'loading' || step() === 'rolled'"
            >
              <img
                src="assets/images/rod.webp"
                alt=""
                width="952"
                height="83"
                class="rod-img"
                aria-hidden="true"
              />
            </div>

            <!-- Rolled Scroll (Step 1 & fades out during Step 2) -->
            <div
              class="rolled-scroll"
              [class.visible]="step() === 'rolled'"
              [class.fading]="step() === 'crossfade'"
              [class.hidden]="step() !== 'rolled' && step() !== 'crossfade'"
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
      --paper-w: min(82vw, calc(82vh * 527 / 903), 480px);
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
      transition: opacity 0.45s ease-out;

      &.visible {
        opacity: 1;
        animation: rolledIn 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards, bobFloat 2.6s ease-in-out infinite alternate;
      }

      &.fading {
        opacity: 0;
        animation: none;
      }

      &.hidden {
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

    /* Paper Reveal Window (Step 3 unroll via clip-path) */
    .paper-reveal-window {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 15;
      /* Starts folded at the center horizontal line */
      clip-path: inset(50% 0 50% 0);

      &.hidden {
        display: none;
      }

      &.unrolling {
        transition: clip-path 3s cubic-bezier(0.65, 0, 0.35, 1);
        clip-path: inset(0% 0 0% 0);
      }

      &.unrolled {
        clip-path: inset(0% 0 0% 0);
      }
    }

    .is-animating .paper-reveal-window {
      will-change: clip-path;
    }

    /* Rods (Top and Bottom) */
    .rod {
      position: absolute;
      left: 50%;
      width: var(--rod-w);
      height: var(--rod-h);
      z-index: 20;

      &.hidden {
        display: none;
      }

      .rod-img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: fill;
      }

      &.rod-top {
        top: 0;
        /* Start folded at the center line (Step 2) */
        transform: translate(-50%, calc(-100% + 2px + (var(--paper-h) / 2)));

        &.stacked {
          opacity: 1;
          transition: opacity 0.45s ease-in;
        }

        &.unrolling {
          transition: transform 3s cubic-bezier(0.65, 0, 0.35, 1);
          transform: translate(-50%, calc(-100% + 2px));
        }

        &.unrolled {
          transform: translate(-50%, calc(-100% + 2px));
        }
      }

      &.rod-bottom {
        bottom: 0;
        /* Start folded at the center line (Step 2) */
        transform: translate(-50%, calc(100% - 2px - (var(--paper-h) / 2)));

        &.stacked {
          opacity: 1;
          transition: opacity 0.45s ease-in;
        }

        &.unrolling {
          transition: transform 3s cubic-bezier(0.65, 0, 0.35, 1);
          transform: translate(-50%, calc(100% - 2px));
        }

        &.unrolled {
          transform: translate(-50%, calc(100% - 2px));
        }
      }
    }

    .is-animating .rod {
      will-change: transform;
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
    return s === 'rolled' || s === 'crossfade' || s === 'unrolling' || s === 'text';
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
      // Fast path for slow connection or reduced motion
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
    if (window.innerWidth <= 768) return; // Desktop only

    this.mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    this.mouseY = (event.clientY / window.innerHeight - 0.5) * 2;

    // Tilt by at most 3 degrees following mouse
    this.tiltX.set(Math.max(-3, Math.min(3, -this.mouseY * 3)));
    this.tiltY.set(Math.max(-3, Math.min(3, this.mouseX * 3)));
  }

  private preloadInitialAsset(): void {
    if (typeof window === 'undefined') {
      this.skip();
      return;
    }

    // Preload rolled.webp first
    const rolledImg = new Image();
    rolledImg.src = 'assets/images/rolled.webp';

    const onRolledReady = () => {
      // Start parallel loading of rod and paper while rolled scroll shows
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
        // Fallback on error: skip directly to ready state
        this.skip();
      };
    }
  }

  private startSequence(): void {
    // 1. (0 to 1.5s) Rolled scroll centred, fading in with scale & bob
    this.step.set('rolled');

    // 2. (about 1.5s) Cross-fade rolled into two stacked copies of rod.webp
    this.schedule(() => {
      this.step.set('crossfade');
    }, 1500);

    // 3. (about 2s to 5s) Unroll: top rod moves up, bottom rod down, clip-path expands
    this.schedule(() => {
      this.step.set('unrolling');
    }, 1950);

    // 4. (about 5s to 7s) Text appears line by line
    this.schedule(() => {
      this.step.set('text');
    }, 5000);

    // 5. (about 7s to 8s) Camera move: drifts up & right, zooms in to final position
    this.schedule(() => {
      this.step.set('camera');
    }, 7000);

    // 6. (~8s) Completed: unlock vertical page scroll, start petals, clean will-change
    this.schedule(() => {
      this.finishIntro();
    }, 8100);
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
