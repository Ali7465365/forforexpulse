import { useState, useEffect, lazy, Suspense } from 'react';
import { ProProvider } from '@/context/ProContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import AdModal from '@/components/AdModal';
import LoginModal from '@/components/LoginModal';
import { updateSEO, initSEO } from '@/lib/seo';

const TradeMap = lazy(() => import('@/components/TradeMap'));
const ProductResearch = lazy(() => import('@/components/ProductResearch'));
const BusinessAdvisor = lazy(() => import('@/components/BusinessAdvisor'));
const Dashboard = lazy(() => import('@/components/Dashboard'));
const ApiPortal = lazy(() => import('@/components/ApiPortal'));

type Page = 'map' | 'research' | 'business' | 'dashboard' | 'api-portal';
type PlanId = 'pro' | 'platinum';

const pageMeta: Record<Page, { title: string; description: string }> = {
  map: {
    title: 'ForForex Pulse - Interactive Trade Map',
    description: 'Explore global trade hubs and sellers on an interactive map.',
  },
  research: {
    title: 'ForForex Pulse - Product Research',
    description: 'City-level product demand, pricing and supply chain intelligence.',
  },
  business: {
    title: 'ForForex Pulse - Business Advisor',
    description: 'New or ongoing business advice by area, city and country.',
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

function PageLoader() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
    </div>
  );
}

function AppShell() {
  const { theme } = useTheme();
  const { isLoggedIn, isGuest, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('map');
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginReason, setLoginReason] = useState('');
  // After login from a Purchase click → open plans on pay step for this plan
  const [pendingBuyPlan, setPendingBuyPlan] = useState<PlanId | null>(null);

  useEffect(() => {
    initSEO();
  }, []);

  // Every time app loads and user is not logged in → show login (guest can skip)
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      setLoginOpen(true);
      setLoginReason(
        isGuest
          ? 'You are in guest mode. Sign in for full account, or continue as guest.'
          : 'Sign in to ForForex Pulse, or skip as guest to browse.'
      );
    }
  }, [loading, isLoggedIn, isGuest]);

  // After successful login while buying → reopen plans on payment step
  useEffect(() => {
    if (isLoggedIn && pendingBuyPlan) {
      setLoginOpen(false);
      setAdModalOpen(true);
    }
  }, [isLoggedIn, pendingBuyPlan]);

  useEffect(() => {
    const meta = pageMeta[currentPage];
    updateSEO({
      title: meta.title,
      description: meta.description,
      path: `/${currentPage === 'map' ? '' : currentPage}`,
    });
  }, [currentPage]);

  /** Unlock PRO — everyone (including guest) can OPEN plans and see specs */
  function openPlans() {
    setAdModalOpen(true);
  }

  /** Guest clicked Purchase → login first, remember which plan */
  function requireLoginToBuy(planId: PlanId) {
    setPendingBuyPlan(planId);
    setAdModalOpen(false);
    setLoginReason('Sign in to buy this plan. After login you can choose EasyPaisa, PayPal or Stripe.');
    setLoginOpen(true);
  }

  function handleLoginClose() {
    setLoginOpen(false);
    // If still not logged in, cancel pending buy
    if (!isLoggedIn) {
      setPendingBuyPlan(null);
    }
  }

  const shellClass =
    theme === 'dark'
      ? 'min-h-screen bg-slate-950 text-white'
      : 'min-h-screen bg-slate-50 text-slate-900';

  return (
    <div className={shellClass}>
      <Navbar
        currentPage={currentPage}
        onNavigate={(p) => setCurrentPage(p as Page)}
        onOpenAds={openPlans}
        onOpenLogin={() => {
          setLoginReason('');
          setPendingBuyPlan(null);
          setLoginOpen(true);
        }}
      />

      <Suspense fallback={<PageLoader />}>
        {currentPage === 'map' && <TradeMap />}
        {currentPage === 'research' && <ProductResearch onOpenPlans={openPlans} />}
        {currentPage === 'business' && <BusinessAdvisor />}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'api-portal' && <ApiPortal />}
      </Suspense>

      <AdModal
        isOpen={adModalOpen}
        onClose={() => {
          setAdModalOpen(false);
          if (!isLoggedIn) setPendingBuyPlan(null);
        }}
        pendingPlan={isLoggedIn ? pendingBuyPlan : null}
        onPendingPlanConsumed={() => setPendingBuyPlan(null)}
        onRequireLogin={requireLoginToBuy}
      />

      <LoginModal isOpen={loginOpen} onClose={handleLoginClose} reason={loginReason} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProProvider>
          <AppShell />
        </ProProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;