import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-invitation-paper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="paper-container"
      [class.animate-text]="animateText()"
      [class.text-visible]="textVisible()"
      [class.curling]="curling()"
    >
      <!-- Paper Background Image with Baroque Flourishes -->
      <img
        class="paper-bg"
        src="assets/images/scroll-paper.webp"
        alt="Royal wedding invitation parchment"
        width="664"
        height="914"
        fetchpriority="high"
      />

      <!-- Real HTML Handwritten Text (strictly hidden until unroll finishes) -->
      <div
        class="paper-content"
        [class.show-content]="animateText() || textVisible()"
        aria-label="Wedding Invitation Details"
      >
        
        <!-- Block 1: Caveat narrative -->
        <div class="text-block block-1">
          <p class="reveal-line line-1">Once upon a time, Ammu met Ajith.</p>
          <p class="reveal-line line-2">They laughed together, made thousands of little memories,<br>annoyed each other a little,</p>
          <p class="reveal-line line-3">and finally decided</p>
          <p class="reveal-line line-4">&ldquo;Okay, let's do this forever.&rdquo;</p>
          <p class="reveal-line line-5">So now, with happy hearts and a whole lot of excitement</p>
        </div>

        <!-- Block 2: Caveat Announcement -->
        <div class="text-block block-2">
          <h1 class="reveal-line line-6 names-title">
            Ammu
            <span class="heart-wine" aria-hidden="true">
              <svg viewBox="0 0 24 24" class="wine-heart-svg">
                <defs>
                  <linearGradient id="wineHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#992332"/>
                    <stop offset="50%" stop-color="#761621"/>
                    <stop offset="100%" stop-color="#540f17"/>
                  </linearGradient>
                </defs>
                <path fill="url(#wineHeartGrad)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </span>
            Ajith
          </h1>
          <p class="reveal-line line-7 getting-married">Yesss... We are getting married</p>
        </div>

        <!-- Block 3: Caveat Closing -->
        <div class="text-block block-5">
          <p class="reveal-line line-8 sign-off">With love, Ammu &amp; Ajith</p>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
    }

    .paper-container {
      container-type: inline-size;
      container-name: paper;
      position: relative;
      width: var(--paper-w);
      height: var(--paper-h);
      aspect-ratio: 664 / 914;
      user-select: text;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
    }

    .paper-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      pointer-events: none;
    }


    /* Text Container & Positioning - framed within the baroque flourishes */
    .paper-content {
      position: absolute;
      inset: 0;
      z-index: 3;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      padding: 9% 11% 8.5% 11%;
      color: #24130c;
      text-shadow: 0 0.5px 1px rgba(255, 245, 220, 0.45);
      box-sizing: border-box;
      pointer-events: auto;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease-in, visibility 0.3s;
      text-wrap: balance;

      &.show-content {
        opacity: 1;
        visibility: visible;
      }
    }

    .text-block {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* Common handwriting style */
    p, h1, h2, span {
      margin: 0;
      letter-spacing: 0.015em;
    }

    .heart-wine {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: -0.05em;
      margin: 0 0.22em;
      line-height: 1;

      .wine-heart-svg {
        width: 0.74em;
        height: 0.74em;
        display: block;
        filter: drop-shadow(0 1.2px 2px rgba(60, 10, 15, 0.35));
      }
    }

    /* Block 1 (Caveat) - Larger, comfortable reading */
    .block-1 {
      font-family: var(--font-caveat);
      font-size: clamp(15px, 5.1cqw, 24px);
      line-height: 1.32;
      font-weight: 600;
    }

    /* Block 2 (Caveat) - Prominent hero names */
    .block-2 {
      font-family: var(--font-caveat);

      .names-title {
        font-size: clamp(32px, 11cqw, 60px);
        font-weight: 700;
        line-height: 1.05;
      }

      .getting-married {
        font-size: clamp(15.5px, 5.2cqw, 26px);
        font-weight: 600;
        line-height: 1.22;
        margin-top: 0.3cqw;
      }
    }

    /* Block 5 (Caveat) - Warm invitation sign-off */
    .block-5 {
      font-family: var(--font-caveat);

      .sign-off {
        font-weight: 700;
        font-size: clamp(19.5px, 7.2cqw, 38px);
        line-height: 1.15;
        white-space: nowrap;
      }
    }

    /* Line-by-Line Reveal Animations */
    .reveal-line {
      clip-path: inset(0 100% 0 0);
      opacity: 0;
    }

    .paper-container.text-visible:not(.animate-text) .reveal-line {
      clip-path: inset(0 0% 0 0);
      opacity: 1;
      transition: opacity 0.4s ease-out;
    }

    .paper-container.animate-text .reveal-line {
      animation: handwritingReveal 0.42s cubic-bezier(0.35, 0, 0.25, 1) forwards;
      will-change: clip-path, opacity;
    }

    .paper-container.animate-text {
      .line-1 { animation-delay: 0.00s; }
      .line-2 { animation-delay: 0.15s; }
      .line-3 { animation-delay: 0.30s; }
      .line-4 { animation-delay: 0.45s; }
      .line-5 { animation-delay: 0.60s; }
      .line-6 { animation-delay: 0.80s; }
      .line-7 { animation-delay: 1.00s; }
      .line-8 { animation-delay: 1.25s; }
    }

    @keyframes handwritingReveal {
      0% {
        clip-path: inset(0 100% 0 0);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      100% {
        clip-path: inset(0 0% 0 0);
        opacity: 1;
      }
    }
  `]
})
export class InvitationPaperComponent {
  readonly animateText = input<boolean>(false);
  readonly textVisible = input<boolean>(false);
  readonly curling = input<boolean>(false);
}
