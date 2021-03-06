import { Callout, Checkbox, DirectionalHint, Stack, TextField } from "@fluentui/react";
import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Auth } from "./Auth";
import * as Styles from "./Config.style";
import { DraggableSection } from "./DraggableSection";
import blankKeyImage from "./img/BlankKey.png";
import {
  ConfigCheckboxes,
  DEFAULT_ACHIEVEMENT_COUNT,
  DEFAULT_CONFIG,
  DEFAULT_SHOW_LAST_GAME,
  DEFAULT_SHOW_MASTERED_SETS,
  DEFAULT_SHOW_RECENT_ACHIEVEMENTS,
  DEFAULT_SHOW_RICH_PRESENCE,
  DEFAULT_SHOW_USER_PROFILE,
  EXT_CONFIG_KEY,
  Fields,
  IAppConfig,
  ISections,
  MAX_ACHIEVEMENTS_TO_SHOW,
} from "./models";
import { RA_URL } from "./ra-api";
import { ConfigSegments, ITwitchAuth, TwitchExtensionHelper } from "./twitch-ext";
import { getSectionIndex, getSectionSetting, validateConfigOptions } from "./utils";

interface IConfigState extends IAppConfig {
  achievementsToShow: string;
  finishedLoading: boolean;
  changesSavedIndicator: boolean;
  saveButtonEnabled: boolean;
  isApiKeyCalloutVisible: boolean;
  hasTextFieldError: boolean;
  showUserProfile: boolean;
  showLastGamePlaying: boolean;
  showRichPresenceMessage: boolean;
  showRecentAchievementList: boolean;
  showMasteredSetsList: boolean;
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

