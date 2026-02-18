import ReactGA from "react-ga4";
import "./App.css";
import { Wrapper } from "./GlobalStyles";
import Header from "./components/Header";
import Transcription from "./components/Transcription";
import  React,{ useEffect } from "react";
//import { tracking_id } from "./API";
import {
  HashRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import View from "./components/View";
import Files from "./components/Files";
import SignUpForm from "./components/Auth/SignUp";
import SignInForm from "./components/Auth/SignIn";

const usePageViews = (location) => {
  useEffect(() => {
    if (import.meta.env.MODE === "production") {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.hash + location.search,
        title: location.pathname.split("/")[1] || "Home",
      });
    } else {
      console.log(
        `Page view tracked: ${location.pathname + location.hash + location.search}`
      );
    }
  }, [location]);
};

function AppComponent() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  usePageViews(location);
  return (
    <>
      <div className="h-screen">
        {!isAuthPage && <Header />}
        <Routes>
          <Route
            path="/"
            element={
              <Wrapper>
                <Transcription />
              </Wrapper>
            }
          />
          <Route
            path="/files"
            element={
              <Wrapper>
                <Files />
              </Wrapper>
            }
          />
          <Route
            path="/files/edit/:id"
            element={
              <Wrapper>
                <View />
              </Wrapper>
            }
          />
          <Route path="/register" element={<SignUpForm />} />
          <Route path="/login" element={<SignInForm />} />
        </Routes>
      </div>
    </>
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
