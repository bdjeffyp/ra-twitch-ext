import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { Auth } from "./Auth";
import { Config } from "./Config";
import { Main } from "./Main";
import { ITwitchAuth, TwitchExtensionHelper } from "./twitch-ext";

export interface IAppState {
  finishedLoading: boolean;
  config: string;
  username: string;
  apiKey: string;
}

interface IAppProps {}

class App extends React.Component<IAppProps, IAppState> {
  private _version = "0.1.0";
  private _auth: Auth;
  private _twitch: TwitchExtensionHelper | undefined;

  constructor(props: IAppProps) {
    super(props);
    this._auth = new Auth();
    this._twitch = window.Twitch ? window.Twitch.ext : undefined;
    this.state = {
      finishedLoading: false,
      config: "",
      // TODO: Remove hardcoded strings after testing. Eventually get from config page.
      username: "bdjeffyp",
      apiKey: "K1uVrVm3YbsHYPYZwG17mYFzgS9cf4nQ",
    };
  }

  public componentDidMount() {
    if (this._twitch) {
      // Authenticate
      this._twitch.onAuthorized((auth: ITwitchAuth) => {
        this._auth.setToken(auth.token, auth.userId);
        if (!this.state.finishedLoading) {
          this.setState({ finishedLoading: true });
        }
      });

      // TODO: Check the context object to set styles based on Light or Dark theme.

      // Validate the configuration
      this._twitch.configuration.onChanged(() => {
        if (!this._twitch) {
          return;
        }
        let config = this._twitch.configuration.broadcaster ? this._twitch.configuration.broadcaster.content : "";
        try {
          // TODO: Do better parsing, such as saving username and key to appropriate state values
          config = JSON.parse(config);
        } catch (error) {
          config = "";
        }

        this.setState({ config: config });
        console.log(config);
      });
    }
  }

  public render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/config">
              <Config
                username={this.state.username}
                apiKey={this.state.apiKey}
                handleKeyUpdate={this._keyChange}
                handleNameUpdate={this._nameChange}
              />
            </Route>
            <Route path="/">
              <Main />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }

  private _nameChange = () => {};

  private _keyChange = () => {};
}

export default App;
