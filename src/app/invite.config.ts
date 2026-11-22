export interface InviteConfig {
  mapsUrl: string;
  whatsappRsvpUrl: string;
  musicEnabled: boolean;
  weddingDateISO: string;
  /**
   * Optional direct WhatsApp number for RSVP (international format without + or spaces, e.g. '919876543210').
   * If left blank, WhatsApp will open with contact picker.
   */
  whatsappPhoneNumber?: string;
  /**
   * Optional Google Sheets Web App / Formspree / API webhook URL to automatically store RSVP submissions.
   */
  rsvpEndpointUrl?: string;
}

export const INVITE_CONFIG: InviteConfig = {
  mapsUrl: 'https://maps.google.com/?q=St+Pauls+Auditorium+Puthoor+Kottarakkara',
  whatsappRsvpUrl: 'https://wa.me/?text=Congratulations%20Ammu%20and%20Ajith!%20Delighted%20to%20attend.',
  whatsappPhoneNumber: '', // Fill with bride/groom WhatsApp number e.g. '91XXXXXXXXXX'
  rsvpEndpointUrl: '',     // Fill with Google Sheet / Webhook URL if automatic online logging is desired
  musicEnabled: false,
  weddingDateISO: '2027-04-04T10:15:00+05:30',
};
