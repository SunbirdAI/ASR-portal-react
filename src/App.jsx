import ReactGA from "react-ga4";
import "./App.css";
import Header from "./components/Header";
import Transcription from "./components/Transcription";
import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import View from "./components/View";
import Files from "./components/Files";

const usePageViews = (location) => {
  useEffect(() => {
    if (import.meta.env.MODE === "production") {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.hash + location.search,
        title: location.pathname.split("/")[1] || "Home",
      });
    }
  }, [location]);
};

function AppComponent() {
  const location = useLocation();
  usePageViews(location);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Transcription />} />
          <Route path="/files" element={<Files />} />
          <Route path="/files/edit/:id" element={<View />} />
        </Routes>
      </main>
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <AppComponent />
    </Router>
  );
};

export default App;
