import { Stack } from "@fluentui/react";
import * as React from "react";
import { IAppConfig } from "./App";
import * as Styles from "./Main.style";
import { IAchievement, IApiProps, IUserSummary, RA_URL, RetroAchievementsApi } from "./ra-api";

interface IMainState {
  failstate: boolean;
  errorMessage: string;
  title: string;
  userPicUrl: string;
  username: string;
  rank: string;
  points: string;
  retroPoints: string;
  recentAchievements: IAchievement[];
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
      userPicUrl: "",
      username: "",
      rank: "",
      points: "",
      retroPoints: "",
      recentAchievements: [],
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
        const onesDigit = this.state.rank.charAt(this.state.rank.length);
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
        {this.state.failstate && <div>{this.state.errorMessage + " - Refresh the page"}</div>}
        {!this.state.failstate && (
          <>
            <Stack style={Styles.profileContainerStyle()}>
              <Stack horizontal>
                <img src={this.state.userPicUrl} alt="Streamer's Retro Achievements profile" style={Styles.profileImageStyle()} />

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
                Recent achievement(s):
                {this.state.recentAchievements.map((item: IAchievement, index: number) => {
                  return (
                    <div key={index} style={Styles.achievementContainerStyle()}>
                      <Stack horizontal>
                        <img
                          src={item.badgeUrl}
                          alt={item.title + " achievement"}
                          style={Styles.achievementBadgeStyle(item.hardcoreAchieved)}
                        />

                        <Stack>
                          <div style={Styles.achievementTitleStyle()}>{item.title}</div>
                        </Stack>
                      </Stack>
                    </div>
                  );
                })}
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
    this._ra.getSummary(this.props.numAchievementsToShow).then((response: IUserSummary) => {
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
        // Put in order from newest to oldest
        achievements.reverse();
      }

      this.setState({
        title: response.recentlyPlayed[0].title,
        userPicUrl: response.userPicUrl,
        username: response.username,
        rank: response.rank,
        points: response.totalPoints,
        retroPoints: response.totalTruePoints,
        recentAchievements: achievements,
      });
    });
  };
}
