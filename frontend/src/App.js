import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import SolutionReduceWorkload from "./pages/SolutionReduceWorkload";
import SolutionIncreaseConversion from "./pages/SolutionIncreaseConversion";
import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <div className="app-shell grain" data-testid="app-shell">
      <ScrollToTop />
      <Navigation />
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/solutions/reduce-workload"
            element={<SolutionReduceWorkload />}
          />
          <Route
            path="/solutions/increase-conversion"
            element={<SolutionIncreaseConversion />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
