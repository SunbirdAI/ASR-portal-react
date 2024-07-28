import ReactGA from "react-ga4";

export const TrackGoogleAnalyticsEvent = (category, action, label) => {
  if (process.env.REACT_APP_NODE_ENV === "Production") {
    if (!category || !action) {
      console.error("trackEvent: category and action are required parameters");
      return;
    }

    ReactGA.event({
      category: category,
      action: action,
      label: label || undefined,
    });
    console.log("Event to be sent:", { category, action, label });
  } else {
    console.log(`Event tracked: ${category}`);
  }
};
