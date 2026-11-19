import { Component, input } from '@angular/core';

interface Petal {
  id: number;
  leftPercent: number;
  size: number;
  colorType: 'marigold' | 'jasmine' | 'rose';
  durationSec: number;
  delaySec: number;
  isDesktopOnly: boolean;
  swayType: 1 | 2 | 3;
}

@Component({
  selector: 'app-petals-layer',
  standalone: true,
  template: `
    <div class="petals-container" [class.active]="active()" aria-hidden="true">
      @for (p of filteredPetals(); track p.id) {
        <div
          class="petal-wrapper"
          [class.desktop-only]="p.isDesktopOnly"
          [style.--left]="p.leftPercent + '%'"
          [style.--duration]="p.durationSec + 's'"
          [style.--delay]="p.delaySec + 's'"
          [style.--size]="p.size + 'px'"
        >
          <div class="petal-flipper sway-type-{{ p.swayType }}">
            <svg
              class="petal-svg {{ p.colorType }}"
              viewBox="0 0 30 38"
              xmlns="http://www.w3.org/2000/svg"
            >
              @switch (p.colorType) {
                @case ('marigold') {
                  <path
                    d="M15 2 C24 10 28 22 21 34 C16 38 12 37 8 32 C1 22 6 8 15 2 Z"
                    fill="url(#marigoldGrad)"
                  />
                }
                @case ('rose') {
                  <path
                    d="M15 2 C25 8 29 20 23 32 C18 37 11 36 7 30 C0 20 5 7 15 2 Z"
                    fill="url(#roseGrad)"
                  />
                }
                @default {
                  <path
                    d="M15 2 C23 10 26 22 20 33 C15 37 13 36 9 31 C2 21 7 8 15 2 Z"
                    fill="url(#jasmineGrad)"
                  />
                }
              }
              <defs>
                <linearGradient id="marigoldGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#f59e0b" />
                  <stop offset="60%" stop-color="#d97706" />
                  <stop offset="100%" stop-color="#b45309" />
                </linearGradient>
                <linearGradient id="roseGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#fb7185" />
                  <stop offset="60%" stop-color="#f43f5e" />
                  <stop offset="100%" stop-color="#be123c" />
                </linearGradient>
                <linearGradient id="jasmineGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#ffffff" />
                  <stop offset="70%" stop-color="#fef3c7" />
                  <stop offset="100%" stop-color="#fde68a" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .petals-container {
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 1.5s ease-in;

      &.active {
        opacity: 1;
      }
    }

    .petal-wrapper {
      position: absolute;
      top: -40px;
      left: var(--left);
      width: var(--size);
      height: calc(var(--size) * 1.3);
      animation: fallDown var(--duration) linear infinite;
      animation-delay: var(--delay);
      perspective: 800px;
      will-change: transform;

      &.desktop-only {
        @media (max-width: 768px) {
          display: none !important;
        }
      }
    }

    .petal-flipper {
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;

      &.sway-type-1 {
        animation: flutter1 3.2s ease-in-out infinite alternate;
      }
      &.sway-type-2 {
        animation: flutter2 4s ease-in-out infinite alternate;
      }
      &.sway-type-3 {
        animation: flutter3 3.6s ease-in-out infinite alternate;
      }
    }

    .petal-svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
    }

    @keyframes fallDown {
      0% {
        transform: translate3d(0, -60px, 0);
      }
      100% {
        transform: translate3d(0, calc(100vh + 120px), 0);
      }
    }

    @keyframes flutter1 {
      0% {
        transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate3d(0, 0, 0);
      }
      50% {
        transform: rotateX(65deg) rotateY(45deg) rotateZ(35deg) translate3d(18px, 0, 10px);
      }
      100% {
        transform: rotateX(120deg) rotateY(-35deg) rotateZ(-25deg) translate3d(-18px, 0, -10px);
      }
    }

    @keyframes flutter2 {
      0% {
        transform: rotateX(30deg) rotateY(-40deg) rotateZ(-15deg) translate3d(-12px, 0, 0);
      }
      50% {
        transform: rotateX(85deg) rotateY(25deg) rotateZ(45deg) translate3d(15px, 0, 15px);
      }
      100% {
        transform: rotateX(145deg) rotateY(-20deg) rotateZ(10deg) translate3d(-10px, 0, -12px);
      }
    }

    @keyframes flutter3 {
      0% {
        transform: rotateX(-20deg) rotateY(30deg) rotateZ(20deg) translate3d(14px, 0, 0);
      }
      50% {
        transform: rotateX(55deg) rotateY(-45deg) rotateZ(-30deg) translate3d(-16px, 0, 12px);
      }
      100% {
        transform: rotateX(110deg) rotateY(35deg) rotateZ(15deg) translate3d(12px, 0, -8px);
      }
    }
  `]
})
export class PetalsLayerComponent {
  readonly active = input<boolean>(false);
  readonly depth = input<'behind' | 'front' | 'all'>('all');

  private readonly allPetals: Petal[] = [
    // Behind group (Mobile has 3, Desktop has +2 = 5)
    { id: 1, leftPercent: 12, size: 20, colorType: 'marigold', durationSec: 10.5, delaySec: 0.2, isDesktopOnly: false, swayType: 1 },
    { id: 2, leftPercent: 54, size: 18, colorType: 'jasmine', durationSec: 11.8, delaySec: 2.1, isDesktopOnly: false, swayType: 2 },
    { id: 3, leftPercent: 82, size: 22, colorType: 'rose', durationSec: 9.6, delaySec: 1.0, isDesktopOnly: false, swayType: 3 },
    { id: 4, leftPercent: 32, size: 16, colorType: 'marigold', durationSec: 12.5, delaySec: 3.5, isDesktopOnly: true, swayType: 2 },
    { id: 5, leftPercent: 68, size: 19, colorType: 'jasmine', durationSec: 10.2, delaySec: 4.8, isDesktopOnly: true, swayType: 1 },

    // Front group (Mobile has 2, Desktop has +3 = 5)
    { id: 6, leftPercent: 25, size: 24, colorType: 'rose', durationSec: 9.2, delaySec: 0.8, isDesktopOnly: false, swayType: 3 },
    { id: 7, leftPercent: 74, size: 22, colorType: 'marigold', durationSec: 10.0, delaySec: 2.6, isDesktopOnly: false, swayType: 1 },
    { id: 8, leftPercent: 6, size: 18, colorType: 'jasmine', durationSec: 11.2, delaySec: 1.5, isDesktopOnly: true, swayType: 2 },
    { id: 9, leftPercent: 44, size: 25, colorType: 'rose', durationSec: 8.8, delaySec: 4.0, isDesktopOnly: true, swayType: 3 },
    { id: 10, leftPercent: 91, size: 21, colorType: 'marigold', durationSec: 10.8, delaySec: 3.0, isDesktopOnly: true, swayType: 1 },
  ];

  filteredPetals(): Petal[] {
    const d = this.depth();
    if (d === 'behind') {
      return this.allPetals.filter(p => p.id <= 5);
    }
    if (d === 'front') {
      return this.allPetals.filter(p => p.id > 5);
    }
    return this.allPetals;
  }
}
