import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { ComparisonProvider } from './context/ComparisonContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <ComparisonProvider>
            <App />
          </ComparisonProvider>
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
