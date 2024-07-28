import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ReactGA from "react-ga4";

const root = createRoot(document.getElementById("root"));

if (process.env.REACT_APP_NODE_ENV === "Production") {
  ReactGA.initialize(`${process.env.REACT_APP_GA4_MEASUREMENT_ID}`, {
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
