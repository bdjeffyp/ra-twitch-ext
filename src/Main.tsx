import * as React from "react";
import { IApiProps, IUserSummaryResponse, RetroAchievementsApi } from "./ra-api";

export class Main extends React.Component<{}, { title: string }> {
  private _ra: RetroAchievementsApi;
  // TODO: Remove hardcoded strings after testing. Eventually get from config page.
  private _username = "bdjeffyp";
  private _apiKey = "K1uVrVm3YbsHYPYZwG17mYFzgS9cf4nQ";

  constructor(props: any) {
    super(props);

    // Initialize RA API
    const apiProps: IApiProps = {
      username: this._username,
      apiKey: this._apiKey,
    };
    this._ra = new RetroAchievementsApi(apiProps);
    this.state = {
      title: "",
    };
  }

  public componentDidMount() {
    this._userSummary();
  }

  public render() {
    return <div>{this.state.title}</div>;
  }

  private _userSummary = () => {
    this._ra.getSummary(1).then((response: IUserSummaryResponse) => {
      this.setState({ title: response.RecentlyPlayed[0].Title });
    });
  };
}
