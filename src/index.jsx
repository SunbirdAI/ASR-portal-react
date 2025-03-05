import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ReactGA from "react-ga4";
import Hotjar from '@hotjar/browser';

const siteId = 5091559;
const hotjarVersion = 6;

Hotjar.init(siteId, hotjarVersion);

// Create root once
const root = ReactDOM.createRoot(
  document.getElementById("root") 
);

if (import.meta.env.MODE === "Production") {
  ReactGA.initialize(`${import.meta.env.VITE_GA4_MEASUREMENT_ID}`, {
    gaOptions: {
      anonymizeIp: true,
    },
  });
} else {
  console.log("Google Analytics is disabled in development mode.");
}
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
