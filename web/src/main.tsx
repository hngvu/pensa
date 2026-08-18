import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AxiosInterceptorSetup } from './components/AxiosInterceptorSetup';
import App from './App';
import './index.css';

// Get Clerk Publishable Key from env
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error("Missing VITE_CLERK_PUBLISHABLE_KEY. Please add it to your .env file.");
}

// Setup React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY || ""} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <AxiosInterceptorSetup>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AxiosInterceptorSetup>
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>,
);
