import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  input,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { INVITE_CONFIG } from '../../invite.config';

interface PhotoItem {
  id: number;
  title: string;
  subtitle: string;
  placeholderTag: string;
  customImgUrl?: string;
  aspect: 'portrait' | 'landscape' | 'square';
}

interface Blessing {
  id: number;
  name: string;
  message: string;
  reaction: string;
  dateStr: string;
}

@Component({
  selector: 'app-details-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="luxury-details-container" [style.--scroll-vel]="scrollVelocity()" aria-label="Event Details, Countdown & Gallery">

      <!-- Ambient Audio Controller Pill (Top Floating) -->
      <div class="audio-control-bar">
        <button
          type="button"
          class="audio-toggle-btn"
          [class.playing]="isAudioPlaying()"
          (click)="toggleAudio()"
          aria-label="Toggle ambient wedding melody"
        >
          <div class="sound-wave" aria-hidden="true">
            <span class="bar bar-1"></span>
            <span class="bar bar-2"></span>
            <span class="bar bar-3"></span>
            <span class="bar bar-4"></span>
          </div>
          <span class="audio-label">{{ isAudioPlaying() ? 'Melody Playing' : 'Play Celebration Melody' }}</span>
        </button>
      </div>

      <!-- Section 1: Royal Monogram & Greeting -->
      <header class="royal-header reveal-item">
        <div
          class="monogram-crest"
          (mousemove)="onCrestMouseMove($event, crestRef)"
          (mouseleave)="onCrestMouseLeave(crestRef)"
          #crestRef
        >
          <svg viewBox="0 0 120 120" class="crest-svg" aria-hidden="true">
            <circle cx="60" cy="60" r="54" stroke="url(#crestGoldGrad)" stroke-width="1.8" fill="none" opacity="0.6"/>
            <circle cx="60" cy="60" r="48" stroke="url(#crestGoldGrad)" stroke-width="0.8" stroke-dasharray="3 3" fill="none" opacity="0.8"/>
            <path d="M25 65 C22 45 35 30 55 24 C45 35 44 50 50 65" fill="none" stroke="url(#crestGoldGrad)" stroke-width="1.5"/>
            <path d="M95 65 C98 45 85 30 65 24 C75 35 76 50 70 65" fill="none" stroke="url(#crestGoldGrad)" stroke-width="1.5"/>
            <text x="60" y="68" text-anchor="middle" class="monogram-text">A &amp; A</text>
          </svg>
        </div>

        <p class="family-invitation">Together with our families, we invite you to celebrate</p>
        <h1 class="couple-title shiny-text blur-text-reveal">Ammu &amp; Ajith</h1>
        <p class="wedding-tagline">A celebration of eternal love, quiet laughter &amp; two hearts becoming one</p>

        <div class="ornate-gold-divider" aria-hidden="true">
          <span class="divider-line"></span>
          <svg viewBox="0 0 24 24" class="divider-diamond">
            <polygon points="12,2 22,12 12,22 2,12" fill="url(#crestGoldGrad)" />
            <circle cx="12" cy="12" r="3" fill="#12080a" />
          </svg>
          <span class="divider-line"></span>
        </div>
      </header>

      <!-- Section 2: Redesigned Royal Astrological Chronometer -->
      <div
        class="chronometer-card reveal-item cathedral-arch-card spotlight-card"
        (mousemove)="onCardTilt($event, chronometerRef)"
        (mouseleave)="onCardLeave(chronometerRef)"
        #chronometerRef
      >
        <!-- ReactBits Spotlight, Glare & Border Beam -->
        <div class="card-spotlight-layer" aria-hidden="true"></div>
        <div class="card-glare-overlay" aria-hidden="true"></div>
        <div class="border-beam-ring" aria-hidden="true"></div>
        <div class="card-shimmer-highlight" aria-hidden="true"></div>
        
        <div class="chronometer-badge">
          <span class="badge-dot"></span>
          <span>Auspicious Muhurtham Countdown</span>
          <span class="badge-dot"></span>
        </div>

        <h2 class="chronometer-heading shiny-text">Counting Down To Our Forever</h2>
        <p class="chronometer-date-str">
          <span class="date-ornament">✦</span>
          Sunday, April 4, 2027 &bull; Kottarakkara, Kerala
          <span class="date-ornament">✦</span>
        </p>

        <!-- 4 Grand Architectural Cathedral Arch Dials -->
        <div class="dials-grid" role="timer" aria-live="polite">
          
          <!-- Days Arch Dial -->
          <div
            class="dial-box cathedral-arch-dial spotlight-card"
            (mousemove)="onDialTilt($event, d1)"
            (mouseleave)="onDialLeave(d1)"
            #d1
          >
            <div class="card-spotlight-layer" aria-hidden="true"></div>
            <div class="arch-apex-crest" aria-hidden="true">✦</div>
            <div class="dial-inner">
              <span class="dial-num shiny-gold-num">{{ pad(days()) }}</span>
              <span class="dial-unit-tag">DAYS</span>
            </div>
            <div class="arch-gold-trim" aria-hidden="true"></div>
          </div>

          <div class="dial-separator" aria-hidden="true">✦</div>

          <!-- Hours Arch Dial -->
          <div
            class="dial-box cathedral-arch-dial spotlight-card"
            (mousemove)="onDialTilt($event, d2)"
            (mouseleave)="onDialLeave(d2)"
            #d2
          >
            <div class="card-spotlight-layer" aria-hidden="true"></div>
            <div class="arch-apex-crest" aria-hidden="true">✦</div>
            <div class="dial-inner">
              <span class="dial-num shiny-gold-num">{{ pad(hours()) }}</span>
              <span class="dial-unit-tag">HOURS</span>
            </div>
            <div class="arch-gold-trim" aria-hidden="true"></div>
          </div>

          <div class="dial-separator" aria-hidden="true">✦</div>

          <!-- Minutes Arch Dial -->
          <div
            class="dial-box cathedral-arch-dial spotlight-card"
            (mousemove)="onDialTilt($event, d3)"
            (mouseleave)="onDialLeave(d3)"
            #d3
          >
            <div class="card-spotlight-layer" aria-hidden="true"></div>
            <div class="arch-apex-crest" aria-hidden="true">✦</div>
            <div class="dial-inner">
              <span class="dial-num shiny-gold-num">{{ pad(minutes()) }}</span>
              <span class="dial-unit-tag">MINUTES</span>
            </div>
            <div class="arch-gold-trim" aria-hidden="true"></div>
          </div>

          <div class="dial-separator" aria-hidden="true">✦</div>

          <!-- Seconds Arch Dial (Living Heartbeat Pulse) -->
          <div
            class="dial-box cathedral-arch-dial seconds-box spotlight-card"
            (mousemove)="onDialTilt($event, d4)"
            (mouseleave)="onDialLeave(d4)"
            #d4
          >
            <div class="card-spotlight-layer" aria-hidden="true"></div>
            <div class="arch-apex-crest pulse-crest" aria-hidden="true">✦</div>
            <div class="dial-inner">
              <span class="dial-num shiny-gold-num seconds-pulse">{{ pad(seconds()) }}</span>
              <span class="dial-unit-tag seconds-tag">SECONDS</span>
            </div>
            <div class="seconds-halo-rings" aria-hidden="true"></div>
            <div class="arch-gold-trim" aria-hidden="true"></div>
          </div>

        </div>

        <div class="calendar-action-bar">
          <div class="star-border-btn-wrap">
            <div class="star-border-beam" aria-hidden="true"></div>
            <button
              type="button"
              class="calendar-btn star-border-btn specular-btn"
              (click)="addToCalendar()"
              (mousemove)="onBtnMouseMove($event, calBtnRef)"
              (mouseleave)="onBtnMouseLeave(calBtnRef)"
              #calBtnRef
            >
              <div class="btn-shine-sweep" aria-hidden="true"></div>
              <svg viewBox="0 0 24 24" class="cal-icon" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Add Auspicious Day to Calendar</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ReactBits Kinetic ScrollVelocity Royal Silk Ribbon Banner -->
      <div class="royal-velocity-ribbon-stage" aria-hidden="true">
        <div class="ribbon-glow-line top-line"></div>
        
        <div class="velocity-track track-1" [style.transform]="velocityTrack1Transform()">
          <div class="track-inner">
            <span class="ribbon-phrase">✦ AMMU &amp; AJITH ✦ APRIL 4, 2027 ✦ MEENAM 21 ✦ KOTTARAKKARA ✦ A CELEBRATION OF ETERNAL LOVE ✦ ശുഭ മുഹൂർത്തം ✦ TWO HEARTS BECOMING ONE ✦</span>
            <span class="ribbon-phrase">✦ AMMU &amp; AJITH ✦ APRIL 4, 2027 ✦ MEENAM 21 ✦ KOTTARAKKARA ✦ A CELEBRATION OF ETERNAL LOVE ✦ ശുഭ മുഹൂർത്തം ✦ TWO HEARTS BECOMING ONE ✦</span>
          </div>
        </div>

        <div class="velocity-track track-2" [style.transform]="velocityTrack2Transform()">
          <div class="track-inner">
            <span class="ribbon-phrase sub-phrase">🕊️ WITH ROYAL BLESSINGS ✦ ST. PAUL'S AUDITORIUM ✦ 24-DISH KERALA SADHYA ✦ TWO SOULS UNITED ✦ SAVING THE AUSPICIOUS DATE ✦ ETERNAL DEVOTION ✦</span>
            <span class="ribbon-phrase sub-phrase">🕊️ WITH ROYAL BLESSINGS ✦ ST. PAUL'S AUDITORIUM ✦ 24-DISH KERALA SADHYA ✦ TWO SOULS UNITED ✦ SAVING THE AUSPICIOUS DATE ✦ ETERNAL DEVOTION ✦</span>
          </div>
        </div>

        <div class="ribbon-glow-line bottom-line"></div>
      </div>

      <!-- Section 3: Redesigned Action Suite (Imperial Wax-Sealed RSVP Missive & Cathedral Sanctuary) -->
      <div class="action-suite-grid reveal-item">
        
        <!-- Imperial Wax-Sealed RSVP Missive Card -->
        <div
          class="suite-card rsvp-suite-card wax-sealed-card spotlight-card"
          (mousemove)="onCardTilt($event, rsvpRef)"
          (mouseleave)="onCardLeave(rsvpRef)"
          #rsvpRef
        >
          <!-- ReactBits Spotlight, Glare & Border Beam -->
          <div class="card-spotlight-layer" aria-hidden="true"></div>
          <div class="card-glare-overlay" aria-hidden="true"></div>
          <div class="border-beam-ring" aria-hidden="true"></div>

          <!-- 3D Sculpted Royal Wax Seal & Silk Ribbon Tails -->
          <div class="wax-seal-ornament" aria-hidden="true">
            <div class="wax-seal-ribbons">
              <span class="wax-ribbon ribbon-left" [style.transform]="waxRibbonLeftTransform()"></span>
              <span class="wax-ribbon ribbon-right" [style.transform]="waxRibbonRightTransform()"></span>
            </div>
            <div class="wax-seal-stamp">
              <div class="wax-outer-rim"></div>
              <div class="wax-inner-bed">
                <svg viewBox="0 0 44 44" class="wax-crest-svg">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255, 235, 180, 0.7)" stroke-width="1" stroke-dasharray="2 1.5"/>
                  <text x="22" y="27" text-anchor="middle" class="wax-monogram">A&amp;A</text>
                </svg>
              </div>
              <div class="wax-gloss-highlight"></div>
            </div>
          </div>

          <div class="suite-badge emerald-badge">
            <svg viewBox="0 0 24 24" class="badge-icon" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z" fill="currentColor"/>
            </svg>
            <span>{{ isRsvpSubmitted() ? 'RSVP Confirmed' : 'Imperial Protocol & RSVP' }}</span>
          </div>

          <h3 class="suite-title shiny-text">Will You Grace Us With Your Presence?</h3>

          <!-- Form View (when not yet submitted or when editing) -->
          @if (!isRsvpSubmitted()) {
            <p class="suite-desc">Kindly record your royal response so we may reserve your seats for the auspicious muhurtham and traditional Kerala Sadhya.</p>

            <form class="rsvp-inline-form" (ngSubmit)="submitRsvp()">
              
              <!-- Royal Hairline Name Input -->
              <div class="imperial-field-group">
                <label class="imperial-field-label">Honored Guest / Family Name *</label>
                <div class="hairline-input-wrap">
                  <input
                    type="text"
                    class="imperial-hairline-input"
                    [(ngModel)]="rsvpName"
                    name="rsvpName"
                    placeholder="e.g. Rahul &amp; Sneha"
                    maxlength="50"
                    required
                  />
                  <span class="hairline-glow-bar" aria-hidden="true"></span>
                </div>
                @if (rsvpError()) {
                  <span class="field-error">{{ rsvpError() }}</span>
                }
              </div>

              <!-- Attendance Velvet Badges -->
              <div class="imperial-field-group">
                <label class="imperial-field-label">Ceremonial Attendance</label>
                <div class="velvet-badge-toggle">
                  <button
                    type="button"
                    class="velvet-badge-btn emerald-velvet"
                    [class.active]="rsvpAttendance() === 'attending'"
                    (click)="rsvpAttendance.set('attending')"
                  >
                    <span class="velvet-icon">👑</span>
                    <span class="velvet-text">Graciously Attending</span>
                    <span class="velvet-glow-border" aria-hidden="true"></span>
                  </button>
                  <button
                    type="button"
                    class="velvet-badge-btn rose-velvet"
                    [class.active]="rsvpAttendance() === 'regret'"
                    (click)="rsvpAttendance.set('regret')"
                  >
                    <span class="velvet-icon">🕊️</span>
                    <span class="velvet-text">Sending Royal Blessings</span>
                    <span class="velvet-glow-border" aria-hidden="true"></span>
                  </button>
                </div>
              </div>

              <!-- Sovereign Minted Gold Coin Guest Counters (Shown when attending) -->
              @if (rsvpAttendance() === 'attending') {
                <div class="imperial-field-group">
                  <div class="count-label-row">
                    <label class="imperial-field-label">Number of Royal Seats Reserved</label>
                    <span class="seat-count-tag">{{ rsvpGuestCount() }} {{ rsvpGuestCount() === 1 ? 'Guest Seat' : 'Guest Seats' }}</span>
                  </div>
                  <div class="sovereign-coins-row">
                    @for (count of [1, 2, 3, 4, 5]; track count) {
                      <button
                        type="button"
                        class="sovereign-coin-btn"
                        [class.active]="rsvpGuestCount() === count"
                        (click)="rsvpGuestCount.set(count)"
                        [attr.aria-label]="count === 5 ? '5 or more guests' : count + ' guests'"
                      >
                        <span class="coin-rim" aria-hidden="true"></span>
                        <span class="coin-face">
                          <span class="coin-num">{{ count === 5 ? '5+' : count }}</span>
                        </span>
                        <span class="coin-sub">{{ count === 1 ? 'Guest' : (count === 5 ? 'Seats' : 'Guests') }}</span>
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- Royal Hairline Note Input -->
              <div class="imperial-field-group">
                <label class="imperial-field-label">Personal Blessing to Ammu &amp; Ajith (Optional)</label>
                <div class="hairline-input-wrap">
                  <input
                    type="text"
                    class="imperial-hairline-input"
                    [(ngModel)]="rsvpNote"
                    name="rsvpNote"
                    placeholder="e.g. Can't wait to celebrate your forever!"
                    maxlength="120"
                  />
                  <span class="hairline-glow-bar" aria-hidden="true"></span>
                </div>
              </div>

              <!-- Grand Emerald Velvet WhatsApp CTA with ReactBits StarBorder -->
              <div class="rsvp-submit-actions">
                <div class="grand-cta-border-wrap">
                  <div class="star-border-beam" aria-hidden="true"></div>
                  <button
                    type="submit"
                    class="grand-emerald-cta-btn specular-btn"
                    [disabled]="isSubmittingRsvp()"
                    (mousemove)="onBtnMouseMove($event, submitRsvpRef)"
                    (mouseleave)="onBtnMouseLeave(submitRsvpRef)"
                    #submitRsvpRef
                  >
                    <div class="btn-shine-sweep" aria-hidden="true"></div>
                    <svg viewBox="0 0 24 24" class="wa-btn-icon" fill="currentColor">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z" fill="currentColor"/>
                    </svg>
                    <span class="cta-text">{{ isSubmittingRsvp() ? 'Recording Royal RSVP...' : 'Confirm Attendance via WhatsApp ✨' }}</span>
                  </button>
                </div>

                <!-- Live Parchment Message Preview -->
                <div class="live-scroll-preview">
                  <div class="preview-badge">
                    <span class="preview-dot"></span>
                    <span>Live WhatsApp Dispatch Preview</span>
                  </div>
                  <div class="preview-quote-box">
                    <p class="preview-text">
                      &ldquo;✨ <strong>WEDDING RSVP — AMMU &amp; AJITH</strong> ✨<br>
                      👤 Guest: <em>{{ rsvpName ? rsvpName : '[Your Gracious Name]' }}</em><br>
                      👑 Attendance: <em>{{ rsvpAttendance() === 'attending' ? ('Joyfully Attending (' + rsvpGuestCount() + (rsvpGuestCount() === 1 ? ' Guest)' : ' Guests)')) : 'Sending Warm Love & Blessings from Afar' }}</em>
                      @if (rsvpNote) {
                        <br>💬 Note: <em>&ldquo;{{ rsvpNote }}&rdquo;</em>
                      }
                      &rdquo;
                    </p>
                  </div>
                </div>

                <a
                  [href]="defaultWhatsappUrl()"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="quick-tap-rsvp-link"
                >
                  Or quick 1-tap direct WhatsApp message &rsaquo;
                </a>
              </div>

            </form>
          } @else {
            <!-- Submitted State View -->
            <div class="rsvp-confirmed-panel">
              <div class="confirmed-header">
                <div class="confirmed-check-icon">✓</div>
                <div>
                  <h4 class="confirmed-title">Royal RSVP Recorded!</h4>
                  <p class="confirmed-subtitle">Thank you, {{ rsvpName }}</p>
                </div>
              </div>

              <div class="confirmed-summary-box">
                <div class="summary-line">
                  <span class="sum-label">Status:</span>
                  <span class="sum-val">{{ rsvpAttendance() === 'attending' ? '👑 Joyfully Attending' : '🕊️ Sending Love from Afar' }}</span>
                </div>
                @if (rsvpAttendance() === 'attending') {
                  <div class="summary-line">
                    <span class="sum-label">Seats:</span>
                    <span class="sum-val">{{ rsvpGuestCount() }} {{ rsvpGuestCount() === 1 ? 'Guest Seat Reserved' : 'Guest Seats Reserved' }}</span>
                  </div>
                }
                @if (rsvpNote) {
                  <div class="summary-line">
                    <span class="sum-label">Note:</span>
                    <span class="sum-val">&ldquo;{{ rsvpNote }}&rdquo;</span>
                  </div>
                }
              </div>

              <div class="confirmed-action-row">
                <button type="button" class="resend-wa-btn" (click)="submitRsvp()">
                  <span>Resend via WhatsApp</span>
                </button>
                <button type="button" class="edit-rsvp-btn" (click)="editRsvp()">
                  <span>Edit Response &rsaquo;</span>
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Cathedral Sanctuary Venue & Navigation Card -->
        <div
          class="suite-card venue-suite-card cathedral-venue-card spotlight-card"
          (mousemove)="onCardTilt($event, venueRef)"
          (mouseleave)="onCardLeave(venueRef)"
          #venueRef
        >
          <!-- ReactBits Spotlight & Glare Layers -->
          <div class="card-spotlight-layer" aria-hidden="true"></div>
          <div class="card-glare-overlay" aria-hidden="true"></div>

          <!-- Gilded Kerala Cathedral Facade Artwork -->
          <div class="venue-facade-banner" aria-hidden="true">
            <svg viewBox="0 0 280 90" class="venue-facade-svg">
              <path d="M140 10 L160 40 L260 40 L260 85 L20 85 L20 40 L120 40 Z" fill="rgba(223, 178, 93, 0.08)" stroke="url(#crestGoldGrad)" stroke-width="1.2"/>
              <path d="M140 5 L140 25 M133 12 L147 12" stroke="url(#crestGoldGrad)" stroke-width="1.5"/>
              <path d="M130 50 C130 40 150 40 150 50 L150 85 L130 85 Z" fill="rgba(150, 96, 26, 0.2)" stroke="url(#crestGoldGrad)" stroke-width="1"/>
              <circle cx="140" cy="30" r="6" fill="none" stroke="url(#crestGoldGrad)" stroke-width="0.9"/>
              <path d="M45 55 C45 48 65 48 65 55 L65 85 L45 85 Z" fill="none" stroke="url(#crestGoldGrad)" stroke-width="0.8"/>
              <path d="M215 55 C215 48 235 48 235 55 L235 85 L215 85 Z" fill="none" stroke="url(#crestGoldGrad)" stroke-width="0.8"/>
            </svg>
          </div>

          <div class="suite-badge gold-badge">
            <svg viewBox="0 0 24 24" class="badge-icon" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Ceremony Venue &bull; 8.9989&deg; N, 76.7725&deg; E</span>
          </div>

          <h3 class="suite-title shiny-text">St. Paul's Auditorium</h3>
          <p class="suite-venue-address">Puthoor, Kottarakkara &bull; Kollam District, Kerala</p>
          <p class="suite-desc">Auspicious ceremony at 10:15 AM followed by grand traditional Kerala Sadhya feast.</p>

          <!-- Auspicious Schedule & Highlights -->
          <div class="venue-highlights-pill-box">
            <div class="venue-hl-row">
              <span class="hl-badge">10:15 AM</span>
              <span class="hl-desc">Sacred Thali Kettu &amp; Wedding Muhurtham</span>
            </div>
            <div class="venue-hl-row">
              <span class="hl-badge">12:30 PM</span>
              <span class="hl-desc">Grand 24-Dish Kerala Wedding Sadhya Feast</span>
            </div>
            <div class="venue-hl-row">
              <span class="hl-badge">SANCTUARY</span>
              <span class="hl-desc">Main Central Auditorium &bull; AC Banquet</span>
            </div>
          </div>

          <!-- Stylized Mini Venue Map Preview Card -->
          <div class="venue-mini-map-preview">
            <div class="map-bg-pattern" aria-hidden="true"></div>
            <div class="map-compass-badge">
              <span class="compass-symbol">🧭</span>
              <span class="compass-coords">Kottarakkara, Kollam</span>
            </div>
            <div class="map-live-beacon">
              <span class="beacon-wave wave-1"></span>
              <span class="beacon-wave wave-2"></span>
              <span class="beacon-pin-head">📍</span>
            </div>
            <div class="map-caption">
              <strong>St. Paul's Auditorium</strong> &bull; Ample parking &amp; highway access
            </div>
          </div>

          <div class="venue-action-row">
            <div class="star-border-btn-wrap">
              <div class="star-border-beam" aria-hidden="true"></div>
              <a
                [href]="mapsUrl()"
                target="_blank"
                rel="noopener noreferrer"
                class="primary-venue-btn specular-btn"
                (mousemove)="onBtnMouseMove($event, venueBtnRef)"
                (mouseleave)="onBtnMouseLeave(venueBtnRef)"
                #venueBtnRef
              >
                <div class="btn-shine-sweep" aria-hidden="true"></div>
                <svg viewBox="0 0 24 24" class="nav-icon" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                </svg>
                <span>Navigate in Google Maps</span>
              </a>
            </div>

            <button type="button" class="copy-address-btn" (click)="copyAddress()">
              <span>{{ addressCopied() ? '✓ Coordinates Copied!' : 'Copy Venue Address' }}</span>
            </button>
          </div>
        </div>

      </div>

      <!-- Section 4: Interactive Artisanal Photo Treasury with ReactBits TrueFocus -->
      <div class="photo-gallery-section reveal-item">
        <div class="section-title-wrap">
          <span class="section-eyebrow">A TREASURY OF SACRED MEMORIES</span>
          <h2 class="section-heading shiny-text">Our Story in Frames</h2>
          <p class="section-subtext">Every glance held a promise, every journey brought us here. Tap any frame to preview or personalize with photos.</p>
        </div>

        <div class="gallery-grid" [class.has-hover]="hoveredPhotoId() !== null">
          @for (photo of photos(); track photo.id) {
            <div
              class="photo-card {{ photo.aspect }} spotlight-card"
              [class.focused]="hoveredPhotoId() === photo.id"
              [class.blurred]="hoveredPhotoId() !== null && hoveredPhotoId() !== photo.id"
              (mouseenter)="hoveredPhotoId.set(photo.id)"
              (mouseleave)="hoveredPhotoId.set(null)"
              (click)="openPhotoModal(photo)"
              (mousemove)="onCardTilt($event, cardEl)"
              (mouseleave)="onCardLeave(cardEl)"
              #cardEl
            >
              <!-- ReactBits Spotlight & Glare Layers -->
              <div class="card-spotlight-layer" aria-hidden="true"></div>
              <div class="card-glare-overlay" aria-hidden="true"></div>

              <!-- Baroque 24K Gold Corner Rosettes -->
              <div class="baroque-corner tl" aria-hidden="true">
                <svg viewBox="0 0 28 28" class="corner-svg"><path d="M2 2 L26 2 C16 4 6 14 2 26 Z" fill="none" stroke="url(#crestGoldGrad)" stroke-width="1.6"/><circle cx="8" cy="8" r="2.5" fill="#dfb25d"/></svg>
              </div>
              <div class="baroque-corner tr" aria-hidden="true">
                <svg viewBox="0 0 28 28" class="corner-svg"><path d="M26 2 L2 2 C12 4 22 14 26 26 Z" fill="none" stroke="url(#crestGoldGrad)" stroke-width="1.6"/><circle cx="20" cy="8" r="2.5" fill="#dfb25d"/></svg>
              </div>
              <div class="baroque-corner bl" aria-hidden="true">
                <svg viewBox="0 0 28 28" class="corner-svg"><path d="M2 26 L26 26 C16 24 6 14 2 2 Z" fill="none" stroke="url(#crestGoldGrad)" stroke-width="1.6"/><circle cx="8" cy="20" r="2.5" fill="#dfb25d"/></svg>
              </div>
              <div class="baroque-corner br" aria-hidden="true">
                <svg viewBox="0 0 28 28" class="corner-svg"><path d="M26 26 L2 26 C12 24 22 14 26 2 Z" fill="none" stroke="url(#crestGoldGrad)" stroke-width="1.6"/><circle cx="20" cy="20" r="2.5" fill="#dfb25d"/></svg>
              </div>

              <div class="photo-frame-content">
                @if (photo.customImgUrl) {
                  <img [src]="photo.customImgUrl" [alt]="photo.title" class="custom-photo-img" />
                } @else {
                  <!-- Handcrafted Royal Art Silhouette Placeholders -->
                  <div class="luxury-placeholder-art artwork-frame-{{ photo.id }}">
                    <div class="art-silhouette-canvas">
                      @switch (photo.id) {
                        @case (1) {
                          <!-- Frame 1: Mandapam & Sacred Vows -->
                          <svg viewBox="0 0 160 160" class="art-svg">
                            <circle cx="80" cy="80" r="70" fill="none" stroke="url(#crestGoldGrad)" stroke-width="1" stroke-dasharray="3 2" opacity="0.5"/>
                            <path d="M30 40 Q80 15 130 40 L130 46 Q80 25 30 46 Z" fill="url(#crestGoldGrad)" opacity="0.6"/>
                            <!-- Couple Silhouette -->
                            <ellipse cx="68" cy="72" rx="12" ry="14" fill="#6e2333" opacity="0.8"/>
                            <path d="M52 135 C52 95 84 95 84 135 Z" fill="#6e2333" opacity="0.8"/>
                            <ellipse cx="94" cy="74" rx="10" ry="12" fill="#8c3346" opacity="0.8"/>
                            <path d="M82 135 C82 100 108 100 108 135 Z" fill="#8c3346" opacity="0.8"/>
                            <circle cx="80" cy="62" r="3" fill="#dfb25d"/>
                          </svg>
                        }
                        @case (2) {
                          <!-- Frame 2: Whispers Under Starlight & Palms -->
                          <svg viewBox="0 0 160 160" class="art-svg">
                            <path d="M125 35 A22 22 0 1 0 145 60 A18 18 0 1 1 125 35 Z" fill="url(#crestGoldGrad)" opacity="0.75"/>
                            <path d="M25 140 Q40 80 70 50 Q60 55 45 62 M70 50 Q85 60 90 70 M70 50 Q65 40 50 35 M70 50 Q75 35 90 35" stroke="url(#crestGoldGrad)" stroke-width="1.8" fill="none" opacity="0.6"/>
                            <ellipse cx="95" cy="100" rx="10" ry="12" fill="#6e2333" opacity="0.8"/>
                            <ellipse cx="115" cy="102" rx="9" ry="11" fill="#8c3346" opacity="0.8"/>
                            <path d="M82 145 C82 118 128 118 128 145 Z" fill="#6e2333" opacity="0.75"/>
                          </svg>
                        }
                        @case (3) {
                          <!-- Frame 3: Traditional Kerala Nilavilakku (Sacred Lamp) -->
                          <svg viewBox="0 0 160 160" class="art-svg">
                            <ellipse cx="80" cy="142" rx="35" ry="8" fill="url(#crestGoldGrad)" opacity="0.6"/>
                            <path d="M76 140 L76 75 L84 75 L84 140 Z" fill="url(#crestGoldGrad)" opacity="0.7"/>
                            <ellipse cx="80" cy="75" rx="30" ry="8" fill="url(#crestGoldGrad)" opacity="0.8"/>
                            <path d="M78 72 Q80 50 80 48 Q82 50 82 72 Z" fill="#dfb25d"/>
                            <circle cx="80" cy="46" r="6" fill="#fae09a" filter="drop-shadow(0 0 8px #dfb25d)"/>
                            <!-- Jasmine Garland -->
                            <path d="M50 78 Q80 98 110 78" fill="none" stroke="#fff8db" stroke-width="3" stroke-dasharray="2 3"/>
                          </svg>
                        }
                        @case (4) {
                          <!-- Frame 4: Sunset Backwaters & Lotus -->
                          <svg viewBox="0 0 160 160" class="art-svg">
                            <circle cx="80" cy="65" r="28" fill="url(#crestGoldGrad)" opacity="0.4"/>
                            <line x1="20" y1="105" x2="140" y2="105" stroke="url(#crestGoldGrad)" stroke-width="1.5" opacity="0.6"/>
                            <line x1="35" y1="118" x2="125" y2="118" stroke="url(#crestGoldGrad)" stroke-width="1" opacity="0.4"/>
                            <line x1="50" y1="130" x2="110" y2="130" stroke="url(#crestGoldGrad)" stroke-width="0.8" opacity="0.3"/>
                            <!-- Couple in Kettuvallam -->
                            <path d="M45 105 Q80 120 115 105 Z" fill="#6e2333" opacity="0.7"/>
                            <circle cx="75" cy="95" r="5" fill="#8c3346"/>
                            <circle cx="85" cy="96" r="4.5" fill="#6e2333"/>
                          </svg>
                        }
                        @case (5) {
                          <!-- Frame 5: Sacred Rings & Garland -->
                          <svg viewBox="0 0 160 160" class="art-svg">
                            <circle cx="68" cy="80" r="22" fill="none" stroke="url(#crestGoldGrad)" stroke-width="3" filter="drop-shadow(0 0 6px rgba(223, 178, 93, 0.6))"/>
                            <circle cx="92" cy="80" r="22" fill="none" stroke="url(#crestGoldGrad)" stroke-width="3" filter="drop-shadow(0 0 6px rgba(223, 178, 93, 0.6))"/>
                            <!-- Diamond Glint -->
                            <polygon points="68,54 71,58 75,58 72,61 73,65 68,62 63,65 64,61 61,58 65,58" fill="#fff8db"/>
                          </svg>
                        }
                        @default {
                          <!-- Frame 6: Grand Procession & Muthukkuda -->
                          <svg viewBox="0 0 160 160" class="art-svg">
                            <path d="M40 70 Q80 25 120 70 Z" fill="url(#crestGoldGrad)" opacity="0.65"/>
                            <line x1="80" y1="70" x2="80" y2="135" stroke="url(#crestGoldGrad)" stroke-width="2.5"/>
                            <!-- Decorative umbrella tassels -->
                            <circle cx="45" cy="74" r="3" fill="#dfb25d"/>
                            <circle cx="62" cy="74" r="3" fill="#dfb25d"/>
                            <circle cx="80" cy="74" r="3" fill="#dfb25d"/>
                            <circle cx="98" cy="74" r="3" fill="#dfb25d"/>
                            <circle cx="115" cy="74" r="3" fill="#dfb25d"/>
                            <ellipse cx="80" cy="25" rx="5" ry="3" fill="#dfb25d"/>
                          </svg>
                        }
                      }
                    </div>
                    <span class="placeholder-badge">{{ photo.placeholderTag }}</span>
                  </div>
                }

                <div class="frame-shimmer" aria-hidden="true"></div>

                <div class="photo-caption-bar">
                  <h4 class="photo-card-title">{{ photo.title }}</h4>
                  <p class="photo-card-sub">{{ photo.subtitle }}</p>
                  <span class="tap-hint">Tap to inspect or personalize &rsaquo;</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Section 5: The Sacred Muhurtham & Event Details -->
      <div class="ceremony-details-section reveal-item">
        <div
          class="ceremony-card spotlight-card"
          (mousemove)="onCardTilt($event, ceremonyRef)"
          (mouseleave)="onCardLeave(ceremonyRef)"
          #ceremonyRef
        >
          <!-- ReactBits Spotlight & Glare Layers -->
          <div class="card-spotlight-layer" aria-hidden="true"></div>
          <div class="card-glare-overlay" aria-hidden="true"></div>
          <div class="card-shimmer-highlight" aria-hidden="true"></div>

          <div class="auspicious-banner">
            <span class="malayalam-script shiny-text">ശുഭ മുഹൂർത്തം</span>
            <span class="banner-sub">Auspicious Wedding Muhurtham</span>
          </div>

          <p class="ceremony-lead">With the blessings of God and the joy of our parents, we invite you to witness our sacred union.</p>

          <div class="ceremony-highlights-grid">
            <div class="highlight-item">
              <div class="hl-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h4 class="hl-title">The Muhurtham</h4>
              <p class="hl-value">10:15 AM &ndash; 11:00 AM</p>
              <p class="hl-note">Sunday, 4 April 2027 (Meenam 21)</p>
            </div>

            <div class="highlight-item">
              <div class="hl-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h4 class="hl-title">The Auditorium</h4>
              <p class="hl-value">St. Paul's Auditorium</p>
              <p class="hl-note">Puthoor, Kottarakkara</p>
            </div>

            <div class="highlight-item">
              <div class="hl-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              </div>
              <h4 class="hl-title">Grand Wedding Feast</h4>
              <p class="hl-value">Kerala Wedding Sadhya</p>
              <p class="hl-note">12:30 PM Onwards</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 6: Celebration Itinerary / Schedule of the Day -->
      <div class="itinerary-section reveal-item">
        <div class="section-title-wrap">
          <span class="section-eyebrow">ORDER OF CELEBRATION</span>
          <h2 class="section-heading">The Day's Journey</h2>
          <p class="section-subtext">A celebration woven with love, sacred customs &amp; joy</p>
        </div>

        <div class="timeline-container">
          <div class="timeline-line" aria-hidden="true"></div>

          <div class="timeline-item left-item">
            <div class="timeline-dot">
              <span class="inner-dot"></span>
            </div>
            <div class="timeline-content">
              <span class="time-badge">09:30 AM</span>
              <h4 class="node-title">Royal Welcome &amp; Panineer</h4>
              <p class="node-desc">Traditional welcoming with fragrant panineer, sandalwood paste &amp; live melody.</p>
            </div>
          </div>

          <div class="timeline-item right-item">
            <div class="timeline-dot special-gold-dot">
              <span class="inner-dot"></span>
            </div>
            <div class="timeline-content highlight-content">
              <span class="time-badge gold-time">10:15 AM</span>
              <h4 class="node-title">Auspicious Wedding Muhurtham</h4>
              <p class="node-desc">The sacred exchange of vows, tying of the sacred knot &amp; garlanding ceremony.</p>
            </div>
          </div>

          <div class="timeline-item left-item">
            <div class="timeline-dot">
              <span class="inner-dot"></span>
            </div>
            <div class="timeline-content">
              <span class="time-badge">11:45 AM</span>
              <h4 class="node-title">Blessings &amp; Royal Portraits</h4>
              <p class="node-desc">Family blessings, photography with friends &amp; capturing unforgettable memories.</p>
            </div>
          </div>

          <div class="timeline-item right-item">
            <div class="timeline-dot">
              <span class="inner-dot"></span>
            </div>
            <div class="timeline-content">
              <span class="time-badge">12:30 PM</span>
              <h4 class="node-title">The Grand Traditional Sadhya</h4>
              <p class="node-desc">A lavish multi-course Kerala wedding feast served with authentic payasam.</p>
            </div>
          </div>

          <div class="timeline-item left-item">
            <div class="timeline-dot">
              <span class="inner-dot"></span>
            </div>
            <div class="timeline-content">
              <span class="time-badge">02:30 PM</span>
              <h4 class="node-title">Joyous Celebrations &amp; Send-Off</h4>
              <p class="node-desc">Sweet goodbyes, warm hugs &amp; beginning our new journey as husband and wife.</p>
            </div>
          </div>

        </div>
      </div>

      <!-- Section 7: Love Story Milestones -->
      <div class="story-milestones-section reveal-item">
        <div class="section-title-wrap">
          <span class="section-eyebrow">OUR PATHWAY TO FOREVER</span>
          <h2 class="section-heading">How Two Worlds Met</h2>
        </div>

        <div class="story-cards-grid">
          <div
            class="story-card spotlight-card"
            (mousemove)="onCardTilt($event, s1)"
            (mouseleave)="onCardLeave(s1)"
            #s1
          >
            <div class="card-spotlight-layer" aria-hidden="true"></div>
            <div class="card-glare-overlay" aria-hidden="true"></div>
            <div class="story-chapter-num">CHAPTER I</div>
            <h4 class="story-heading shiny-text">The Unplanned Hello</h4>
            <p class="story-text">What started as a simple conversation turned into endless hours of laughing, understanding each other's quirks, and realizing some people just feel like home.</p>
          </div>

          <div
            class="story-card spotlight-card"
            (mousemove)="onCardTilt($event, s2)"
            (mouseleave)="onCardLeave(s2)"
            #s2
          >
            <div class="card-spotlight-layer" aria-hidden="true"></div>
            <div class="card-glare-overlay" aria-hidden="true"></div>
            <div class="story-chapter-num">CHAPTER II</div>
            <h4 class="story-heading shiny-text">A Thousand Little Moments</h4>
            <p class="story-text">From celebrating the smallest wins to standing strong through every storm, every cup of tea and late-night chat brought our souls closer together.</p>
          </div>

          <div
            class="story-card spotlight-card"
            (mousemove)="onCardTilt($event, s3)"
            (mouseleave)="onCardLeave(s3)"
            #s3
          >
            <div class="card-spotlight-layer" aria-hidden="true"></div>
            <div class="card-glare-overlay" aria-hidden="true"></div>
            <div class="story-chapter-num">CHAPTER III</div>
            <h4 class="story-heading shiny-text">The Forever Promise</h4>
            <p class="story-text">Surrounded by love and dreams of tomorrow, we chose each other. Not just for today, but for every sunrise and starlit night that follows.</p>
          </div>
        </div>
      </div>

      <!-- Section 8: Interactive Blessings & Guestbook Wall -->
      <div class="guestbook-section reveal-item">
        <div class="section-title-wrap">
          <span class="section-eyebrow">WALL OF LOVE</span>
          <h2 class="section-heading">Leave a Blessing for Ammu &amp; Ajith</h2>
          <p class="section-subtext">Your warm words and prayers are the greatest gift on our special day.</p>
        </div>

        <!-- Input Box -->
        <div
          class="blessing-form-card spotlight-card"
          (mousemove)="onCardTilt($event, gbRef)"
          (mouseleave)="onCardLeave(gbRef)"
          #gbRef
        >
          <div class="card-spotlight-layer" aria-hidden="true"></div>
          <div class="card-glare-overlay" aria-hidden="true"></div>
          <div class="form-row">
            <input
              type="text"
              class="gold-input"
              [(ngModel)]="newGuestName"
              placeholder="Your Full Name"
              maxlength="40"
              aria-label="Your Name"
            />
            
            <div class="reaction-picker">
              @for (emoji of reactions; track emoji) {
                <button
                  type="button"
                  class="reaction-btn"
                  [class.active]="selectedReaction() === emoji"
                  (click)="selectedReaction.set(emoji)"
                >
                  {{ emoji }}
                </button>
              }
            </div>
          </div>

          <textarea
            class="gold-textarea"
            [(ngModel)]="newGuestMessage"
            placeholder="Write your heartfelt blessing, wishes or favorite memory for Ammu & Ajith..."
            rows="3"
            maxlength="280"
            aria-label="Blessing Message"
          ></textarea>

          <div class="form-submit-row">
            <button
              type="button"
              class="send-blessing-btn specular-btn star-border-btn"
              [disabled]="!canSubmitBlessing()"
              (click)="submitBlessing()"
              (mousemove)="onBtnMouseMove($event, sendBlessingRef)"
              (mouseleave)="onBtnMouseLeave(sendBlessingRef)"
              #sendBlessingRef
            >
              <div class="btn-shine-sweep" aria-hidden="true"></div>
              <span>Send Royal Blessing ✨</span>
            </button>
            
            @if (blessingSubmitted()) {
              <span class="blessing-toast">Thank you! Your blessing was added to our wall of love 💖</span>
            }
          </div>
        </div>

        <!-- Live Blessing Cards Carousel / Wall -->
        <div class="blessings-wall-grid">
          @for (b of blessings(); track b.id) {
            <div class="blessing-bubble">
              <div class="bubble-header">
                <span class="bubble-reaction">{{ b.reaction }}</span>
                <span class="bubble-author">{{ b.name }}</span>
                <span class="bubble-date">{{ b.dateStr }}</span>
              </div>
              <p class="bubble-msg">&ldquo;{{ b.message }}&rdquo;</p>
              
              <button
                type="button"
                class="forward-wa-btn"
                (click)="shareBlessingOnWa(b)"
                title="Send this blessing to Ammu & Ajith on WhatsApp"
              >
                <span>Forward to WhatsApp &rsaquo;</span>
              </button>
            </div>
          }
        </div>
      </div>

      <!-- Section 9: Royal Grand Sign-off & Footer -->
      <footer class="grand-footer reveal-item">
        <div class="footer-crest-symbol" aria-hidden="true">
          <svg viewBox="0 0 60 60" class="mini-crest">
            <polygon points="30,5 55,30 30,55 5,30" stroke="url(#crestGoldGrad)" stroke-width="1.5" fill="none"/>
            <polygon points="30,12 48,30 30,48 12,30" stroke="url(#crestGoldGrad)" stroke-width="0.8" fill="rgba(223, 178, 93, 0.1)"/>
            <circle cx="30" cy="30" r="4" fill="url(#crestGoldGrad)"/>
          </svg>
        </div>

        <p class="footer-blessing-text">We cannot wait to celebrate this milestone with you</p>
        <p class="footer-signoff-names">With love, Ammu &amp; Ajith</p>
        <p class="footer-coordinates">08&deg;59'N, 76&deg;46'E &bull; Puthoor &bull; Kottarakkara &bull; Kerala</p>
        <p class="footer-credit">Handcrafted with celebration &bull; April 2027</p>
      </footer>

      <!-- Lightbox Modal for Photo Placeholders & Image Upload -->
      @if (selectedPhoto()) {
        <div class="modal-backdrop" (click)="closePhotoModal()" role="dialog" aria-modal="true">
          <div class="modal-dialog photo-modal-dialog" (click)="$event.stopPropagation()">
            <button type="button" class="modal-close-btn" (click)="closePhotoModal()" aria-label="Close modal">&times;</button>
            
            <h3 class="modal-title">{{ selectedPhoto()?.title }}</h3>
            <p class="modal-sub">{{ selectedPhoto()?.subtitle }}</p>

            <div class="modal-preview-frame">
              @if (selectedPhoto()?.customImgUrl) {
                <img [src]="selectedPhoto()?.customImgUrl" alt="Preview" class="modal-img-preview" />
              } @else {
                <div class="modal-placeholder-box">
                  <svg viewBox="0 0 64 64" class="modal-cam-svg">
                    <circle cx="32" cy="32" r="28" stroke="url(#crestGoldGrad)" stroke-width="1.2" stroke-dasharray="4 2" fill="none" opacity="0.4"/>
                    <path d="M22 26 L26 20 L38 20 L42 26 L50 26 C52.2 26 54 27.8 54 30 L54 48 C54 50.2 52.2 52 50 52 L14 52 C11.8 52 10 50.2 10 48 L10 30 C10 27.8 11.8 26 14 26 Z" stroke="url(#crestGoldGrad)" stroke-width="1.8" fill="rgba(223, 178, 93, 0.1)"/>
                    <circle cx="32" cy="39" r="8" stroke="url(#crestGoldGrad)" stroke-width="1.8" fill="none"/>
                  </svg>
                  <p class="modal-box-tip">{{ selectedPhoto()?.placeholderTag }}</p>
                  <span class="modal-sub-tip">Click below to upload and preview a real photo in this slot!</span>
                </div>
              }
            </div>

            <div class="modal-upload-controls">
              <label class="custom-file-upload-btn">
                <input type="file" accept="image/*" (change)="onFileSelected($event)" hidden />
                <span>📷 Upload Real Photo Here</span>
              </label>

              @if (selectedPhoto()?.customImgUrl) {
                <button type="button" class="reset-photo-btn" (click)="resetCustomPhoto()">
                  <span>Reset to Placeholder</span>
                </button>
              }
            </div>
          </div>
        </div>
      }

      <!-- Shared SVG Gradient Definitions -->
      <svg width="0" height="0" class="svg-defs">
        <defs>
          <linearGradient id="crestGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fff5db" />
            <stop offset="35%" stop-color="#fae09a" />
            <stop offset="70%" stop-color="#dfa84a" />
            <stop offset="100%" stop-color="#8a5214" />
          </linearGradient>
        </defs>
      </svg>

    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      position: relative;
      z-index: 10;
    }

    .luxury-details-container {
      width: 100%;
      max-width: 1080px;
      margin: 0 auto;
      padding: 40px 24px 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 56px;
      box-sizing: border-box;
      position: relative;
    }

    /* Ambient Audio Controller Bar */
    .audio-control-bar {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-bottom: -15px;
    }

    .audio-toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 10px 22px;
      border-radius: 40px;
      background: rgba(255, 255, 255, 0.85);
      border: 1.5px solid rgba(212, 155, 80, 0.45);
      color: #3b141d;
      font-family: var(--font-sans);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.04em;
      cursor: pointer;
      backdrop-filter: blur(16px);
      box-shadow: 0 8px 24px rgba(184, 107, 88, 0.14), inset 0 1px 0 #ffffff;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        transform: translateY(-2px);
        border-color: rgba(212, 155, 80, 0.85);
        box-shadow: 0 12px 30px rgba(184, 107, 88, 0.22);
      }

      &.playing {
        border-color: #25a26b;
        color: #0d4a2f;
        background: rgba(255, 255, 255, 0.95);
        box-shadow: 0 8px 24px rgba(37, 162, 107, 0.25);

        .sound-wave .bar {
          animation: wavePulse 1s ease-in-out infinite alternate;
        }
      }
    }

    .sound-wave {
      display: flex;
      align-items: flex-end;
      gap: 3px;
      height: 14px;

      .bar {
        width: 3px;
        background: currentColor;
        border-radius: 2px;
        height: 4px;
      }
      .bar-1 { height: 6px; }
      .bar-2 { height: 12px; }
      .bar-3 { height: 9px; }
      .bar-4 { height: 14px; }
    }

    @keyframes wavePulse {
      0% { height: 3px; }
      100% { height: 14px; }
    }

    /* Section 1: Royal Monogram & Greeting */
    .royal-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 100%;
      max-width: 760px;
      gap: 14px;
    }

    .monogram-crest {
      width: 90px;
      height: 90px;
      margin-bottom: 4px;
      cursor: pointer;
      transform-style: preserve-3d;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);

      .crest-svg {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 6px 16px rgba(184, 107, 88, 0.25));
      }

      .monogram-text {
        font-family: var(--font-royal);
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 0.1em;
        fill: url(#crestGoldGrad);
      }
    }

    .family-invitation {
      font-family: var(--font-sans);
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.22em;
      color: #7d2e3e;
      font-weight: 700;
    }

    .couple-title {
      font-family: var(--font-royal);
      font-size: clamp(38px, 8vw, 68px);
      font-weight: 700;
      background: linear-gradient(110deg, #2b0e16 0%, #6e2433 25%, #b57424 50%, #6e2433 75%, #2b0e16 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 0.04em;
      line-height: 1.1;
      filter: drop-shadow(0 4px 14px rgba(184, 107, 88, 0.15));
    }

    .wedding-tagline {
      font-family: var(--font-caveat);
      font-size: clamp(20px, 4.5vw, 27px);
      color: #54212d;
      max-width: 600px;
      line-height: 1.4;
    }

    .ornate-gold-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 220px;
      gap: 12px;
      margin-top: 8px;

      .divider-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(181, 116, 36, 0.5), transparent);
      }

      .divider-diamond {
        width: 14px;
        height: 14px;
        background: #b57424;
        transform: rotate(45deg);
        box-shadow: 0 0 10px rgba(181, 116, 36, 0.4);
      }
    }

    /* ========================================================
       ReactBits Creative Components Suite:
       - Spotlight Card (Cursor Tracking Mesh Glow)
       - Glare Overlay (Specular Reflection)
       - Border Beam (Luminous Orbiting Edge Light)
       - Star Border Button (Orbiting Conic Glow)
       - Shiny Text (Metallic 24k Gold Sweep)
       - True Focus (Depth of Field Defocus on Sibling Cards)
       - Specular Magnetic Buttons
       ======================================================== */
    .spotlight-card {
      position: relative;
      overflow: hidden;
      --mouse-x: 50%;
      --mouse-y: 50%;
    }

    .card-spotlight-layer {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      z-index: 1;
      opacity: 0;
      transition: opacity 0.35s ease;
      background: radial-gradient(
        420px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
        rgba(254, 215, 170, 0.45),
        transparent 75%
      );
    }

    .card-glare-overlay {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      z-index: 1;
      opacity: 0;
      transition: opacity 0.35s ease;
      background: radial-gradient(
        320px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
        rgba(255, 255, 255, 0.55),
        transparent 65%
      );
    }

    .spotlight-card:hover .card-spotlight-layer,
    .spotlight-card:hover .card-glare-overlay {
      opacity: 1;
    }

    /* ReactBits Radiant Border Beam */
    .border-beam-ring {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      overflow: hidden;
      z-index: 2;

      &::after {
        content: '';
        position: absolute;
        top: -100%;
        left: -100%;
        width: 300%;
        height: 300%;
        background: conic-gradient(
          from 0deg at 50% 50%,
          transparent 0deg,
          transparent 40deg,
          rgba(255, 245, 220, 0.9) 55deg,
          rgba(212, 155, 80, 0.95) 70deg,
          transparent 90deg,
          transparent 360deg
        );
        animation: rotateBorderBeam 8s linear infinite;
        mask: radial-gradient(transparent calc(100% - 3px), black calc(100% - 2px));
        -webkit-mask: radial-gradient(transparent calc(100% - 3px), black calc(100% - 2px));
      }
    }

    @keyframes rotateBorderBeam {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* ReactBits Shiny Text Animation */
    .shiny-text {
      background: linear-gradient(
        110deg,
        #2b0e16 0%,
        #6e2433 25%,
        #b57424 50%,
        #6e2433 75%,
        #2b0e16 100%
      );
      background-size: 250% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shinyTextSweep 5s ease-in-out infinite;
    }

    @keyframes shinyTextSweep {
      0% {
        background-position: 250% center;
      }
      100% {
        background-position: -250% center;
      }
    }

    /* ReactBits Specular Magnetic Button */
    .specular-btn {
      position: relative;
      overflow: hidden;
      transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
      will-change: transform;

      .btn-shine-sweep {
        position: absolute;
        top: 0;
        left: -120%;
        width: 70%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.45),
          transparent
        );
        transform: skewX(-22deg);
        pointer-events: none;
        animation: btnShineSweep 4s ease-in-out infinite;
      }
    }

    @keyframes btnShineSweep {
      0% { left: -120%; }
      30% { left: 180%; }
      100% { left: 180%; }
    }

    /* ReactBits Star Border Glowing Orbit */
    .star-border-btn {
      position: relative;
      overflow: hidden;
      z-index: 1;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 250%;
        height: 250%;
        background: conic-gradient(
          from 0deg,
          transparent 0%,
          rgba(255, 255, 255, 0.95) 12%,
          rgba(212, 155, 80, 0.95) 20%,
          transparent 28%,
          transparent 100%
        );
        animation: starBorderOrbit 4s linear infinite;
        z-index: -2;
        pointer-events: none;
      }

      &::after {
        content: '';
        position: absolute;
        inset: 1.5px;
        background: inherit;
        border-radius: inherit;
        z-index: -1;
        pointer-events: none;
      }
    }

    @keyframes starBorderOrbit {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }

    /* ReactBits Blur Text Reveal */
    .blur-text-reveal {
      animation: blurTextReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    @keyframes blurTextReveal {
      0% {
        filter: blur(12px);
        opacity: 0;
        transform: translateY(12px) scale(0.96);
      }
      100% {
        filter: blur(0px);
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* ReactBits True Focus Depth Effect */
    .ceremony-highlights-grid,
    .story-cards-grid,
    .gallery-grid,
    .timeline-container {
      transition: filter 0.3s ease;
    }

    .ceremony-highlights-grid:hover .highlight-item:not(:hover),
    .story-cards-grid:hover .story-card:not(:hover),
    .gallery-grid:hover .photo-card:not(:hover),
    .timeline-container:hover .timeline-item:not(:hover) .timeline-content {
      filter: blur(1.5px) opacity(0.52);
      transform: scale(0.98);
      transition: filter 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
    }

    .highlight-item,
    .story-card,
    .photo-card,
    .timeline-content {
      transition: filter 0.3s ease, opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    }

    /* Section 2: Redesigned Royal Astrological Chronometer */
    .chronometer-card {
      position: relative;
      width: 100%;
      max-width: 760px;
      padding: 48px 36px 40px;
      border-radius: 44px 44px 28px 28px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(255, 246, 240, 0.86) 100%);
      border: 1.5px solid rgba(212, 155, 80, 0.45);
      box-shadow: 0 24px 60px rgba(184, 107, 88, 0.16), 0 0 35px rgba(223, 178, 93, 0.18), inset 0 1.5px 0 #ffffff;
      backdrop-filter: blur(24px);
      text-align: center;
      transform-style: preserve-3d;
      transform: perspective(1000px) rotateX(calc(var(--scroll-vel, 0) * -0.06deg)) translateY(calc(var(--scroll-vel, 0) * 0.12px));
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease-out;

      &:hover {
        box-shadow: 0 32px 80px rgba(184, 107, 88, 0.24), 0 0 50px rgba(223, 178, 93, 0.28);
      }
    }

    .chronometer-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 20px;
      border-radius: 30px;
      background: rgba(240, 180, 160, 0.25);
      border: 1px solid rgba(190, 110, 75, 0.35);
      color: #6e2333;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-weight: 700;
      margin-bottom: 14px;

      .badge-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #b57424;
        box-shadow: 0 0 8px #b57424;
      }
    }

    .chronometer-heading {
      font-family: var(--font-royal);
      font-size: clamp(24px, 5vw, 34px);
      font-weight: 700;
      color: #2b0e16;
      letter-spacing: 0.06em;
      margin-bottom: 8px;
    }

    .chronometer-date-str {
      font-family: var(--font-sans);
      font-size: 13px;
      letter-spacing: 0.12em;
      color: #7d3343;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;

      .date-ornament {
        color: #b57424;
        font-size: 11px;
      }
    }

    .dials-grid {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: clamp(8px, 2.5vw, 18px);
      margin-bottom: 34px;
    }

    .cathedral-arch-dial {
      flex: 1;
      max-width: 125px;
      min-width: 74px;
      padding: 16px 8px 14px;
      border-radius: 44px 44px 18px 18px;
      background: linear-gradient(180deg, #ffffff 0%, #fff7f2 100%);
      border: 1.5px solid rgba(212, 155, 80, 0.48);
      box-shadow: 0 12px 28px rgba(184, 107, 88, 0.14), inset 0 1.5px 0 #ffffff;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;

      &.seconds-box {
        border-color: rgba(212, 155, 80, 0.7);
        background: linear-gradient(180deg, #ffffff 0%, #ffefe6 100%);
      }
    }

    .dials-grid .dial-box:nth-child(1) {
      transform: perspective(600px) translateY(calc(var(--scroll-vel, 0) * 0.08px));
    }
    .dials-grid .dial-box:nth-child(3) {
      transform: perspective(600px) translateY(calc(var(--scroll-vel, 0) * 0.14px));
    }
    .dials-grid .dial-box:nth-child(5) {
      transform: perspective(600px) translateY(calc(var(--scroll-vel, 0) * 0.20px));
    }
    .dials-grid .dial-box:nth-child(7) {
      transform: perspective(600px) translateY(calc(var(--scroll-vel, 0) * 0.26px));
    }

    .arch-apex-crest {
      font-size: 13px;
      color: #b57424;
      line-height: 1;
      margin-bottom: 2px;
      text-shadow: 0 0 6px rgba(212, 155, 80, 0.5);

      &.pulse-crest {
        animation: dialHaloPulse 1.8s ease-in-out infinite;
      }
    }

    .dial-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      width: 100%;
    }

    .dial-num {
      font-family: var(--font-royal);
      font-size: clamp(34px, 7.5vw, 56px);
      font-weight: 800;
      line-height: 1;
      background: linear-gradient(180deg, #2b0e16 0%, #6e2433 35%, #a6651b 75%, #704108 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 2px 6px rgba(184, 107, 88, 0.2));
    }

    .dial-unit-tag {
      font-family: var(--font-sans);
      font-size: clamp(9.5px, 2vw, 11px);
      letter-spacing: 0.18em;
      color: #7d3141;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 10px;
      background: rgba(212, 155, 80, 0.12);
      border: 1px solid rgba(212, 155, 80, 0.3);

      &.seconds-tag {
        background: rgba(212, 155, 80, 0.2);
        border-color: rgba(212, 155, 80, 0.5);
      }
    }

    .arch-gold-trim {
      position: absolute;
      inset: 3px;
      border-radius: 40px 40px 14px 14px;
      border: 1px solid rgba(212, 155, 80, 0.2);
      pointer-events: none;
    }

    .dial-separator {
      font-size: clamp(14px, 3.5vw, 20px);
      color: rgba(181, 116, 36, 0.65);
      margin-top: -6px;
    }

    .seconds-halo-rings {
      position: absolute;
      inset: -2px;
      border-radius: inherit;
      border: 1.5px solid rgba(212, 155, 80, 0.6);
      animation: dialHaloPulse 1.8s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes dialHaloPulse {
      0%, 100% { opacity: 0.25; transform: scale(1); }
      50% { opacity: 0.85; transform: scale(1.03); }
    }

    .calendar-action-bar {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    /* ReactBits StarBorder Animation */
    .star-border-btn-wrap {
      position: relative;
      display: inline-flex;
      border-radius: 34px;
      padding: 1.5px;
      overflow: hidden;

      .star-border-beam {
        position: absolute;
        inset: -150%;
        background: conic-gradient(from 0deg, transparent 0deg, transparent 315deg, #dfb25d 340deg, #fff8db 360deg);
        animation: starBorderSpin 4s linear infinite;
        pointer-events: none;
      }
    }

    @keyframes starBorderSpin {
      100% { transform: rotate(360deg); }
    }

    .calendar-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 28px;
      border-radius: 32px;
      background: linear-gradient(135deg, #ffffff 0%, #fff2eb 100%);
      border: 1px solid rgba(212, 155, 80, 0.5);
      color: #3b141d;
      font-family: var(--font-sans);
      font-size: 13.5px;
      font-weight: 700;
      letter-spacing: 0.04em;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(184, 107, 88, 0.14);
      transition: all 0.25s ease;
      position: relative;
      z-index: 1;

      &:hover {
        background: linear-gradient(135deg, #ffffff 0%, #fae2d6 100%);
        border-color: rgba(212, 155, 80, 0.8);
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(184, 107, 88, 0.22);
      }

      .cal-icon {
        width: 17px;
        height: 17px;
        stroke: #a6651b;
      }
    }

    /* ========================================================
       ReactBits Kinetic ScrollVelocity Royal Silk Ribbon Banner
       - Infinite Counter-Scrolling Silk Ribbons
       - Reacts to Scroll Velocity: accelerates and skews dynamically
       ======================================================== */
    .royal-velocity-ribbon-stage {
      position: relative;
      width: 100vw;
      margin-left: calc(-50vw + 50%);
      margin-right: calc(-50vw + 50%);
      overflow: hidden;
      padding: 16px 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: linear-gradient(90deg, rgba(254, 224, 210, 0.45) 0%, rgba(255, 245, 238, 0.88) 50%, rgba(254, 224, 210, 0.45) 100%);
      border-top: 1px solid rgba(212, 155, 80, 0.35);
      border-bottom: 1px solid rgba(212, 155, 80, 0.35);
      box-shadow: 0 4px 24px rgba(184, 107, 88, 0.08), inset 0 1px 0 #ffffff;
      margin-top: 8px;
      margin-bottom: 8px;
      mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
      -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);

      .ribbon-glow-line {
        position: absolute;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent 0%, #dfb25d 30%, #fff3c4 50%, #dfb25d 70%, transparent 100%);
        opacity: 0.75;

        &.top-line { top: 0; }
        &.bottom-line { bottom: 0; }
      }

      .velocity-track {
        display: flex;
        white-space: nowrap;
        will-change: transform;
        user-select: none;
        pointer-events: none;
        transition: transform 0.08s linear;

        .track-inner {
          display: flex;
          flex-shrink: 0;
          gap: 32px;
        }

        .ribbon-phrase {
          font-family: var(--font-royal);
          font-size: clamp(12.5px, 1.6vw, 15px);
          font-weight: 700;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #6e2333;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8), 0 0 12px rgba(223, 178, 93, 0.25);

          &.sub-phrase {
            font-family: var(--font-sans);
            font-size: clamp(11px, 1.3vw, 13px);
            font-weight: 600;
            letter-spacing: 0.18em;
            color: #944d5c;
          }
        }
      }
    }

    /* Section 3: Redesigned Action Suite */
    .action-suite-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 28px;
      width: 100%;
      max-width: 960px;
    }

    .suite-card {
      padding: 38px 30px 32px;
      border-radius: 28px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      text-align: left;
      backdrop-filter: blur(24px);
      transform-style: preserve-3d;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease-out;
      position: relative;

      &.rsvp-suite-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(255, 248, 242, 0.88) 100%);
        border: 1.5px solid rgba(26, 115, 76, 0.38);
        box-shadow: 0 24px 54px rgba(184, 107, 88, 0.15), 0 8px 24px rgba(26, 115, 76, 0.08), inset 0 1.5px 0 #ffffff;
        transform: perspective(1000px) rotateX(calc(var(--scroll-vel, 0) * -0.05deg)) translateY(calc(var(--scroll-vel, 0) * 0.09px));

        &:hover {
          box-shadow: 0 30px 72px rgba(184, 107, 88, 0.22), 0 0 40px rgba(46, 196, 134, 0.25);
        }
      }

      &.venue-suite-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(255, 246, 240, 0.88) 100%);
        border: 1.5px solid rgba(212, 155, 80, 0.45);
        border-radius: 44px 44px 28px 28px;
        box-shadow: 0 24px 54px rgba(184, 107, 88, 0.16), inset 0 1.5px 0 #ffffff;
        transform: perspective(1000px) rotateX(calc(var(--scroll-vel, 0) * -0.05deg)) translateY(calc(var(--scroll-vel, 0) * 0.13px));

        &:hover {
          box-shadow: 0 30px 72px rgba(184, 107, 88, 0.24), 0 0 40px rgba(223, 178, 93, 0.25);
        }
      }
    }

    /* 3D Sculpted Royal Wax Seal */
    .wax-seal-ornament {
      position: absolute;
      top: -18px;
      right: 28px;
      z-index: 10;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      align-items: center;

      .wax-seal-stamp {
        width: 58px;
        height: 58px;
        border-radius: 50% / 48% 52% 49% 51%;
        background: radial-gradient(circle at 35% 35%, #a61c36 0%, #750f24 55%, #420410 100%);
        box-shadow: 0 8px 22px rgba(100, 10, 25, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.45), inset 0 -3px 6px rgba(0, 0, 0, 0.6);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .wax-outer-rim {
        position: absolute;
        inset: 2px;
        border-radius: 50%;
        border: 1.2px solid rgba(255, 216, 133, 0.35);
      }

      .wax-inner-bed {
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .wax-crest-svg {
        width: 100%;
        height: 100%;
      }

      .wax-monogram {
        font-family: var(--font-royal);
        font-size: 14px;
        font-weight: 800;
        fill: #ffd885;
        letter-spacing: 0.05em;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.7));
      }

      .wax-gloss-highlight {
        position: absolute;
        top: 6px;
        left: 10px;
        width: 18px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: rotate(-30deg);
        filter: blur(1.5px);
      }

      .wax-seal-ribbons {
        position: absolute;
        top: 36px;
        display: flex;
        gap: 6px;
        z-index: -1;
      }

      .wax-ribbon {
        width: 14px;
        height: 38px;
        background: linear-gradient(180deg, #750f24 0%, #4a0614 100%);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
        clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 80%, 0% 100%);
        transform-origin: top center;
        will-change: transform;
        transition: transform 0.08s linear;

        &.ribbon-right {
          background: linear-gradient(180deg, #8a152d 0%, #540817 100%);
        }
      }
    }

    .suite-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;

      .badge-icon {
        width: 14px;
        height: 14px;
      }

      &.emerald-badge {
        background: rgba(26, 115, 76, 0.12);
        border: 1px solid rgba(26, 115, 76, 0.38);
        color: #0e4f32;
      }

      &.gold-badge {
        background: rgba(240, 180, 160, 0.25);
        border: 1px solid rgba(190, 110, 75, 0.35);
        color: #6e2333;
      }
    }

    .suite-title {
      font-family: var(--font-royal);
      font-size: clamp(21px, 4.2vw, 25px);
      font-weight: 700;
      color: #2b0e16;
      line-height: 1.25;
    }

    .suite-desc {
      font-family: var(--font-sans);
      font-size: 13.5px;
      color: #54212d;
      line-height: 1.55;
    }

    /* Imperial Hairline Underline Form */
    .rsvp-inline-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
      width: 100%;
      margin-top: 6px;
    }

    .imperial-field-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }

    .imperial-field-label {
      font-family: var(--font-royal);
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #5c1e28;
    }

    .hairline-input-wrap {
      position: relative;
      width: 100%;
    }

    .imperial-hairline-input {
      width: 100%;
      padding: 10px 4px;
      background: transparent;
      border: none;
      border-bottom: 1.5px solid rgba(212, 155, 80, 0.45);
      color: #2b0e16;
      font-family: var(--font-serif);
      font-size: 16px;
      outline: none;
      transition: border-color 0.25s ease;

      &:focus {
        border-color: #a6651b;
      }

      &::placeholder {
        color: rgba(84, 33, 45, 0.4);
        font-family: var(--font-sans);
        font-size: 14px;
      }
    }

    .hairline-glow-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, #dfb25d 50%, transparent);
      transform: scaleX(0);
      transform-origin: center;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 0 10px rgba(223, 178, 93, 0.8);
      pointer-events: none;
    }

    .imperial-hairline-input:focus + .hairline-glow-bar {
      transform: scaleX(1);
    }

    .field-error {
      font-family: var(--font-sans);
      font-size: 12px;
      color: #c92a2a;
      font-weight: 600;
    }

    /* Velvet Attendance Badges */
    .velvet-badge-toggle {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .velvet-badge-btn {
      flex: 1;
      min-width: 140px;
      padding: 12px 16px;
      border-radius: 14px;
      background: #ffffff;
      border: 1.5px solid rgba(212, 155, 80, 0.38);
      color: #54212d;
      font-family: var(--font-royal);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.04em;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(184, 107, 88, 0.08);
      transition: all 0.25s ease;

      .velvet-icon {
        font-size: 14px;
      }

      &.emerald-velvet:hover,
      &.emerald-velvet.active {
        background: linear-gradient(135deg, #093c24 0%, #13663e 50%, #0a331f 100%);
        border-color: #2ec486;
        color: #ffffff;
        box-shadow: 0 8px 24px rgba(19, 102, 62, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.35);
      }

      &.rose-velvet:hover,
      &.rose-velvet.active {
        background: linear-gradient(135deg, #6b1d2e 0%, #8c2e42 50%, #521220 100%);
        border-color: #dfb25d;
        color: #ffffff;
        box-shadow: 0 8px 24px rgba(140, 46, 66, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.35);
      }
    }

    /* Kerala Sovereign Minted Coins */
    .count-label-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .seat-count-tag {
      font-family: var(--font-sans);
      font-size: 11.5px;
      font-weight: 700;
      color: #0e4f32;
      background: rgba(26, 115, 76, 0.12);
      border: 1px solid rgba(26, 115, 76, 0.3);
      padding: 2px 10px;
      border-radius: 12px;
    }

    .sovereign-coins-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 4px;
    }

    .sovereign-coin-btn {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ffffff 0%, #fff4db 50%, #fae2b8 100%);
      border: 1.5px solid rgba(212, 155, 80, 0.55);
      box-shadow: 0 6px 16px rgba(184, 107, 88, 0.12), inset 0 1px 0 #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

      .coin-face {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .coin-num {
        font-family: var(--font-royal);
        font-size: 16px;
        font-weight: 800;
        color: #54212d;
        line-height: 1;
      }

      .coin-sub {
        font-family: var(--font-sans);
        font-size: 8px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #7d3343;
        margin-top: 1px;
      }

      &:hover {
        transform: translateY(-2px) scale(1.05);
        border-color: rgba(212, 155, 80, 0.85);
        box-shadow: 0 8px 20px rgba(184, 107, 88, 0.2);
      }

      &.active {
        background: linear-gradient(135deg, #093c24 0%, #13663e 50%, #0a331f 100%);
        border-color: #2ec486;
        box-shadow: 0 8px 24px rgba(19, 102, 62, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4);
        transform: scale(1.1) translateY(-2px);

        .coin-num {
          color: #ffd885;
          text-shadow: 0 0 8px rgba(255, 216, 133, 0.6);
        }

        .coin-sub {
          color: #ffffff;
        }
      }
    }

    /* Grand Emerald Velvet WhatsApp CTA */
    .rsvp-submit-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 8px;
      width: 100%;
    }

    .grand-cta-border-wrap {
      position: relative;
      width: 100%;
      border-radius: 36px;
      padding: 2px;
      overflow: hidden;
      box-shadow: 0 12px 32px rgba(19, 102, 62, 0.35);

      .star-border-beam {
        position: absolute;
        inset: -150%;
        background: conic-gradient(from 0deg, transparent 0deg, transparent 315deg, #dfb25d 340deg, #fff8db 360deg);
        animation: starBorderSpin 3.5s linear infinite;
        pointer-events: none;
      }
    }

    .grand-emerald-cta-btn {
      width: 100%;
      padding: 16px 22px;
      border-radius: 34px;
      background: linear-gradient(135deg, #08331f 0%, #105934 50%, #082d1c 100%);
      border: 1px solid rgba(46, 196, 134, 0.6);
      color: #ffffff;
      font-family: var(--font-royal);
      font-size: clamp(12px, 2.2vw, 13.5px);
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 10px;
      cursor: pointer;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      position: relative;
      z-index: 1;
      overflow: hidden;
      transition: all 0.25s ease;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        background: linear-gradient(135deg, #0d462b 0%, #157343 50%, #0a3a24 100%);
      }

      &:disabled {
        opacity: 0.6;
        cursor: wait;
      }

      .wa-btn-icon {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        fill: #ffd885;
        filter: drop-shadow(0 0 6px rgba(255, 216, 133, 0.6));
      }

      .cta-text {
        white-space: nowrap;
      }
    }

    /* Live WhatsApp Message Preview */
    .live-scroll-preview {
      width: 100%;
      border-radius: 14px;
      background: rgba(255, 252, 245, 0.95);
      border: 1.2px dashed rgba(212, 155, 80, 0.55);
      padding: 14px 16px;
      font-family: var(--font-sans);
      box-shadow: 0 4px 14px rgba(184, 107, 88, 0.08);

      .preview-badge {
        font-size: 10.5px;
        font-weight: 800;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #8c4e14;
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 6px;

        .preview-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2ec486;
          box-shadow: 0 0 6px #2ec486;
        }
      }

      .preview-quote-box {
        font-size: 12.5px;
        color: #3d141e;
        line-height: 1.55;

        strong {
          color: #2b0e16;
        }
        em {
          color: #0e4f32;
          font-style: normal;
          font-weight: 600;
        }
      }
    }

    .quick-tap-rsvp-link {
      font-family: var(--font-sans);
      font-size: 12px;
      color: #0e4f32;
      font-weight: 700;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: #18734c;
        text-decoration: underline;
      }
    }

    /* Confirmed Panel */
    .rsvp-confirmed-panel {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
      padding: 24px;
      border-radius: 20px;
      background: #ffffff;
      border: 1.5px solid rgba(26, 115, 76, 0.45);
      box-shadow: 0 10px 30px rgba(26, 115, 76, 0.12);
    }

    .confirmed-header {
      display: flex;
      align-items: center;
      gap: 14px;

      .confirmed-check-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #18734c;
        color: #ffffff;
        font-size: 20px;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .confirmed-title {
        font-family: var(--font-royal);
        font-size: 19px;
        font-weight: 700;
        color: #2b0e16;
      }

      .confirmed-subtitle {
        font-family: var(--font-sans);
        font-size: 13px;
        color: #54212d;
      }
    }

    .confirmed-summary-box {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-family: var(--font-sans);
      font-size: 13px;

      .summary-line {
        display: flex;
        gap: 8px;
      }
      .sum-label {
        color: #7d3343;
        font-weight: 600;
      }
      .sum-val {
        color: #2b0e16;
        font-weight: 600;
      }
    }

    .confirmed-action-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 6px;
    }

    .resend-wa-btn {
      padding: 10px 20px;
      border-radius: 24px;
      background: linear-gradient(135deg, #18734c 0%, #0d4a2f 100%);
      border: 1px solid #2ec486;
      color: #ffffff;
      font-family: var(--font-sans);
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #20875b;
      }
    }

    .edit-rsvp-btn {
      background: none;
      border: 1.5px solid rgba(26, 115, 76, 0.45);
      border-radius: 24px;
      padding: 10px 18px;
      color: #0e4f32;
      font-family: var(--font-sans);
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;

      &:hover {
        color: #ffffff;
        background: #18734c;
      }
    }

    /* Cathedral Venue Card */
    .venue-facade-banner {
      width: 100%;
      height: 75px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: -10px;
      margin-bottom: 2px;

      .venue-facade-svg {
        width: 100%;
        max-width: 260px;
        height: 100%;
      }
    }

    .suite-venue-address {
      font-family: var(--font-sans);
      font-size: 13.5px;
      font-weight: 700;
      color: #7d3343;
      letter-spacing: 0.04em;
    }

    /* Venue Highlights & Schedule Pills */
    .venue-highlights-pill-box {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
      margin: 4px 0;
    }

    .venue-hl-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(212, 155, 80, 0.28);
      box-shadow: 0 2px 6px rgba(184, 107, 88, 0.05);

      .hl-badge {
        font-family: var(--font-royal);
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.08em;
        padding: 3px 8px;
        border-radius: 8px;
        background: linear-gradient(135deg, #093c24 0%, #13663e 100%);
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(19, 102, 62, 0.25);
        flex-shrink: 0;
      }

      .hl-desc {
        font-family: var(--font-sans);
        font-size: 12px;
        font-weight: 600;
        color: #3d141e;
      }
    }

    /* Stylized Mini Map Card */
    .venue-mini-map-preview {
      width: 100%;
      height: 110px;
      border-radius: 16px;
      background: linear-gradient(135deg, #fbf4ea 0%, #fae6d8 50%, #f5d4c2 100%);
      border: 1.2px solid rgba(212, 155, 80, 0.45);
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.04), 0 6px 18px rgba(184, 107, 88, 0.1);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10px 14px;

      .map-bg-pattern {
        position: absolute;
        inset: 0;
        opacity: 0.08;
        background-image: radial-gradient(#96601a 1px, transparent 1px);
        background-size: 12px 12px;
        pointer-events: none;
      }

      .map-compass-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 10px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(212, 155, 80, 0.35);
        font-size: 10.5px;
        font-weight: 700;
        color: #6e2333;
        width: fit-content;
        z-index: 2;
      }

      .map-live-beacon {
        position: absolute;
        top: 38%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3;

        .beacon-pin-head {
          font-size: 22px;
          filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3));
          position: relative;
          z-index: 2;
        }

        .beacon-wave {
          position: absolute;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.5px solid rgba(212, 155, 80, 0.8);
          animation: beaconPulse 2s ease-out infinite;

          &.wave-2 {
            animation-delay: 0.7s;
          }
        }
      }

      .map-caption {
        font-family: var(--font-sans);
        font-size: 11px;
        color: #54212d;
        z-index: 2;
        background: rgba(255, 255, 255, 0.75);
        padding: 2px 8px;
        border-radius: 8px;
        width: fit-content;
      }
    }

    @keyframes beaconPulse {
      0% { transform: scale(0.5); opacity: 1; }
      100% { transform: scale(2.2); opacity: 0; }
    }

    .venue-action-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 14px;
      margin-top: auto;
      padding-top: 14px;
      width: 100%;
    }

    .primary-venue-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 26px;
      border-radius: 32px;
      background: linear-gradient(135deg, #ffffff 0%, #fae2d6 100%);
      border: 1px solid rgba(212, 155, 80, 0.55);
      color: #3b141d;
      font-family: var(--font-sans);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.03em;
      text-decoration: none;
      box-shadow: 0 8px 24px rgba(184, 107, 88, 0.15), inset 0 1px 0 #ffffff;
      cursor: pointer;
      position: relative;
      z-index: 1;
      transition: all 0.25s ease;

      &:hover {
        transform: translateY(-2px);
        border-color: rgba(212, 155, 80, 0.85);
        box-shadow: 0 12px 30px rgba(184, 107, 88, 0.22);
      }

      .nav-icon {
        width: 17px;
        height: 17px;
        stroke: #a6651b;
      }
    }

    .copy-address-btn {
      background: #ffffff;
      border: 1.5px solid rgba(212, 155, 80, 0.45);
      border-radius: 32px;
      padding: 12px 20px;
      color: #54212d;
      font-family: var(--font-sans);
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(184, 107, 88, 0.08);
      transition: all 0.25s ease;

      &:hover {
        background: #fae2d6;
        color: #2b0e16;
      }
    }

    /* Section 4: Photo Gallery Section */
    .photo-gallery-section {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 36px;
    }

    .section-title-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 8px;
      max-width: 700px;
    }

    .section-eyebrow {
      font-family: var(--font-sans);
      font-size: 12px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #96601a;
      font-weight: 700;
    }

    .section-heading {
      font-family: var(--font-royal);
      font-size: clamp(28px, 6vw, 44px);
      font-weight: 700;
      color: #2b0e16;
      letter-spacing: 0.04em;
    }

    .section-subtext {
      font-family: var(--font-sans);
      font-size: 14px;
      color: #54212d;
      line-height: 1.6;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 28px;
      width: 100%;
      position: relative;

      .photo-card:nth-child(odd) {
        transform: translateY(calc(var(--scroll-vel, 0) * -0.07px));
        transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease;
      }

      .photo-card:nth-child(even) {
        transform: translateY(calc(var(--scroll-vel, 0) * 0.07px));
        transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease;
      }

      &.has-hover .photo-card.blurred {
        filter: blur(2.5px) grayscale(15%);
        opacity: 0.55;
        transform: scale(0.97) !important;
      }

      .photo-card.focused {
        filter: none;
        opacity: 1;
        z-index: 6;
        border-color: rgba(212, 155, 80, 0.9);
        box-shadow: 0 30px 75px rgba(184, 107, 88, 0.28), 0 0 45px rgba(223, 178, 93, 0.35);
      }
    }

    .photo-card {
      position: relative;
      border-radius: 24px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 245, 240, 0.88) 100%);
      border: 1.5px solid rgba(212, 155, 80, 0.45);
      box-shadow: 0 18px 42px rgba(184, 107, 88, 0.14), inset 0 1.5px 0 #ffffff;
      overflow: hidden;
      cursor: pointer;
      min-height: 350px;
      transform-style: preserve-3d;
      backdrop-filter: blur(20px);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease, opacity 0.3s ease;

      &:hover {
        border-color: rgba(212, 155, 80, 0.85);

        .custom-photo-img {
          transform: scale(1.05);
        }

        .frame-shimmer {
          transform: translateX(100%);
        }

        .tap-hint {
          color: #8c4e14;
          transform: translateX(4px);
        }
      }

      &.portrait {
        min-height: 390px;
      }
    }

    /* Baroque 24K Gold Corner Rosettes */
    .baroque-corner {
      position: absolute;
      width: 28px;
      height: 28px;
      pointer-events: none;
      z-index: 4;

      .corner-svg {
        width: 100%;
        height: 100%;
      }

      &.tl { top: 8px; left: 8px; }
      &.tr { top: 8px; right: 8px; }
      &.bl { bottom: 8px; left: 8px; }
      &.br { bottom: 8px; right: 8px; }
    }

    .photo-frame-content {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .custom-photo-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .luxury-placeholder-art {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      background: radial-gradient(circle at center, rgba(255, 248, 242, 0.98) 0%, rgba(250, 226, 215, 0.92) 100%);

      .art-silhouette-canvas {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 140px;
        height: 140px;
      }

      .art-svg {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 4px 12px rgba(184, 107, 88, 0.25));
      }

      .placeholder-badge {
        font-family: var(--font-royal);
        font-size: 10.5px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        padding: 5px 16px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(190, 110, 75, 0.4);
        color: #6e2333;
        font-weight: 700;
        box-shadow: 0 4px 12px rgba(184, 107, 88, 0.1);
      }
    }

    .frame-shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.45), transparent);
      transform: translateX(-100%);
      transition: transform 0.8s ease-in-out;
      pointer-events: none;
    }

    .photo-caption-bar {
      position: relative;
      z-index: 3;
      padding: 28px 20px 18px;
      background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.96) 65%);
      border-top: 1px solid rgba(212, 155, 80, 0.25);
      display: flex;
      flex-direction: column;
      gap: 4px;
      text-align: left;
    }

    .photo-card-title {
      font-family: var(--font-royal);
      font-size: 18px;
      font-weight: 700;
      color: #2b0e16;
    }

    .photo-card-sub {
      font-family: var(--font-caveat);
      font-size: 17px;
      color: #7d3343;
    }

    .tap-hint {
      font-family: var(--font-sans);
      font-size: 11.5px;
      color: #8c4e14;
      margin-top: 4px;
      font-weight: 700;
      transition: all 0.25s ease;
    }

    /* Section 5: Ceremony Details Section */
    .ceremony-details-section {
      width: 100%;
      max-width: 860px;
    }

    .ceremony-card {
      position: relative;
      padding: 44px 36px;
      border-radius: 28px;
      background: rgba(255, 255, 255, 0.85);
      border: 1.5px solid rgba(212, 155, 80, 0.42);
      box-shadow: 0 24px 60px rgba(184, 107, 88, 0.14), inset 0 1.5px 0 #ffffff;
      backdrop-filter: blur(20px);
      text-align: center;
      transform-style: preserve-3d;
      transition: transform 0.25s ease-out;
    }

    .auspicious-banner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      margin-bottom: 14px;

      .malayalam-script {
        font-family: var(--font-chilanka);
        font-size: clamp(28px, 6vw, 42px);
        font-weight: 700;
        color: #691d2d;
      }

      .banner-sub {
        font-family: var(--font-sans);
        font-size: 12px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #96601a;
        font-weight: 700;
      }
    }

    .ceremony-lead {
      font-family: var(--font-caveat);
      font-size: clamp(19px, 4vw, 24px);
      color: #54212d;
      max-width: 620px;
      margin: 0 auto 36px;
      line-height: 1.4;
    }

    .ceremony-highlights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 22px;
    }

    .highlight-item {
      padding: 24px 18px;
      border-radius: 18px;
      background: #ffffff;
      border: 1.5px solid rgba(212, 155, 80, 0.35);
      box-shadow: 0 8px 20px rgba(184, 107, 88, 0.08);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      .hl-icon {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: rgba(240, 180, 160, 0.25);
        border: 1px solid rgba(190, 110, 75, 0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 4px;

        svg {
          width: 22px;
          height: 22px;
          stroke: #a6651b;
        }
      }

      .hl-title {
        font-family: var(--font-royal);
        font-size: 15px;
        font-weight: 700;
        color: #2b0e16;
      }

      .hl-value {
        font-family: var(--font-sans);
        font-size: 15px;
        font-weight: 700;
        color: #7d3343;
      }

      .hl-note {
        font-family: var(--font-sans);
        font-size: 12.5px;
        color: #54212d;
      }
    }

    /* Section 6: Itinerary Timeline */
    .itinerary-section {
      width: 100%;
      max-width: 760px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 40px;
    }

    .timeline-container {
      position: relative;
      width: 100%;
      padding: 20px 0;
    }

    .timeline-line {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: 2px;
      background: linear-gradient(180deg, transparent 0%, rgba(181, 116, 36, 0.6) 15%, rgba(181, 116, 36, 0.6) 85%, transparent 100%);
      transform: translateX(-50%);

      @media (max-width: 640px) {
        left: 20px;
      }
    }

    .timeline-item {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 34px;
      width: 50%;

      &.left-item {
        left: 0;
        padding-right: 36px;
        justify-content: flex-end;
        text-align: right;

        .timeline-dot {
          right: -10px;
        }

        @media (max-width: 640px) {
          width: 100%;
          left: 0;
          padding-right: 0;
          padding-left: 50px;
          justify-content: flex-start;
          text-align: left;

          .timeline-dot {
            left: 10px;
            right: auto;
          }
        }
      }

      &.right-item {
        left: 50%;
        padding-left: 36px;
        justify-content: flex-start;
        text-align: left;

        .timeline-dot {
          left: -10px;
        }

        @media (max-width: 640px) {
          width: 100%;
          left: 0;
          padding-left: 50px;

          .timeline-dot {
            left: 10px;
          }
        }
      }
    }

    .timeline-dot {
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ffffff;
      border: 2.5px solid #a6651b;
      box-shadow: 0 0 10px rgba(166, 101, 27, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;

      .inner-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #a6651b;
      }

      &.special-gold-dot {
        border-color: #7d3343;
        box-shadow: 0 0 14px rgba(125, 51, 67, 0.4);

        .inner-dot {
          background: #7d3343;
        }
      }
    }

    .timeline-content {
      padding: 18px 24px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.88);
      border: 1.5px solid rgba(212, 155, 80, 0.38);
      backdrop-filter: blur(14px);
      box-shadow: 0 10px 26px rgba(184, 107, 88, 0.1);
      max-width: 320px;

      &.highlight-content {
        border-color: rgba(212, 155, 80, 0.7);
        background: linear-gradient(135deg, #ffffff 0%, #fff6f0 100%);
        box-shadow: 0 14px 34px rgba(184, 107, 88, 0.18);
      }

      .time-badge {
        display: inline-block;
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.1em;
        color: #7d3343;
        margin-bottom: 6px;

        &.gold-time {
          color: #3b141d;
          background: rgba(240, 180, 160, 0.3);
          padding: 2px 8px;
          border-radius: 12px;
        }
      }

      .node-title {
        font-family: var(--font-royal);
        font-size: 16px;
        font-weight: 700;
        color: #2b0e16;
        margin-bottom: 4px;
      }

      .node-desc {
        font-family: var(--font-sans);
        font-size: 12.5px;
        color: #54212d;
        line-height: 1.45;
      }
    }

    /* Section 7: Story Milestones */
    .story-milestones-section {
      width: 100%;
      max-width: 920px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 32px;
    }

    .story-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 22px;
      width: 100%;
    }

    .story-card {
      padding: 30px 24px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.85);
      border: 1.5px solid rgba(212, 155, 80, 0.38);
      backdrop-filter: blur(16px);
      box-shadow: 0 16px 36px rgba(184, 107, 88, 0.12), inset 0 1px 0 #ffffff;
      display: flex;
      flex-direction: column;
      gap: 10px;
      text-align: left;
      transform-style: preserve-3d;
      transition: transform 0.25s ease-out, border-color 0.25s ease;

      &:hover {
        border-color: rgba(212, 155, 80, 0.85);
        box-shadow: 0 24px 60px rgba(184, 107, 88, 0.22);
      }

      .story-chapter-num {
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.2em;
        color: #96601a;
      }

      .story-heading {
        font-family: var(--font-royal);
        font-size: 19px;
        font-weight: 700;
        color: #2b0e16;
      }

      .story-text {
        font-family: var(--font-caveat);
        font-size: 19px;
        color: #3d141e;
        line-height: 1.45;
      }
    }

    /* Section 8: Guestbook & Wishes Wall */
    .guestbook-section {
      width: 100%;
      max-width: 820px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 28px;
    }

    .blessing-form-card {
      width: 100%;
      padding: 30px 28px;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.88);
      border: 1.5px solid rgba(212, 155, 80, 0.4);
      box-shadow: 0 20px 48px rgba(184, 107, 88, 0.14), inset 0 1px 0 #ffffff;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 14px;
    }

    .gold-input {
      flex: 1;
      min-width: 220px;
      padding: 13px 18px;
      border-radius: 12px;
      background: #ffffff;
      border: 1.5px solid rgba(212, 155, 80, 0.45);
      color: #2b0e16;
      font-family: var(--font-sans);
      font-size: 14px;
      outline: none;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;

      &:focus {
        border-color: #a6651b;
        box-shadow: 0 0 14px rgba(166, 101, 27, 0.25);
      }

      &::placeholder {
        color: rgba(84, 33, 45, 0.4);
      }
    }

    .reaction-picker {
      display: flex;
      gap: 6px;
    }

    .reaction-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #ffffff;
      border: 1.5px solid rgba(212, 155, 80, 0.35);
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, border-color 0.2s ease;

      &:hover, &.active {
        transform: scale(1.15);
        border-color: #a6651b;
        background: rgba(240, 180, 160, 0.3);
      }
    }

    .gold-textarea {
      width: 100%;
      padding: 14px 18px;
      border-radius: 12px;
      background: #ffffff;
      border: 1.5px solid rgba(212, 155, 80, 0.45);
      color: #2b0e16;
      font-family: var(--font-sans);
      font-size: 14px;
      line-height: 1.5;
      outline: none;
      resize: vertical;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;

      &:focus {
        border-color: #a6651b;
        box-shadow: 0 0 14px rgba(166, 101, 27, 0.25);
      }

      &::placeholder {
        color: rgba(84, 33, 45, 0.4);
      }
    }

    .form-submit-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 16px;
    }

    .send-blessing-btn {
      padding: 13px 28px;
      border-radius: 30px;
      background: linear-gradient(135deg, #ffffff 0%, #fae2d6 50%, #deb085 100%);
      border: 1.5px solid rgba(212, 155, 80, 0.55);
      color: #3b141d;
      font-family: var(--font-sans);
      font-size: 13.5px;
      font-weight: 700;
      letter-spacing: 0.04em;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(184, 107, 88, 0.15);
      transition: all 0.25s ease;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(184, 107, 88, 0.22);
      }

      &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
    }

    .blessing-toast {
      font-family: var(--font-caveat);
      font-size: 18px;
      color: #691d2d;
      font-weight: 700;
    }

    .blessings-wall-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 18px;
      width: 100%;
    }

    .blessing-bubble {
      padding: 20px 20px 16px;
      border-radius: 18px;
      background: #ffffff;
      border: 1.5px solid rgba(212, 155, 80, 0.32);
      backdrop-filter: blur(12px);
      box-shadow: 0 10px 24px rgba(184, 107, 88, 0.1);
      display: flex;
      flex-direction: column;
      gap: 8px;
      text-align: left;
    }

    .bubble-header {
      display: flex;
      align-items: center;
      gap: 8px;

      .bubble-reaction {
        font-size: 18px;
      }

      .bubble-author {
        font-family: var(--font-royal);
        font-size: 14px;
        font-weight: 700;
        color: #2b0e16;
      }

      .bubble-date {
        font-family: var(--font-sans);
        font-size: 11px;
        color: #7d3343;
        margin-left: auto;
      }
    }

    .bubble-msg {
      font-family: var(--font-caveat);
      font-size: 18px;
      color: #3d141e;
      line-height: 1.4;
      flex: 1;
    }

    .forward-wa-btn {
      background: none;
      border: none;
      color: #0e4f32;
      font-family: var(--font-sans);
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
      padding: 0;
      text-align: left;
      margin-top: 4px;
      transition: color 0.2s ease;

      &:hover {
        color: #18734c;
        text-decoration: underline;
      }
    }

    /* Section 9: Grand Royal Footer */
    .grand-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 10px;
      margin-top: 20px;
      padding-top: 30px;
      border-top: 1px solid rgba(181, 116, 36, 0.3);
      width: 100%;
      max-width: 600px;
    }

    .footer-crest-symbol {
      width: 36px;
      height: 36px;
      margin-bottom: 4px;

      .mini-crest {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 0 10px rgba(181, 116, 36, 0.3));
      }
    }

    .footer-blessing-text {
      font-family: var(--font-caveat);
      font-size: clamp(20px, 4.5vw, 25px);
      color: #6e2a39;
    }

    .footer-signoff-names {
      font-family: var(--font-caveat);
      font-size: clamp(34px, 7vw, 48px);
      font-weight: 700;
      color: #2b0e16;
      letter-spacing: 0.02em;
    }

    .footer-coordinates {
      font-family: var(--font-sans);
      font-size: 11.5px;
      letter-spacing: 0.16em;
      color: #8c4e14;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 6px;
    }

    .footer-credit {
      font-family: var(--font-sans);
      font-size: 11px;
      color: rgba(84, 33, 45, 0.5);
      letter-spacing: 0.08em;
    }

    /* Modals Backdrop */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(30, 10, 16, 0.75);
      backdrop-filter: blur(16px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 20px;
      animation: modalFadeIn 0.3s ease;
    }

    @keyframes modalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-dialog {
      position: relative;
      background: radial-gradient(circle at 50% 0%, #ffffff 0%, #fff5f0 100%);
      border: 1.5px solid rgba(212, 155, 80, 0.55);
      border-radius: 26px;
      padding: 34px 30px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 30px 90px rgba(80, 30, 20, 0.35);
      animation: modalPopUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes modalPopUp {
      from { transform: scale(0.92) translateY(20px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }

    .photo-modal-dialog {
      max-width: 520px;
      text-align: center;
    }

    .modal-close-btn {
      position: absolute;
      top: 18px;
      right: 18px;
      background: none;
      border: none;
      color: #6e2333;
      font-size: 28px;
      line-height: 1;
      cursor: pointer;
      transition: color 0.2s ease;

      &:hover {
        color: #2b0e16;
      }
    }

    .modal-title {
      font-family: var(--font-royal);
      font-size: 22px;
      font-weight: 700;
      color: #2b0e16;
      margin-bottom: 4px;
    }

    .modal-sub {
      font-family: var(--font-caveat);
      font-size: 18px;
      color: #6e2333;
      margin-bottom: 20px;
    }

    .modal-preview-frame {
      width: 100%;
      height: 280px;
      border-radius: 16px;
      overflow: hidden;
      background: #fff7f2;
      border: 1.5px solid rgba(212, 155, 80, 0.35);
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-img-preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .modal-placeholder-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 20px;

      .modal-cam-svg {
        width: 60px;
        height: 60px;
        stroke: #b57424;
      }

      .modal-box-tip {
        font-family: var(--font-sans);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #8c4e14;
      }

      .modal-sub-tip {
        font-family: var(--font-sans);
        font-size: 12px;
        color: #54212d;
        max-width: 260px;
      }
    }

    .modal-upload-controls {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .custom-file-upload-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 24px;
      border-radius: 30px;
      background: linear-gradient(135deg, #18734c 0%, #0d4a2f 100%);
      color: #ffffff;
      font-family: var(--font-sans);
      font-size: 13.5px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(26, 115, 76, 0.3);
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 28px rgba(26, 115, 76, 0.45);
      }
    }

    .reset-photo-btn {
      padding: 11px 20px;
      border-radius: 30px;
      background: none;
      border: 1.5px solid rgba(212, 155, 80, 0.45);
      color: #54212d;
      font-family: var(--font-sans);
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;

      &:hover {
        background: #fae2d6;
        color: #2b0e16;
      }
    }

    .svg-defs {
      position: absolute;
      width: 0;
      height: 0;
    }

    /* Mobile High-Performance & Responsive Polish */
    @media (max-width: 768px) {
      .chronometer-card,
      .suite-card,
      .photo-frame-card,
      .story-card,
      .audio-toggle-btn,
      .cathedral-arch-dial,
      .guestbook-note-card,
      .itinerary-timeline-card,
      .rsvp-suite-card,
      .venue-suite-card {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        background: rgba(255, 255, 255, 0.96) !important;
      }
    }

    @media (max-width: 640px) {
      .chronometer-card {
        padding: 32px 14px 28px;
        border-radius: 32px 32px 22px 22px;
      }

      .dials-grid {
        gap: 4px;
        margin-bottom: 24px;
      }

      .cathedral-arch-dial {
        min-width: 62px;
        max-width: 80px;
        padding: 10px 4px 8px;
        border-radius: 28px 28px 12px 12px;
      }

      .arch-apex-crest {
        font-size: 10px;
      }

      .dial-num {
        font-size: clamp(22px, 6.2vw, 32px);
      }

      .dial-unit-tag {
        font-size: 8px;
        padding: 1px 5px;
        letter-spacing: 0.1em;
      }

      .dial-separator {
        font-size: 10px;
        margin-top: -2px;
      }

      .action-suite-grid {
        gap: 20px;
      }

      .suite-card {
        padding: 28px 18px 24px;
        border-radius: 24px;
      }

      .wax-seal-ornament {
        top: -12px;
        right: 14px;
        transform: scale(0.8);
      }

      .suite-badge {
        font-size: 9.5px;
        padding: 4px 10px;
        letter-spacing: 0.1em;
      }

      .velvet-badge-toggle {
        flex-direction: column;
        gap: 8px;
      }

      .velvet-badge-btn {
        min-width: 100%;
        padding: 10px 14px;
      }

      .sovereign-coins-row {
        gap: 8px;
      }

      .sovereign-coin-btn {
        width: 48px;
        height: 48px;

        .coin-num {
          font-size: 14px;
        }
        .coin-sub {
          font-size: 7.5px;
        }
      }

      .grand-emerald-cta-btn {
        padding: 14px 16px;

        .cta-text {
          font-size: 11.5px;
          letter-spacing: 0.03em;
        }
      }

      .venue-mini-map-preview {
        height: 95px;
      }
    }
  `]
})
export class DetailsSectionComponent implements OnInit, OnDestroy {
  readonly scrollY = input<number>(0);
  readonly scrollVelocity = input<number>(0);

  private timerId: number | null = null;
  private audioCtx: AudioContext | null = null;
  private audioIntervalId: number | null = null;

  readonly mapsUrl = signal<string>(INVITE_CONFIG.mapsUrl || 'https://maps.google.com/?q=St+Pauls+Auditorium+Puthoor+Kottarakkara');
  readonly defaultWhatsappUrl = signal<string>(INVITE_CONFIG.whatsappRsvpUrl || 'https://wa.me/?text=Congratulations%20Ammu%20and%20Ajith!%20Delighted%20to%20attend.');

  // ReactBits ScrollVelocity kinetic horizontal ribbon transforms
  readonly velocityTrack1Transform = computed(() => {
    const y = this.scrollY();
    const vel = this.scrollVelocity();
    const offset = ((y * 0.75) % 1400);
    const skew = (-vel * 0.12).toFixed(2);
    return `translate3d(${-offset}px, 0, 0) skewX(${skew}deg)`;
  });

  readonly velocityTrack2Transform = computed(() => {
    const y = this.scrollY();
    const vel = this.scrollVelocity();
    const offset = ((y * 0.62) % 1400);
    const skew = (vel * 0.12).toFixed(2);
    return `translate3d(${offset - 700}px, 0, 0) skewX(${skew}deg)`;
  });

  // 3D Sculpted Wax Seal silk ribbon wind flutter physics
  readonly waxRibbonLeftTransform = computed(() => {
    const vel = this.scrollVelocity();
    const sway = Math.sin(this.scrollY() * 0.05) * 3;
    const rot = -14 + (vel * 0.45) + sway;
    const skew = (-vel * 0.2).toFixed(1);
    return `rotate(${rot.toFixed(1)}deg) skewX(${skew}deg)`;
  });

  readonly waxRibbonRightTransform = computed(() => {
    const vel = this.scrollVelocity();
    const sway = Math.cos(this.scrollY() * 0.05) * 3;
    const rot = 14 + (vel * 0.55) + sway;
    const skew = (-vel * 0.25).toFixed(1);
    return `rotate(${rot.toFixed(1)}deg) skewX(${skew}deg)`;
  });

  // Live countdown state
  private readonly diffMs = signal<number>(0);
  readonly days = computed(() => Math.max(0, Math.floor(this.diffMs() / (1000 * 60 * 60 * 24))));
  readonly hours = computed(() => Math.max(0, Math.floor((this.diffMs() / (1000 * 60 * 60)) % 24)));
  readonly minutes = computed(() => Math.max(0, Math.floor((this.diffMs() / (1000 * 60)) % 60)));
  readonly seconds = computed(() => Math.max(0, Math.floor((this.diffMs() / 1000) % 60)));

  // Address copied state
  readonly addressCopied = signal<boolean>(false);

  // Audio melody state
  readonly isAudioPlaying = signal<boolean>(false);

  // RSVP Form & Submit state
  rsvpName = '';
  readonly rsvpAttendance = signal<'attending' | 'regret'>('attending');
  readonly rsvpGuestCount = signal<number>(2);
  rsvpNote = '';
  readonly isRsvpSubmitted = signal<boolean>(false);
  readonly isSubmittingRsvp = signal<boolean>(false);
  readonly rsvpError = signal<string>('');

  // Photo gallery state
  readonly photos = signal<PhotoItem[]>([
    { id: 1, title: 'The Bride & Groom', subtitle: 'Ammu & Ajith • Eternal Promise', placeholderTag: 'Portrait Frame 01', aspect: 'portrait' },
    { id: 2, title: 'Where Destiny Began', subtitle: 'The first smile that changed everything', placeholderTag: 'Story Frame 02', aspect: 'landscape' },
    { id: 3, title: 'Golden Sunsets', subtitle: 'Quiet moments lost in time', placeholderTag: 'Memory Frame 03', aspect: 'square' },
    { id: 4, title: 'The Proposal', subtitle: 'Under the starlight canopy', placeholderTag: 'Romance Frame 04', aspect: 'landscape' },
    { id: 5, title: 'Laughter & Little Things', subtitle: 'A thousand reasons to smile', placeholderTag: 'Candid Frame 05', aspect: 'square' },
    { id: 6, title: 'Walking Into Forever', subtitle: 'The beginning of our greatest adventure', placeholderTag: 'Celebration Frame 06', aspect: 'portrait' }
  ]);
  readonly selectedPhoto = signal<PhotoItem | null>(null);
  readonly hoveredPhotoId = signal<number | null>(null);

  // Guestbook & Blessings state
  readonly reactions = ['💖', '🌸', '🥂', '✨', '💍'];
  readonly selectedReaction = signal<string>('💖');
  newGuestName = '';
  newGuestMessage = '';
  readonly blessingSubmitted = signal<boolean>(false);

  readonly blessings = signal<Blessing[]>([
    { id: 1, name: 'Uncle George & Family', message: 'May your union be blessed with endless happiness, health and peace. Can’t wait to celebrate with you both!', reaction: '💖', dateStr: 'Recently' },
    { id: 2, name: 'Anjali & Vivek', message: 'Huge congratulations Ammu and Ajith! You two are truly made for each other. Counting down the days to the grand feast!', reaction: '✨', dateStr: 'Yesterday' },
    { id: 3, name: 'Karthik & Friends', message: 'To a lifetime of adventures, late-night tea talks and unconditional laughter. Best wishes for the big day!', reaction: '🥂', dateStr: '2 days ago' }
  ]);

  ngOnInit(): void {
    this.updateCountdown();
    if (typeof window !== 'undefined') {
      this.timerId = window.setInterval(() => this.updateCountdown(), 1000);
      this.restoreSavedRsvp();
      this.restoreSavedBlessings();
    }
  }

  ngOnDestroy(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
    }
    this.stopAudio();
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  private updateCountdown(): void {
    const target = new Date(INVITE_CONFIG.weddingDateISO).getTime();
    const now = Date.now();
    this.diffMs.set(Math.max(0, target - now));
  }

  // Restore saved RSVP from localStorage
  private restoreSavedRsvp(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('wedding_rsvp_ammu_ajith');
        if (saved) {
          const data = JSON.parse(saved);
          if (data && data.name) {
            this.rsvpName = data.name;
            if (data.attendance) this.rsvpAttendance.set(data.attendance);
            if (data.guests) this.rsvpGuestCount.set(data.guests);
            if (data.note) this.rsvpNote = data.note;
            this.isRsvpSubmitted.set(true);
          }
        }
      }
    } catch {
      // Graceful localstorage fallback
    }
  }

  // Restore saved blessings from localStorage
  private restoreSavedBlessings(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('wedding_blessings_ammu_ajith');
        if (saved) {
          const customBlessings = JSON.parse(saved);
          if (Array.isArray(customBlessings) && customBlessings.length > 0) {
            this.blessings.update(defaults => [...customBlessings, ...defaults]);
          }
        }
      }
    } catch {
      // Graceful fallback
    }
  }

  // Submit RSVP Logic
  submitRsvp(): void {
    const name = this.rsvpName.trim();
    if (!name) {
      this.rsvpError.set('Please enter your full name to submit RSVP.');
      return;
    }
    this.rsvpError.set('');
    this.isSubmittingRsvp.set(true);

    const count = this.rsvpGuestCount();
    const isAttending = this.rsvpAttendance() === 'attending';
    const statusText = isAttending
      ? `Joyfully Attending (${count} ${count === 1 ? 'Guest' : 'Guests'})`
      : `Sending Warm Love & Blessings from Afar`;

    const note = this.rsvpNote.trim();
    const noteLine = note ? `\n💬 Note: ${note}` : '';

    // Formatted structured WhatsApp RSVP Message
    const message = `✨ WEDDING RSVP — AMMU & AJITH ✨\n\n👤 Name: ${name}\n🎉 Attendance: ${statusText}${noteLine}\n\n📍 Sunday, April 4, 2027 • St. Paul's Auditorium, Kottarakkara`;

    // 1. Post to optional backend webhook / Google Sheet endpoint if configured in invite.config.ts
    if (INVITE_CONFIG.rsvpEndpointUrl) {
      try {
        fetch(INVITE_CONFIG.rsvpEndpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            attendance: this.rsvpAttendance(),
            guests: isAttending ? count : 0,
            note,
            submittedAt: new Date().toISOString()
          }),
          mode: 'no-cors'
        }).catch(() => {});
      } catch {
        // Non-blocking background sync
      }
    }

    // 2. Open WhatsApp with formatted RSVP text
    const phone = INVITE_CONFIG.whatsappPhoneNumber?.trim() || '';
    const baseWa = phone ? `https://wa.me/${phone}` : 'https://wa.me/';
    const waUrl = `${baseWa}?text=${encodeURIComponent(message)}`;

    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }

    // 3. Save to localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const payload = {
          name,
          attendance: this.rsvpAttendance(),
          guests: count,
          note,
          submittedAt: Date.now()
        };
        localStorage.setItem('wedding_rsvp_ammu_ajith', JSON.stringify(payload));
      }
    } catch {}

    this.isRsvpSubmitted.set(true);
    this.isSubmittingRsvp.set(false);
  }

  // Edit existing RSVP
  editRsvp(): void {
    this.isRsvpSubmitted.set(false);
  }

  // ReactBits 3D Tilt + Cursor-Tracking Spotlight Position
  onCardTilt(event: MouseEvent, cardEl: HTMLElement): void {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Set custom properties for ReactBits spotlight layer
    cardEl.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
    cardEl.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6.5;
    const rotateY = ((x - centerX) / centerX) * 6.5;
    cardEl.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.018, 1.018, 1.018)`;
  }

  onCardLeave(cardEl: HTMLElement): void {
    if (!cardEl) return;
    cardEl.style.transform = '';
  }

  // ReactBits Crest Interactive 3D Perspective Tilt
  onCrestMouseMove(event: MouseEvent, crestEl: HTMLElement): void {
    if (!crestEl) return;
    const rect = crestEl.getBoundingClientRect();
    const x = event.clientX - rect.left - (rect.width / 2);
    const y = event.clientY - rect.top - (rect.height / 2);
    const rotateX = (y / (rect.height / 2)) * -10;
    const rotateY = (x / (rect.width / 2)) * 10;
    crestEl.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.06)`;
  }

  onCrestMouseLeave(crestEl: HTMLElement): void {
    if (!crestEl) return;
    crestEl.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
  }

  // ReactBits Individual Chronometer Dial Spotlight & Lift
  onDialTilt(event: MouseEvent, dialEl: HTMLElement): void {
    if (!dialEl) return;
    const rect = dialEl.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    dialEl.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
    dialEl.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    dialEl.style.transform = `perspective(600px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
  }

  onDialLeave(dialEl: HTMLElement): void {
    if (!dialEl) return;
    dialEl.style.transform = '';
  }

  // ReactBits Magnetic CTA Button Attraction
  onBtnMouseMove(event: MouseEvent, btnEl: HTMLElement): void {
    if (!btnEl) return;
    const rect = btnEl.getBoundingClientRect();
    const x = event.clientX - rect.left - (rect.width / 2);
    const y = event.clientY - rect.top - (rect.height / 2);
    btnEl.style.transform = `translate3d(${(x * 0.22).toFixed(1)}px, ${(y * 0.22).toFixed(1)}px, 0) scale(1.03)`;
  }

  onBtnMouseLeave(btnEl: HTMLElement): void {
    if (!btnEl) return;
    btnEl.style.transform = 'translate3d(0, 0, 0) scale(1)';
  }

  // ReactBits Click Spark Effect (Micro Gold Sparkles)
  @HostListener('click', ['$event'])
  onClickSpark(event: MouseEvent): void {
    if (typeof window === 'undefined') return;
    const sparkCount = 8;
    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('div');
      spark.className = 'click-spark-particle';
      const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.5;
      const velocity = 24 + Math.random() * 32;
      const destX = Math.cos(angle) * velocity;
      const destY = Math.sin(angle) * velocity;
      spark.style.left = `${event.clientX}px`;
      spark.style.top = `${event.clientY}px`;
      spark.style.setProperty('--dx', `${destX.toFixed(1)}px`);
      spark.style.setProperty('--dy', `${destY.toFixed(1)}px`);
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 600);
    }
  }

  // Copy Venue Address
  copyAddress(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('St. Paul\'s Auditorium, Puthoor, Kottarakkara, Kollam, Kerala');
      this.addressCopied.set(true);
      setTimeout(() => this.addressCopied.set(false), 3000);
    }
  }

  // Add to Calendar
  addToCalendar(): void {
    const title = encodeURIComponent('Wedding: Ammu & Ajith');
    const details = encodeURIComponent('Auspicious Wedding Muhurtham of Ammu and Ajith followed by traditional Kerala Sadhya feast.');
    const location = encodeURIComponent('St. Paul\'s Auditorium, Puthoor, Kottarakkara, Kerala');
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20270404T044500Z/20270404T093000Z&details=${details}&location=${location}`;
    if (typeof window !== 'undefined') {
      window.open(googleCalUrl, '_blank', 'noopener,noreferrer');
    }
  }

  // Ambient Web Audio Synthesizer
  toggleAudio(): void {
    if (this.isAudioPlaying()) {
      this.stopAudio();
    } else {
      this.startMelody();
    }
  }

  private startMelody(): void {
    try {
      const AudioClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioClass) return;
      this.audioCtx = new AudioClass();

      const notes = [370.0, 466.16, 554.37, 622.25, 739.99, 830.61];
      let step = 0;

      const playChime = () => {
        if (!this.audioCtx || this.audioCtx.state === 'closed') return;
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        const freq = notes[step % notes.length];
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 2.3);

        step++;
      };

      playChime();
      this.audioIntervalId = window.setInterval(playChime, 1800);
      this.isAudioPlaying.set(true);
    } catch {
      // Audio autoplay restrictions gracefully handled
    }
  }

  private stopAudio(): void {
    if (this.audioIntervalId !== null) {
      clearInterval(this.audioIntervalId);
      this.audioIntervalId = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
    this.isAudioPlaying.set(false);
  }

  // Photo Lightbox modal & File upload
  openPhotoModal(photo: PhotoItem): void {
    this.selectedPhoto.set(photo);
  }

  closePhotoModal(): void {
    this.selectedPhoto.set(null);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const current = this.selectedPhoto();
        if (current) {
          current.customImgUrl = result;
          this.photos.update(list => list.map(p => p.id === current.id ? { ...p, customImgUrl: result } : p));
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  resetCustomPhoto(): void {
    const current = this.selectedPhoto();
    if (current) {
      current.customImgUrl = undefined;
      this.photos.update(list => list.map(p => p.id === current.id ? { ...p, customImgUrl: undefined } : p));
    }
  }

  // Guestbook Submission Logic
  canSubmitBlessing(): boolean {
    return this.newGuestName.trim().length > 1 && this.newGuestMessage.trim().length > 3;
  }

  submitBlessing(): void {
    if (!this.canSubmitBlessing()) return;

    const newBlessing: Blessing = {
      id: Date.now(),
      name: this.newGuestName.trim(),
      message: this.newGuestMessage.trim(),
      reaction: this.selectedReaction(),
      dateStr: 'Just now'
    };

    this.blessings.update(prev => [newBlessing, ...prev]);

    // Save to localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('wedding_blessings_ammu_ajith') || '[]');
        existing.unshift(newBlessing);
        localStorage.setItem('wedding_blessings_ammu_ajith', JSON.stringify(existing.slice(0, 30)));
      }
    } catch {}

    this.newGuestName = '';
    this.newGuestMessage = '';
    this.blessingSubmitted.set(true);
    setTimeout(() => this.blessingSubmitted.set(false), 4500);
  }

  shareBlessingOnWa(b: Blessing): void {
    const text = `Blessing for Ammu & Ajith (${b.reaction}):\n"${b.message}"\n- With love, ${b.name}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}
