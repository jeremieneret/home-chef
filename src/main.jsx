import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import RecipeDetails from './components/RecipeDetails.jsx';

// Create the root element and set up routing
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Main page displaying categories and recipes */}
        <Route path="/" element={<App />} />
        
        {/* Recipe details page displaying full information */}
        <Route path="/meal/:id" element={<RecipeDetails />} />
      </Routes>
    </Router>
  </StrictMode>
);
