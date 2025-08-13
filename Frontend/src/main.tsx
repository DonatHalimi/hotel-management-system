import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import App from './App.tsx'
import { PrimeReactProvider } from 'primereact/api';

const value = {
  ripple: true,
  unstyled: false,
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider value={value}>
      <App />
    </PrimeReactProvider>
  </StrictMode>,
)
