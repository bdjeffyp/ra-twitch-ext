import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { Config } from "./Config";
import { Main } from "./Main";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/config">
              <Config />
            </Route>
            <Route path="/">
              <Main />
            </Route>
          </Switch>
        </Router>
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </header> */}
      </div>
    );
  }
}

export default App;
