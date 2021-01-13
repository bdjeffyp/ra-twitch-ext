import { Spinner, SpinnerSize, Stack } from "@fluentui/react";
import DayJs from "dayjs";
import * as React from "react";
import * as Styles from "./Main.style";
import { DEFAULT_ACHIEVEMENT_COUNT, IAppConfig, Sections } from "./models";
import { IAchievement, IApiProps, ICompletedGame, IUserSummary, RA_URL, RetroAchievementsApi } from "./ra-api";

interface IMainState {
  failstate: boolean;
  errorMessage: string;
  title: string;
  lastGameUrl: string;
  userPicUrl: string;
  username: string;
  rank: string;
  points: string;
  retroPoints: string;
  recentAchievements: IAchievement[];
  masteredSets: ICompletedGame[];
  richPresenceMessage: string;
  apisToCall: number;
  showUserProfile: boolean;
  showLastGamePlaying: boolean;
  showRichPresenceMessage: boolean;
  showRecentAchievementList: boolean;
  showMasteredSetsList: boolean;
  sectionOrder: Sections[];
}

export class Main extends React.Component<IAppConfig, IMainState> {
  private _ra: RetroAchievementsApi;

  constructor(props: IAppConfig) {
    super(props);

    // Initialize RA API
    const apiProps: IApiProps = {
      username: this.props.username,
      apiKey: this.props.apiKey,
    };
    this._ra = new RetroAchievementsApi(apiProps);

    this.state = {
      failstate: false,
      errorMessage: "",
      title: "",
      lastGameUrl: "",
      userPicUrl: "",
      username: "",
      rank: "",
      points: "",
      retroPoints: "",
      recentAchievements: [],
      masteredSets: [],
      richPresenceMessage: "",
      apisToCall: 2,
      showUserProfile: true,
      showLastGamePlaying: true,
      showRichPresenceMessage: true,
      showRecentAchievementList: true,
      showMasteredSetsList: true,
      sectionOrder: [],
    };
  }

  public componentDidMount() {
    // Set the layout customization
    this.setState({
      showUserProfile: this.props.showUserProfile,
      showLastGamePlaying: this.props.showLastGamePlaying,
      showRichPresenceMessage: this.props.showRichPresenceMessage,
      showRecentAchievementList: this.props.showRecentAchievementList,
      showMasteredSetsList: this.props.showMasteredSetsList,
    });

    // Get the data for the panel from RetroAchievements and kick off the periodic fetching sequence
    this._performInitialFetch();
  }

  public render() {
    return (
      <div style={Styles.mainContainerStyle()}>
        {this.state.apisToCall > 0 && !this.state.failstate && (
          <Spinner size={SpinnerSize.large} label="Loading" style={Styles.loadingSpinnerStyle()}></Spinner>
        )}
        {this.state.apisToCall === 0 && this.state.failstate && <div>{this.state.errorMessage + " - Refresh the page"}</div>}
        {this.state.apisToCall === 0 && !this.state.failstate && (
          <>
            {this._renderPanelSections()}
            <div style={Styles.footerStyle()}>
              Extension created by{" "}
              <a href="https://github.com/bdjeffyp" target="_blank" rel="noopener noreferrer" style={Styles.linkStyle()}>
                Jeff Peterson (bdjeffyp)
              </a>
              <br />
              Report issues/bugs/happiness{" "}
              <a
                href="https://github.com/bdjeffyp/ra-twitch-ext/issues"
                target="_blank"
                rel="noopener noreferrer"
                style={Styles.linkStyle()}
              >
                here
              </a>
            </div>
          </>
        )}
      </div>
    );
  }

  /**
   * Renders the basic Retro Achievements profile information like so:
   *
   * PHOTO  UserName | Ranking
   *
   * PHOTO  Points
   *
   * PHOTO  Retro Ratio points
   */
  private _renderUserProfileInfo = (index: number): React.ReactNode => {
    // Create formatted text string for the user's Retro Achievements standing
    let rankText = "";
    if (this.state.rank) {
      if (this.state.rank === "0") {
        rankText = "Unranked";
      } else {
        rankText = ` | ${this.state.rank}`;
        const onesDigit = this.state.rank.charAt(this.state.rank.length - 1);
        switch (onesDigit) {
          case "1":
            rankText += "st";
            break;
          case "2":
            rankText += "nd";
            break;
          case "3":
            rankText += "rd";
            break;
          default:
            rankText += "th";
            break;
        }
        rankText += " place";
      }
    }

    return (
      <Stack
        key={`${index}: ${Sections.userProfile}`}
        style={Styles.profileContainerStyle(this._isFirstSection(index), this._isLastSection(index))}
      >
        <Stack horizontal>
          {/* Profile pic. Note that alt text doesn't need the word "photo" in it. */}
          <img src={this.state.userPicUrl} alt="Streamer's Retro Achievements profile" style={Styles.profileImageStyle()} />

          <Stack>
            <div>
              {/* Username and rank */}
              <a href={RA_URL + "/user/" + this.state.username} target="_blank" rel="noopener noreferrer" style={Styles.profileNameStyle()}>
                {this.state.username}
              </a>
              <span>{rankText}</span>
            </div>
            {/* Points earned */}
            <div>{this.state.points} points</div>
            <div style={Styles.retroRatioPointsStyle()}>{this.state.retroPoints} Retro Ratio points</div>
          </Stack>
        </Stack>
      </Stack>
    );
  };

