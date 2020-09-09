import { AxiosError, AxiosResponse } from "axios";
import { Api } from "./api";

export interface IApiProps {
  username: string;
  apiKey: string;
}

export enum ApiTargets {
  topTenUsers = "TopTenUsers",
  gameInfo = "Game",
  gameInfoExtended = "GameExtended",
  consoleIds = "ConsoleIDs",
  gameList = "GameList",
  feed = "Feed",
  userRank = "UserRankAndScore",
  userProgress = "UserProgress",
  userRecentGames = "UserRecentlyPlayedGames",
  userSummary = "UserSummary",
  gameInfoAndProgress = "GameInfoAndUserProgress",
  achieveOnDay = "AchievementsEarnedOnDay",
  achieveBetweenDays = "AchievementsEarnedBetween",
}

export interface IRecentlyPlayedData {
  Title: string;
}

export interface IUserSummaryResponse {
  Rank: string;
  TotalPoints: string;
  TotalTruePoints: string;
  RecentlyPlayedCount: number;
  RichPresenceMsg: string;
  Status: string;
  RecentlyPlayed: IRecentlyPlayedData[];
}

export class RetroAchievementsApi extends Api {
  private readonly _rootUrl = "https://retroachievements.org/API";
  private _username: string;
  private _apiKey: string;
  private _fetchOptions: RequestInit = { method: "GET" };

  constructor(props: IApiProps) {
    super();
    this._username = props.username;
    this._apiKey = props.apiKey;
  }

  public getTopTenUsers = async () => {
    return await fetch(this._raUrl(ApiTargets.topTenUsers), this._fetchOptions);
  };

  public getGameInfo = async (gameId: string) => {
    const param = `i=${gameId}`;
    return await fetch(this._raUrl(ApiTargets.gameInfo, param), this._fetchOptions);
  };

  public getExtendedGameInfo = async (gameId: string) => {
    const param = `i=${gameId}`;
    return await fetch(this._raUrl(ApiTargets.gameInfoExtended, param), this._fetchOptions);
  };

  public getConsoleIds = async () => {
    return await fetch(this._raUrl(ApiTargets.consoleIds), this._fetchOptions);
  };

  public getGamesList = async (consoleId: string) => {
    const param = `i=${consoleId}`;
    return await fetch(this._raUrl(ApiTargets.gameList, param), this._fetchOptions);
  };

  public getFeed = async (count: number, offset: number) => {
    const params = `u=${this._username}&c=${count.toString()}&o=${offset.toString()}`;
    return await fetch(this._raUrl(ApiTargets.feed, params), this._fetchOptions);
  };

  public getRankAndScore = async () => {
    const param = `u=${this._username}`;
    return await fetch(this._raUrl(ApiTargets.userRank, param), this._fetchOptions);
  };

  /**
   * Get the completion progress of one or more games.
   * @param gameIds List of game IDs as comma separated values (e.g. "1, 2, 35, 666"). Can include whitespace or not.
   */
  public getProgress = async (gameIds: string) => {
    // Remove whitespace
    const cleanGameIds = gameIds.replace(/\s+/, "");
    const params = `u=${this._username}&i=${cleanGameIds}`;
    return await fetch(this._raUrl(ApiTargets.userProgress, params), this._fetchOptions);
  };

  public getRecentGames = async (count: number, offset: number) => {
    const params = `u=${this._username}&c=${count.toString()}&o=${offset.toString()}`;
    return await fetch(this._raUrl(ApiTargets.userRecentGames, params), this._fetchOptions);
  };

  public getSummary = async (count: number): Promise<IUserSummaryResponse> => {
    // TODO: What is the "a" param??
    const params = `u=${this._username}&g=${count.toString()}&a=5`;
    return await this.get<IUserSummaryResponse>(this._raUrl(ApiTargets.userSummary, params))
      .then((response: AxiosResponse<IUserSummaryResponse>) => {
        const data = response.data;
        const result: IUserSummaryResponse = {
          Rank: data.Rank,
          TotalPoints: data.TotalPoints,
          TotalTruePoints: data.TotalTruePoints,
          Status: data.Status,
          RecentlyPlayed: data.RecentlyPlayed,
          RecentlyPlayedCount: data.RecentlyPlayedCount,
          RichPresenceMsg: data.RichPresenceMsg,
        };
        return result;
      })
      .catch((error: AxiosError) => {
        throw error;
      });
  };

  public getUserGameProgress = async (gameId: string) => {
    const params = `u=${this._username}&g=${gameId}`;
    return await fetch(this._raUrl(ApiTargets.gameInfoAndProgress, params), this._fetchOptions);
  };

  private _authQueryString = (): string => {
    return `?z=${this._username}&y=${this._apiKey}`;
  };

  private _raUrl = (target: ApiTargets, params?: string): string => {
    const appendedParams = params ? `&${params}` : "";
    return `${this._rootUrl}/API_Get${target}.php${this._authQueryString()}${appendedParams}`;
  };
}
