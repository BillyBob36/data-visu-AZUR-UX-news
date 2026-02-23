import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from 'recharts';
import {
  Clock, MailOpen, TrendingUp, RotateCcw, Monitor, Smartphone, Tablet,
  Building2, User,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { mockCompanies } from '../lib/mock-data';
import { SLIDE_NAMES } from '../lib/types';
import type { Contact } from '../lib/types';
import { useTranslation } from '../lib/i18n';

type EngagedContact = Contact & { engagement: NonNullable<Contact['engagement']> };
type ViewMode = 'global' | 'company' | 'individual';

const tooltipStyle = { borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', fontSize: '12px' };

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-xl font-bold mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function computeStats(contacts: Contact[]) {
  const engaged = contacts.filter((c): c is EngagedContact => c.engagement !== null);
  const mailOpened = engaged.filter(c => c.engagement.mailOpenedAt).length;
  const mailRate = contacts.length > 0 ? Math.round((mailOpened / contacts.length) * 100) : 0;
  const avgCompletion = engaged.length > 0 ? Math.round(engaged.reduce((s, c) => s + c.engagement.completionPercent, 0) / engaged.length) : 0;
  const fullCompletion = engaged.filter(c => c.engagement.completionPercent === 100).length;
  const avgTime = engaged.length > 0 ? Math.round(engaged.reduce((s, c) => s + c.engagement.timeSpentSeconds, 0) / engaged.length) : 0;
  const withReplay = engaged.filter(c => c.engagement.slideBreakdown.some(sl => sl.replayed)).length;
  const replayRate = engaged.length > 0 ? Math.round((withReplay / engaged.length) * 100) : 0;
  return { engaged, mailOpened, mailRate, avgCompletion, fullCompletion, avgTime, replayRate, total: contacts.length };
}

// ─── Global View ────────────────────────────────────────────────────────────
function GlobalView({ allContacts, engaged, t }: { allContacts: Contact[]; engaged: EngagedContact[], t: any }) {
  const stats = computeStats(allContacts);

  const statusPie = [
    { name: t('analytics.chart.status.opened'), value: stats.mailOpened },
    { name: t('analytics.chart.status.sent'), value: allContacts.filter(c => c.status === 'sent').length },
    { name: t('analytics.chart.status.not_sent'), value: allContacts.filter(c => c.status === 'not_sent').length },
  ];

  const companyData = mockCompanies.map(company => {
    const ce = company.contacts.filter(c => c.engagement);
    const avgC = ce.length > 0 ? Math.round(ce.reduce((s, c) => s + (c.engagement?.completionPercent || 0), 0) / ce.length) : 0;
    const opened = company.contacts.filter(c => c.engagement?.mailOpenedAt).length;
    const openRate = company.contacts.length > 0 ? Math.round((opened / company.contacts.length) * 100) : 0;
    return { name: company.name.length > 15 ? company.name.slice(0, 15) + '…' : company.name, completion: avgC, ouverture: openRate };
  });

  const slideData = SLIDE_NAMES.map((name, i) => ({
    name: t(`slide.${name}`),
    vues: engaged.filter(c => c.engagement.slideBreakdown[i]?.visited).length,
    rejouées: engaged.filter(c => c.engagement.slideBreakdown[i]?.replayed).length,
  }));

  const deviceCounts: Record<string, number> = {};
  engaged.forEach(c => { deviceCounts[c.engagement.deviceType] = (deviceCounts[c.engagement.deviceType] || 0) + 1; });
  const deviceData = Object.entries(deviceCounts).map(([n, v]) => ({ name: n.charAt(0).toUpperCase() + n.slice(1), value: v }));

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<MailOpen className="h-4 w-4 text-indigo-500" />} label={t('analytics.kpi.open_rate')} value={`${stats.mailRate}%`} sub={`${stats.mailOpened} / ${stats.total}`} />
        <StatCard icon={<TrendingUp className="h-4 w-4 text-emerald-500" />} label={t('analytics.kpi.completion')} value={`${stats.avgCompletion}%`} sub={`${stats.fullCompletion} ${t('analytics.kpi.completion.sub')}`} />
        <StatCard icon={<Clock className="h-4 w-4 text-amber-500" />} label={t('analytics.kpi.time')} value={formatTime(stats.avgTime)} sub={t('analytics.kpi.time.sub')} />
        <StatCard icon={<RotateCcw className="h-4 w-4 text-purple-500" />} label={t('analytics.kpi.replay')} value={`${stats.replayRate}%`} sub={t('analytics.kpi.replay.sub')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-4">{t('analytics.chart.status')}</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {statusPie.map((_, i) => <Cell key={i} fill={['#10b981', '#f59e0b', '#ef4444'][i]} />)}
                </Pie>
                <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(v: string) => <span className="text-xs text-foreground">{v}</span>} />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 lg:col-span-2">
          <h3 className="font-semibold text-sm mb-4">{t('analytics.chart.company_open_completion')}</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companyData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} unit="%" domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="ouverture" fill="#6366f1" radius={[4, 4, 0, 0]} name={t('analytics.chart.open_rate')} />
                <Bar dataKey="completion" fill="#10b981" radius={[4, 4, 0, 0]} name={t('analytics.chart.completion_rate')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-4">{t('analytics.chart.views_replays')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={slideData} layout="vertical" barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="vues" fill="#10b981" radius={[0, 4, 4, 0]} name={t('analytics.chart.views')} />
                <Bar dataKey="rejouées" fill="#8b5cf6" radius={[0, 4, 4, 0]} name={t('analytics.chart.replays')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-4">{t('analytics.chart.completion_area')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={companyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} unit="%" domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <defs>
                  <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="completion" stroke="#6366f1" fill="url(#colorCompletion)" strokeWidth={2} name={t('analytics.chart.completion')} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {deviceData.map(d => {
          const iconMap: Record<string, React.ReactNode> = {
            Desktop: <Monitor className="h-5 w-5 text-indigo-500" />,
            Mobile: <Smartphone className="h-5 w-5 text-emerald-500" />,
            Tablet: <Tablet className="h-5 w-5 text-amber-500" />,
          };
          return (
            <div key={d.name} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
              <div className="h-11 w-11 rounded-lg bg-muted flex items-center justify-center">{iconMap[d.name]}</div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{d.name}</p>
                <p className="text-2xl font-bold">{d.value}</p>
                <p className="text-xs text-muted-foreground">{engaged.length > 0 ? Math.round((d.value / engaged.length) * 100) : 0}{t('analytics.chart.sessions')}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── Company View ───────────────────────────────────────────────────────────
function CompanyView({ companyId, t }: { companyId: string, t: any }) {
  const company = mockCompanies.find(c => c.id === companyId);
  if (!company) return <p className="text-muted-foreground">{t('analytics.select.company')}</p>;

  const stats = computeStats(company.contacts);
  const engaged = stats.engaged;

  const slideData = SLIDE_NAMES.map((name, i) => ({
    name: t(`slide.${name}`),
    vues: engaged.filter(c => c.engagement.slideBreakdown[i]?.visited).length,
    rejouées: engaged.filter(c => c.engagement.slideBreakdown[i]?.replayed).length,
  }));

  const contactData = company.contacts.map(c => ({
    name: `${c.firstName} ${c.lastName.charAt(0)}.`,
    completion: c.engagement?.completionPercent ?? 0,
    mailOuvert: c.engagement?.mailOpenedAt ? 1 : 0,
  }));

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<MailOpen className="h-4 w-4 text-indigo-500" />} label={t('analytics.kpi.open_rate')} value={`${stats.mailRate}%`} sub={`${stats.mailOpened} / ${stats.total}`} />
        <StatCard icon={<TrendingUp className="h-4 w-4 text-emerald-500" />} label={t('analytics.kpi.completion')} value={`${stats.avgCompletion}%`} sub={`${stats.fullCompletion} ${t('analytics.kpi.completion.sub')}`} />
        <StatCard icon={<Clock className="h-4 w-4 text-amber-500" />} label={t('analytics.kpi.time')} value={formatTime(stats.avgTime)} sub={t('analytics.kpi.time.sub')} />
        <StatCard icon={<RotateCcw className="h-4 w-4 text-purple-500" />} label={t('analytics.kpi.replay')} value={`${stats.replayRate}%`} sub={t('analytics.kpi.replay.sub')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-4">{t('analytics.chart.completion_contact')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contactData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} unit="%" domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="completion" fill="#10b981" radius={[4, 4, 0, 0]} name={t('analytics.chart.completion')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-4">{t('analytics.chart.views_replays')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={slideData} layout="vertical" barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="vues" fill="#10b981" radius={[0, 4, 4, 0]} name={t('analytics.chart.views')} />
                <Bar dataKey="rejouées" fill="#8b5cf6" radius={[0, 4, 4, 0]} name={t('analytics.chart.replays')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Contact detail table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('analytics.table.contact')}</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('analytics.table.mail_opened')}</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t('analytics.table.completion')}</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">{t('analytics.table.time')}</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">{t('analytics.table.replay')}</th>
            </tr>
          </thead>
          <tbody>
            {company.contacts.map(c => (
              <tr key={c.id} className="border-b border-border hover:bg-muted/10">
                <td className="px-4 py-3 font-medium">{c.firstName} {c.lastName}</td>
                <td className="px-4 py-3">
                  {c.engagement?.mailOpenedAt
                    ? <span className="text-emerald-600 font-medium text-xs">{t('analytics.table.yes')}</span>
                    : <span className="text-muted-foreground text-xs">{t('analytics.table.no')}</span>}
                </td>
                <td className="px-4 py-3">
                  {c.engagement ? (
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${c.engagement.completionPercent}%` }} />
                      </div>
                      <span className="text-xs font-medium">{c.engagement.completionPercent}%</span>
                    </div>
                  ) : <span className="text-xs text-muted-foreground">—</span>}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                  {c.engagement ? formatTime(c.engagement.timeSpentSeconds) : '—'}
                </td>
                <td className="px-4 py-3 text-xs hidden md:table-cell">
                  {c.engagement?.slideBreakdown.some(sl => sl.replayed)
                    ? <span className="text-purple-600 font-medium">{t('analytics.table.yes')}</span>
                    : <span className="text-muted-foreground">{t('analytics.table.no')}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── Individual View ────────────────────────────────────────────────────────
function IndividualView({ contactId, t }: { contactId: string, t: any }) {
  const contact = mockCompanies.flatMap(c => c.contacts).find(c => c.id === contactId);
  if (!contact) return <p className="text-muted-foreground">{t('analytics.select.contact')}</p>;

  const e = contact.engagement;
  if (!e) return (
    <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
      <p className="font-medium">{contact.firstName} {contact.lastName}</p>
      <p className="text-sm mt-1">{t('analytics.no_data')}</p>
    </div>
  );

  const minutes = Math.floor(e.timeSpentSeconds / 60);
  const seconds = e.timeSpentSeconds % 60;
  const replayedCount = e.slideBreakdown.filter(s => s.replayed).length;

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {contact.firstName[0]}{contact.lastName[0]}
          </div>
          <div>
            <h3 className="font-bold">{contact.firstName} {contact.lastName}</h3>
            <p className="text-xs text-muted-foreground">{t(`role.${contact.role}`)} — {contact.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<MailOpen className="h-4 w-4 text-indigo-500" />} label={t('analytics.table.mail_opened')} value={e.mailOpenedAt ? t('analytics.table.yes') : t('analytics.table.no')} />
        <StatCard icon={<TrendingUp className="h-4 w-4 text-emerald-500" />} label={t('analytics.kpi.completion.ind')} value={`${e.completionPercent}%`} sub={`${e.slidesViewed}/${e.totalSlides} ${t('analytics.kpi.completion.slides')}`} />
        <StatCard icon={<Clock className="h-4 w-4 text-amber-500" />} label={t('analytics.kpi.time.ind')} value={`${minutes}m ${seconds}s`} />
        <StatCard icon={<RotateCcw className="h-4 w-4 text-purple-500" />} label={t('analytics.kpi.replay.ind')} value={replayedCount > 0 ? `${replayedCount}` : '0'} />
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-3">{t('analytics.progression')}</h3>
        <div className="space-y-2">
          {e.slideBreakdown.map(slide => (
            <div
              key={slide.slideIndex}
              className={cn('flex items-center gap-3 p-3 rounded-lg border', slide.visited
                ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/30'
                : 'bg-muted/30 border-border opacity-50'
              )}
            >
              <div className={cn('h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                slide.visited ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
              )}>
                {slide.slideIndex + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{t(`slide.${slide.slideName}`)}</p>
                {slide.replayed && <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-0.5"><RotateCcw className="h-3 w-3" /> {t('analytics.progression.replayed')}</p>}
              </div>
              {slide.visited && !slide.replayed && <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{t('analytics.progression.viewed')}</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Main AnalyticsPage ─────────────────────────────────────────────────────
export function AnalyticsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('global');
  const [selectedCompanyId, setSelectedCompanyId] = useState(mockCompanies[0]?.id ?? '');
  const [selectedContactId, setSelectedContactId] = useState('');
  const { t } = useTranslation();

  const allContacts = useMemo(() => mockCompanies.flatMap(c => c.contacts), []);
  const engaged = useMemo(
    () => allContacts.filter((c): c is EngagedContact => c.engagement !== null),
    [allContacts]
  );

  const viewTabs: { key: ViewMode; label: string; icon: React.ReactNode }[] = [
    { key: 'global', label: t('analytics.tab.global'), icon: <TrendingUp className="h-4 w-4" /> },
    { key: 'company', label: t('analytics.tab.company'), icon: <Building2 className="h-4 w-4" /> },
    { key: 'individual', label: t('analytics.tab.individual'), icon: <User className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('analytics.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('analytics.subtitle')}</p>
        </div>

        {/* View mode tabs */}
        <div className="flex bg-muted rounded-lg p-1 gap-1">
          {viewTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setViewMode(tab.key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                viewMode === tab.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-selector for company / individual */}
      {viewMode === 'company' && (
        <div>
          <select
            value={selectedCompanyId}
            onChange={e => setSelectedCompanyId(e.target.value)}
            className="w-full sm:w-72 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {mockCompanies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {viewMode === 'individual' && (
        <div>
          <select
            value={selectedContactId}
            onChange={e => setSelectedContactId(e.target.value)}
            className="w-full sm:w-80 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">{t('analytics.select.individual')}</option>
            {mockCompanies.map(company => (
              <optgroup key={company.id} label={company.name}>
                {company.contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName} — {t(`role.${c.role}`)}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      )}

      {/* Content */}
      {viewMode === 'global' && <GlobalView allContacts={allContacts} engaged={engaged} t={t} />}
      {viewMode === 'company' && <CompanyView companyId={selectedCompanyId} t={t} />}
      {viewMode === 'individual' && (selectedContactId ? <IndividualView contactId={selectedContactId} t={t} /> : (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          {t('analytics.select.contact')}
        </div>
      ))}
    </div>
  );
}
