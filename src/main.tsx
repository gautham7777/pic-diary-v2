// FIX: Add 'vite/client' type reference to the main entry point to ensure
// TypeScript is aware of Vite's environment variables throughout the app.
/// <reference types="vite/client" />

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

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
