import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure Vite dev WebSocket disconnections are handled gracefully without false failure
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = (reason && (reason.message || reason.stack || String(reason))) || '';
    if (
      msg.includes('WebSocket closed without opened') ||
      msg.includes('[vite] failed to connect to websocket') ||
      msg.includes('failed to connect to websocket') ||
      msg.includes('WebSocket')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);
