import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import FullScreenSpinner from '@/shared/ui/FullScreenSpinner';

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
          <Suspense fallback={<FullScreenSpinner />}>{children}</Suspense>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
