import * as React from "react";
import "./App.css";
import { Auth } from "./Auth";
import { Main } from "./Main";
import { EMPTY_CONFIG, IAppConfig, IAppState } from "./models";
import { ITwitchAuth, TwitchExtensionHelper } from "./twitch-ext";

interface IAppProps {}

class App extends React.Component<IAppProps, IAppState> {
  private _auth: Auth;
  private _twitch: TwitchExtensionHelper | undefined;

  constructor(props: IAppProps) {
    super(props);
    this._auth = new Auth();
    this._twitch = window.Twitch ? window.Twitch.ext : undefined;
    this.state = {
      finishedLoading: false,
      username: "",
      apiKey: "",
      numAchievementsToShow: 0,
    };
  }

  public componentDidMount() {
    if (this._twitch) {
      // Authenticate
      this._twitch.onAuthorized((auth: ITwitchAuth) => {
        this._auth.setToken(auth.token, auth.userId);
        if (!this.state.finishedLoading) {
          // Get the configuration from the backend
          this._updateConfigState();
          this.setState({ finishedLoading: true });
        }
      });

      // TODO: Check the context object to set styles based on Light or Dark theme.

      // Validate the configuration
      this._twitch.configuration.onChanged(() => this._updateConfigState());
    }
  }

  public render() {
    return (
      <div className="App">
        {this.state.finishedLoading && (
          <Main username={this.state.username} apiKey={this.state.apiKey} numAchievementsToShow={this.state.numAchievementsToShow} />
        )}
      </div>
    );
  }

  private _updateConfigState = () => {
    if (!this._twitch) {
      // TODO: Display some sort of error...
      console.log("Twitch extension helper is not loaded...");
      return;
    }
    let config: IAppConfig;
    let rawConfig = this._twitch.configuration.broadcaster ? this._twitch.configuration.broadcaster.content : "";
    try {
      config = JSON.parse(rawConfig);
    } catch (error) {
      config = EMPTY_CONFIG;
    }

    this.setState({ username: config.username, apiKey: config.apiKey, numAchievementsToShow: config.numAchievementsToShow });
  };
}

export default App;
