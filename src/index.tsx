import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/* 图标与字体全部本地化，不再依赖任何 CDN */
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import '@fortawesome/fontawesome-free/css/regular.css';
import '@fortawesome/fontawesome-free/css/brands.css';
import '@fontsource/playfair-display/latin-400.css';
import '@fontsource/playfair-display/latin-700.css';
import '@fontsource/playfair-display/latin-400-italic.css';
import '@fontsource/lato/latin-300.css';
import '@fontsource/lato/latin-400.css';
import '@fontsource/lato/latin-300-italic.css';
import '@fontsource/lato/latin-400-italic.css';
import '@fontsource/jetbrains-mono/latin-300.css';
import '@fontsource/jetbrains-mono/latin-400.css';

import './index.css';
import './styles/ambient.css';
import './styles/shelf.css';
import './styles/objects.css';
import './styles/eggs.css';
import './styles/photos.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
