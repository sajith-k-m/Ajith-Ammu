import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  inject,
  signal,
  computed
} from '@angular/core';
import { INVITE_CONFIG } from '../../invite.config';

@Component({
  selector: 'app-details-section',
  standalone: true,
  template: `
    <section class="details-section" aria-label="Event Details & RSVP">
      
      <!-- Golden Divider Ornament -->
      <div class="divider reveal-on-scroll">
        <svg viewBox="0 0 160 24" fill="none" class="ornament-svg" aria-hidden="true">
          <path d="M5 12h55m40 0h55M80 5l4 7-4 7-4-7 4-7z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
        </svg>
      </div>

      <!-- Live Countdown Card -->
      <div class="countdown-card reveal-on-scroll">
        <p class="countdown-label">Counting down to the big day</p>
        <div class="countdown-grid" role="timer" aria-live="polite">
          <div class="time-unit">
            <span class="num">{{ days() }}</span>
            <span class="unit">Days</span>
          </div>
          <span class="separator" aria-hidden="true">&middot;</span>
          <div class="time-unit">
            <span class="num">{{ hours() }}</span>
            <span class="unit">Hours</span>
          </div>
          <span class="separator" aria-hidden="true">&middot;</span>
          <div class="time-unit">
            <span class="num">{{ minutes() }}</span>
            <span class="unit">Minutes</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons reveal-on-scroll">
        @if (mapsUrl()) {
          <a
            [href]="mapsUrl()"
            target="_blank"
            rel="noopener noreferrer"
            class="action-btn location-btn"
          >
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>View location</span>
          </a>
        }

        @if (whatsappRsvpUrl()) {
          <a
            [href]="whatsappRsvpUrl()"
            target="_blank"
            rel="noopener noreferrer"
            class="action-btn rsvp-btn"
          >
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <span>WhatsApp RSVP</span>
          </a>
        }
      </div>

      <!-- Footer Sign-off -->
      <footer class="invitation-footer reveal-on-scroll">
        <p class="footer-blessing">We can't wait to celebrate with you</p>
        <p class="footer-signoff">With love, Ammu &amp; Ajith</p>
      </footer>

    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .details-section {
      width: 100%;
      max-width: 580px;
      margin: 0 auto;
      padding: 6px 20px 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-sizing: border-box;
      gap: 20px;
    }

    /* Decorative Divider */
    .divider {
      color: rgba(212, 165, 90, 0.45);
      width: 160px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;

      .ornament-svg {
        width: 100%;
        height: 100%;
      }
    }

    /* Countdown Card */
    .countdown-card {
      background: radial-gradient(circle at center, rgba(42, 18, 12, 0.85) 0%, rgba(20, 9, 11, 0.95) 100%);
      border: 1px solid rgba(212, 165, 90, 0.28);
      border-radius: 18px;
      padding: 26px 36px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

      .countdown-label {
        font-family: var(--font-caveat);
        font-size: clamp(19px, 4.5vw, 24px);
        color: rgba(212, 165, 90, 0.9);
        margin-bottom: 14px;
        letter-spacing: 0.03em;
      }

      .countdown-grid {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
      }

      .time-unit {
        display: flex;
        flex-direction: column;
        align-items: center;

        .num {
          font-family: var(--font-caveat);
          font-size: clamp(32px, 8vw, 44px);
          font-weight: 700;
          color: #f7e6c4;
          line-height: 1;
        }

        .unit {
          font-family: var(--font-caveat);
          font-size: clamp(15px, 3.8vw, 19px);
          color: rgba(212, 165, 90, 0.75);
          margin-top: 4px;
        }
      }

      .separator {
        font-size: 28px;
        color: rgba(212, 165, 90, 0.4);
        margin-top: -16px;
      }
    }

    /* Action Buttons */
    .action-buttons {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 18px;
      width: 100%;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 13px 26px;
      border-radius: 30px;
      text-decoration: none;
      font-family: var(--font-caveat);
      font-size: clamp(19px, 4.2vw, 23px);
      font-weight: 600;
      letter-spacing: 0.02em;
      transition: transform 0.25s ease, opacity 0.25s ease;
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        opacity: 0.95;
      }

      &:active {
        transform: translateY(0);
      }

      .btn-icon {
        width: 1.15em;
        height: 1.15em;
      }

      &.location-btn {
        background: linear-gradient(135deg, rgba(212, 165, 90, 0.2) 0%, rgba(180, 130, 60, 0.12) 100%);
        border: 1px solid rgba(212, 165, 90, 0.45);
        color: #f7e6c4;
      }

      &.rsvp-btn {
        background: linear-gradient(135deg, #1b4332 0%, #0d2818 100%);
        border: 1px solid rgba(82, 183, 136, 0.5);
        color: #d8f3dc;
      }
    }

    /* Footer */
    .invitation-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      margin-top: 10px;

      .footer-blessing {
        font-family: var(--font-caveat);
        font-size: clamp(18px, 4vw, 22px);
        color: rgba(212, 165, 90, 0.7);
      }

      .footer-signoff {
        font-family: var(--font-caveat);
        font-size: clamp(24px, 5.5vw, 32px);
        font-weight: 700;
        color: #f7e6c4;
      }
    }

    /* Suspended elements fade & rise with scroll intensity */
    .reveal-on-scroll {
      opacity: 1;
      transform: none;
    }
  `]
})
export class DetailsSectionComponent implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private timerId: number | null = null;
  private observer: IntersectionObserver | null = null;

  readonly mapsUrl = signal<string>(INVITE_CONFIG.mapsUrl || '');
  readonly whatsappRsvpUrl = signal<string>(INVITE_CONFIG.whatsappRsvpUrl || '');

  private readonly diffMs = signal<number>(0);

  readonly days = computed(() => Math.max(0, Math.floor(this.diffMs() / (1000 * 60 * 60 * 24))));
  readonly hours = computed(() => Math.max(0, Math.floor((this.diffMs() / (1000 * 60 * 60)) % 24)));
  readonly minutes = computed(() => Math.max(0, Math.floor((this.diffMs() / (1000 * 60)) % 60)));

  ngOnInit(): void {
    this.updateCountdown();
    if (typeof window !== 'undefined') {
      this.timerId = window.setInterval(() => this.updateCountdown(), 1000);
      this.initIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
    }
    this.observer?.disconnect();
  }

  private updateCountdown(): void {
    const target = new Date(INVITE_CONFIG.weddingDateISO).getTime();
    const now = Date.now();
    this.diffMs.set(Math.max(0, target - now));
  }

  private initIntersectionObserver(): void {
    const elements = this.el.nativeElement.querySelectorAll('.reveal-on-scroll');
    if (!elements || elements.length === 0) return;

    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.observer?.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      elements.forEach((el: Element) => this.observer?.observe(el));
    } else {
      // Fallback for environments without IntersectionObserver
      elements.forEach((el: Element) => el.classList.add('is-visible'));
    }
  }
}
