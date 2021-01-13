import * as React from "react";
import "./App.css";
import { Auth } from "./Auth";
import { Main } from "./Main";
import { DEFAULT_CONFIG, IAppConfig } from "./models";
import { ITwitchAuth, TwitchExtensionHelper } from "./twitch-ext";
import { validateConfigOptions } from "./utils";

interface IAppState extends IAppConfig {
  finishedLoading: boolean;
}
interface IAppProps {
  nonce: string;
}

/**
 * Main panel entry point. Responsible for setting up Twitch extension helper and fetching config.
 */
class App extends React.Component<IAppProps, IAppState> {
  private _auth: Auth;
  private _twitch: TwitchExtensionHelper | undefined;

  constructor(props: IAppProps) {
    super(props);
    this._auth = new Auth();
    this._twitch = window.Twitch ? window.Twitch.ext : undefined;

    // Initialize the state with defaults from DEFAULT_CONFIG
    this.state = {
      finishedLoading: false,
      ...DEFAULT_CONFIG,
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
    return <div className="App">{this.state.finishedLoading && <Main {...this.state} />}</div>;
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
      config = DEFAULT_CONFIG;
    }

    // Ensure each property of the config is initialized with default values if undefined
    validateConfigOptions(config);

    this.setState({
      username: config.username,
      apiKey: config.apiKey,
      numAchievementsToShow: config.numAchievementsToShow,
      showUserProfile: config.showUserProfile,
      showLastGamePlaying: config.showLastGamePlaying,
      showRichPresenceMessage: config.showRichPresenceMessage,
      showRecentAchievementList: config.showRecentAchievementList,
      showMasteredSetsList: config.showMasteredSetsList,
      showCompletedWithMastered: config.showCompletedWithMastered,
    });
  };
}

export default App;
