import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { IngestionPage } from './pages/IngestionPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { EngagementDrawer } from './components/EngagementDrawer';
import type { Page, Contact } from './lib/types';

function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [drawerContact, setDrawerContact] = useState<Contact | null>(null);

  return (
    <Layout activePage={page} onNavigate={setPage}>
      {page === 'dashboard' && (
        <DashboardPage onViewEngagement={(c) => setDrawerContact(c)} />
      )}
      {page === 'ingestion' && <IngestionPage />}
      {page === 'analytics' && <AnalyticsPage />}

      <EngagementDrawer
        contact={drawerContact}
        onClose={() => setDrawerContact(null)}
      />
    </Layout>
  );
}

export default App;
