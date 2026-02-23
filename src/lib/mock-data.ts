import { Company, SLIDE_NAMES, TOTAL_SLIDES, SlideEngagement } from './types';

function makeSlides(lastReached: number, hasReplay: boolean): SlideEngagement[] {
  return SLIDE_NAMES.map((name, i) => ({
    slideIndex: i,
    slideName: name,
    visited: i <= lastReached,
    replayed: hasReplay && i <= 1 && i <= lastReached,
  }));
}

function eng(
  mailOpenedAt: string,
  time: number,
  lastSlide: number,
  hasReplay: boolean,
  lastActive: string,
  device: 'desktop' | 'mobile' | 'tablet',
) {
  const viewed = lastSlide + 1;
  return {
    mailOpenedAt,
    timeSpentSeconds: time,
    completionPercent: Math.round((viewed / TOTAL_SLIDES) * 100),
    slidesViewed: viewed,
    totalSlides: TOTAL_SLIDES,
    lastSlideReached: lastSlide,
    lastActiveAt: lastActive,
    deviceType: device,
    slideBreakdown: makeSlides(lastSlide, hasReplay),
  };
}

export const mockCompanies: Company[] = [
  // ── Compagnie 1 : ENVOYÉE — tous les contacts ont un lien, mail envoyé par lot ──
  {
    id: 'comp_1',
    name: 'Acme Corp',
    industry: 'Manufacturing',
    contacts: [
      {
        id: 'c_1', firstName: 'Jean', lastName: 'Dupont',
        email: 'jean.dupont@acme.com', role: 'CISO',
        scorecardName: 'Acme_Security_Report_Q1.pdf',
        link: 'https://ai.scorecard.com/v/a1b2c3d4', status: 'read',
        createdAt: '2024-01-10T09:00:00Z',
        engagement: eng('2024-01-14T10:05:00Z', 185, 4, true, '2024-01-14T10:08:05Z', 'desktop'),
      },
      {
        id: 'c_2', firstName: 'Marie', lastName: 'Curie',
        email: 'marie.curie@acme.com', role: 'CEO',
        scorecardName: 'Acme_Exec_Summary_Q1.pdf',
        link: 'https://ai.scorecard.com/v/x9y8z7w6', status: 'read',
        createdAt: '2024-01-10T09:00:00Z',
        engagement: eng('2024-01-14T11:30:00Z', 130, 4, false, '2024-01-14T11:32:10Z', 'mobile'),
      },
      {
        id: 'c_3', firstName: 'Paul', lastName: 'Martin',
        email: 'paul.martin@acme.com', role: 'IT Manager',
        scorecardName: 'Acme_IT_Metrics_Q1.pdf',
        link: 'https://ai.scorecard.com/v/p3q4r5s6', status: 'sent',
        createdAt: '2024-01-10T09:00:00Z', engagement: null,
      },
      {
        id: 'c_4', firstName: 'Sophie', lastName: 'Bernard',
        email: 'sophie.bernard@acme.com', role: 'Risk Manager',
        scorecardName: 'Acme_Risk_Overview_Q1.pdf',
        link: 'https://ai.scorecard.com/v/r4s5t6u7', status: 'read',
        createdAt: '2024-01-10T09:00:00Z',
        engagement: eng('2024-01-15T09:00:00Z', 210, 4, true, '2024-01-15T09:03:30Z', 'desktop'),
      },
    ],
  },
  // ── Compagnie 2 : ENVOYÉE — tous envoyés, certains lus ──
  {
    id: 'comp_2',
    name: 'Global Tech Industries',
    industry: 'Technology',
    contacts: [
      {
        id: 'c_5', firstName: 'Sarah', lastName: 'Connor',
        email: 's.connor@globaltech.com', role: 'Head of Security',
        scorecardName: 'GlobalTech_Risk_Assessment.pdf',
        link: 'https://ai.scorecard.com/v/f5g6h7j8', status: 'read',
        createdAt: '2024-01-08T10:00:00Z',
        engagement: eng('2024-01-12T09:00:00Z', 95, 4, true, '2024-01-12T09:01:35Z', 'desktop'),
      },
      {
        id: 'c_6', firstName: 'John', lastName: 'Smith',
        email: 'j.smith@globaltech.com', role: 'CTO',
        scorecardName: 'GlobalTech_Tech_Debt.pdf',
        link: 'https://ai.scorecard.com/v/j6k7l8m9', status: 'sent',
        createdAt: '2024-01-08T10:00:00Z', engagement: null,
      },
      {
        id: 'c_7', firstName: 'Emily', lastName: 'Zhang',
        email: 'e.zhang@globaltech.com', role: 'VP Engineering',
        scorecardName: 'GlobalTech_Infra_Review.pdf',
        link: 'https://ai.scorecard.com/v/k1l2m3n4', status: 'read',
        createdAt: '2024-01-09T10:00:00Z',
        engagement: eng('2024-01-13T16:00:00Z', 150, 4, false, '2024-01-13T16:02:30Z', 'tablet'),
      },
    ],
  },
  // ── Compagnie 3 : ENVOYÉE — tous envoyés, mix read/sent ──
  {
    id: 'comp_3',
    name: 'CyberShield Financial',
    industry: 'Finance',
    contacts: [
      {
        id: 'c_8', firstName: 'Lucas', lastName: 'Moreau',
        email: 'l.moreau@cybershield.fin', role: 'DSI',
        scorecardName: 'CyberShield_Full_Audit.pdf',
        link: 'https://ai.scorecard.com/v/csf_01', status: 'read',
        createdAt: '2024-01-05T08:00:00Z',
        engagement: eng('2024-01-09T14:00:00Z', 175, 4, true, '2024-01-09T14:02:55Z', 'desktop'),
      },
      {
        id: 'c_9', firstName: 'Camille', lastName: 'Leroy',
        email: 'c.leroy@cybershield.fin', role: 'Compliance Officer',
        scorecardName: 'CyberShield_Compliance.pdf',
        link: 'https://ai.scorecard.com/v/csf_02', status: 'sent',
        createdAt: '2024-01-05T08:00:00Z', engagement: null,
      },
      {
        id: 'c_10', firstName: 'Antoine', lastName: 'Petit',
        email: 'a.petit@cybershield.fin', role: 'Risk Manager',
        scorecardName: 'CyberShield_Risk_Matrix.pdf',
        link: 'https://ai.scorecard.com/v/csf_03', status: 'read',
        createdAt: '2024-01-06T08:00:00Z',
        engagement: eng('2024-01-11T15:30:00Z', 140, 3, false, '2024-01-11T15:32:20Z', 'desktop'),
      },
      {
        id: 'c_11', firstName: 'Nadia', lastName: 'Benali',
        email: 'n.benali@cybershield.fin', role: 'CISO',
        scorecardName: 'CyberShield_CISO_Brief.pdf',
        link: 'https://ai.scorecard.com/v/csf_04', status: 'read',
        createdAt: '2024-01-06T08:00:00Z',
        engagement: eng('2024-01-10T08:15:00Z', 190, 4, false, '2024-01-10T08:18:10Z', 'mobile'),
      },
      {
        id: 'c_12', firstName: 'Thomas', lastName: 'Roux',
        email: 't.roux@cybershield.fin', role: 'IT Manager',
        scorecardName: 'CyberShield_IT_Ops.pdf',
        link: 'https://ai.scorecard.com/v/csf_05', status: 'sent',
        createdAt: '2024-01-07T08:00:00Z', engagement: null,
      },
    ],
  },
  // ── Compagnie 4 : LIENS GÉNÉRÉS mais PAS ENCORE ENVOYÉS ──
  {
    id: 'comp_4',
    name: 'MedSecure Health',
    industry: 'Healthcare',
    contacts: [
      {
        id: 'c_13', firstName: 'Claire', lastName: 'Fontaine',
        email: 'c.fontaine@medsecure.health', role: 'CIO',
        scorecardName: 'MedSecure_HIPAA_Review.pdf',
        link: 'https://ai.scorecard.com/v/ms_01', status: 'not_sent',
        createdAt: '2024-01-12T08:00:00Z', engagement: null,
      },
      {
        id: 'c_14', firstName: 'Marc', lastName: 'Dubois',
        email: 'm.dubois@medsecure.health', role: 'Head of Compliance',
        scorecardName: 'MedSecure_Compliance_Audit.pdf',
        link: 'https://ai.scorecard.com/v/ms_02', status: 'not_sent',
        createdAt: '2024-01-12T08:00:00Z', engagement: null,
      },
      {
        id: 'c_15', firstName: 'Isabelle', lastName: 'Garnier',
        email: 'i.garnier@medsecure.health', role: 'DPO',
        scorecardName: 'MedSecure_Data_Protection.pdf',
        link: 'https://ai.scorecard.com/v/ms_03', status: 'not_sent',
        createdAt: '2024-01-13T08:00:00Z', engagement: null,
      },
    ],
  },
  // ── Compagnie 5 : PAS ENCORE DE LIENS GÉNÉRÉS ──
  {
    id: 'comp_5',
    name: 'EnergiePlus',
    industry: 'Energy',
    contacts: [
      {
        id: 'c_16', firstName: 'Hugo', lastName: 'Lambert',
        email: 'h.lambert@energieplus.eu', role: 'CISO',
        scorecardName: 'EnergiePlus_OT_Security.pdf',
        link: null, status: 'not_sent',
        createdAt: '2024-01-14T08:00:00Z', engagement: null,
      },
      {
        id: 'c_17', firstName: 'Léa', lastName: 'Mercier',
        email: 'l.mercier@energieplus.eu', role: 'CEO',
        scorecardName: 'EnergiePlus_Exec_Brief.pdf',
        link: null, status: 'not_sent',
        createdAt: '2024-01-14T08:00:00Z', engagement: null,
      },
    ],
  },
];
