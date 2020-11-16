import { Spinner, SpinnerSize, Stack } from "@fluentui/react";
import DayJs from "dayjs";
import * as React from "react";
import { IAppConfig } from "./App";
import * as Styles from "./Main.style";
import { IAchievement, IApiProps, IUserSummary, RA_URL, RetroAchievementsApi } from "./ra-api";

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
  richPresenceMessage: string;
  initialLoading: boolean;
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
      richPresenceMessage: "",
      initialLoading: true,
    };
  }

  public componentDidMount() {
    this._userSummary();
  }

  public render() {
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
      <div style={Styles.mainContainerStyle()}>
        {this.state.initialLoading && !this.state.failstate && (
          <Spinner size={SpinnerSize.large} label="Loading" style={Styles.loadingSpinnerStyle()}></Spinner>
        )}
        {!this.state.initialLoading && this.state.failstate && <div>{this.state.errorMessage + " - Refresh the page"}</div>}
        {!this.state.initialLoading && !this.state.failstate && (
          <>
            <Stack style={Styles.profileContainerStyle()}>
              <Stack horizontal>
                <img src={this.state.userPicUrl} alt="Streamer's Retro Achievements profile photo" style={Styles.profileImageStyle()} />

                <Stack>
                  <div>
                    <a
                      href={RA_URL + "/user/" + this.state.username}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={Styles.profileNameStyle()}
                    >
                      {this.state.username}
                    </a>
                    <span>{rankText}</span>
                  </div>
                  <div>{this.state.points} points</div>
                  <div style={Styles.retroRatioPointsStyle()}>{this.state.retroPoints} Retro Ratio points</div>
                </Stack>
              </Stack>
            </Stack>

            {this.state.recentAchievements.length > 0 && (
              <Stack>
                {/* Rich Presence Message */}
                <div>
                  <div>
                    <span>Last seen playing: </span>
                    <a href={this.state.lastGameUrl} target="_blank" rel="noopener noreferrer" style={Styles.lastGameTitleStyle()}>
                      {this.state.title}
                    </a>
                  </div>
                  <div style={Styles.richPresenceContainerStyle()}>{this.state.richPresenceMessage}</div>
                </div>
                {/* Recent achievements */}
                <div>
                  Recent achievement(s):
                  {this.state.recentAchievements.map((item: IAchievement, index: number) => {
                    const points = item.points > 1 ? `${item.points} points` : `${item.points} point`;
                    return (
                      <a
                        key={index}
                        href={RA_URL + "/Achievement/" + item.id}
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
                </div>
              </Stack>
            )}
            {this.state.recentAchievements.length === 0 && <Stack>No achievements earned recently...</Stack>}
          </>
        )}
      </div>
    );
  }

  private _userSummary = () => {
    // Get data from the number of games equivalent to number achievements user wants to show
    // If each game only has one recent achievement, then we are still getting the right number of achievements to show.

    // TODO: Since I disabled the recent achievements count, I need to ensure that the default of five is shown.
    const count = this.props.numAchievementsToShow === 0 ? 5 : this.props.numAchievementsToShow;

    // Making other calls to see what the data responses are
    // this._ra.getConsoleIds();
    // this._ra.getExtendedGameInfo("504");
    // this._ra.getFeed(5, 0); // failed... doesn't seem to be supported any more
    // this._ra.getGameInfo("504");
    // this._ra.getGamesList("4");
    // this._ra.getProgress("504");
    // this._ra.getRankAndScore();
    // this._ra.getRecentGames(5, 0);
    // this._ra.getTopTenUsers();
    // this._ra.getUserGameProgress("504");

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
        initialLoading: false,
      });
    });

    // Set the interval to call this again in one minute!
    setTimeout(this._userSummary, 60000);
  };
}
