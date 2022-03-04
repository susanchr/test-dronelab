import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Home from "./pages/home";
import { HomeProvider } from "./pages/home/reducer";
import "./App.css"
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <HomeProvider>
            <Home />
          </HomeProvider>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
