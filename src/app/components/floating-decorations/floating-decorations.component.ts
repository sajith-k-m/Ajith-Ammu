import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  input,
  computed,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface FloatingElement {
  id: number;
  type: 'sparkle' | 'rose' | 'jasmine' | 'bokeh' | 'ring' | 'leaf' | 'diya' | 'coin';
  depth: number;       // 0.2 (far) to 1.5 (near)
  leftPercent: number; // 0 to 100
  topPercent: number;  // 0 to 100
  sizePx: number;
  rotationDeg: number;
  driftDurationSec: number;
  delaySec: number;
  colorGrad: string;
}

@Component({
  selector: 'app-floating-decorations',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="floating-3d-stage"
      [style.transform]="stageParallaxTransform()"
      aria-hidden="true"
    >
      <!-- Deep Atmospheric Ambient Glow Orbs -->
      <div class="ambient-orb orb-1" [style.transform]="orb1Transform()"></div>
      <div class="ambient-orb orb-2" [style.transform]="orb2Transform()"></div>
      <div class="ambient-orb orb-3" [style.transform]="orb3Transform()"></div>

      <!-- Layered 3D Floating Particles (Compositor-only hardware acceleration) -->
      @for (el of visibleElements(); track el.id) {
        <div
          class="floating-node depth-{{ Math.round(el.depth * 2) }}"
          [style.left.%]="el.leftPercent"
          [style.top.%]="el.topPercent"
          [style.width.px]="el.sizePx"
          [style.height.px]="el.sizePx"
          [style.animation-duration.s]="el.driftDurationSec"
          [style.animation-delay.s]="el.delaySec"
        >
          <!-- SVG element based on type -->
          @switch (el.type) {
            @case ('sparkle') {
              <svg viewBox="0 0 24 24" class="svg-sparkle" fill="none">
                <path
                  d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9L12 0Z"
                  fill="url(#goldSparkleGrad)"
                />
              </svg>
            }
            @case ('rose') {
              <svg viewBox="0 0 32 38" class="svg-petal rose-petal" fill="none">
                <path
                  d="M16 2 C26 8 30 20 24 32 C19 37 12 36 8 30 C1 20 6 7 16 2 Z"
                  fill="url(#rosePetalGrad)"
                />
              </svg>
            }
            @case ('jasmine') {
              <svg viewBox="0 0 30 36" class="svg-petal jasmine-floret" fill="none">
                <path
                  d="M15 2 C23 10 26 22 20 33 C15 37 13 36 9 31 C2 21 7 8 15 2 Z"
                  fill="url(#jasminePetalGrad)"
                />
              </svg>
            }
            @case ('leaf') {
              <svg viewBox="0 0 28 38" class="svg-leaf" fill="none">
                <path
                  d="M14 2 C24 10 26 26 14 36 C2 26 4 10 14 2 Z"
                  stroke="url(#goldSparkleGrad)"
                  stroke-width="1.2"
                  fill="rgba(223, 178, 93, 0.12)"
                />
                <line x1="14" y1="2" x2="14" y2="36" stroke="rgba(255, 243, 196, 0.4)" stroke-width="0.8" />
              </svg>
            }
            @case ('ring') {
              <svg viewBox="0 0 28 28" class="svg-ring" fill="none">
                <circle cx="14" cy="14" r="10" stroke="url(#goldSparkleGrad)" stroke-width="1.8" />
                <circle cx="14" cy="14" r="12" stroke="rgba(255, 243, 196, 0.3)" stroke-width="0.7" stroke-dasharray="2 3" />
              </svg>
            }
            @case ('diya') {
              <svg viewBox="0 0 36 36" class="svg-diya" fill="none">
                <!-- Glowing Kerala Bronze Lamp Flame -->
                <g class="diya-flame">
                  <ellipse cx="18" cy="9" rx="4" ry="7" fill="url(#flameGrad)" />
                  <ellipse cx="18" cy="9.5" rx="2" ry="4" fill="#ffffff" />
                  <circle cx="18" cy="9" r="8" fill="url(#flameGlowGrad)" opacity="0.65" />
                </g>
                <!-- Traditional Kerala Bronze Oil Lamp Bowl & Base -->
                <path d="M7 19 C7 25 12 28 18 28 C24 28 29 25 29 19 C29 17 26 17 18 17 C10 17 7 17 7 19 Z" fill="url(#diyaBronzeGrad)" />
                <ellipse cx="18" cy="18" rx="11" ry="3" fill="url(#diyaOilGrad)" />
                <path d="M16 28 L16 32 L13 34 L23 34 L20 32 L20 28 Z" fill="url(#diyaBronzeGrad)" />
              </svg>
            }
            @case ('coin') {
              <svg viewBox="0 0 32 32" class="svg-kerala-coin" fill="none">
                <circle cx="16" cy="16" r="14" fill="url(#goldSparkleGrad)" stroke="#8a5a18" stroke-width="0.8" />
                <circle cx="16" cy="16" r="11.5" fill="none" stroke="rgba(255, 255, 255, 0.6)" stroke-width="0.8" stroke-dasharray="2 1.5" />
                <path d="M16 8 C13 12 11 15 11 18 C11 21 13 23 16 23 C19 23 21 21 21 18 C21 15 19 12 16 8 Z" fill="#7a4a0f" opacity="0.75" />
                <circle cx="16" cy="16" r="2" fill="#fff9db" />
              </svg>
            }
            @default {
              <!-- Glowing Firefly / Bokeh particle -->
              <div class="bokeh-particle"></div>
            }
          }
        </div>
      }

      <!-- Shared SVG Gradient Definitions -->
      <svg width="0" height="0" class="svg-defs-only">
        <defs>
          <linearGradient id="goldSparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff8db" />
            <stop offset="40%" stop-color="#fae09a" />
            <stop offset="70%" stop-color="#dfb25d" />
            <stop offset="100%" stop-color="#8a5a18" />
          </linearGradient>
          <linearGradient id="rosePetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fb7185" />
            <stop offset="40%" stop-color="#e11d48" />
            <stop offset="80%" stop-color="#9f1239" />
            <stop offset="100%" stop-color="#4c0519" />
          </linearGradient>
          <linearGradient id="jasminePetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="60%" stop-color="#fffbeb" />
            <stop offset="100%" stop-color="#fde68a" />
          </linearGradient>
          <linearGradient id="flameGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="25%" stop-color="#ffea79" />
            <stop offset="60%" stop-color="#ff9100" />
            <stop offset="100%" stop-color="#e5383b" />
          </linearGradient>
          <radialGradient id="flameGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(255, 230, 110, 0.9)" />
            <stop offset="45%" stop-color="rgba(255, 140, 20, 0.45)" />
            <stop offset="100%" stop-color="rgba(255, 80, 0, 0)" />
          </radialGradient>
          <linearGradient id="diyaBronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a" />
            <stop offset="30%" stop-color="#d97706" />
            <stop offset="70%" stop-color="#92400e" />
            <stop offset="100%" stop-color="#451a03" />
          </linearGradient>
          <linearGradient id="diyaOilGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#78350f" />
            <stop offset="50%" stop-color="#d97706" />
            <stop offset="100%" stop-color="#78350f" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      overflow: hidden;
      z-index: 8;
      perspective: 1200px;
      contain: strict;
    }

    .floating-3d-stage {
      position: absolute;
      inset: -50px;
      width: calc(100% + 100px);
      height: calc(100% + 100px);
      transform-style: preserve-3d;
      will-change: transform;
      pointer-events: none;
    }

    /* Ambient Glowing Bokeh Orbs (Naturally soft gradients without GPU blur convolution overhead) */
    .ambient-orb {
      position: absolute;
      border-radius: 50%;
      opacity: 0.38;
      pointer-events: none;
    }

    .orb-1 {
      width: 500px;
      height: 500px;
      top: 15%;
      left: -8%;
      background: radial-gradient(circle at center, rgba(223, 178, 93, 0.3) 0%, rgba(138, 90, 24, 0.12) 40%, transparent 68%);
    }

    .orb-2 {
      width: 580px;
      height: 580px;
      top: 55%;
      right: -10%;
      background: radial-gradient(circle at center, rgba(163, 29, 58, 0.32) 0%, rgba(84, 15, 23, 0.14) 40%, transparent 68%);
    }

    .orb-3 {
      width: 440px;
      height: 440px;
      bottom: -10%;
      left: 30%;
      background: radial-gradient(circle at center, rgba(250, 224, 154, 0.2) 0%, rgba(37, 162, 107, 0.12) 38%, transparent 68%);
    }

    /* Floating Nodes (100% GPU compositor acceleration, zero CPU transform churn) */
    .floating-node {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      animation: floatDrift linear infinite alternate;

      &.depth-1 { opacity: 0.45; transform: scale(0.78); }
      &.depth-2 { opacity: 0.72; transform: scale(0.92); }
      &.depth-3 { opacity: 1; transform: scale(1.06); }
    }

    .svg-sparkle {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 6px rgba(255, 243, 196, 0.7));
      animation: sparkleTwinkle 3.2s ease-in-out infinite;
    }

    .svg-petal {
      width: 100%;
      height: 100%;
      animation: petalTumble 6s ease-in-out infinite alternate;
    }

    .rose-petal {
      opacity: 0.95;
    }

    .jasmine-floret {
      opacity: 0.95;
    }

    .svg-leaf {
      width: 100%;
      height: 100%;
    }

    .svg-ring {
      width: 100%;
      height: 100%;
      animation: ringSpin 14s linear infinite;
    }

    .bokeh-particle {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: radial-gradient(circle, #fff3c4 0%, #dfb25d 50%, transparent 75%);
      box-shadow: 0 0 12px rgba(255, 243, 196, 0.8);
      animation: fireflyPulse 2.8s ease-in-out infinite alternate;
    }

    .svg-defs-only {
      position: absolute;
      width: 0;
      height: 0;
    }

    .svg-diya {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35));
      animation: diyaFloat 4.5s ease-in-out infinite alternate;
    }

    .diya-flame {
      transform-origin: 18px 16px;
      animation: flameFlicker 1.8s ease-in-out infinite alternate;
    }

    @keyframes flameFlicker {
      0% { transform: scale(0.96) skewX(-2deg); }
      50% { transform: scale(1.04) skewX(2deg); }
      100% { transform: scale(0.98) skewX(-1deg); }
    }

    .svg-kerala-coin {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 2px 6px rgba(184, 107, 88, 0.25));
      animation: coinGlint 5s ease-in-out infinite alternate;
    }

    @keyframes floatDrift {
      0% {
        transform: translate3d(0, 0, 0) rotate(0deg);
      }
      100% {
        transform: translate3d(18px, -26px, 0) rotate(12deg);
      }
    }

    @keyframes sparkleTwinkle {
      0%, 100% { transform: scale(0.7) rotate(0deg); opacity: 0.4; }
      50% { transform: scale(1.15) rotate(45deg); opacity: 1; }
    }

    @keyframes petalTumble {
      0% { transform: rotateY(0deg) rotateZ(0deg); }
      100% { transform: rotateY(180deg) rotateZ(28deg); }
    }

    @keyframes ringSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes fireflyPulse {
      0% { opacity: 0.25; transform: scale(0.7); }
      100% { opacity: 0.95; transform: scale(1.3); }
    }

    @keyframes diyaFloat {
      0% { transform: translateY(0px) rotate(-2deg); }
      100% { transform: translateY(-8px) rotate(3deg); }
    }

    @keyframes coinGlint {
      0% { transform: rotateY(0deg) scale(0.95); }
      50% { transform: rotateY(35deg) scale(1.05); }
      100% { transform: rotateY(0deg) scale(0.95); }
    }
  `]
})
export class FloatingDecorationsComponent implements OnInit, OnDestroy {
  readonly scrollY = input<number>(0);
  readonly scrollVelocity = input<number>(0);

  protected readonly Math = Math;

  // Normalized mouse coordinates (-1 to 1)
  private mouseX = signal<number>(0);
  private mouseY = signal<number>(0);

  // Smooth lerp for buttery parallax
  private smoothMouseX = 0;
  private smoothMouseY = 0;
  private animFrameId: number | null = null;

  // 24 Hand-tuned 3D decorative elements distributed across depths
  readonly elements: FloatingElement[] = [
    { id: 1, type: 'sparkle', depth: 0.6, leftPercent: 12, topPercent: 18, sizePx: 22, rotationDeg: 15, driftDurationSec: 5.5, delaySec: 0.2, colorGrad: 'gold' },
    { id: 2, type: 'rose', depth: 1.2, leftPercent: 86, topPercent: 14, sizePx: 32, rotationDeg: -25, driftDurationSec: 7.2, delaySec: 0.8, colorGrad: 'rose' },
    { id: 3, type: 'jasmine', depth: 0.8, leftPercent: 24, topPercent: 32, sizePx: 26, rotationDeg: 40, driftDurationSec: 6.0, delaySec: 1.2, colorGrad: 'jasmine' },
    { id: 4, type: 'ring', depth: 0.4, leftPercent: 78, topPercent: 38, sizePx: 34, rotationDeg: 0, driftDurationSec: 9.0, delaySec: 0.4, colorGrad: 'gold' },
    { id: 5, type: 'bokeh', depth: 0.5, leftPercent: 8, topPercent: 48, sizePx: 16, rotationDeg: 0, driftDurationSec: 4.8, delaySec: 1.5, colorGrad: 'gold' },
    { id: 6, type: 'sparkle', depth: 1.0, leftPercent: 92, topPercent: 54, sizePx: 26, rotationDeg: -10, driftDurationSec: 5.0, delaySec: 0.6, colorGrad: 'gold' },
    { id: 7, type: 'rose', depth: 0.7, leftPercent: 18, topPercent: 68, sizePx: 28, rotationDeg: 55, driftDurationSec: 7.8, delaySec: 2.0, colorGrad: 'rose' },
    { id: 8, type: 'jasmine', depth: 1.3, leftPercent: 82, topPercent: 72, sizePx: 30, rotationDeg: -35, driftDurationSec: 6.4, delaySec: 1.1, colorGrad: 'jasmine' },
    { id: 9, type: 'leaf', depth: 0.9, leftPercent: 6, topPercent: 82, sizePx: 30, rotationDeg: 20, driftDurationSec: 8.5, delaySec: 0.3, colorGrad: 'gold' },
    { id: 10, type: 'sparkle', depth: 0.7, leftPercent: 48, topPercent: 88, sizePx: 20, rotationDeg: 30, driftDurationSec: 4.5, delaySec: 1.8, colorGrad: 'gold' },
    { id: 11, type: 'bokeh', depth: 0.3, leftPercent: 38, topPercent: 12, sizePx: 14, rotationDeg: 0, driftDurationSec: 5.2, delaySec: 0.9, colorGrad: 'gold' },
    { id: 12, type: 'rose', depth: 1.1, leftPercent: 68, topPercent: 24, sizePx: 34, rotationDeg: -45, driftDurationSec: 6.8, delaySec: 2.3, colorGrad: 'rose' },
    { id: 13, type: 'sparkle', depth: 0.5, leftPercent: 32, topPercent: 58, sizePx: 18, rotationDeg: 12, driftDurationSec: 5.6, delaySec: 0.5, colorGrad: 'gold' },
    { id: 14, type: 'jasmine', depth: 0.9, leftPercent: 62, topPercent: 62, sizePx: 24, rotationDeg: 18, driftDurationSec: 6.2, delaySec: 1.7, colorGrad: 'jasmine' },
    { id: 15, type: 'ring', depth: 0.6, leftPercent: 15, topPercent: 92, sizePx: 28, rotationDeg: 0, driftDurationSec: 8.0, delaySec: 1.0, colorGrad: 'gold' },
    { id: 16, type: 'bokeh', depth: 0.4, leftPercent: 75, topPercent: 84, sizePx: 18, rotationDeg: 0, driftDurationSec: 4.2, delaySec: 2.4, colorGrad: 'gold' },
    { id: 17, type: 'leaf', depth: 1.2, leftPercent: 88, topPercent: 94, sizePx: 32, rotationDeg: -15, driftDurationSec: 7.5, delaySec: 0.7, colorGrad: 'gold' },
    { id: 18, type: 'sparkle', depth: 0.8, leftPercent: 4, topPercent: 34, sizePx: 22, rotationDeg: 45, driftDurationSec: 4.9, delaySec: 1.4, colorGrad: 'gold' },
    { id: 19, type: 'diya', depth: 1.0, leftPercent: 10, topPercent: 42, sizePx: 38, rotationDeg: -5, driftDurationSec: 6.5, delaySec: 0.5, colorGrad: 'gold' },
    { id: 20, type: 'diya', depth: 0.8, leftPercent: 84, topPercent: 64, sizePx: 34, rotationDeg: 6, driftDurationSec: 7.0, delaySec: 1.6, colorGrad: 'gold' },
    { id: 21, type: 'coin', depth: 1.1, leftPercent: 20, topPercent: 22, sizePx: 30, rotationDeg: 12, driftDurationSec: 5.8, delaySec: 0.9, colorGrad: 'gold' },
    { id: 22, type: 'coin', depth: 0.6, leftPercent: 88, topPercent: 80, sizePx: 26, rotationDeg: -18, driftDurationSec: 8.2, delaySec: 2.1, colorGrad: 'gold' }
  ];

  readonly isMobile = signal<boolean>(false);

  readonly visibleElements = computed(() => {
    if (this.isMobile()) {
      return this.elements.filter(el =>
        el.id === 1 ||  // Sparkle
        el.id === 2 ||  // Rose petal
        el.id === 19 || // Kerala Diya left
        el.id === 20 || // Kerala Diya right
        el.id === 21 || // Kerala Gold Coin left
        el.id === 22    // Kerala Gold Coin right
      );
    }
    // Desktop: 12 curated elements
    return this.elements.filter(el =>
      el.id === 1 || el.id === 2 || el.id === 3 || el.id === 4 ||
      el.id === 6 || el.id === 7 || el.id === 8 || el.id === 10 ||
      el.id === 19 || el.id === 20 || el.id === 21 || el.id === 22
    );
  });

  private isParallaxRunning = false;
  readonly smoothMouseXSignal = signal<number>(0);
  readonly smoothMouseYSignal = signal<number>(0);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.checkMobile();
    }
  }

  ngOnDestroy(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkMobile();
  }

  private checkMobile(): void {
    if (typeof window !== 'undefined') {
      this.isMobile.set(window.innerWidth <= 768);
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (this.isMobile()) return;
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    this.mouseX.set(((e.clientX / w) - 0.5) * 2);
    this.mouseY.set(((e.clientY / h) - 0.5) * 2);

    if (!this.isParallaxRunning) {
      this.isParallaxRunning = true;
      this.animFrameId = requestAnimationFrame(() => this.stepParallax());
    }
  }

  private stepParallax(): void {
    const targetX = this.mouseX();
    const targetY = this.mouseY();
    const diffX = targetX - this.smoothMouseX;
    const diffY = targetY - this.smoothMouseY;

    if (Math.abs(diffX) < 0.005 && Math.abs(diffY) < 0.005) {
      this.smoothMouseX = targetX;
      this.smoothMouseY = targetY;
      this.smoothMouseXSignal.set(targetX);
      this.smoothMouseYSignal.set(targetY);
      this.isParallaxRunning = false;
      return;
    }

    this.smoothMouseX += diffX * 0.12;
    this.smoothMouseY += diffY * 0.12;
    this.smoothMouseXSignal.set(this.smoothMouseX);
    this.smoothMouseYSignal.set(this.smoothMouseY);

    this.animFrameId = requestAnimationFrame(() => this.stepParallax());
  }

  readonly stageParallaxTransform = computed(() => {
    if (this.isMobile()) return '';
    const sx = this.smoothMouseXSignal();
    const sy = this.smoothMouseYSignal();
    const rx = (-sy * 4).toFixed(2);
    const ry = (sx * 4).toFixed(2);
    return `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });

  readonly orb1Transform = computed(() => {
    const sx = this.smoothMouseXSignal();
    const sy = this.smoothMouseYSignal();
    const ox = (sx * -40).toFixed(1);
    const oy = (sy * -30).toFixed(1);
    return `translate3d(${ox}px, ${oy}px, 0)`;
  });

  readonly orb2Transform = computed(() => {
    const sx = this.smoothMouseXSignal();
    const sy = this.smoothMouseYSignal();
    const ox = (sx * 35).toFixed(1);
    const oy = (sy * 25).toFixed(1);
    return `translate3d(${ox}px, ${oy}px, 0)`;
  });

  readonly orb3Transform = computed(() => {
    const sx = this.smoothMouseXSignal();
    const sy = this.smoothMouseYSignal();
    const ox = (sx * -20).toFixed(1);
    const oy = (sy * -15).toFixed(1);
    return `translate3d(${ox}px, ${oy}px, 0)`;
  });
}
