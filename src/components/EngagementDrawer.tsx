import {
  X, Clock, Eye, Monitor, Smartphone, Tablet, MailOpen, RotateCcw, CheckCircle2,
} from 'lucide-react';
import type { Contact } from '../lib/types';
import { useTranslation } from '../lib/i18n';

interface EngagementDrawerProps {
  contact: Contact | null;
  onClose: () => void;
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
      <div className="h-8 w-8 rounded-md bg-background flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}

export function EngagementDrawer({ contact, onClose }: EngagementDrawerProps) {
  const { t } = useTranslation();

  if (!contact || !contact.engagement) return null;

  const e = contact.engagement;
  const minutes = Math.floor(e.timeSpentSeconds / 60);
  const seconds = e.timeSpentSeconds % 60;
  const replayedSlides = e.slideBreakdown.filter(s => s.replayed).length;

  const deviceIcon: Record<string, React.ReactNode> = {
    desktop: <Monitor className="h-4 w-4" />,
    mobile: <Smartphone className="h-4 w-4" />,
    tablet: <Tablet className="h-4 w-4" />,
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(t('drawer.date.locale'), { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-card border-l border-border shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="font-bold text-base">{contact.firstName} {contact.lastName}</h2>
            <p className="text-xs text-muted-foreground">{t(`role.${contact.role}`)} — {contact.email}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Completion ring */}
          <div className="flex items-center justify-center">
            <div className="relative h-28 w-28">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--muted)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={e.completionPercent >= 80 ? '#10b981' : e.completionPercent >= 50 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${e.completionPercent * 2.64} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{e.completionPercent}%</span>
                <span className="text-[10px] text-muted-foreground">{t('analytics.kpi.completion.ind')}</span>
              </div>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-3">
            <Metric icon={<MailOpen className="h-4 w-4 text-indigo-500" />} label={t('analytics.table.mail_opened')} value={e.mailOpenedAt ? t('analytics.table.yes') : t('analytics.table.no')} />
            <Metric icon={<Eye className="h-4 w-4 text-emerald-500" />} label={t('analytics.chart.views')} value={`${e.slidesViewed} / ${e.totalSlides}`} />
            <Metric icon={<Clock className="h-4 w-4 text-amber-500" />} label={t('analytics.kpi.time.ind')} value={`${minutes}m ${seconds}s`} />
            <Metric icon={<RotateCcw className="h-4 w-4 text-purple-500" />} label={t('analytics.kpi.replay.ind')} value={replayedSlides > 0 ? `${replayedSlides}` : t('drawer.slides.none')} />
          </div>

          {/* Device & dates */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2.5 text-sm">
            {e.mailOpenedAt && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('drawer.mail.opened')}</span>
                <span className="font-medium">{formatDate(e.mailOpenedAt)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('drawer.active.last')}</span>
              <span className="font-medium">{formatDate(e.lastActiveAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('drawer.kpi.device')}</span>
              <span className="flex items-center gap-1.5 font-medium capitalize">{deviceIcon[e.deviceType]} {e.deviceType}</span>
            </div>
          </div>

          {/* Slide-by-slide breakdown */}
          <div>
            <h3 className="font-semibold text-sm mb-3">{t('analytics.progression')}</h3>
            <div className="space-y-2">
              {e.slideBreakdown.map((slide) => (
                <div
                  key={slide.slideIndex}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    slide.visited
                      ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/30'
                      : 'bg-muted/30 border-border opacity-50'
                  }`}
                >
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    slide.visited ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {slide.visited ? <CheckCircle2 className="h-4 w-4" /> : slide.slideIndex + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{t(`slide.${slide.slideName}`)}</p>
                    {slide.replayed && (
                      <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-0.5">
                        <RotateCcw className="h-3 w-3" /> {t('analytics.progression.replayed')}
                      </p>
                    )}
                  </div>
                  {slide.visited && !slide.replayed && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{t('analytics.progression.viewed')}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
