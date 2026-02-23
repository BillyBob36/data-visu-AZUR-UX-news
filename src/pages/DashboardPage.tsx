import { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Search,
  Mail,
  Link as LinkIcon,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  Building2,
  Users,
  Eye,
  FileText,
  Copy,
  Check,
  Link2,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { mockCompanies } from '../lib/mock-data';
import type { Contact, Company } from '../lib/types';
import { useTranslation } from '../lib/i18n';

type CompanyBatchStatus = 'no_links' | 'links_ready' | 'sent';

function getCompanyBatchStatus(company: Company): CompanyBatchStatus {
  const hasAnyLink = company.contacts.some(c => c.link);
  const hasAnySentOrRead = company.contacts.some(c => c.status === 'sent' || c.status === 'read');
  if (hasAnySentOrRead) return 'sent';
  if (hasAnyLink) return 'links_ready';
  return 'no_links';
}

interface KpiCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  color: string;
}

function KpiCard({ label, value, sub, icon, color }: KpiCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 flex items-start gap-4">
      <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0', color)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold mt-0.5">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status, t }: { status: Contact['status'], t: any }) {
  const map = {
    read: { label: t('dashboard.badge.read'), icon: <CheckCircle2 className="h-3 w-3" />, cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    sent: { label: t('dashboard.badge.sent'), icon: <Clock className="h-3 w-3" />, cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    not_sent: { label: t('dashboard.badge.not_sent'), icon: <AlertCircle className="h-3 w-3" />, cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  } as const;
  const s = map[status];
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap', s.cls)}>
      {s.icon}{s.label}
    </span>
  );
}

function CompanyStatusBadge({ status, t }: { status: CompanyBatchStatus, t: any }) {
  const map = {
    sent: { label: t('dashboard.badge.company.sent'), cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    links_ready: { label: t('dashboard.badge.company.links_ready'), cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    no_links: { label: t('dashboard.badge.company.no_links'), cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  } as const;
  const s = map[status];
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap', s.cls)}>
      {s.label}
    </span>
  );
}

function CopyButton({ text, t }: { text: string, t: any }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title={t('dashboard.action.copy_link')}>
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function CompanyProgress({ contacts, t }: { contacts: Contact[], t: any }) {
  const total = contacts.length;
  const read = contacts.filter(c => c.status === 'read').length;
  const sent = contacts.filter(c => c.status === 'sent').length;
  const pctRead = total > 0 ? (read / total) * 100 : 0;
  const pctSent = total > 0 ? (sent / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden flex">
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pctRead}%` }} />
        <div className="h-full bg-amber-400 transition-all" style={{ width: `${pctSent}%` }} />
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{read}/{total} {t('dashboard.progress.read')}</span>
    </div>
  );
}

interface DashboardPageProps {
  onViewEngagement: (contact: Contact) => void;
}

export function DashboardPage({ onViewEngagement }: DashboardPageProps) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(mockCompanies.map(c => c.id)));
  const { t } = useTranslation();

  const allContacts = useMemo(() => mockCompanies.flatMap(c => c.contacts), []);
  const totalContacts = allContacts.length;
  const totalRead = allContacts.filter(c => c.status === 'read').length;
  const companiesSent = mockCompanies.filter(c => getCompanyBatchStatus(c) === 'sent').length;
  const companiesNoLinks = mockCompanies.filter(c => getCompanyBatchStatus(c) === 'no_links').length;

  const filtered = useMemo(() => {
    if (!search.trim()) return mockCompanies;
    const q = search.toLowerCase();
    return mockCompanies
      .map(company => ({
        ...company,
        contacts: company.contacts.filter(
          c =>
            c.firstName.toLowerCase().includes(q) ||
            c.lastName.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.role.toLowerCase().includes(q) ||
            company.name.toLowerCase().includes(q)
        ),
      }))
      .filter(c => c.contacts.length > 0);
  }, [search]);

  const toggleExpand = (id: string) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          label={t('dashboard.kpi.companies')}
          value={mockCompanies.length}
          sub={`${totalContacts} ${t('dashboard.kpi.contacts')}`}
          icon={<Building2 className="h-5 w-5 text-white" />}
          color="bg-indigo-500"
        />
        <KpiCard
          label={t('dashboard.kpi.read')}
          value={totalRead}
          sub={`${Math.round((totalRead / totalContacts) * 100)}${t('dashboard.kpi.read.sub')}`}
          icon={<Eye className="h-5 w-5 text-white" />}
          color="bg-emerald-500"
        />
        <KpiCard
          label={t('dashboard.kpi.sent')}
          value={companiesSent}
          sub={t('dashboard.kpi.sent.sub', { total: mockCompanies.length })}
          icon={<Send className="h-5 w-5 text-white" />}
          color="bg-amber-500"
        />
        <KpiCard
          label={t('dashboard.kpi.not_sent')}
          value={companiesNoLinks}
          sub={t('dashboard.kpi.not_sent.sub')}
          icon={<AlertCircle className="h-5 w-5 text-white" />}
          color="bg-red-500"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('dashboard.search.placeholder')}
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground w-8" />
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('dashboard.table.contact')}</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">{t('dashboard.table.role')}</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">{t('dashboard.table.scorecard')}</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('dashboard.table.status')}</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">{t('dashboard.table.link')}</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">{t('dashboard.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(company => (
                <CompanyBlock
                  key={company.id}
                  company={company}
                  isExpanded={expanded.has(company.id)}
                  onToggleExpand={() => toggleExpand(company.id)}
                  onViewEngagement={onViewEngagement}
                  t={t}
                />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    {t('dashboard.table.no_results', { search })}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface CompanyBlockProps {
  company: Company;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onViewEngagement: (contact: Contact) => void;
  t: any;
}

function CompanyBlock({
  company, isExpanded, onToggleExpand, onViewEngagement, t
}: CompanyBlockProps) {
  const batchStatus = getCompanyBatchStatus(company);

  return (
    <>
      {/* Company row */}
      <tr
        className="bg-muted/20 hover:bg-muted/30 cursor-pointer transition-colors border-b border-border"
        onClick={onToggleExpand}
      >
        <td className="px-4 py-3">
          {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </td>
        <td className="px-4 py-3" colSpan={2}>
          <div className="flex items-center gap-2 flex-wrap">
            <Building2 className="h-4 w-4 text-primary shrink-0" />
            <span className="font-semibold">{company.name}</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full hidden sm:inline-block">
              {t(`industry.${company.industry}`)}
            </span>
            <span className="text-xs text-muted-foreground">
              <Users className="h-3 w-3 inline -mt-0.5" /> {company.contacts.length}
            </span>
          </div>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell" />
        <td className="px-4 py-3">
          {batchStatus === 'sent' ? (
            <CompanyProgress contacts={company.contacts} t={t} />
          ) : (
            <CompanyStatusBadge status={batchStatus} t={t} />
          )}
        </td>
        <td className="px-4 py-3 hidden sm:table-cell" />
        <td className="px-4 py-3 text-right">
          <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
            {batchStatus === 'no_links' && (
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-medium" title={t('dashboard.action.generate.title')}>
                <Link2 className="h-3.5 w-3.5" /> {t('dashboard.action.generate')}
              </button>
            )}
            {batchStatus === 'links_ready' && (
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors text-xs font-medium" title={t('dashboard.action.send.title')}>
                <Send className="h-3.5 w-3.5" /> {t('dashboard.action.send')}
              </button>
            )}
            {batchStatus === 'sent' && (
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-xs font-medium" title={t('dashboard.action.resend.title')}>
                <Mail className="h-3.5 w-3.5" /> {t('dashboard.action.resend')}
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Contact rows */}
      {isExpanded && company.contacts.map(contact => (
        <tr key={contact.id} className="border-b border-border hover:bg-muted/10 transition-colors">
          <td className="px-4 py-3" />
          <td className="px-4 py-3 pl-10">
            <div>
              <p className="font-medium">{contact.firstName} {contact.lastName}</p>
              <p className="text-xs text-muted-foreground">{contact.email}</p>
            </div>
          </td>
          <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{t(`role.${contact.role}`)}</td>
          <td className="px-4 py-3 hidden lg:table-cell">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate max-w-[160px] text-xs" title={contact.scorecardName}>{contact.scorecardName}</span>
            </div>
          </td>
          <td className="px-4 py-3">
            <StatusBadge status={contact.status} t={t} />
          </td>
          <td className="px-4 py-3 hidden sm:table-cell">
            {contact.link ? (
              <div className="flex items-center gap-1">
                <LinkIcon className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-xs text-primary truncate max-w-[120px]">{contact.link.replace('https://ai.scorecard.com/v/', '')}</span>
                <CopyButton text={contact.link} t={t} />
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic">—</span>
            )}
          </td>
          <td className="px-4 py-3 text-right">
            {contact.status === 'read' && contact.engagement && (
              <button
                className="p-1.5 rounded bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                title={t('dashboard.action.view_engagement')}
                onClick={() => onViewEngagement(contact)}
              >
                <BarChart3 className="h-3.5 w-3.5" />
              </button>
            )}
          </td>
        </tr>
      ))}
    </>
  );
}
