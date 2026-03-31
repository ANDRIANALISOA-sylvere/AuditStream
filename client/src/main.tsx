import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router';
import { Toaster as SonnerToaster } from 'sonner';
import { Toaster as HotToastToaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SonnerToaster richColors position="top-right" />
      <HotToastToaster position="top-center" reverseOrder={false} />
      <App />
    </BrowserRouter>
  </StrictMode>,
);
