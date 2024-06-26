import ReactGA from "react-ga4";
import "./App.css";
import { Wrapper } from "./GlobalStyles";
import Header from "./components/Header";
import Transcription from "./components/Transcription";
import { useEffect } from "react";
import { tracking_id } from "./API";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import View from "./components/View";
import Files from "./components/Files";
import SignUpForm from "./components/Auth/SignUp";

function App() {
  useEffect(() => {
    ReactGA.initialize(tracking_id);
    ReactGA.send("pageview");
  }, []);

  return (
    <Router>
      <div className="h-screen">
        <Header />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
