import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  input,
  computed,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface FloatingElement {
  id: number;
  type: 'sparkle' | 'rose' | 'jasmine' | 'bokeh' | 'ring' | 'leaf';
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
  template: `
    <div
      class="floating-3d-stage"
      [class.peach-mode]="isPeachMode()"
      [style.transform]="stageParallaxTransform()"
      aria-hidden="true"
    >
      <!-- ReactBits Aurora Atmospheric Shimmer Wave -->
      <div class="reactbits-aurora-layer" aria-hidden="true"></div>

      <!-- Deep Atmospheric Ambient Glow Orbs -->
      <div class="ambient-orb orb-1" [style.transform]="orb1Transform()"></div>
      <div class="ambient-orb orb-2" [style.transform]="orb2Transform()"></div>
      <div class="ambient-orb orb-3" [style.transform]="orb3Transform()"></div>

      <!-- Layered 3D Floating Particles -->
      @for (el of elements; track el.id) {
        <div
          class="floating-node depth-{{ Math.round(el.depth * 2) }}"
          [style.left.%]="el.leftPercent"
          [style.top.%]="el.topPercent"
          [style.width.px]="el.sizePx"
          [style.height.px]="el.sizePx"
          [style.animation-duration.s]="el.driftDurationSec"
          [style.animation-delay.s]="el.delaySec"
          [style.transform]="getNodeTransform(el)"
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
    }

    .floating-3d-stage {
      position: absolute;
      inset: -50px;
      width: calc(100% + 100px);
      height: calc(100% + 100px);
      transform-style: preserve-3d;
      will-change: transform;
      pointer-events: none;

      &.peach-mode {
        .reactbits-aurora-layer {
          mix-blend-mode: multiply;
          opacity: 0.35;
          background: radial-gradient(ellipse at 25% 35%, rgba(223, 178, 93, 0.28) 0%, transparent 50%),
                      radial-gradient(ellipse at 75% 25%, rgba(220, 140, 120, 0.32) 0%, transparent 45%),
                      radial-gradient(ellipse at 35% 75%, rgba(240, 180, 150, 0.25) 0%, transparent 45%),
                      radial-gradient(ellipse at 70% 65%, rgba(250, 210, 160, 0.3) 0%, transparent 50%);
        }

        .ambient-orb {
          mix-blend-mode: multiply;
          opacity: 0.22;
        }

        .orb-1 {
          background: radial-gradient(circle, rgba(235, 165, 140, 0.45) 0%, rgba(212, 140, 110, 0.2) 50%, transparent 75%);
        }

        .orb-2 {
          background: radial-gradient(circle, rgba(220, 130, 110, 0.45) 0%, rgba(195, 100, 85, 0.2) 50%, transparent 75%);
        }

        .orb-3 {
          background: radial-gradient(circle, rgba(245, 195, 140, 0.4) 0%, rgba(225, 165, 110, 0.18) 45%, transparent 70%);
        }

        .svg-sparkle {
          filter: drop-shadow(0 0 6px rgba(184, 107, 88, 0.45));
        }

        .svg-petal {
          filter: drop-shadow(0 4px 10px rgba(140, 50, 40, 0.25));
        }

        .rose-petal {
          filter: drop-shadow(0 5px 12px rgba(180, 40, 60, 0.3));
        }

        .jasmine-floret {
          filter: drop-shadow(0 4px 8px rgba(184, 107, 88, 0.3));
        }

        .bokeh-particle {
          background: radial-gradient(circle, #ffffff 0%, #dfb25d 55%, transparent 75%);
          box-shadow: 0 0 10px rgba(223, 178, 93, 0.7), 0 0 20px rgba(184, 107, 88, 0.35);
        }
      }
    }

    /* ReactBits Aurora Atmospheric Shimmer Wave */
    .reactbits-aurora-layer {
      position: absolute;
      inset: -20%;
      width: 140%;
      height: 140%;
      background: radial-gradient(ellipse at 25% 35%, rgba(223, 178, 93, 0.16) 0%, transparent 50%),
                  radial-gradient(ellipse at 75% 25%, rgba(163, 29, 58, 0.18) 0%, transparent 45%),
                  radial-gradient(ellipse at 35% 75%, rgba(37, 162, 107, 0.12) 0%, transparent 45%),
                  radial-gradient(ellipse at 70% 65%, rgba(250, 224, 154, 0.14) 0%, transparent 50%);
      filter: blur(60px);
      mix-blend-mode: screen;
      opacity: 0.75;
      animation: auroraMorph 18s ease-in-out infinite alternate;
      pointer-events: none;
    }

    @keyframes auroraMorph {
      0% {
        transform: rotate(0deg) scale(1) translate(0, 0);
      }
      50% {
        transform: rotate(4deg) scale(1.08) translate(-2%, 3%);
      }
      100% {
        transform: rotate(-3deg) scale(0.96) translate(3%, -2%);
      }
    }

    /* Ambient Glowing Bokeh Orbs */
    .ambient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.38;
      mix-blend-mode: screen;
      pointer-events: none;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .orb-1 {
      width: 550px;
      height: 550px;
      top: 15%;
      left: -8%;
      background: radial-gradient(circle, rgba(223, 178, 93, 0.32) 0%, rgba(138, 90, 24, 0.15) 50%, transparent 75%);
    }

    .orb-2 {
      width: 650px;
      height: 650px;
      top: 55%;
      right: -10%;
      background: radial-gradient(circle, rgba(163, 29, 58, 0.35) 0%, rgba(84, 15, 23, 0.18) 50%, transparent 75%);
    }

    .orb-3 {
      width: 480px;
      height: 480px;
      bottom: -10%;
      left: 30%;
      background: radial-gradient(circle, rgba(250, 224, 154, 0.22) 0%, rgba(37, 162, 107, 0.15) 45%, transparent 70%);
    }

    /* Floating Nodes */
    .floating-node {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      animation: floatDrift linear infinite alternate;
      will-change: transform;

      &.depth-1 { filter: blur(2.5px); opacity: 0.45; }
      &.depth-2 { filter: blur(1.2px); opacity: 0.7; }
      &.depth-3 { filter: none; opacity: 0.95; }
    }

    .svg-sparkle {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 8px rgba(255, 243, 196, 0.8));
      animation: sparkleTwinkle 3.2s ease-in-out infinite;
    }

    .svg-petal {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5));
      animation: petalTumble 6s ease-in-out infinite alternate;
    }

    .rose-petal {
      filter: drop-shadow(0 6px 12px rgba(100, 10, 20, 0.6));
    }

    .jasmine-floret {
      filter: drop-shadow(0 4px 10px rgba(223, 178, 93, 0.45));
    }

    .svg-leaf {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 6px rgba(223, 178, 93, 0.3));
    }

    .svg-ring {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 10px rgba(223, 178, 93, 0.5));
      animation: ringSpin 14s linear infinite;
    }

    .bokeh-particle {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: radial-gradient(circle, #fff3c4 0%, #dfb25d 50%, transparent 75%);
      box-shadow: 0 0 14px rgba(255, 243, 196, 0.9), 0 0 24px rgba(223, 178, 93, 0.6);
      animation: fireflyPulse 2.8s ease-in-out infinite alternate;
    }

    .svg-defs-only {
      position: absolute;
      width: 0;
      height: 0;
    }

    @keyframes floatDrift {
      0% {
        transform: translate3d(0, 0, 0) rotate(0deg);
      }
      100% {
        transform: translate3d(24px, -36px, 15px) rotate(16deg);
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
  `]
})
export class FloatingDecorationsComponent implements OnInit, OnDestroy {
  readonly scrollY = input<number>(0);
  readonly scrollVelocity = input<number>(0);
  readonly isPeachMode = input<boolean>(false);

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
    { id: 18, type: 'sparkle', depth: 0.8, leftPercent: 4, topPercent: 34, sizePx: 22, rotationDeg: 45, driftDurationSec: 4.9, delaySec: 1.4, colorGrad: 'gold' }
  ];

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.startParallaxLoop();
    }
  }

  ngOnDestroy(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    this.mouseX.set(((e.clientX / w) - 0.5) * 2);
    this.mouseY.set(((e.clientY / h) - 0.5) * 2);
  }

  private startParallaxLoop(): void {
    const loop = () => {
      // Lerp mouse
      this.smoothMouseX += (this.mouseX() - this.smoothMouseX) * 0.08;
      this.smoothMouseY += (this.mouseY() - this.smoothMouseY) * 0.08;
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  readonly stageParallaxTransform = computed(() => {
    // Stage rotates subtly with mouse to create stereoscopic depth
    const rx = (-this.smoothMouseY * 4).toFixed(2);
    const ry = (this.smoothMouseX * 4).toFixed(2);
    return `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });

  readonly orb1Transform = computed(() => {
    const ox = (this.smoothMouseX * -40).toFixed(1);
    const oy = (this.smoothMouseY * -30).toFixed(1);
    const sy = ((this.scrollY() * 0.12) % 300).toFixed(1);
    return `translate3d(${ox}px, calc(${oy}px - ${sy}px), 0)`;
  });

  readonly orb2Transform = computed(() => {
    const ox = (this.smoothMouseX * 35).toFixed(1);
    const oy = (this.smoothMouseY * 25).toFixed(1);
    const sy = ((this.scrollY() * 0.18) % 350).toFixed(1);
    return `translate3d(${ox}px, calc(${oy}px - ${sy}px), 0)`;
  });

  readonly orb3Transform = computed(() => {
    const ox = (this.smoothMouseX * -20).toFixed(1);
    const oy = (this.smoothMouseY * -15).toFixed(1);
    return `translate3d(${ox}px, ${oy}px, 0)`;
  });

  getNodeTransform(el: FloatingElement): string {
    const d = el.depth;
    // Mouse parallax based on depth
    const mx = (this.smoothMouseX * d * 32).toFixed(1);
    const my = (this.smoothMouseY * d * 32).toFixed(1);

    // Scroll parallax & speed intensity breeze
    const vel = this.scrollVelocity();
    const velOffset = (vel * d * 0.6).toFixed(1);
    const velTilt = (vel * 0.25).toFixed(1);

    // Continuous scroll travel
    const scrollTravel = ((this.scrollY() * d * 0.2) % 180).toFixed(1);

    return `translate3d(${mx}px, calc(${my}px - ${scrollTravel}px + ${velOffset}px), ${Math.round(d * 40)}px) rotateX(${velTilt}deg) rotateZ(${el.rotationDeg}deg)`;
  }
}
