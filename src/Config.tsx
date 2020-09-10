import * as React from "react";
import { APP_VERSION, IAppConfig } from "./App";
import { Auth } from "./Auth";
import { ConfigSegments, ITwitchAuth, TwitchExtensionHelper } from "./twitch-ext";

interface IConfigState {
  username: string;
  apiKey: string;
  numAchievementsToShow: number;
  finishedLoading: boolean;
}

enum Fields {
  username = "username",
  apiKey = "apiKey",
  numAchievementsToShow = "numAchievementsToShow",
}

export const EMPTY_CONFIG: IAppConfig = {
  username: "",
  apiKey: "",
  numAchievementsToShow: 0,
};

export class Config extends React.Component<{}, IConfigState> {
  private _auth: Auth;
  private _twitch: TwitchExtensionHelper | undefined;
  private _currentNumAchievements = "";

  constructor(_ = {}) {
    super({});
    this._auth = new Auth();
    this._twitch = window.Twitch ? window.Twitch.ext : undefined;
    this.state = {
      username: "",
      apiKey: "",
      numAchievementsToShow: 0,
      finishedLoading: false,
    };
  }

  public componentDidMount() {
    // Set up Twitch stuff
    if (this._twitch) {
      this._twitch.onAuthorized((auth: ITwitchAuth) => {
        this._auth.setToken(auth.token, auth.userId);
        if (!this.state.finishedLoading) {
          this.setState({ finishedLoading: true });
        }
      });

      this._twitch.configuration.onChanged(() => {
        let config: IAppConfig;
        let rawConfig = this._twitch?.configuration.broadcaster ? this._twitch.configuration.broadcaster.content : "";
        try {
          config = JSON.parse(rawConfig);
        } catch (error) {
          config = EMPTY_CONFIG;
        }

        this.setState({ username: config.username, apiKey: config.apiKey, numAchievementsToShow: config.numAchievementsToShow });
        this._currentNumAchievements = config.numAchievementsToShow ? config.numAchievementsToShow.toString() : "1";
      });
    }
  }

  public render() {
    // TODO: STYLING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // TODO: Validate the numAchievementsToShow field! Disable button if invalid!
    return (
      <div>
        <label htmlFor={Fields.username}>Retro Achievements Username: </label>
        <input id={Fields.username} type="text" name={Fields.username} value={this.state.username} onChange={this._onInputChange} />
        <br />
        <label htmlFor={Fields.apiKey}>Retro Achievements API Key: </label>
        <input id={Fields.apiKey} type="text" name={Fields.apiKey} value={this.state.apiKey} onChange={this._onInputChange} />
        <br />
        <label htmlFor={Fields.numAchievementsToShow}>Number of recent achievements to show: </label>
        <input
          id={Fields.numAchievementsToShow}
          type="text"
          name={Fields.numAchievementsToShow}
          value={this._currentNumAchievements}
          onChange={this._onInputChange}
        />
        <br />
        <button type="submit" onClick={this._saveConfig}>
          Save
        </button>
      </div>
    );
  }

  private _onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const name = target.name;

    switch (name) {
      case Fields.username:
        this.setState({ username: target.value });
        break;
      case Fields.apiKey:
        this.setState({ apiKey: target.value });
        break;
      case Fields.numAchievementsToShow:
        this._currentNumAchievements = target.value;
        // Validate the currentNumAchievements
        if (isNaN(parseInt(this._currentNumAchievements))) {
          // Change the value to 5 if we don't know what this is
          this._currentNumAchievements = "5";
          this.setState({ numAchievementsToShow: 5 });
          break;
        }
        // TODO: Determine actual max value. I believe it is 5, but I'm not 100%. Also, 10 is probably a healthy max for the extension.
        let value = parseInt(this._currentNumAchievements);
        if (value > 5) {
          value = 5;
        } else if (value < 1) {
          value = 1;
        }
        this.setState({ numAchievementsToShow: value });
        break;
    }
  };

  private _saveConfig = () => {
    const config: IAppConfig = {
      username: this.state.username,
      apiKey: this.state.apiKey,
      numAchievementsToShow: this.state.numAchievementsToShow,
    };
    if (this._twitch) {
      this._twitch.configuration.set(ConfigSegments.broadcaster, APP_VERSION, JSON.stringify(config));
    } else {
      // TODO: Display some sort of error on the config page...
      console.log("Twitch extension helper is not loaded...");
    }
  };
}
