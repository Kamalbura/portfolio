import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AnimatePresence } from 'framer-motion';

// Theme and Global Styles
import modernTheme from './themes/modernTheme';
import GlobalStyles from './styles/GlobalStyles';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Preloader from './components/common/Preloader';

// Pages
import Home from './pages/Home';

function App() {
  const [loading, setLoading] = useState(true);
  
  // No timeout needed, let preloader handle it
  const handleLoadComplete = () => {
    console.log("Preloader complete");
    setLoading(false);
  };
  
  return (
    <ThemeProvider theme={modernTheme}>
      <GlobalStyles />
      <AnimatePresence mode="wait">
        {loading && <Preloader onLoadComplete={handleLoadComplete} />}
      </AnimatePresence>
      
      <Router>
        {!loading && <Navbar />}
        <AnimatePresence mode="wait">
          {!loading && (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<div>Projects Page Coming Soon</div>} />
              <Route path="/about" element={<div>About Page Coming Soon</div>} />
              <Route path="/contact" element={<div>Contact Page Coming Soon</div>} />
              <Route path="/personal" element={<div>Personal Page Coming Soon</div>} />
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          )}
        </AnimatePresence>
        {!loading && <Footer />}
      </Router>
    </ThemeProvider>
  );
}

export default App;
