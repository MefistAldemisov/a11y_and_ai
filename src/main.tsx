import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import './index.css';
import App from './App.tsx';
import { ChecklistProvider } from './context/ChecklistContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChecklistProvider>
      <App />
    </ChecklistProvider>
  </StrictMode>,
);
