import { Stack } from "@fluentui/react";
import * as React from "react";
import { APP_VERSION, IAppConfig } from "./App";
import { Auth } from "./Auth";
import * as Styles from "./Config.style";
import { RA_URL } from "./ra-api";
import { ConfigSegments, ITwitchAuth, TwitchExtensionHelper } from "./twitch-ext";

interface IConfigState {
  username: string;
  apiKey: string;
  numAchievementsToShow: number;
  finishedLoading: boolean;
  changesSavedIndicator: boolean;
}
interface IConfigProps {}

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

export class Config extends React.Component<IConfigProps, IConfigState> {
  private _auth: Auth;
  private _twitch: TwitchExtensionHelper | undefined;
  private _currentNumAchievements = "";

  constructor(props: IConfigProps) {
    super(props);
    this._auth = new Auth();
    this._twitch = window.Twitch ? window.Twitch.ext : undefined;
    this.state = {
      username: "",
      apiKey: "",
      numAchievementsToShow: 0,
      finishedLoading: false,
      changesSavedIndicator: false,
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
    // TODO: Validate the numAchievementsToShow field! Disable button if invalid!
    return (
      <div style={Styles.configContainerStyle()}>
        <div style={Styles.instructionsStyle()}>
          To display this extension, you need to provide your Retro Achievements username and API key. Go to{" "}
          <a href={`${RA_URL}/controlpanel.php`} target="_blank" rel="noopener noreferrer" style={Styles.linkStyle()}>
            your Retro Achievements settings page
          </a>{" "}
          to find the API key and copy-paste it. These values are encrypted and stored with Twitch.
        </div>
        <Stack horizontal style={Styles.optionsStackStyle()}>
          <div>
            <div style={Styles.labelStyle()}>
              <label htmlFor={Fields.username}>Retro Achievements Username: </label>
            </div>
            <div style={Styles.labelStyle()}>
              <label htmlFor={Fields.apiKey}>Retro Achievements API Key: </label>
            </div>
            {/* TODO: Currently hiding the number of achievements to show as I don't think I want it... */}
            {/* <div style={Styles.labelStyle()}>
              <label htmlFor={Fields.numAchievementsToShow}>Recent achievements to show: </label>
            </div> */}
          </div>
          <div style={Styles.inputStackStyle()}>
            <div>
              <input
                id={Fields.username}
                type="text"
                name={Fields.username}
                value={this.state.username}
                onClick={this._onInputClick}
                onChange={this._onInputChange}
                style={Styles.inputStyle()}
              />
            </div>
            <div>
              {/* While it is bad practice to set a value into a password field, the API key isn't really a password, per se... */}
              {/* We allow it here as the key is available in plaintext on Retro Achievements for the specific user. */}
              {/* That specific user can only see the value here as well, since they copy-paste it here. */}
              <input
                id={Fields.apiKey}
                type="password"
                name={Fields.apiKey}
                value={this.state.apiKey}
                onClick={this._onInputClick}
                onChange={this._onInputChange}
                style={Styles.inputStyle()}
              />
            </div>
            {/* <div>
              <input
                id={Fields.numAchievementsToShow}
                type="text"
                name={Fields.numAchievementsToShow}
                value={this._currentNumAchievements}
                onChange={this._onInputChange}
                style={Styles.inputStyle()}
              />
            </div> */}
          </div>
        </Stack>
        <button type="submit" onClick={this._saveConfig} style={Styles.inputStyle()}>
          Save
        </button>
        <span style={Styles.changesSavedIndicatorStyle()} hidden={!this.state.changesSavedIndicator}>
          Saved!
        </span>
        <div style={Styles.footerStyle()}>
          Retro Achievements Streamer Stats extension created by{" "}
          <a href="https://github.com/bdjeffyp" target="_blank" rel="noopener noreferrer" style={Styles.linkStyle()}>
            Jeff Peterson (bdjeffyp)
          </a>
          <br />
          Report issues/bugs/happiness with the extension{" "}
          <a href="https://github.com/bdjeffyp/ra-twitch-ext/issues" target="_blank" rel="noopener noreferrer" style={Styles.linkStyle()}>
            here
          </a>
        </div>
      </div>
    );
  }

  private _onInputClick = () => {
    this.setState({ changesSavedIndicator: false });
  };

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
      this.setState({ changesSavedIndicator: true });
    } else {
      // TODO: Display some sort of error on the config page...
      console.log("Twitch extension helper is not loaded...");
    }
  };
}
