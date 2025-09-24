import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistor, store } from '@/redux/store';
import { Toaster } from 'react-hot-toast';
import SessionWrapper from '@/containers/SessionWrapper';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 2,
    },
    mutations: {
      retry: 1,
    },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <SessionWrapper>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
            <Toaster />
          </SessionWrapper>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default AppProviders;
