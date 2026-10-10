import { useState, useEffect } from 'react';
import { ProProvider } from '@/context/ProContext';
import Navbar from '@/components/Navbar';
import TradeMap from '@/components/TradeMap';
import Dashboard from '@/components/Dashboard';
import ApiPortal from '@/components/ApiPortal';
import Explore from '@/components/Explore';
import AdModal from '@/components/AdModal';
import { updateSEO, initSEO } from '@/lib/seo';

type Page = 'map' | 'explore' | 'dashboard' | 'api-portal';

const pageMeta: Record<Page, { title: string; description: string }> = {
  map: {
    title: 'ForForex Pulse - Interactive Trade Map | Global Market Hubs & Sellers',
    description: 'Explore an interactive global trade map with real-time seller pins, trade hubs, price popups, and product category filtering across major world markets.',
  },
  explore: {
    title: 'ForForex Pulse - Explore Markets by Country | Trade Hub Search',
    description: 'Search and explore trade hubs, sellers, and market items by country and area. Discover trade opportunities in specific regions around the world.',
  },
  dashboard: {
    title: 'ForForex Pulse - Intelligence Dashboard | High-Value Trade Signals',
    description: 'AI-ranked market intelligence dashboard showing high-value trade items by price, supply, demand, and competitor density. Unlock PRO signals for exclusive margins.',
  },
  'api-portal': {
    title: 'ForForex Pulse - Developer API Portal | Trade Data API',
    description: 'Generate API keys, monitor request limits, and test live trade data queries. Access global market intelligence data programmatically via REST API.',
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
    updateSEO({ title: meta.title, description: meta.description, path: `/${currentPage === 'map' ? '' : currentPage}` });
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  return (
    <ProProvider>
      <div className="min-h-screen bg-slate-950">
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenAds={() => setAdModalOpen(true)}
        />

        {currentPage === 'map' && <TradeMap />}
        {currentPage === 'explore' && <Explore />}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'api-portal' && <ApiPortal />}

        <AdModal isOpen={adModalOpen} onClose={() => setAdModalOpen(false)} />
      </div>
    </ProProvider>
  );
}

export default App;