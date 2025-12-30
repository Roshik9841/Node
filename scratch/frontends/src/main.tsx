import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { Provider } from "@/components/ui/provider"
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store'

// ✅ CREATE THE CLIENT
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>

    <QueryClientProvider client={queryClient}>
      {/* React Query */}
      <Provider store={store}>        
        {/*   //Redux Provider added */}
        <App />
      </Provider>
    </QueryClientProvider>
    </Provider>
  </StrictMode>
);
