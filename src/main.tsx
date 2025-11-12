import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/index.scss';
import './assets/css/custom.css';
// Import i18n configuration
import './i18n';

// Apply theme immediately before React renders (similar to theme-script.js)
(function () {
    const darkMode = localStorage.getItem('darkMode');
    const themeClass = darkMode === 'enabled' ? 'dark-mode' : 'light-mode';
    document.documentElement.classList.remove('light-mode', 'dark-mode');
    document.documentElement.classList.add(themeClass);
})();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
