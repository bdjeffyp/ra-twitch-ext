import { Callout, DirectionalHint, Stack, TextField } from "@fluentui/react";
import * as React from "react";
import { Auth } from "./Auth";
import * as Styles from "./Config.style";
import blankKeyImage from "./img/BlankKey.png";
import { EMPTY_CONFIG, EXT_CONFIG_KEY, Fields, IAppConfig, MAX_ACHIEVEMENTS_TO_SHOW } from "./models";
import { RA_URL } from "./ra-api";
import { ConfigSegments, ITwitchAuth, TwitchExtensionHelper } from "./twitch-ext";

interface IConfigState {
  username: string;
  apiKey: string;
  numAchievementsToShow: string;
  finishedLoading: boolean;
  changesSavedIndicator: boolean;
  saveButtonEnabled: boolean;
  isApiKeyCalloutVisible: boolean;
}
interface IConfigProps {}

export class Config extends React.Component<IConfigProps, IConfigState> {
  private _auth: Auth;
  private _twitch: TwitchExtensionHelper | undefined;
  private _usernameTextFieldError = false;
  private _apiKeyTextFieldError = false;
  private _numAchievementsTextFieldError = false;

  constructor(props: IConfigProps) {
    super(props);
    this._auth = new Auth();
    this._twitch = window.Twitch ? window.Twitch.ext : undefined;
    this.state = {
      username: "",
      apiKey: "",
      numAchievementsToShow: "5",
      finishedLoading: false,
      changesSavedIndicator: false,
      saveButtonEnabled: false,
      isApiKeyCalloutVisible: false,
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

        this.setState({ username: config.username, apiKey: config.apiKey, numAchievementsToShow: config.numAchievementsToShow.toString() });
      });
    }
  }

  public render() {
    return (
      <>
        <div style={Styles.configContainerStyle()}>
          <div style={Styles.instructionsStyle()}>
            To display this extension, you need to provide your Retro Achievements username and API key. Go to{" "}
            <a href={`${RA_URL}/controlpanel.php`} target="_blank" rel="noopener noreferrer" style={Styles.linkStyle()}>
              your Retro Achievements settings page
            </a>{" "}
            to find the API key and copy-paste it. These values are encrypted and stored with Twitch.
          </div>
          <Stack horizontal style={Styles.optionsStackStyle()}>
            <label htmlFor={Fields.username} style={Styles.labelStyle()}>
              Retro Achievements Username:
            </label>
            <TextField
              id={Fields.username}
              type="text"
              name={Fields.username}
              value={this.state.username}
              onFocus={this._onInputClick}
              onChange={this._onUsernameChange}
              onGetErrorMessage={this._validateUsername}
              styles={Styles.inputStyle("14em", this._usernameTextFieldError)}
            />
          </Stack>
          <Stack horizontal style={Styles.optionsStackStyle()}>
            <label htmlFor={Fields.apiKey} style={Styles.labelStyle()}>
              Retro Achievements API Key:
            </label>
            {/* While it is bad practice to set a value into a password field, the API key isn't really a password, per se... */}
            {/* We allow it here as the key is available in plaintext on Retro Achievements for the specific user. */}
            {/* That specific user can only see the value here as well, since they copy-paste it here. */}
            <TextField
              id={Fields.apiKey}
              type="password"
              canRevealPassword
              name={Fields.apiKey}
              value={this.state.apiKey}
              onFocus={this._onApiKeyInputClick}
              onBlur={this._onApiKeyInputBlur}
              onChange={this._onApiKeyChange}
              onGetErrorMessage={this._validateApiKey}
              styles={Styles.inputStyle("15.4em", this._apiKeyTextFieldError)}
            />
          </Stack>
          <Stack horizontal style={Styles.optionsStackStyle()}>
            <label htmlFor={Fields.numAchievementsToShow} style={Styles.labelStyle()}>
              Recent achievements to show:
            </label>
            <TextField
              id={Fields.numAchievementsToShow}
              type="text"
              name={Fields.numAchievementsToShow}
              value={this.state.numAchievementsToShow}
              onFocus={this._onInputClick}
              onChange={this._onNumAchievementsChange}
              onGetErrorMessage={this._validateNumAchievements}
              validateOnLoad={false}
              styles={Styles.inputStyle("14.55em", this._numAchievementsTextFieldError)}
            />
          </Stack>
          <button type="submit" disabled={!this.state.saveButtonEnabled} onClick={this._saveConfig} style={Styles.buttonInputStyle()}>
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
        {this.state.isApiKeyCalloutVisible && (
          <Callout target={`input#${Fields.apiKey}`} directionalHint={DirectionalHint.bottomCenter} styles={Styles.apiKeyCalloutStyle()}>
            <div style={Styles.apiKeyCalloutHeaderStyle()}>Is your API Key blank!?</div>
            <img src={blankKeyImage} alt="Retro Achievements Web API Key text field is empty" />
            If your settings page looks like the above screenshot, press the{" "}
            <span style={Styles.calloutQuoteStyle()}>"Reset Web API Key"</span> button to get a new key generated.
          </Callout>
        )}
      </>
    );
  }

  private _onInputClick = () => {
    this.setState({ changesSavedIndicator: false });
  };

  private _onApiKeyInputClick = () => {
    this._onInputClick();
    // Show the callout
    this.setState({ isApiKeyCalloutVisible: true });
  };

  private _onApiKeyInputBlur = () => {
    // Hide the callout
    this.setState({ isApiKeyCalloutVisible: false });
  };

  private _onUsernameChange = (_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newName?: string) => {
    this.setState({ username: newName || "" });
  };

  private _validateUsername = (newName: string): string => {
    let errorText = "";
    if (newName === "") {
      this._usernameTextFieldError = true;
      errorText = "Retro Achievements username is required";
    } else {
      this._usernameTextFieldError = false;
    }
    this._updateSaveButtonEnabledState(this._usernameTextFieldError);
    return errorText;
  };

  private _onApiKeyChange = (_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newKey?: string) => {
    this.setState({ apiKey: newKey || "" });
  };

  private _validateApiKey = (newKey: string): string => {
    let errorText = "";
    if (newKey === "") {
      this._apiKeyTextFieldError = true;
      errorText = "API Key is required";
    } else {
      this._apiKeyTextFieldError = false;
    }
    this._updateSaveButtonEnabledState(this._apiKeyTextFieldError);
    return errorText;
  };

  private _onNumAchievementsChange = (_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newNumber?: string) => {
    this.setState({ numAchievementsToShow: newNumber || "" });
  };

  private _validateNumAchievements = (newNumber: string): string => {
    let validCount = false;
    let errorText = "";

    // Validate the change
    if (isNaN(parseInt(newNumber))) {
      validCount = false;
    } else {
      let value = parseInt(newNumber);
      if (value > MAX_ACHIEVEMENTS_TO_SHOW || value < 1) {
        validCount = false;
      } else {
        validCount = true;
      }
    }

    // Update the ability to save
    if (validCount) {
      this._numAchievementsTextFieldError = false;
    } else {
      this._numAchievementsTextFieldError = true;
      errorText = "Must be a number between 1 and 30";
    }
    this._updateSaveButtonEnabledState(this._numAchievementsTextFieldError);
    return errorText;
  };

  private _updateSaveButtonEnabledState = (hasError: boolean) => {
    this.setState({ saveButtonEnabled: !hasError });
  };

  private _saveConfig = () => {
    // Here is the final chance to validate the parsing of the number of achievements
    // Shouldn't be able to press Save button unless already verified to be a valid int, but perform one last check here
    if (isNaN(parseInt(this.state.numAchievementsToShow))) {
      // TODO: Should show some sort of error?
      return;
    }
    const config: IAppConfig = {
      username: this.state.username,
      apiKey: this.state.apiKey,
      numAchievementsToShow: parseInt(this.state.numAchievementsToShow),
    };
    if (this._twitch) {
      this._twitch.configuration.set(ConfigSegments.broadcaster, EXT_CONFIG_KEY, JSON.stringify(config));
      this.setState({ changesSavedIndicator: true, saveButtonEnabled: false });
    } else {
      // TODO: Display some sort of error on the config page...
      console.log("Twitch extension helper is not loaded...");
    }
  };
}
