import { useState } from 'react';
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Page } from '../../lib/types';
import { useTranslation } from '../../lib/i18n';

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function SidebarLink({ icon, label, active, onClick }: SidebarLinkProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

interface LayoutProps {
  children: React.ReactNode;
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export function Layout({ children, activePage, onNavigate }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, language, setLanguage } = useTranslation();

  const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
    { page: 'dashboard', label: t('nav.dashboard'), icon: <LayoutDashboard className="h-4 w-4" /> },
    { page: 'ingestion', label: t('nav.ingestion'), icon: <Upload className="h-4 w-4" /> },
    { page: 'analytics', label: t('nav.analytics'), icon: <BarChart3 className="h-4 w-4" /> },
  ];

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-60 bg-card border-r border-border flex flex-col transition-transform duration-200 lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-14 flex items-center gap-2.5 px-4 border-b border-border shrink-0">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-base tracking-tight">AI Scorecard</span>
          <button
            className="ml-auto lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <SidebarLink
              key={item.page}
              icon={item.icon}
              label={item.label}
              active={activePage === item.page}
              onClick={() => handleNav(item.page)}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{t('header.admin')}</p>
              <p className="text-xs text-muted-foreground truncate">admin@cybermeteo.ai</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-4 sm:px-6 bg-card border-b border-border shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-1.5 -ml-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold">{t(`nav.${activePage}`)}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
              <button
                onClick={() => setLanguage('fr')}
                className={cn(
                  'px-2 py-1 text-xs font-medium rounded-md transition-colors',
                  language === 'fr' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={cn(
                  'px-2 py-1 text-xs font-medium rounded-md transition-colors',
                  language === 'en' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                EN
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
