import ReactGA from "react-ga4";

export const TrackGoogleAnalyticsEvent = (category, action, label) => {
  if (import.meta.env.MODE === "production") {
    if (!category || !action) {
      console.error("trackEvent: category and action are required parameters");
      return;
    }

    ReactGA.event({
      category: category,
      action: action,
      label: label || undefined,
    });
  } else {
    console.log(`Event tracked: ${category}`);
  }
};
