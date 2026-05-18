import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/styles/global.css';
import App from './app/App';
import { seedDatabase } from './db/seed';

seedDatabase();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
