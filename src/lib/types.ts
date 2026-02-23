export type Status = 'not_sent' | 'sent' | 'read';

export const SLIDE_NAMES = [
  'Score Global',
  'Indicateurs',
  'Vulnérabilités',
  'Radar Chart',
  'Score Final',
] as const;

export const TOTAL_SLIDES = SLIDE_NAMES.length;

export interface SlideEngagement {
  slideIndex: number;
  slideName: string;
  visited: boolean;
  replayed: boolean;
}

export interface EngagementData {
  mailOpenedAt: string | null;
  timeSpentSeconds: number;
  completionPercent: number;
  slidesViewed: number;
  totalSlides: number;
  lastSlideReached: number;
  lastActiveAt: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  slideBreakdown: SlideEngagement[];
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  scorecardName: string;
  link: string | null;
  status: Status;
  engagement: EngagementData | null;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  contacts: Contact[];
}

export type Page = 'dashboard' | 'ingestion' | 'analytics';
