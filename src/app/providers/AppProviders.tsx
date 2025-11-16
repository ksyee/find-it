import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { RouteProgressProvider } from '@/shared/ui/progress/RouteProgressProvider';
import TopProgressBar from '@/shared/ui/progress/TopProgressBar';
import RouteProgressFallback from '@/shared/ui/progress/RouteProgressFallback';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <RouteProgressProvider>
            <TopProgressBar />
            <Suspense fallback={<RouteProgressFallback />}>
              {children}
            </Suspense>
          </RouteProgressProvider>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
