import { Component, input } from '@angular/core';

@Component({
  selector: 'app-invitation-paper',
  standalone: true,
  template: `
    <div
      class="paper-container"
      [class.animate-text]="animateText()"
      [class.text-visible]="textVisible()"
      [class.curling]="curling()"
    >
      <!-- Paper Background Image -->
      <img
        class="paper-bg"
        src="assets/images/paper.webp"
        alt="Wedding invitation parchment"
        width="527"
        height="903"
        fetchpriority="high"
      />

      <!-- Soft dark gradient curl overlays during unrolling -->
      <div class="curl-shadow curl-top" aria-hidden="true"></div>
      <div class="curl-shadow curl-bottom" aria-hidden="true"></div>

      <!-- Real HTML Handwritten Text (strictly hidden until unroll finishes) -->
      <div
        class="paper-content"
        [class.show-content]="animateText() || textVisible()"
        aria-label="Wedding Invitation Details"
      >
        
        <!-- Block 1: Caveat narrative -->
        <div class="text-block block-1">
          <p class="reveal-line line-1">Once upon a time, Ammu met Ajith.</p>
          <p class="reveal-line line-2">They laughed together, made thousands of little memories, annoyed each other a little,</p>
          <p class="reveal-line line-3">and finally decided</p>
          <p class="reveal-line line-4">&ldquo;Okay, let's do this forever.&rdquo;</p>
          <p class="reveal-line line-5">So now, with happy hearts and a whole lot of excitement</p>
        </div>

        <!-- Block 2: Caveat Announcement -->
        <div class="text-block block-2">
          <h1 class="reveal-line line-6 names-title">Ammu <span class="heart">&hearts;</span> Ajith</h1>
          <p class="reveal-line line-7 getting-married">Yesss... We are getting married</p>
        </div>

        <!-- Block 3: Chilanka Malayalam Heading -->
        <div class="text-block block-3">
          <h2 class="reveal-line line-8 mal-sub">മീനത്തിൽ താലികെട്ട്</h2>
          <h1 class="reveal-line line-9 mal-names">അമ്മു <span class="heart">&hearts;</span> അജിത്ത്</h1>
        </div>

        <!-- Block 4: Chilanka Details with SVG Icons -->
        <div class="text-block block-4">
          <p class="reveal-line line-10 detail-line">
            <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>മീനം 21 &middot; 4 ഏപ്രിൽ 2027, ഞായർ</span>
          </p>

          <p class="reveal-line line-11 detail-line">
            <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>St പോൾസ് ഓഡിറ്റോറിയം, പുത്തൂർ, കൊട്ടാരക്കര</span>
          </p>

          <p class="reveal-line line-12 detail-line muhurtham">
            <span>മുഹൂർത്തം: പകൽ 10.15നും 10.45നും മദ്ധ്യേ</span>
          </p>
        </div>

        <!-- Block 5: Caveat Closing -->
        <div class="text-block block-5">
          <p class="reveal-line line-13 sign-off">With love, Ammu &amp; Ajith</p>
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
      aspect-ratio: 527 / 903;
      user-select: text;
    }

    .paper-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      pointer-events: none;
      filter: drop-shadow(0 14px 28px rgba(0, 0, 0, 0.45));
    }

    /* Deep curl shadows to give parchment 3D curvature at the rods */
    .curl-shadow {
      position: absolute;
      left: 0;
      right: 0;
      height: 48px;
      pointer-events: none;
      opacity: 0.2;
      transition: opacity 0.6s ease-out;
      z-index: 2;

      &.curl-top {
        top: 0;
        background: linear-gradient(
          to bottom,
          rgba(20, 8, 4, 0.75) 0%,
          rgba(40, 18, 8, 0.45) 35%,
          rgba(60, 30, 15, 0.15) 70%,
          transparent 100%
        );
      }

      &.curl-bottom {
        bottom: 0;
        background: linear-gradient(
          to top,
          rgba(20, 8, 4, 0.75) 0%,
          rgba(40, 18, 8, 0.45) 35%,
          rgba(60, 30, 15, 0.15) 70%,
          transparent 100%
        );
      }
    }

    .paper-container.curling .curl-shadow {
      opacity: 1;
    }

    /* Text Container & Positioning - strictly hidden until unroll is complete */
    .paper-content {
      position: absolute;
      inset: 0;
      z-index: 3;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 5.5cqw 5.5cqw;
      gap: 2.8cqw;
      color: rgba(59, 42, 26, 0.95);
      box-sizing: border-box;
      pointer-events: auto;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease-in, visibility 0.3s;

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
      letter-spacing: 0.01em;
    }

    .heart {
      color: #dc2626;
      display: inline-block;
      margin: 0 0.15em;
      font-size: 0.9em;
    }

    /* Block 1 (Caveat) - Larger, comfortable reading */
    .block-1 {
      font-family: var(--font-caveat);
      font-size: clamp(13.5px, 4.3cqw, 21.5px);
      line-height: 1.22;
      font-weight: 500;
      gap: 0.15cqw;
    }

    /* Block 2 (Caveat) - Prominent hero names */
    .block-2 {
      font-family: var(--font-caveat);

      .names-title {
        font-size: clamp(28px, 9.4cqw, 46px);
        font-weight: 700;
        line-height: 1.05;
      }

      .getting-married {
        font-size: clamp(14.5px, 5.1cqw, 24px);
        font-weight: 500;
        line-height: 1.2;
        margin-top: 0.15cqw;
      }
    }

    /* Block 3 (Chilanka) - Prominent Malayalam calligraphy */
    .block-3 {
      font-family: var(--font-chilanka);

      .mal-sub {
        font-size: clamp(17.5px, 6.2cqw, 30px);
        font-weight: 400;
        line-height: 1.2;
      }

      .mal-names {
        font-size: clamp(23.5px, 8.6cqw, 42px);
        font-weight: 400;
        line-height: 1.15;
        margin-top: 0.2cqw;
      }
    }

    /* Block 4 (Chilanka with icons) - Clear event information */
    .block-4 {
      font-family: var(--font-chilanka);
      font-size: clamp(13px, 4.5cqw, 21.5px);
      line-height: 1.28;
      gap: 0.4cqw;

      .detail-line {
        display: block;
        text-align: center;
      }

      .detail-icon {
        display: inline-block;
        width: 1.15em;
        height: 1.15em;
        vertical-align: -0.16em;
        margin-right: 0.28em;
        color: rgba(59, 42, 26, 0.92);
        stroke-width: 2.2;
      }

      .muhurtham {
        margin-top: 0.15cqw;
        font-weight: 400;
      }
    }

    /* Block 5 (Caveat) - Warm invitation sign-off */
    .block-5 {
      font-family: var(--font-caveat);

      .sign-off {
        margin-top: 0.2cqw;
        font-weight: 700;
        font-size: clamp(17.5px, 6.2cqw, 30px);
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
      .line-1  { animation-delay: 0.00s; }
      .line-2  { animation-delay: 0.14s; }
      .line-3  { animation-delay: 0.28s; }
      .line-4  { animation-delay: 0.42s; }
      .line-5  { animation-delay: 0.56s; }
      .line-6  { animation-delay: 0.70s; }
      .line-7  { animation-delay: 0.84s; }
      .line-8  { animation-delay: 0.98s; }
      .line-9  { animation-delay: 1.12s; }
      .line-10 { animation-delay: 1.26s; }
      .line-11 { animation-delay: 1.40s; }
      .line-12 { animation-delay: 1.54s; }
      .line-13 { animation-delay: 1.68s; }
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