  /**
   * Renders the information about the last game the user has played as well as rich presence data
   */
  private _renderLastGamePlaying = (index: number): React.ReactNode => {
    return (
      <Stack key={`${index}: ${Sections.lastGame}`} style={Styles.lastGamePlayingContainerStyle(this._isLastSection(index))}>
        <div>
          <span>Last seen playing: </span>
          <a href={this.state.lastGameUrl} target="_blank" rel="noopener noreferrer" style={Styles.lastGameTitleStyle()}>
            {this.state.title}
          </a>
        </div>
        {/* Rich Presence Message is optional within the Last Game Playing */}
        {this.state.showRichPresenceMessage && <div style={Styles.richPresenceContainerStyle()}>{this.state.richPresenceMessage}</div>}
      </Stack>
    );
  };

  /**
   * Renders the list of recent achievements or displays a message if none have been earned recently
   */
  private _renderRecentAchievements = (index: number): React.ReactNode => {
    return (
      <div key={`${index}: ${Sections.recentAchievements}`} style={Styles.recentAchievementsContainerStyle(this._isLastSection(index))}>
        {this.state.recentAchievements.length > 0 && (
          <Stack>
            Recent achievement(s):
            {this.state.recentAchievements.map((item: IAchievement, index: number) => {
              const points = item.points > 1 ? `${item.points} points` : `${item.points} point`;
              return (
                <a
                  key={index}
                  href={RA_URL + "/achievement/" + item.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={Styles.achievementLinkStyle()}
                >
                  <div style={Styles.achievementContainerStyle()}>
                    <Stack horizontal>
                      <img
                        src={item.badgeUrl}
                        alt={item.title + " achievement"}
                        style={Styles.achievementBadgeStyle(item.hardcoreAchieved)}
                      />

                      <Stack>
                        <div style={Styles.achievementTitleStyle()}>{item.title}</div>
                        <div>{points}</div>
                      </Stack>
                    </Stack>
                  </div>
                </a>
              );
            })}
          </Stack>
        )}
        {this.state.recentAchievements.length === 0 && <Stack>No achievements earned recently...</Stack>}
      </div>
    );
  };

  /**
   * Renders the list of achievement sets that this user has fully mastered and/or completed
   */
  private _renderMasteredSets = (index: number): React.ReactNode => {
    return (
      <div key={`${index}: ${Sections.masteredSets}`} style={Styles.masteredSetsContainerStyle(this._isLastSection(index))}>
        {this.state.masteredSets.length > 0 && (
          <Stack>
            Mastered sets:
            {this.state.masteredSets.map((set: ICompletedGame, index: number) => {
              const achievements = set.maxPossible > 1 ? `${set.maxPossible} achievements` : `${set.maxPossible} achievement`;
              return (
                <a
                  key={index}
                  href={`${RA_URL}/game/${set.gameId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={Styles.achievementLinkStyle()}
                >
                  <div style={Styles.achievementContainerStyle()}>
                    <Stack horizontal>
                      <img src={set.imageIcon} alt={set.gameTitle} style={Styles.achievementBadgeStyle(set.hardcoreMode)} />
                      <Stack>
                        <div style={Styles.achievementTitleStyle()}>{set.gameTitle}</div>
                        <div>{achievements}</div>
                      </Stack>
                    </Stack>
                  </div>
                </a>
              );
            })}
          </Stack>
        )}
        {this.state.masteredSets.length === 0 && <Stack>No mastered sets... yet!</Stack>}
      </div>
    );
  };

  /**
   * Render sections based on the order defined by the configuration
   */
  private _renderPanelSections = (): React.ReactNode[] => {
    return this.props.sectionOrder.map((section: Sections, index: number) => {
      switch (section) {
        case Sections.userProfile:
          return this._renderUserProfileInfo(index);
        case Sections.lastGame:
          return this._renderLastGamePlaying(index);
        case Sections.recentAchievements:
          return this._renderRecentAchievements(index);
        case Sections.masteredSets:
          return this._renderMasteredSets(index);
        default:
          return <div key={"unknown"}>BUG: An invalid section</div>;
      }
    });
  };

  private _getUserSummary = () => {
    // Get data from the number of games equivalent to number achievements user wants to show
    // If each game only has one recent achievement, then we are still getting the right number of achievements to show.

    // As a fallback, in case the setting is somehow set to 0, we will fetch DEFAULT_ACHIEVEMENT_COUNT by default to avoid an error.
    const count = this.props.numAchievementsToShow === 0 ? DEFAULT_ACHIEVEMENT_COUNT : this.props.numAchievementsToShow;

    this._ra.getSummary(count).then((response: IUserSummary) => {
      if (response.hasErrorResponse) {
        return this.setState({ failstate: true, errorMessage: response.errorMessage });
      }

      // Process the achievements before saving in the state
      const achievements: IAchievement[] = [];
      if (response.recentAchievements) {
        Object.keys(response.recentAchievements).forEach((gameId: string) => {
          Object.keys(response.recentAchievements[gameId]).forEach((id: string) => {
            achievements.push(response.recentAchievements[gameId][id]);
          });
        });
        // Achievements from the API call are not in a particular order. Sort them by the date field, placing the newest at the top.
        achievements.sort((a: IAchievement, b: IAchievement) => (DayJs(a.dateAwarded).isBefore(DayJs(b.dateAwarded)) ? 1 : -1));

        // Put in order from newest to oldest
        // achievements.reverse();
      }

      this.setState({
        title: response.recentlyPlayed[0].title,
        lastGameUrl: `${RA_URL}/Game/${response.lastGameId}`,
        userPicUrl: response.userPicUrl,
        username: response.username,
        rank: response.rank,
        points: response.totalPoints,
        retroPoints: response.totalTruePoints,
        recentAchievements: achievements,
        richPresenceMessage: response.richPresenceMsg,
      });
      this._endInitialLoad();
    });

    // Set the interval to call this again in one minute!
    setTimeout(this._getUserSummary, 60000);
  };

  /**
   * Retrieves the list of games this user has mastered AND completed. This logic then returns the sets that are mastered but will only
   * return any completed (non-hardcore) sets if that option is set in the extension config options, and ONLY if there isn't a mastered
   * set already associated with the game.
   */
  private _getMasteredGamesList = () => {
    this._ra.getUserCompletedGames().then((response: ICompletedGame[]) => {
      if (response[0].hasErrorResponse) {
        return this.setState({ failstate: true, errorMessage: response[0].errorMessage });
      }

      // Process the sets before saving in the state
      let sets: ICompletedGame[] = [];
      if (!this.props.showCompletedWithMastered) {
        // Remove all entries with hardcore mode off
        sets = response.filter((set: ICompletedGame) => set.hardcoreMode === true);
        // Sort by gameId for now
        sets.sort((a: ICompletedGame, b: ICompletedGame) => a.gameId - b.gameId);
      } else {
        // Keep hardcore mode off entries that don't have a matching set with hardcore mode on
        // Create a set that will be keyed off the gameId
        interface IKeyedCompletedGame {
          [id: number]: ICompletedGame;
        }
        const uniqueSets = {} as IKeyedCompletedGame;
        response.forEach((game: ICompletedGame) => {
          // If it doesn't exist in the unique collection, add it
          if (uniqueSets[game.gameId] === undefined) {
            uniqueSets[game.gameId] = game;
          } else {
            // It does exist. Make sure it is the hardcore version.
            if (!uniqueSets[game.gameId].hardcoreMode) {
              // Replace it
              uniqueSets[game.gameId] = game;
            }
          }
        });
        // Now put it all into the sets array
        sets = Object.values(uniqueSets).map<ICompletedGame>((set: ICompletedGame) => set);
      }

      this.setState({ masteredSets: sets });
      this._endInitialLoad();
    });
  };

  /**
   * Perform the initial fetching of data from the RetroAchievements APIs.
   * Once all fetches are complete, update the initial loading state to show the rendered page.
   */
  private _performInitialFetch = () => {
    this._getUserSummary();
    this._getMasteredGamesList();
  };

  /**
   * Is this section being rendered the first section of the sectionOrder array?
   * @param index Index of the sectionOrder array
   */
  private _isFirstSection = (index: number): boolean => {
    return index === 0;
  };

  /**
   * Is this section being rendered the last section of the sectionOrder array?
   * @param index Index of the sectionOrder array
   */
  private _isLastSection = (index: number): boolean => {
    return index === this.props.sectionOrder.length - 1;
  };

  private _endInitialLoad = () => {
    if (this.state.apisToCall > 0) {
      this.setState({ apisToCall: this.state.apisToCall - 1 });
    }
  };
}
