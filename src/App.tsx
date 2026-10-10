import { useState, useEffect } from 'react';
import { ProProvider } from '@/context/ProContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import TradeMap from '@/components/TradeMap';
import Dashboard from '@/components/Dashboard';
import ApiPortal from '@/components/ApiPortal';
import ProductResearch from '@/components/ProductResearch';
import AdModal from '@/components/AdModal';
import { updateSEO, initSEO } from '@/lib/seo';

type Page = 'map' | 'research' | 'dashboard' | 'api-portal';

const pageMeta: Record<Page, { title: string; description: string }> = {
  map: {
    title: 'ForForex Pulse - Interactive Trade Map',
    description: 'Explore global trade hubs and sellers on an interactive map.',
  },
  research: {
    title: 'ForForex Pulse - Product Research',
    description: 'City-level product demand, pricing and supply chain intelligence.',
  },
  dashboard: {
    title: 'ForForex Pulse - Intelligence Dashboard',
    description: 'AI-ranked high-value trade signals.',
  },
  'api-portal': {
    title: 'ForForex Pulse - Developer API Portal',
    description: 'API keys and live trade data queries.',
  },
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('map');
  const [adModalOpen, setAdModalOpen] = useState(false);

  useEffect(() => {
    initSEO();
  }, []);

  useEffect(() => {
    const meta = pageMeta[currentPage];
    updateSEO({
      title: meta.title,
      description: meta.description,
      path: `/${currentPage === 'map' ? '' : currentPage}`,
    });
  }, [currentPage]);

  return (
    <ThemeProvider>
      <ProProvider>
        <div className="min-h-screen bg-slate-950">
          <Navbar
            currentPage={currentPage}
            onNavigate={(p) => setCurrentPage(p as Page)}
            onOpenAds={() => setAdModalOpen(true)}
          />

          {currentPage === 'map' && <TradeMap />}
          {currentPage === 'research' && <ProductResearch />}
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'api-portal' && <ApiPortal />}

          <AdModal isOpen={adModalOpen} onClose={() => setAdModalOpen(false)} />
        </div>
      </ProProvider>
    </ThemeProvider>
  );
}

export default App;