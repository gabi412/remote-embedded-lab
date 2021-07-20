import React from "react";
import "./App.css";
import Home from "./components/Home/Home";
import PinsControl from "./components/PinsControl/PinsControl";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { NavLink } from "react-router-dom";

function NavBar(){
  return (
    <nav>
      <div className="navbar-container">   
          <div className="navbar-start">
            <NavLink className="navbar-item" to="/">
              Home
            </NavLink>

            <NavLink className="navbar-item" to="/pins-control">
              Pins Control
            </NavLink>
          </div>
      </div>
    </nav>
  );
}
function Header() {
    return (
      <div>
        <br />
        <br />
        <h1 align="center" className="header-h1">
          Remote Embedded Lab
        </h1>
      </div>
    );
}
function Footer() {
  return (
    <div>
      <br />
      <br />
      <hr></hr>
      <footer>&copy;2021 Tatarusanu Gabriel</footer>
    </div>
  );
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <br />
          <NavBar />
          <div>
            <Switch>
              <Route exact path="/">
                <Header />
                <Home />
                <Footer />
              </Route>
              <Route path="/pins-control">
                <Header />
                <PinsControl />
                <Footer />
              </Route>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