    // Initialize state with defaults from DEFAULT_CONFIG
    this.state = {
      ...DEFAULT_CONFIG,
      achievementsToShow: DEFAULT_ACHIEVEMENT_COUNT.toString(),
      finishedLoading: false,
      changesSavedIndicator: false,
      saveButtonEnabled: false,
      isApiKeyCalloutVisible: false,
      hasTextFieldError: false,
      showUserProfile: DEFAULT_SHOW_USER_PROFILE,
      showLastGamePlaying: DEFAULT_SHOW_LAST_GAME,
      showRichPresenceMessage: DEFAULT_SHOW_RICH_PRESENCE,
      showRecentAchievementList: DEFAULT_SHOW_RECENT_ACHIEVEMENTS,
      showMasteredSetsList: DEFAULT_SHOW_MASTERED_SETS,
    };
  }

  public componentDidMount() {
    // Set up Twitch stuff and get data from the configuration store
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
          config = DEFAULT_CONFIG;
        }

        // If any config options are missing, typically for extension updates, update it!
        validateConfigOptions(config);

        // Update the state
        const sections = config.sections;
        this.setState({
          username: config.username,
          apiKey: config.apiKey,
          achievementsToShow: config.numAchievementsToShow.toString(),
          showCompletedWithMastered: config.showCompletedWithMastered,
          sections: sections,
          // Split out the state from the ISections objects while we work
          showUserProfile: getSectionSetting(ConfigCheckboxes.userProfile, sections) || DEFAULT_SHOW_USER_PROFILE,
          showLastGamePlaying: getSectionSetting(ConfigCheckboxes.lastGamePlaying, sections) || DEFAULT_SHOW_LAST_GAME,
          showRichPresenceMessage: getSectionSetting(ConfigCheckboxes.richPresence, sections) || DEFAULT_SHOW_RICH_PRESENCE,
          showRecentAchievementList: getSectionSetting(ConfigCheckboxes.recentAchievements, sections) || DEFAULT_SHOW_RECENT_ACHIEVEMENTS,
          showMasteredSetsList: getSectionSetting(ConfigCheckboxes.masteredSets, sections) || DEFAULT_SHOW_MASTERED_SETS,
        });
      });
    }
  }

  public render() {
    // Set up a working copy of the section order array and indexes
    const sections = this.state.sections;
    const userProfileIndex = getSectionIndex(ConfigCheckboxes.userProfile, sections);
    const lastGameIndex = getSectionIndex(ConfigCheckboxes.lastGamePlaying, sections);
    const recentAchievementsIndex = getSectionIndex(ConfigCheckboxes.recentAchievements, sections);
    const masteredSetsIndex = getSectionIndex(ConfigCheckboxes.masteredSets, sections);

    return (
      <>
        <div style={Styles.configContainerStyle()}>
          {/* Instructions section */}
          <div style={Styles.instructionsStyle()}>
            To display this extension, you need to provide your Retro Achievements username and API key. Go to{" "}
            <a href={`${RA_URL}/controlpanel.php`} target="_blank" rel="noopener noreferrer" style={Styles.linkStyle()}>
              your Retro Achievements settings page
            </a>{" "}
            to find the API key and copy-paste it. These values are encrypted and stored with Twitch.
          </div>
          {/* Username */}
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
          {/* API Key */}
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
          {/* Number of achievements to show */}
          <Stack horizontal style={Styles.optionsStackStyle()}>
            <label htmlFor={Fields.numAchievementsToShow} style={Styles.labelStyle()}>
              Recent achievements to show:
            </label>
            <TextField
              id={Fields.numAchievementsToShow}
              type="text"
              name={Fields.numAchievementsToShow}
              value={this.state.achievementsToShow}
              onFocus={this._onInputClick}
              onChange={this._onNumAchievementsChange}
              onGetErrorMessage={this._validateNumAchievements}
              validateOnLoad={false}
              styles={Styles.inputStyle("14.55em", this._numAchievementsTextFieldError)}
            />
          </Stack>
          {/* Number of mastered sets to show */}
          <Stack horizontal style={Styles.optionsStackStyle()}>
            <label htmlFor={Fields.showCompletedWithMastered} style={Styles.labelStyle()}>
              Show completed (non-hardcore) sets?
            </label>
            <Checkbox
              id={Fields.showCompletedWithMastered}
              name={Fields.showCompletedWithMastered}
              checked={this.state.showCompletedWithMastered}
              onFocus={this._onInputClick}
              onChange={this._onShowCompletedCheckChange}
              styles={Styles.completedSetsCheckboxStyle(this.state.showCompletedWithMastered)}
            />
          </Stack>
          <hr style={Styles.horizontalRuleStyle()} />
          {/* Configure panel appearance with drag and drop sections */}
          {sections && (
            <DndProvider backend={HTML5Backend}>
              Select the sections you want to display on the panel.
              <br />
              <b>Coming soon:</b> drag and drop to change the order of the sections!
              <DraggableSection
                id={sections[userProfileIndex].text}
                sectionCard={sections[userProfileIndex]}
                renderCheckbox={this._renderCheckbox}
                initialIndex={userProfileIndex}
                // moveCard={this._moveSectionCard}
                // findCard={this._findSectionCard}
              />
              <DraggableSection
                id={sections[lastGameIndex].text}
                sectionCard={sections[lastGameIndex]}
                renderCheckbox={this._renderCheckbox}
                initialIndex={lastGameIndex}
                // moveCard={this._moveSectionCard}
                // findCard={this._findSectionCard}
              />
              <DraggableSection
                id={sections[recentAchievementsIndex].text}
                sectionCard={sections[recentAchievementsIndex]}
                renderCheckbox={this._renderCheckbox}
                initialIndex={recentAchievementsIndex}
                // moveCard={this._moveSectionCard}
                // findCard={this._findSectionCard}
              />
              <DraggableSection
                id={sections[masteredSetsIndex].text}
                sectionCard={sections[masteredSetsIndex]}
                renderCheckbox={this._renderCheckbox}
                initialIndex={masteredSetsIndex}
                // moveCard={this._moveSectionCard}
                // findCard={this._findSectionCard}
              />
            </DndProvider>
          )}
          {/* Save button and status */}
          <button type="submit" disabled={!this.state.saveButtonEnabled} onClick={this._saveConfig} style={Styles.buttonInputStyle()}>
            Save
          </button>
          <span style={Styles.changesSavedIndicatorStyle()} hidden={!this.state.changesSavedIndicator}>
            Saved!
          </span>
          {/* Footer */}
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
      this._setTextFieldErrorState();
      errorText = "Retro Achievements username is required";
    } else {
      this._usernameTextFieldError = false;
      this._clearTextFieldErrorState();
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
      this._setTextFieldErrorState();
      errorText = "API Key is required";
    } else {
      this._apiKeyTextFieldError = false;
      this._clearTextFieldErrorState();
    }
    this._updateSaveButtonEnabledState(this._apiKeyTextFieldError);
    return errorText;
  };

  private _onNumAchievementsChange = (_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newNumber?: string) => {
    this.setState({ achievementsToShow: newNumber || "" });
  };

  private _validateNumberFromString = (newNumber: string, maxValue: number): boolean => {
    let validNumber = false;

    if (isNaN(parseInt(newNumber))) {
      validNumber = false;
    } else {
      let value = parseInt(newNumber);
      if (value > maxValue || value < 1) {
        validNumber = false;
      } else {
        validNumber = true;
      }
    }

    return validNumber;
  };

  private _validateNumAchievements = (newNumber: string): string => {
    let validCount = false;
    let errorText = "";

    // Validate the change
    validCount = this._validateNumberFromString(newNumber, MAX_ACHIEVEMENTS_TO_SHOW);

    // Update the ability to save
    if (validCount) {
      this._numAchievementsTextFieldError = false;
      this._clearTextFieldErrorState();
    } else {
      this._numAchievementsTextFieldError = true;
      this._setTextFieldErrorState();
      errorText = "Must be a number between 1 and 30";
    }
    this._updateSaveButtonEnabledState(this._numAchievementsTextFieldError);
    return errorText;
  };

  private _onShowCompletedCheckChange = (_?: React.FormEvent<HTMLInputElement | HTMLElement>, checked?: boolean) => {
    this.setState({
      showCompletedWithMastered: checked || false,
      saveButtonEnabled: !this.state.hasTextFieldError && true,
      changesSavedIndicator: false,
    });
  };

  /**
   * Draw a checkbox for the section container
   * @param id The ConfigCheckboxes enum value
   * @param checked The boolean state associated with the id
   */
  private _renderCheckbox = (id: ConfigCheckboxes, checked: boolean): React.ReactNode => {
    const disabled = id === ConfigCheckboxes.richPresence ? !this.state.showLastGamePlaying : false;
    const styles = id === ConfigCheckboxes.richPresence ? Styles.checkboxStyle(checked, disabled, true) : Styles.checkboxStyle(checked);
    return <Checkbox label={id} checked={checked} disabled={disabled} onChange={() => this._onCheckChanged(id)} styles={styles} />;
  };

  private _onCheckChanged = (configItem: ConfigCheckboxes) => {
    console.log(`I'm clicked! ${configItem}`);
    switch (configItem) {
      case ConfigCheckboxes.userProfile:
        console.log(`Initial state: ${this.state.showUserProfile}`);
        this.setState({ showUserProfile: !this.state.showUserProfile });
        break;
      case ConfigCheckboxes.lastGamePlaying:
        this.setState({ showLastGamePlaying: !this.state.showLastGamePlaying });
        break;
      case ConfigCheckboxes.richPresence:
        this.setState({ showRichPresenceMessage: !this.state.showRichPresenceMessage });
        break;
      case ConfigCheckboxes.recentAchievements:
        this.setState({ showRecentAchievementList: !this.state.showRecentAchievementList });
        break;
      case ConfigCheckboxes.masteredSets:
        this.setState({ showMasteredSetsList: !this.state.showMasteredSetsList });
    }

    // Enable the save button as long as there are no errors
    if (!this.state.hasTextFieldError) {
      this.setState({ saveButtonEnabled: true });
    }

    // TODO: THIS NEEDS TO BE FIXED!!
    // If all checkboxes (user profile, last game, and recent achievements) are unchecked, disable the save button
    if (!this.state.showUserProfile && !this.state.showLastGamePlaying && !this.state.showRecentAchievementList) {
      this._updateSaveButtonEnabledState(true);
    }
  };

  private _updateSaveButtonEnabledState = (hasError: boolean) => {
    this.setState({ saveButtonEnabled: !hasError });
  };

  private _setTextFieldErrorState = () => {
    this.setState({ hasTextFieldError: true });
  };

  private _clearTextFieldErrorState = () => {
    this.setState({ hasTextFieldError: false });
  };

  private _saveConfig = () => {
    // Here is the final chance to validate the parsing of the number of achievements
    // Shouldn't be able to press Save button unless already verified to be a valid int, but perform one last check here
    if (isNaN(parseInt(this.state.achievementsToShow))) {
      // TODO: Should show some sort of error?
      return;
    }

    // Place the section states back into their ISections objects
    const sections = this.state.sections;
    this._updateSectionState(ConfigCheckboxes.userProfile, sections, this.state.showUserProfile);
    this._updateSectionState(
      ConfigCheckboxes.lastGamePlaying,
      sections,
      this.state.showLastGamePlaying,
      this.state.showRichPresenceMessage
    );
    this._updateSectionState(ConfigCheckboxes.recentAchievements, sections, this.state.showRecentAchievementList);
    this._updateSectionState(ConfigCheckboxes.masteredSets, sections, this.state.showMasteredSetsList);

    // Now update the config with Twitch!
    const config: IAppConfig = {
      username: this.state.username,
      apiKey: this.state.apiKey,
      numAchievementsToShow: parseInt(this.state.achievementsToShow),
      showCompletedWithMastered: this.state.showCompletedWithMastered,
      sections: sections,
    };
    if (this._twitch) {
      this._twitch.configuration.set(ConfigSegments.broadcaster, EXT_CONFIG_KEY, JSON.stringify(config));
      this.setState({ changesSavedIndicator: true, saveButtonEnabled: false });
    } else {
      // TODO: Display some sort of error on the config page...
      console.log("Twitch extension helper is not loaded...");
    }
  };

  /**
   * Updates the sectionOrder array passed in with the checked state, if the index is found, otherwise does nothing.
   * @param id The `ConfigCheckboxes` identifier for the state
   * @param sectionOrder The `ISections` array to update
   * @param checked The state being updated
   * @param childChecked The section's child state being updated
   */
  private _updateSectionState = (id: ConfigCheckboxes, sectionOrder: ISections[], checked: boolean, childChecked?: boolean) => {
    const index = getSectionIndex(id, sectionOrder);
    if (index >= 0) {
      sectionOrder[index].checked = checked;
      if (sectionOrder[index].childChecked !== undefined && childChecked) {
        // Update the child as well
        sectionOrder[index].childChecked = childChecked;
      }
    }
  };

  private _findSectionCard = (id: string) => {
    // const card = this.state.sections.filter((section: ISections) => section.text === id)[0];
    // return { card, index: this.state.sections.indexOf(card) };
  };

  private _moveSectionCard = (id: string, atIndex: number) => {
    //   const { card, index } = this._findSectionCard(id);
    //   let updateSections = this.state.sections;
    //   updateSections = updateSections.splice(index, 1);
    //   updateSections = updateSections.splice(atIndex, 0, card);
    //   this.setState({ sections: updateSections });
  };
}
