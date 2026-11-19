export interface InviteConfig {
  mapsUrl: string;
  whatsappRsvpUrl: string;
  musicEnabled: boolean;
  weddingDateISO: string;
}

export const INVITE_CONFIG: InviteConfig = {
  mapsUrl: 'https://maps.google.com/?q=St+Pauls+Auditorium+Puthoor+Kottarakkara',
  whatsappRsvpUrl: 'https://wa.me/?text=Congratulations%20Ammu%20and%20Ajith!%20Delighted%20to%20attend.',
  musicEnabled: false,
  weddingDateISO: '2027-04-04T10:15:00+05:30',
};
