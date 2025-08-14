import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import App from './App.tsx'
import { PrimeReactProvider } from 'primereact/api';
import { queryClient } from './config/reactQuery.ts';
import { primeReactConfig } from './config/primeReact.ts';
import { QueryClientProvider } from '@tanstack/react-query';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider value={primeReactConfig}>
        <App />
      </PrimeReactProvider>
    </QueryClientProvider>
  </StrictMode>,
);