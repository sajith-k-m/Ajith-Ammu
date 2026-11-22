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
    <section class="luxury-details-container" aria-label="Event Details, Countdown & Gallery">

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

      <!-- Section 2: Redesigned Royal Chronometer Countdown -->
      <div
        class="chronometer-card reveal-item spotlight-card"
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
        <p class="chronometer-date-str">Sunday, April 4, 2027 &bull; Kottarakkara, Kerala</p>

        <!-- 4 Grand Architectural Dials -->
        <div class="dials-grid" role="timer" aria-live="polite">
          
          <div
            class="dial-box spotlight-card"
            (mousemove)="onDialTilt($event, d1)"
            (mouseleave)="onDialLeave(d1)"
            #d1
          >
            <div class="card-spotlight-layer" aria-hidden="true"></div>
            <div class="dial-inner">
              <span class="dial-num">{{ pad(days()) }}</span>
              <span class="dial-unit">DAYS</span>
            </div>
          </div>

          <div class="dial-separator" aria-hidden="true">:</div>

          <div
            class="dial-box spotlight-card"
            (mousemove)="onDialTilt($event, d2)"
            (mouseleave)="onDialLeave(d2)"
            #d2
          >
            <div class="card-spotlight-layer" aria-hidden="true"></div>
            <div class="dial-inner">
              <span class="dial-num">{{ pad(hours()) }}</span>
              <span class="dial-unit">HOURS</span>
            </div>
          </div>

          <div class="dial-separator" aria-hidden="true">:</div>

          <div
            class="dial-box spotlight-card"
            (mousemove)="onDialTilt($event, d3)"
            (mouseleave)="onDialLeave(d3)"
            #d3
          >
            <div class="card-spotlight-layer" aria-hidden="true"></div>
            <div class="dial-inner">
              <span class="dial-num">{{ pad(minutes()) }}</span>
              <span class="dial-unit">MINUTES</span>
            </div>
          </div>

          <div class="dial-separator" aria-hidden="true">:</div>

          <div
            class="dial-box seconds-box spotlight-card"
            (mousemove)="onDialTilt($event, d4)"
            (mouseleave)="onDialLeave(d4)"
            #d4
          >
            <div class="card-spotlight-layer" aria-hidden="true"></div>
            <div class="dial-inner">
              <span class="dial-num seconds-pulse">{{ pad(seconds()) }}</span>
              <span class="dial-unit">SECONDS</span>
            </div>
            <div class="seconds-glow-ring" aria-hidden="true"></div>
          </div>

        </div>

        <div class="calendar-action-bar">
          <button
            type="button"
            class="calendar-btn specular-btn star-border-btn"
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
            <span>Add to Google / Apple Calendar</span>
          </button>
        </div>
      </div>

      <!-- Section 3: Redesigned Action Suite (Interactive RSVP Submit Form & Venue Navigation) -->
      <div class="action-suite-grid reveal-item">
        
        <!-- Interactive RSVP Card with Complete Submission Form -->
        <div
          class="suite-card rsvp-suite-card spotlight-card"
          (mousemove)="onCardTilt($event, rsvpRef)"
          (mouseleave)="onCardLeave(rsvpRef)"
          #rsvpRef
        >
          <!-- ReactBits Spotlight, Glare & Border Beam -->
          <div class="card-spotlight-layer" aria-hidden="true"></div>
          <div class="card-glare-overlay" aria-hidden="true"></div>
          <div class="border-beam-ring" aria-hidden="true"></div>

          <div class="suite-badge emerald-badge">
            <svg viewBox="0 0 24 24" class="badge-icon" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2Z" fill="currentColor"/>
            </svg>
            <span>{{ isRsvpSubmitted() ? 'RSVP Confirmed' : 'RSVP Submission' }}</span>
          </div>

          <h3 class="suite-title shiny-text">Will You Grace Us With Your Presence?</h3>

          <!-- Form View (when not yet submitted or when editing) -->
          @if (!isRsvpSubmitted()) {
            <p class="suite-desc">Kindly enter your name and confirm your attendance so we may reserve your royal seat and traditional Kerala Sadhya.</p>

            <form class="rsvp-inline-form" (ngSubmit)="submitRsvp()">
              
              <!-- Guest Name -->
              <div class="form-group">
                <label class="field-label">Your Full Name / Family Name *</label>
                <input
                  type="text"
                  class="gold-field-input"
                  [(ngModel)]="rsvpName"
                  name="rsvpName"
                  placeholder="e.g. Rahul &amp; Sneha"
                  maxlength="50"
                  required
                />
                @if (rsvpError()) {
                  <span class="field-error">{{ rsvpError() }}</span>
                }
              </div>

              <!-- Attendance Choice -->
              <div class="form-group">
                <label class="field-label">Attendance</label>
                <div class="status-pill-toggle">
                  <button
                    type="button"
                    class="status-choice-btn"
                    [class.active]="rsvpAttendance() === 'attending'"
                    (click)="rsvpAttendance.set('attending')"
                  >
                    <span>🎉 Joyfully Attending</span>
                  </button>
                  <button
                    type="button"
                    class="status-choice-btn"
                    [class.active]="rsvpAttendance() === 'regret'"
                    (click)="rsvpAttendance.set('regret')"
                  >
                    <span>💌 Sending Love from Afar</span>
                  </button>
                </div>
              </div>

              <!-- Guest Count (Shown when attending) -->
              @if (rsvpAttendance() === 'attending') {
                <div class="form-group">
                  <label class="field-label">Number of Guests</label>
                  <div class="guest-pills-row">
                    @for (count of [1, 2, 3, 4, 5]; track count) {
                      <button
                        type="button"
                        class="guest-pill"
                        [class.active]="rsvpGuestCount() === count"
                        (click)="rsvpGuestCount.set(count)"
                      >
                        {{ count === 5 ? '5+ Guests' : count + (count === 1 ? ' Guest' : ' Guests') }}
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- Optional Note -->
              <div class="form-group">
                <label class="field-label">Message / Dietary Note (Optional)</label>
                <input
                  type="text"
                  class="gold-field-input"
                  [(ngModel)]="rsvpNote"
                  name="rsvpNote"
                  placeholder="e.g. Looking forward to the celebrations!"
                  maxlength="120"
                />
              </div>

              <!-- Submit Buttons with ReactBits Magnetic Hover -->
              <div class="rsvp-submit-actions">
                <button
                  type="submit"
                  class="primary-submit-rsvp-btn specular-btn star-border-btn"
                  [disabled]="isSubmittingRsvp()"
                  (mousemove)="onBtnMouseMove($event, submitRsvpRef)"
                  (mouseleave)="onBtnMouseLeave(submitRsvpRef)"
                  #submitRsvpRef
                >
                  <div class="btn-shine-sweep" aria-hidden="true"></div>
                  <svg viewBox="0 0 24 24" class="wa-btn-icon" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  <span>{{ isSubmittingRsvp() ? 'Submitting RSVP...' : 'Submit RSVP via WhatsApp ✨' }}</span>
                </button>

                <a
                  [href]="defaultWhatsappUrl()"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="quick-tap-rsvp-link"
                >
                  Or quick 1-tap WhatsApp RSVP &rsaquo;
                </a>
              </div>

            </form>
          } @else {
            <!-- Submitted State View -->
            <div class="rsvp-confirmed-panel">
              <div class="confirmed-header">
                <div class="confirmed-check-icon">✓</div>
                <div>
                  <h4 class="confirmed-title">RSVP Recorded!</h4>
                  <p class="confirmed-subtitle">Thank you, {{ rsvpName }}</p>
                </div>
              </div>

              <div class="confirmed-summary-box">
                <div class="summary-line">
                  <span class="sum-label">Status:</span>
                  <span class="sum-val">{{ rsvpAttendance() === 'attending' ? '🎉 Joyfully Attending' : '💌 Sending Love from Afar' }}</span>
                </div>
                @if (rsvpAttendance() === 'attending') {
                  <div class="summary-line">
                    <span class="sum-label">Guests:</span>
                    <span class="sum-val">{{ rsvpGuestCount() }} {{ rsvpGuestCount() === 1 ? 'Guest' : 'Guests' }}</span>
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

        <!-- Venue & Navigation Card -->
        <div
          class="suite-card venue-suite-card spotlight-card"
          (mousemove)="onCardTilt($event, venueRef)"
          (mouseleave)="onCardLeave(venueRef)"
          #venueRef
        >
          <!-- ReactBits Spotlight & Glare Layers -->
          <div class="card-spotlight-layer" aria-hidden="true"></div>
          <div class="card-glare-overlay" aria-hidden="true"></div>

          <div class="suite-badge gold-badge">
            <svg viewBox="0 0 24 24" class="badge-icon" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Ceremony Venue</span>
          </div>

          <h3 class="suite-title shiny-text">St. Paul's Auditorium</h3>
          <p class="suite-venue-address">Puthoor, Kottarakkara &bull; Kollam District, Kerala</p>
          <p class="suite-desc">Auspicious ceremony at 10:15 AM followed by grand wedding feast (Sadhya).</p>

          <div class="venue-action-row">
            <a
              [href]="mapsUrl()"
              target="_blank"
              rel="noopener noreferrer"
              class="primary-venue-btn specular-btn star-border-btn"
              (mousemove)="onBtnMouseMove($event, venueBtnRef)"
              (mouseleave)="onBtnMouseLeave(venueBtnRef)"
              #venueBtnRef
            >
              <div class="btn-shine-sweep" aria-hidden="true"></div>
              <svg viewBox="0 0 24 24" class="nav-icon" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
              </svg>
              <span>Open in Google Maps</span>
            </a>

            <button type="button" class="copy-address-btn" (click)="copyAddress()">
              <span>{{ addressCopied() ? '✓ Copied Address!' : 'Copy Address' }}</span>
            </button>
          </div>
        </div>

      </div>

      <!-- Section 4: Interactive 3D Photo Placeholders Gallery -->
      <div class="photo-gallery-section reveal-item">
        <div class="section-title-wrap">
          <span class="section-eyebrow">A TREASURY OF MOMENTS</span>
          <h2 class="section-heading">Our Story in Frames</h2>
          <p class="section-subtext">Every glance held a promise, every journey brought us here. Tap any frame to preview or replace with real photos.</p>
        </div>

        <div class="gallery-grid">
          @for (photo of photos(); track photo.id) {
            <div
              class="photo-card {{ photo.aspect }} spotlight-card"
              (click)="openPhotoModal(photo)"
              (mousemove)="onCardTilt($event, cardEl)"
              (mouseleave)="onCardLeave(cardEl)"
              #cardEl
            >
              <!-- ReactBits Spotlight & Glare Layers -->
              <div class="card-spotlight-layer" aria-hidden="true"></div>
              <div class="card-glare-overlay" aria-hidden="true"></div>

              <div class="corner-filigree top-left" aria-hidden="true"></div>
              <div class="corner-filigree top-right" aria-hidden="true"></div>
              <div class="corner-filigree bottom-left" aria-hidden="true"></div>
              <div class="corner-filigree bottom-right" aria-hidden="true"></div>

              <div class="photo-frame-content">
                @if (photo.customImgUrl) {
                  <img [src]="photo.customImgUrl" [alt]="photo.title" class="custom-photo-img" />
                } @else {
                  <div class="luxury-placeholder-art">
                    <div class="placeholder-watermark">
                      <svg viewBox="0 0 64 64" class="watermark-svg">
                        <circle cx="32" cy="32" r="28" stroke="url(#crestGoldGrad)" stroke-width="1.2" stroke-dasharray="4 2" fill="none" opacity="0.4"/>
                        <path d="M22 26 L26 20 L38 20 L42 26 L50 26 C52.2 26 54 27.8 54 30 L54 48 C54 50.2 52.2 52 50 52 L14 52 C11.8 52 10 50.2 10 48 L10 30 C10 27.8 11.8 26 14 26 Z" stroke="url(#crestGoldGrad)" stroke-width="1.8" fill="rgba(223, 178, 93, 0.08)"/>
                        <circle cx="32" cy="39" r="8" stroke="url(#crestGoldGrad)" stroke-width="1.8" fill="none"/>
                      </svg>
                    </div>
                    <span class="placeholder-badge">{{ photo.placeholderTag }}</span>
                  </div>
                }

                <div class="frame-shimmer" aria-hidden="true"></div>

                <div class="photo-caption-bar">
                  <h4 class="photo-card-title">{{ photo.title }}</h4>
                  <p class="photo-card-sub">{{ photo.subtitle }}</p>
                  <span class="tap-hint">Tap to view / swap photo &rsaquo;</span>
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
            <stop offset="0%" stop-color="#fff8db" />
            <stop offset="35%" stop-color="#fae09a" />
            <stop offset="70%" stop-color="#dfb25d" />
            <stop offset="100%" stop-color="#7a4f10" />
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
      background: rgba(22, 10, 14, 0.85);
      border: 1px solid rgba(223, 178, 93, 0.45);
      color: #fae09a;
      font-family: var(--font-sans);
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.04em;
      cursor: pointer;
      backdrop-filter: blur(16px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 243, 196, 0.2);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        transform: translateY(-2px);
        border-color: rgba(255, 243, 196, 0.8);
        box-shadow: 0 12px 30px rgba(223, 178, 93, 0.35);
      }

      &.playing {
        border-color: #2ec486;
        color: #d8f3dc;
        box-shadow: 0 8px 24px rgba(37, 162, 107, 0.35);

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

      .crest-svg {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 0 16px rgba(223, 178, 93, 0.45));
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
      color: rgba(223, 178, 93, 0.85);
      font-weight: 600;
    }

    .couple-title {
      font-family: var(--font-royal);
      font-size: clamp(38px, 8vw, 68px);
      font-weight: 700;
      background: linear-gradient(135deg, #fffbf0 0%, #fae09a 30%, #dfb25d 65%, #94641c 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 0.04em;
      line-height: 1.1;
      text-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    }

    .wedding-tagline {
      font-family: var(--font-caveat);
      font-size: clamp(20px, 4.5vw, 27px);
      color: rgba(251, 245, 232, 0.88);
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
        background: linear-gradient(90deg, transparent, rgba(223, 178, 93, 0.6), transparent);
      }

      .divider-diamond {
        width: 14px;
        height: 14px;
      }
    }

    /* ========================================================
       ReactBits Creative Components Suite:
       - Spotlight Card (Cursor Tracking Mesh Glow)
       - Glare Overlay (Specular Reflection)
       - Border Beam (Luminous Orbiting Edge Light)
       - Shiny Text (Metallic 24k Gold Sweep)
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
        rgba(223, 178, 93, 0.16),
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
        rgba(255, 255, 255, 0.08),
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
          rgba(255, 243, 196, 0.85) 55deg,
          rgba(223, 178, 93, 0.95) 70deg,
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
        #fbf5e8 0%,
        #fae09a 25%,
        #ffffff 50%,
        #dfb25d 75%,
        #fbf5e8 100%
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
          rgba(255, 255, 255, 0.28),
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
          rgba(255, 243, 196, 0.95) 12%,
          rgba(223, 178, 93, 0.95) 20%,
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

    /* Section 2: Redesigned Royal Chronometer Countdown */
    .chronometer-card {
      position: relative;
      width: 100%;
      max-width: 720px;
      padding: 44px 36px 36px;
      border-radius: 28px;
      background: radial-gradient(circle at 50% 0%, rgba(48, 18, 25, 0.85) 0%, rgba(18, 7, 10, 0.95) 85%);
      border: 1.5px solid rgba(223, 178, 93, 0.42);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(223, 178, 93, 0.15), inset 0 1px 0 rgba(255, 243, 196, 0.35);
      backdrop-filter: blur(24px);
      text-align: center;
      transform-style: preserve-3d;
      transition: transform 0.25s ease-out, box-shadow 0.25s ease-out;

      &:hover {
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.85), 0 0 50px rgba(223, 178, 93, 0.28);
      }
    }

    .chronometer-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 18px;
      border-radius: 30px;
      background: rgba(223, 178, 93, 0.12);
      border: 1px solid rgba(223, 178, 93, 0.3);
      color: #fae09a;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      font-weight: 600;
      margin-bottom: 12px;

      .badge-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #dfb25d;
        box-shadow: 0 0 8px #dfb25d;
      }
    }

    .chronometer-heading {
      font-family: var(--font-royal);
      font-size: clamp(22px, 4.8vw, 32px);
      font-weight: 700;
      color: #fff8eb;
      letter-spacing: 0.06em;
      margin-bottom: 6px;
    }

    .chronometer-date-str {
      font-family: var(--font-sans);
      font-size: 13px;
      letter-spacing: 0.1em;
      color: rgba(223, 178, 93, 0.8);
      text-transform: uppercase;
      margin-bottom: 30px;
    }

    .dials-grid {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: clamp(8px, 2.5vw, 20px);
      margin-bottom: 32px;
    }

    .dial-box {
      flex: 1;
      max-width: 120px;
      min-width: 72px;
      padding: 16px 8px 12px;
      border-radius: 18px;
      background: linear-gradient(180deg, rgba(38, 14, 20, 0.9) 0%, rgba(18, 7, 10, 0.95) 100%);
      border: 1.2px solid rgba(223, 178, 93, 0.32);
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.6), 0 8px 20px rgba(0, 0, 0, 0.4);
      position: relative;
      overflow: hidden;

      &.seconds-box {
        border-color: rgba(223, 178, 93, 0.55);
        background: linear-gradient(180deg, rgba(58, 20, 28, 0.9) 0%, rgba(20, 7, 12, 0.95) 100%);
      }
    }

    .dial-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .dial-num {
      font-family: var(--font-royal);
      font-size: clamp(32px, 7vw, 54px);
      font-weight: 800;
      line-height: 1;
      background: linear-gradient(180deg, #ffffff 0%, #fae09a 45%, #dfb25d 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6));
    }

    .dial-unit {
      font-family: var(--font-sans);
      font-size: clamp(10px, 2.2vw, 12px);
      letter-spacing: 0.16em;
      color: rgba(223, 178, 93, 0.85);
      font-weight: 700;
    }

    .dial-separator {
      font-family: var(--font-royal);
      font-size: clamp(24px, 5vw, 36px);
      color: rgba(223, 178, 93, 0.5);
      margin-top: -14px;
      font-weight: 300;
    }

    .calendar-action-bar {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .calendar-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 26px;
      border-radius: 30px;
      background: rgba(223, 178, 93, 0.15);
      border: 1px solid rgba(223, 178, 93, 0.45);
      color: #fff3c4;
      font-family: var(--font-sans);
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: all 0.25s ease;

      &:hover {
        background: rgba(223, 178, 93, 0.28);
        border-color: #fff3c4;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(223, 178, 93, 0.25);
      }

      .cal-icon {
        width: 16px;
        height: 16px;
        stroke: #fae09a;
      }
    }

    /* Section 3: Redesigned Action Suite */
    .action-suite-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
      width: 100%;
      max-width: 920px;
    }

    .suite-card {
      padding: 34px 28px;
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 14px;
      text-align: left;
      backdrop-filter: blur(20px);
      transform-style: preserve-3d;
      transition: transform 0.25s ease-out, box-shadow 0.25s ease-out;

      &.rsvp-suite-card {
        background: radial-gradient(circle at 10% 10%, rgba(18, 56, 38, 0.88) 0%, rgba(10, 24, 18, 0.98) 100%);
        border: 1.5px solid rgba(46, 196, 134, 0.45);
        box-shadow: 0 16px 45px rgba(0, 0, 0, 0.6), 0 0 25px rgba(37, 162, 107, 0.18);

        &:hover {
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(46, 196, 134, 0.35);
        }
      }

      &.venue-suite-card {
        background: radial-gradient(circle at 90% 10%, rgba(48, 22, 28, 0.88) 0%, rgba(18, 8, 12, 0.98) 100%);
        border: 1.5px solid rgba(223, 178, 93, 0.45);
        box-shadow: 0 16px 45px rgba(0, 0, 0, 0.6), 0 0 25px rgba(223, 178, 93, 0.18);

        &:hover {
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(223, 178, 93, 0.35);
        }
      }
    }

    .suite-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 5px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;

      .badge-icon {
        width: 14px;
        height: 14px;
      }

      &.emerald-badge {
        background: rgba(46, 196, 134, 0.18);
        border: 1px solid rgba(46, 196, 134, 0.45);
        color: #74f5bb;
      }

      &.gold-badge {
        background: rgba(223, 178, 93, 0.18);
        border: 1px solid rgba(223, 178, 93, 0.45);
        color: #fae09a;
      }
    }

    .suite-title {
      font-family: var(--font-royal);
      font-size: clamp(20px, 4vw, 24px);
      font-weight: 700;
      color: #fff8ec;
      line-height: 1.25;
    }

    .suite-desc {
      font-family: var(--font-sans);
      font-size: 13.5px;
      color: rgba(251, 245, 232, 0.75);
      line-height: 1.5;
    }

    /* RSVP Inline Form Styles */
    .rsvp-inline-form {
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 100%;
      margin-top: 4px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    .field-label {
      font-family: var(--font-sans);
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #fae09a;
    }

    .field-error {
      font-family: var(--font-sans);
      font-size: 12px;
      color: #ff8b94;
    }

    .gold-field-input {
      width: 100%;
      padding: 12px 16px;
      border-radius: 12px;
      background: rgba(8, 20, 14, 0.9);
      border: 1.2px solid rgba(46, 196, 134, 0.4);
      color: #ffffff;
      font-family: var(--font-sans);
      font-size: 14px;
      outline: none;
      transition: all 0.2s ease;

      &:focus {
        border-color: #38df96;
        box-shadow: 0 0 12px rgba(46, 196, 134, 0.4);
      }

      &::placeholder {
        color: rgba(251, 245, 232, 0.4);
      }
    }

    .status-pill-toggle {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .status-choice-btn {
      flex: 1;
      min-width: 130px;
      padding: 9px 12px;
      border-radius: 12px;
      background: rgba(8, 20, 14, 0.85);
      border: 1px solid rgba(46, 196, 134, 0.35);
      color: rgba(251, 245, 232, 0.8);
      font-family: var(--font-sans);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover, &.active {
        background: rgba(46, 196, 134, 0.25);
        border-color: #38df96;
        color: #ffffff;
      }
    }

    .guest-pills-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .guest-pill {
      padding: 7px 12px;
      border-radius: 20px;
      background: rgba(8, 20, 14, 0.85);
      border: 1px solid rgba(46, 196, 134, 0.3);
      color: #fae09a;
      font-family: var(--font-sans);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover, &.active {
        background: rgba(46, 196, 134, 0.3);
        border-color: #ffffff;
        color: #ffffff;
      }
    }

    .rsvp-submit-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 6px;
      width: 100%;
    }

    .primary-submit-rsvp-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 13px 24px;
      border-radius: 30px;
      background: linear-gradient(135deg, #1b7a4f 0%, #0d4b2e 100%);
      border: 1px solid #38df96;
      color: #ffffff;
      font-family: var(--font-sans);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.03em;
      box-shadow: 0 8px 24px rgba(13, 75, 46, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3);
      cursor: pointer;
      transition: all 0.25s ease;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(46, 196, 134, 0.6);
        background: linear-gradient(135deg, #249963 0%, #135d39 100%);
      }

      &:disabled {
        opacity: 0.6;
        cursor: wait;
      }

      .wa-btn-icon {
        width: 18px;
        height: 18px;
      }
    }

    .quick-tap-rsvp-link {
      font-family: var(--font-sans);
      font-size: 12px;
      color: #74f5bb;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: #ffffff;
        text-decoration: underline;
      }
    }

    /* Confirmed Panel */
    .rsvp-confirmed-panel {
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 100%;
      padding: 16px;
      border-radius: 16px;
      background: rgba(8, 28, 18, 0.85);
      border: 1px solid rgba(46, 196, 134, 0.5);
    }

    .confirmed-header {
      display: flex;
      align-items: center;
      gap: 12px;

      .confirmed-check-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #2ec486;
        color: #072218;
        font-size: 18px;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .confirmed-title {
        font-family: var(--font-royal);
        font-size: 17px;
        font-weight: 700;
        color: #d8f3dc;
      }

      .confirmed-subtitle {
        font-family: var(--font-sans);
        font-size: 12.5px;
        color: #fae09a;
      }
    }

    .confirmed-summary-box {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-family: var(--font-sans);
      font-size: 12.5px;

      .summary-line {
        display: flex;
        gap: 8px;
      }
      .sum-label {
        color: rgba(223, 178, 93, 0.8);
        font-weight: 600;
      }
      .sum-val {
        color: #ffffff;
      }
    }

    .confirmed-action-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 4px;
    }

    .resend-wa-btn {
      padding: 9px 18px;
      border-radius: 20px;
      background: linear-gradient(135deg, #1b7a4f 0%, #0d4b2e 100%);
      border: 1px solid #38df96;
      color: #ffffff;
      font-family: var(--font-sans);
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #249963;
      }
    }

    .edit-rsvp-btn {
      background: none;
      border: 1px solid rgba(46, 196, 134, 0.4);
      border-radius: 20px;
      padding: 9px 16px;
      color: #74f5bb;
      font-family: var(--font-sans);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        color: #ffffff;
        background: rgba(46, 196, 134, 0.15);
      }
    }

    /* Venue Navigation */
    .suite-venue-address {
      font-family: var(--font-sans);
      font-size: 13px;
      font-weight: 600;
      color: #fae09a;
      letter-spacing: 0.04em;
    }

    .venue-action-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin-top: auto;
      padding-top: 10px;
      width: 100%;
    }

    .primary-venue-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 13px 24px;
      border-radius: 30px;
      background: linear-gradient(135deg, rgba(223, 178, 93, 0.32) 0%, rgba(138, 90, 24, 0.3) 100%);
      border: 1px solid rgba(255, 243, 196, 0.65);
      color: #fff8eb;
      font-family: var(--font-sans);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.03em;
      text-decoration: none;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 243, 196, 0.3);
      cursor: pointer;
      transition: all 0.25s ease;

      &:hover {
        transform: translateY(-2px);
        border-color: #ffffff;
        box-shadow: 0 12px 30px rgba(223, 178, 93, 0.4);
        background: linear-gradient(135deg, rgba(223, 178, 93, 0.45) 0%, rgba(138, 90, 24, 0.4) 100%);
      }

      .nav-icon {
        width: 17px;
        height: 17px;
      }
    }

    .copy-address-btn {
      background: none;
      border: 1px solid rgba(223, 178, 93, 0.35);
      border-radius: 30px;
      padding: 11px 18px;
      color: #fae09a;
      font-family: var(--font-sans);
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;

      &:hover {
        background: rgba(223, 178, 93, 0.15);
        color: #ffffff;
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
      max-width: 680px;
    }

    .section-eyebrow {
      font-family: var(--font-sans);
      font-size: 12px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(223, 178, 93, 0.9);
      font-weight: 700;
    }

    .section-heading {
      font-family: var(--font-royal);
      font-size: clamp(28px, 6vw, 44px);
      font-weight: 700;
      color: #fff9ed;
      letter-spacing: 0.04em;
    }

    .section-subtext {
      font-family: var(--font-sans);
      font-size: 14px;
      color: rgba(251, 245, 232, 0.7);
      line-height: 1.6;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 26px;
      width: 100%;
    }

    .photo-card {
      position: relative;
      border-radius: 22px;
      background: radial-gradient(circle at 50% 50%, rgba(38, 15, 20, 0.9) 0%, rgba(14, 5, 8, 0.98) 100%);
      border: 1.5px solid rgba(223, 178, 93, 0.35);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65);
      overflow: hidden;
      cursor: pointer;
      min-height: 340px;
      transform-style: preserve-3d;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;

      &:hover {
        border-color: rgba(255, 243, 196, 0.7);
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(223, 178, 93, 0.3);

        .custom-photo-img {
          transform: scale(1.05);
        }

        .frame-shimmer {
          transform: translateX(100%);
        }

        .tap-hint {
          color: #fff8db;
          transform: translateX(4px);
        }
      }

      &.portrait {
        min-height: 380px;
      }
    }

    .corner-filigree {
      position: absolute;
      width: 22px;
      height: 22px;
      border: 2px solid #dfb25d;
      pointer-events: none;
      z-index: 4;

      &.top-left {
        top: 10px;
        left: 10px;
        border-right: none;
        border-bottom: none;
      }
      &.top-right {
        top: 10px;
        right: 10px;
        border-left: none;
        border-bottom: none;
      }
      &.bottom-left {
        bottom: 10px;
        left: 10px;
        border-right: none;
        border-top: none;
      }
      &.bottom-right {
        bottom: 10px;
        right: 10px;
        border-left: none;
        border-top: none;
      }
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
      background: radial-gradient(circle at center, rgba(58, 22, 28, 0.5) 0%, rgba(14, 5, 8, 0.9) 70%);

      .watermark-svg {
        width: 68px;
        height: 68px;
      }

      .placeholder-badge {
        font-family: var(--font-sans);
        font-size: 11px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        padding: 5px 14px;
        border-radius: 20px;
        background: rgba(223, 178, 93, 0.12);
        border: 1px solid rgba(223, 178, 93, 0.3);
        color: #fae09a;
        font-weight: 600;
      }
    }

    .frame-shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 243, 196, 0.12), transparent);
      transform: translateX(-100%);
      transition: transform 0.8s ease-in-out;
      pointer-events: none;
    }

    .photo-caption-bar {
      position: relative;
      z-index: 3;
      padding: 30px 20px 18px;
      background: linear-gradient(180deg, transparent 0%, rgba(10, 4, 6, 0.95) 60%);
      display: flex;
      flex-direction: column;
      gap: 4px;
      text-align: left;
    }

    .photo-card-title {
      font-family: var(--font-royal);
      font-size: 18px;
      font-weight: 700;
      color: #fff9ee;
    }

    .photo-card-sub {
      font-family: var(--font-caveat);
      font-size: 17px;
      color: #fae09a;
    }

    .tap-hint {
      font-family: var(--font-sans);
      font-size: 11.5px;
      color: rgba(223, 178, 93, 0.7);
      margin-top: 4px;
      font-weight: 600;
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
      background: radial-gradient(circle at 50% 0%, rgba(42, 16, 22, 0.9) 0%, rgba(14, 5, 8, 0.98) 100%);
      border: 1.5px solid rgba(223, 178, 93, 0.38);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
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
        background: linear-gradient(135deg, #fff3c4 0%, #dfb25d 50%, #fae09a 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .banner-sub {
        font-family: var(--font-sans);
        font-size: 12px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: rgba(223, 178, 93, 0.85);
        font-weight: 700;
      }
    }

    .ceremony-lead {
      font-family: var(--font-caveat);
      font-size: clamp(19px, 4vw, 24px);
      color: rgba(251, 245, 232, 0.9);
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
      background: rgba(24, 9, 13, 0.75);
      border: 1px solid rgba(223, 178, 93, 0.22);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      .hl-icon {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: rgba(223, 178, 93, 0.12);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 4px;

        svg {
          width: 20px;
          height: 20px;
          stroke: #dfb25d;
        }
      }

      .hl-title {
        font-family: var(--font-royal);
        font-size: 15px;
        font-weight: 700;
        color: #fae09a;
      }

      .hl-value {
        font-family: var(--font-sans);
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
      }

      .hl-note {
        font-family: var(--font-sans);
        font-size: 12.5px;
        color: rgba(251, 245, 232, 0.65);
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
      background: linear-gradient(180deg, transparent 0%, rgba(223, 178, 93, 0.6) 15%, rgba(223, 178, 93, 0.6) 85%, transparent 100%);
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
      background: #14070a;
      border: 2px solid #dfb25d;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;

      .inner-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #fae09a;
      }

      &.special-gold-dot {
        border-color: #fff3c4;
        box-shadow: 0 0 14px #dfb25d;

        .inner-dot {
          background: #dfb25d;
        }
      }
    }

    .timeline-content {
      padding: 18px 24px;
      border-radius: 18px;
      background: rgba(28, 12, 16, 0.85);
      border: 1px solid rgba(223, 178, 93, 0.28);
      backdrop-filter: blur(14px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
      max-width: 320px;

      &.highlight-content {
        border-color: rgba(223, 178, 93, 0.6);
        background: radial-gradient(circle at 50% 0%, rgba(48, 18, 25, 0.95), rgba(20, 8, 12, 0.98));
        box-shadow: 0 10px 30px rgba(223, 178, 93, 0.2);
      }

      .time-badge {
        display: inline-block;
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.1em;
        color: #fae09a;
        margin-bottom: 6px;

        &.gold-time {
          color: #fff3c4;
          background: rgba(223, 178, 93, 0.2);
          padding: 2px 8px;
          border-radius: 12px;
        }
      }

      .node-title {
        font-family: var(--font-royal);
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 4px;
      }

      .node-desc {
        font-family: var(--font-sans);
        font-size: 12.5px;
        color: rgba(251, 245, 232, 0.68);
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
      background: rgba(26, 11, 15, 0.82);
      border: 1px solid rgba(223, 178, 93, 0.28);
      backdrop-filter: blur(16px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      gap: 10px;
      text-align: left;
      transform-style: preserve-3d;
      transition: transform 0.25s ease-out, border-color 0.25s ease;

      &:hover {
        border-color: rgba(255, 243, 196, 0.6);
        box-shadow: 0 18px 45px rgba(0, 0, 0, 0.7), 0 0 25px rgba(223, 178, 93, 0.2);
      }

      .story-chapter-num {
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.2em;
        color: #dfb25d;
      }

      .story-heading {
        font-family: var(--font-royal);
        font-size: 19px;
        font-weight: 700;
        color: #fff9ee;
      }

      .story-text {
        font-family: var(--font-caveat);
        font-size: 18px;
        color: rgba(251, 245, 232, 0.85);
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
      background: radial-gradient(circle at 50% 0%, rgba(42, 16, 22, 0.9) 0%, rgba(18, 7, 10, 0.95) 100%);
      border: 1.5px solid rgba(223, 178, 93, 0.35);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
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
      background: rgba(14, 5, 8, 0.8);
      border: 1px solid rgba(223, 178, 93, 0.35);
      color: #fff9ee;
      font-family: var(--font-sans);
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;

      &:focus {
        border-color: #fae09a;
        box-shadow: 0 0 14px rgba(223, 178, 93, 0.3);
      }

      &::placeholder {
        color: rgba(251, 245, 232, 0.4);
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
      background: rgba(14, 5, 8, 0.8);
      border: 1px solid rgba(223, 178, 93, 0.25);
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, border-color 0.2s ease;

      &:hover, &.active {
        transform: scale(1.15);
        border-color: #dfb25d;
        background: rgba(223, 178, 93, 0.2);
      }
    }

    .gold-textarea {
      width: 100%;
      padding: 14px 18px;
      border-radius: 12px;
      background: rgba(14, 5, 8, 0.8);
      border: 1px solid rgba(223, 178, 93, 0.35);
      color: #fff9ee;
      font-family: var(--font-sans);
      font-size: 14px;
      line-height: 1.5;
      outline: none;
      resize: vertical;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;

      &:focus {
        border-color: #fae09a;
        box-shadow: 0 0 14px rgba(223, 178, 93, 0.3);
      }

      &::placeholder {
        color: rgba(251, 245, 232, 0.4);
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
      background: linear-gradient(135deg, #fae09a 0%, #dfb25d 50%, #94641c 100%);
      border: none;
      color: #14070a;
      font-family: var(--font-sans);
      font-size: 13.5px;
      font-weight: 700;
      letter-spacing: 0.04em;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(223, 178, 93, 0.35);
      transition: all 0.25s ease;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(223, 178, 93, 0.5);
      }

      &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
    }

    .blessing-toast {
      font-family: var(--font-caveat);
      font-size: 18px;
      color: #fae09a;
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
      background: rgba(24, 10, 14, 0.85);
      border: 1px solid rgba(223, 178, 93, 0.22);
      backdrop-filter: blur(12px);
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
        color: #fff9ee;
      }

      .bubble-date {
        font-family: var(--font-sans);
        font-size: 11px;
        color: rgba(223, 178, 93, 0.65);
        margin-left: auto;
      }
    }

    .bubble-msg {
      font-family: var(--font-caveat);
      font-size: 17.5px;
      color: rgba(251, 245, 232, 0.88);
      line-height: 1.4;
      flex: 1;
    }

    .forward-wa-btn {
      background: none;
      border: none;
      color: rgba(223, 178, 93, 0.8);
      font-family: var(--font-sans);
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      text-align: left;
      margin-top: 4px;
      transition: color 0.2s ease;

      &:hover {
        color: #fff3c4;
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
      border-top: 1px solid rgba(223, 178, 93, 0.2);
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
        filter: drop-shadow(0 0 10px rgba(223, 178, 93, 0.4));
      }
    }

    .footer-blessing-text {
      font-family: var(--font-caveat);
      font-size: clamp(20px, 4.5vw, 25px);
      color: rgba(223, 178, 93, 0.85);
    }

    .footer-signoff-names {
      font-family: var(--font-caveat);
      font-size: clamp(34px, 7vw, 48px);
      font-weight: 700;
      color: #fff8ee;
      letter-spacing: 0.02em;
    }

    .footer-coordinates {
      font-family: var(--font-sans);
      font-size: 11.5px;
      letter-spacing: 0.16em;
      color: rgba(223, 178, 93, 0.6);
      text-transform: uppercase;
      margin-top: 6px;
    }

    .footer-credit {
      font-family: var(--font-sans);
      font-size: 11px;
      color: rgba(251, 245, 232, 0.35);
      letter-spacing: 0.08em;
    }

    /* Modals Backdrop */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(4, 2, 3, 0.88);
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
      background: radial-gradient(circle at 50% 0%, rgba(48, 18, 25, 0.98) 0%, rgba(14, 5, 8, 0.98) 100%);
      border: 1.5px solid rgba(223, 178, 93, 0.55);
      border-radius: 26px;
      padding: 34px 30px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 30px 90px rgba(0, 0, 0, 0.95), 0 0 50px rgba(223, 178, 93, 0.3);
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
      color: rgba(223, 178, 93, 0.8);
      font-size: 28px;
      line-height: 1;
      cursor: pointer;
      transition: color 0.2s ease;

      &:hover {
        color: #ffffff;
      }
    }

    .modal-title {
      font-family: var(--font-royal);
      font-size: 22px;
      font-weight: 700;
      color: #fff9ee;
      margin-bottom: 4px;
    }

    .modal-sub {
      font-family: var(--font-caveat);
      font-size: 18px;
      color: #fae09a;
      margin-bottom: 20px;
    }

    .modal-preview-frame {
      width: 100%;
      height: 280px;
      border-radius: 16px;
      overflow: hidden;
      background: #0d0407;
      border: 1px solid rgba(223, 178, 93, 0.25);
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
      }

      .modal-box-tip {
        font-family: var(--font-sans);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #fae09a;
      }

      .modal-sub-tip {
        font-family: var(--font-sans);
        font-size: 12px;
        color: rgba(251, 245, 232, 0.6);
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
      background: linear-gradient(135deg, #fae09a 0%, #dfb25d 50%, #94641c 100%);
      color: #14070a;
      font-family: var(--font-sans);
      font-size: 13.5px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(223, 178, 93, 0.35);
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 28px rgba(223, 178, 93, 0.5);
      }
    }

    .reset-photo-btn {
      padding: 11px 20px;
      border-radius: 30px;
      background: none;
      border: 1px solid rgba(223, 178, 93, 0.4);
      color: #fae09a;
      font-family: var(--font-sans);
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        background: rgba(223, 178, 93, 0.15);
        color: #ffffff;
      }
    }

    .svg-defs {
      position: absolute;
      width: 0;
      height: 0;
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
    cardEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
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
    dialEl.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px)';
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
