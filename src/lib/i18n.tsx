import React, { createContext, useContext, useState, useMemo } from 'react';

type Language = 'fr' | 'en';

type Translations = Record<string, string>;

const fr: Translations = {
  // Navigation
  'nav.dashboard': 'Tableau de bord',
  'nav.ingestion': 'Ingestion',
  'nav.analytics': 'Analytics',
  
  // Header
  'header.search': 'Rechercher...',
  'header.admin': 'Admin',
  
  // Dashboard
  'dashboard.kpi.companies': 'Entreprises',
  'dashboard.kpi.contacts': 'contacts',
  'dashboard.kpi.read': 'Mails lus',
  'dashboard.kpi.read.sub': '% du total',
  'dashboard.kpi.sent': 'Campagnes envoyées',
  'dashboard.kpi.sent.sub': 'sur {total} entreprises',
  'dashboard.kpi.not_sent': 'Sans liens',
  'dashboard.kpi.not_sent.sub': 'Liens à générer',
  'dashboard.search.placeholder': 'Rechercher entreprise, contact, rôle…',
  'dashboard.table.contact': 'Contact',
  'dashboard.table.role': 'Rôle',
  'dashboard.table.scorecard': 'Scorecard',
  'dashboard.table.status': 'Statut',
  'dashboard.table.link': 'Lien',
  'dashboard.table.actions': 'Actions',
  'dashboard.table.no_results': 'Aucun résultat pour « {search} »',
  'dashboard.badge.read': 'Lu',
  'dashboard.badge.sent': 'Envoyé',
  'dashboard.badge.not_sent': 'Non envoyé',
  'dashboard.badge.company.sent': 'Envoyé',
  'dashboard.badge.company.links_ready': 'Liens prêts',
  'dashboard.badge.company.no_links': 'Pas de liens',
  'dashboard.progress.read': 'lus',
  'dashboard.action.generate': 'Générer',
  'dashboard.action.generate.title': 'Générer les liens pour cette entreprise',
  'dashboard.action.send': 'Envoyer',
  'dashboard.action.send.title': 'Envoyer les mails pour cette entreprise',
  'dashboard.action.resend': 'Relancer',
  'dashboard.action.resend.title': 'Relancer cette entreprise',
  'dashboard.action.view_engagement': 'Voir l\'engagement',
  'dashboard.action.copy_link': 'Copier le lien',
  
  // Analytics
  'analytics.title': 'Analytics',
  'analytics.subtitle': 'Taux d\'ouverture des mails et complétion des expériences.',
  'analytics.tab.global': 'Global',
  'analytics.tab.company': 'Par entreprise',
  'analytics.tab.individual': 'Par individu',
  'analytics.select.individual': '— Sélectionner un individu —',
  'analytics.select.company': 'Sélectionnez une entreprise.',
  'analytics.select.contact': 'Sélectionnez un individu dans la liste ci-dessus.',
  'analytics.no_data': 'Aucune donnée d\'engagement disponible.',
  'analytics.kpi.open_rate': 'Mails ouverts',
  'analytics.kpi.completion': 'Complétion moy.',
  'analytics.kpi.completion.ind': 'Complétion',
  'analytics.kpi.completion.sub': 'à 100%',
  'analytics.kpi.completion.slides': 'slides',
  'analytics.kpi.time': 'Temps moyen',
  'analytics.kpi.time.ind': 'Temps passé',
  'analytics.kpi.time.sub': 'par session',
  'analytics.kpi.replay': 'Taux de replay',
  'analytics.kpi.replay.ind': 'Slides rejouées',
  'analytics.kpi.replay.sub': 'ont rejoué des slides',
  'analytics.chart.status': 'Répartition des statuts',
  'analytics.chart.status.opened': 'Mail ouvert',
  'analytics.chart.status.sent': 'Envoyé (non ouvert)',
  'analytics.chart.status.not_sent': 'Non envoyé',
  'analytics.chart.company_open_completion': 'Ouverture mail & Complétion par entreprise (%)',
  'analytics.chart.open_rate': 'Ouverture mail (%)',
  'analytics.chart.completion_rate': 'Complétion slides (%)',
  'analytics.chart.views_replays': 'Vues & Replays par slide',
  'analytics.chart.views': 'Vues',
  'analytics.chart.replays': 'Rejouées',
  'analytics.chart.completion_area': 'Taux de complétion par entreprise',
  'analytics.chart.completion_contact': 'Complétion par contact (%)',
  'analytics.chart.completion': 'Complétion (%)',
  'analytics.chart.sessions': '% des sessions',
  'analytics.table.contact': 'Contact',
  'analytics.table.mail_opened': 'Mail ouvert',
  'analytics.table.completion': 'Complétion',
  'analytics.table.time': 'Temps',
  'analytics.table.replay': 'Replay',
  'analytics.table.yes': 'Oui',
  'analytics.table.no': 'Non',
  'analytics.progression': 'Progression par slide',
  'analytics.progression.viewed': 'Vue',
  'analytics.progression.replayed': 'Rejouée',
  
  // Ingestion
  'ingestion.title': 'Ingestion',
  'ingestion.subtitle': 'Importez des scorecards (PDF) et/ou la base de contacts (CSV).',
  'ingestion.dropzone.title': 'Glissez-déposez vos fichiers ici',
  'ingestion.dropzone.subtitle': 'PDF pour les scorecards, CSV pour les contacts',
  'ingestion.dropzone.max': 'Max 50 MB',
  'ingestion.dropzone.browse': 'Parcourir les fichiers',
  'ingestion.dropzone.supported': 'Supporté : .pdf, .csv',
  'ingestion.csv.title': 'Import CSV',
  'ingestion.csv.subtitle': 'Colonnes : Entreprise, Nom, Email, Rôle, Scorecard',
  'ingestion.api.title': 'Sync API',
  'ingestion.api.subtitle': 'Connectez votre pipeline de scorecards',
  'ingestion.files.title': 'Fichiers en attente',
  'ingestion.files.count': '{count} fichiers prêts',
  'ingestion.files.empty': 'Aucun fichier sélectionné.',
  'ingestion.action.process': 'Lancer l\'ingestion',
  'ingestion.action.processing': 'Traitement en cours...',
  'ingestion.status.success': 'Ingestion terminée avec succès.',
  'ingestion.status.error': 'Erreur lors du traitement.',
  'ingestion.status.parsing': 'Analyse des données en cours...',
  'ingestion.file.remove': 'Retirer',
  
  // Engagement Drawer
  'drawer.title': 'Détail de l\'engagement',
  'drawer.date.locale': 'fr-FR',
  'drawer.kpi.time': 'Temps total passé',
  'drawer.kpi.completion': 'Progression',
  'drawer.kpi.device': 'Appareil utilisé',
  'drawer.slides.title': 'Détail par slide',
  'drawer.slides.viewed': 'Vue',
  'drawer.slides.not_viewed': 'Non vue',
  'drawer.slides.replayed': 'Rejouée',
  'drawer.slides.none': 'Aucune',
  'drawer.mail.opened': 'Mail ouvert le',
  'drawer.mail.not_opened': 'Mail non ouvert',
  'drawer.active.last': 'Dernière activité',
  
  // Roles & Industries
  'role.CISO': 'CISO',
  'role.CEO': 'CEO',
  'role.IT Manager': 'Manager IT',
  'role.Risk Manager': 'Risk Manager',
  'role.Head of Security': 'Directeur Sécurité',
  'role.CTO': 'CTO',
  'role.VP Engineering': 'VP Engineering',
  'role.DSI': 'DSI',
  'role.Compliance Officer': 'Resp. Conformité',
  'role.CIO': 'CIO',
  'role.Head of Compliance': 'Directeur Conformité',
  'role.DPO': 'DPO',
  
  'industry.Manufacturing': 'Industrie',
  'industry.Technology': 'Technologie',
  'industry.Finance': 'Finance',
  'industry.Healthcare': 'Santé',
  'industry.Energy': 'Énergie',
};

const en: Translations = {
  // Navigation
  'nav.dashboard': 'Dashboard',
  'nav.ingestion': 'Ingestion',
  'nav.analytics': 'Analytics',
  
  // Header
  'header.search': 'Search...',
  'header.admin': 'Admin',
  
  // Dashboard
  'dashboard.kpi.companies': 'Companies',
  'dashboard.kpi.contacts': 'contacts',
  'dashboard.kpi.read': 'Emails read',
  'dashboard.kpi.read.sub': '% of total',
  'dashboard.kpi.sent': 'Campaigns sent',
  'dashboard.kpi.sent.sub': 'out of {total} companies',
  'dashboard.kpi.not_sent': 'No links',
  'dashboard.kpi.not_sent.sub': 'Links to generate',
  'dashboard.search.placeholder': 'Search company, contact, role...',
  'dashboard.table.contact': 'Contact',
  'dashboard.table.role': 'Role',
  'dashboard.table.scorecard': 'Scorecard',
  'dashboard.table.status': 'Status',
  'dashboard.table.link': 'Link',
  'dashboard.table.actions': 'Actions',
  'dashboard.table.no_results': 'No results for "{search}"',
  'dashboard.badge.read': 'Read',
  'dashboard.badge.sent': 'Sent',
  'dashboard.badge.not_sent': 'Not sent',
  'dashboard.badge.company.sent': 'Sent',
  'dashboard.badge.company.links_ready': 'Links ready',
  'dashboard.badge.company.no_links': 'No links',
  'dashboard.progress.read': 'read',
  'dashboard.action.generate': 'Generate',
  'dashboard.action.generate.title': 'Generate links for this company',
  'dashboard.action.send': 'Send',
  'dashboard.action.send.title': 'Send emails for this company',
  'dashboard.action.resend': 'Resend',
  'dashboard.action.resend.title': 'Resend to this company',
  'dashboard.action.view_engagement': 'View engagement',
  'dashboard.action.copy_link': 'Copy link',
  
  // Analytics
  'analytics.title': 'Analytics',
  'analytics.subtitle': 'Email open rates and experience completion.',
  'analytics.tab.global': 'Global',
  'analytics.tab.company': 'By company',
  'analytics.tab.individual': 'By individual',
  'analytics.select.individual': '— Select an individual —',
  'analytics.select.company': 'Select a company.',
  'analytics.select.contact': 'Select an individual from the list above.',
  'analytics.no_data': 'No engagement data available.',
  'analytics.kpi.open_rate': 'Emails opened',
  'analytics.kpi.completion': 'Avg completion',
  'analytics.kpi.completion.ind': 'Completion',
  'analytics.kpi.completion.sub': 'at 100%',
  'analytics.kpi.completion.slides': 'slides',
  'analytics.kpi.time': 'Avg time',
  'analytics.kpi.time.ind': 'Time spent',
  'analytics.kpi.time.sub': 'per session',
  'analytics.kpi.replay': 'Replay rate',
  'analytics.kpi.replay.ind': 'Slides replayed',
  'analytics.kpi.replay.sub': 'replayed slides',
  'analytics.chart.status': 'Status distribution',
  'analytics.chart.status.opened': 'Email opened',
  'analytics.chart.status.sent': 'Sent (not opened)',
  'analytics.chart.status.not_sent': 'Not sent',
  'analytics.chart.company_open_completion': 'Email opening & Completion by company (%)',
  'analytics.chart.open_rate': 'Email opened (%)',
  'analytics.chart.completion_rate': 'Slide completion (%)',
  'analytics.chart.views_replays': 'Views & Replays per slide',
  'analytics.chart.views': 'Views',
  'analytics.chart.replays': 'Replayed',
  'analytics.chart.completion_area': 'Completion rate by company',
  'analytics.chart.completion_contact': 'Completion by contact (%)',
  'analytics.chart.completion': 'Completion (%)',
  'analytics.chart.sessions': '% of sessions',
  'analytics.table.contact': 'Contact',
  'analytics.table.mail_opened': 'Email opened',
  'analytics.table.completion': 'Completion',
  'analytics.table.time': 'Time',
  'analytics.table.replay': 'Replay',
  'analytics.table.yes': 'Yes',
  'analytics.table.no': 'No',
  'analytics.progression': 'Progression per slide',
  'analytics.progression.viewed': 'Viewed',
  'analytics.progression.replayed': 'Replayed',
  
  // Ingestion
  'ingestion.title': 'Ingestion',
  'ingestion.subtitle': 'Import scorecards (PDF) and/or contact base (CSV).',
  'ingestion.dropzone.title': 'Drag and drop your files here',
  'ingestion.dropzone.subtitle': 'PDF for scorecards, CSV for contacts',
  'ingestion.dropzone.max': 'Max 50 MB',
  'ingestion.dropzone.browse': 'Browse files',
  'ingestion.dropzone.supported': 'Supported: .pdf, .csv',
  'ingestion.csv.title': 'CSV Import',
  'ingestion.csv.subtitle': 'Columns: Company, Name, Email, Role, Scorecard',
  'ingestion.api.title': 'API Sync',
  'ingestion.api.subtitle': 'Connect your scorecard pipeline',
  'ingestion.files.title': 'Pending files',
  'ingestion.files.count': '{count} ready files',
  'ingestion.files.empty': 'No files selected.',
  'ingestion.action.process': 'Start ingestion',
  'ingestion.action.processing': 'Processing...',
  'ingestion.status.success': 'Ingestion completed successfully.',
  'ingestion.status.error': 'Error during processing.',
  'ingestion.status.parsing': 'Parsing data...',
  'ingestion.file.remove': 'Remove',
  
  // Engagement Drawer
  'drawer.title': 'Engagement detail',
  'drawer.date.locale': 'en-US',
  'drawer.kpi.time': 'Total time spent',
  'drawer.kpi.completion': 'Progression',
  'drawer.kpi.device': 'Device used',
  'drawer.slides.title': 'Detail per slide',
  'drawer.slides.viewed': 'Viewed',
  'drawer.slides.not_viewed': 'Not viewed',
  'drawer.slides.replayed': 'Replayed',
  'drawer.slides.none': 'None',
  'drawer.mail.opened': 'Email opened on',
  'drawer.mail.not_opened': 'Email not opened',
  'drawer.active.last': 'Last active',
  
  // Roles & Industries
  'role.CISO': 'CISO',
  'role.CEO': 'CEO',
  'role.IT Manager': 'IT Manager',
  'role.Risk Manager': 'Risk Manager',
  'role.Head of Security': 'Head of Security',
  'role.CTO': 'CTO',
  'role.VP Engineering': 'VP Engineering',
  'role.DSI': 'CIO (DSI)',
  'role.Compliance Officer': 'Compliance Officer',
  'role.CIO': 'CIO',
  'role.Head of Compliance': 'Head of Compliance',
  'role.DPO': 'DPO',
  
  'industry.Manufacturing': 'Manufacturing',
  'industry.Technology': 'Technology',
  'industry.Finance': 'Finance',
  'industry.Healthcare': 'Healthcare',
  'industry.Energy': 'Energy',
};

const dictionaries: Record<Language, Translations> = { fr, en };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>) => {
      let str = dictionaries[language][key] || key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, String(v));
        });
      }
      return str;
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
