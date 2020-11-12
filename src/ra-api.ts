import { AxiosError, AxiosResponse } from "axios";
import { Api } from "./api";

export const RA_URL = "https://retroachievements.org";
const INVALID_KEY_ERROR = "Invalid API Key";

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

export interface IRecentlyPlayed {
  /** Identifier for the console this game belongs to */
  consoleId: string;
  /** Human-readable name of the console associated with the ID */
  consoleName: string;
  /** Identifier for the game this data is related to */
  gameId: string;
  /** Human-readable name of the game associated with this ID */
  title: string;
  /** URL that holds the game's RetroAchievements icon */
  imageIcon: string;
  /**
   * Date/time the game was last played
   *
   * TODO: I believe this is UTC, but need to confirm...
   */
  lastPlayed: string;
  /**
   * Unknown...
   *
   * TODO: I believe this is associated with set request voting.
   * Once confirmed, update the type. Currently I see "null" returned in API response.
   */
  myVote: any;
}

export interface IAchievement {
  /**
   * Date that the achievement was awarded to the user.
   *
   * TODO: I believe that this is in UTC.
   */
  dateAwarded: string;
  /** Long description that hints at how the achievement is earned. */
  description: string;
  /** Identifier that ties the achievement to a specific game. */
  gameId: string;
  /** Title of the game this achievement is tied to. */
  gameTitle: string;
  /**
   * Was this achieved in HARDCORE mode?
   *
   * TODO: My most recent achievements were earned in HARDCORE, but the value is `"0"`.
   * Does `"0"` mean `true`? That seems counter-intuitive...
   */
  hardcoreAchieved: boolean;
  /** Identifier for this achievement */
  id: string;
  /**
   * Did this user earn this achievement?
   *
   * TODO: This one is `"1"` for `true`... Don't know why it'd be different from hardcoreAchieved.
   */
  isAwarded: boolean;
  /** Point value for this achievement */
  points: number;
  /** Short title of the achievement */
  title: string;
  /** Achievement badge URL */
  badgeUrl: string;
}

/**
 * Collection of achievements for the associated game, where `id` = `IAchievement.id`
 */
export interface IGameAchievements {
  [id: string]: IAchievement;
}

/**
 * Collection of achievements a user recently earned, grouped by `gameId`
 */
export interface IRecentAchievements {
  [key: string]: IGameAchievements;
}

export interface IUserSummary {
  hasErrorResponse: boolean;
  errorMessage: string;
  /** User's overall rank on Retro Achievements */
  rank: string;
  /** Total points the user has earned for their achievements */
  totalPoints: string;
  /** Total RetroRatio points the user has earned in comparison to others */
  totalTruePoints: string;
  /** Data about what the player is last actively doing in-game */
  richPresenceMsg: string;
  /** User's online status */
  status: string;
  /** Data about the user's recent games played */
  recentlyPlayed: IRecentlyPlayed[];
  /** Number of games user recently played. Also `recentlyPlayed.length`. */
  recentlyPlayedCount: number;
  /** URL that holds the user's avatar picture */
  userPicUrl: string;
  /** Name of the user in Retro Achievements */
  username: string;
  /** ID of the last game played */
  lastGameId: number;
  /** Recent achievements this user has earned, by game, in order from oldest to newest */
  recentAchievements: IRecentAchievements;
}

export interface IAchievementResponseData {
  BadgeName: string;
  DateAwarded: string;
  Description: string;
  GameID: string;
  GameTitle: string;
  HardcoreAchieved: string;
  ID: string;
  IsAwarded: string;
  Points: string;
  Title: string;
}

export interface IGameAchievementsResponseData {
  [id: string]: IAchievementResponseData;
}

export interface IGetUserSummaryRecentAchievementsResponseData {
  [key: string]: IGameAchievementsResponseData;
}

export interface IGetUserSummaryRecentlyPlayedResponseData {
  ConsoleID: string;
  ConsoleName: string;
  GameID: string;
  ImageIcon: string;
  LastPlayed: string;
  MyVote: any;
  Title: string;
}

export interface ILastActivityResponseData {
  User: string;
}

export interface IGetUserSummaryResponseData {
  Rank: string;
  TotalPoints: string;
  TotalTruePoints: string;
  RichPresenceMsg: string;
  Status: string;
  RecentlyPlayed: IGetUserSummaryRecentlyPlayedResponseData[];
  RecentlyPlayedCount: number;
  UserPic: string;
  RecentAchievements: IGetUserSummaryRecentAchievementsResponseData;
  Motto: string;
  MemberSince: string;
  LastGameID: string;
  LastActivity: ILastActivityResponseData;
}

export interface IApiProps {
  username: string;
  apiKey: string;
}

export class RetroAchievementsApi extends Api {
  private readonly _rootApiUrl = "https://retroachievements.org/API";
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

  /**
   * This might be a dead API. The call failed.
   * @param count
   * @param offset
   */
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

  public getSummary = async (count: number): Promise<IUserSummary> => {
    // g = number of games to look at
    // a = number of achievements per game
    // Must have a non-zero value at g to get valid data!
    const params = `u=${this._username}&g=${count}&a=${count}`;
    return await this.get<IGetUserSummaryResponseData>(this._raUrl(ApiTargets.userSummary, params))
      .then((response: AxiosResponse<IGetUserSummaryResponseData>) => {
        // TODO: THIS NEEDS BETTER ERROR HANDLING AND TESTING FOR THE PRESENCE OF FIELDS!!!!!!!!!!
        const data = response.data;
        // Validate the response for the invalid apiKey error
        if ((response.data as unknown) === INVALID_KEY_ERROR) {
          throw new Error(INVALID_KEY_ERROR);
        }
        // Format the data and return it
        const result: IUserSummary = {
          hasErrorResponse: false,
          errorMessage: "",
          rank: data.Rank,
          totalPoints: data.TotalPoints,
          totalTruePoints: data.TotalTruePoints,
          status: data.Status,
          recentlyPlayed: [],
          recentlyPlayedCount: data.RecentlyPlayedCount,
          richPresenceMsg: data.RichPresenceMsg,
          userPicUrl: RA_URL + data.UserPic,
          username: data.LastActivity.User,
          lastGameId: parseInt(data.LastGameID),
          recentAchievements: {},
        };
        data.RecentlyPlayed.forEach((item: IGetUserSummaryRecentlyPlayedResponseData) => {
          result.recentlyPlayed.push({
            consoleId: item.ConsoleID,
            consoleName: item.ConsoleName,
            gameId: item.GameID,
            title: item.Title,
            imageIcon: item.ImageIcon,
            lastPlayed: item.LastPlayed,
            myVote: item.MyVote,
          });
        });
        Object.keys(data.RecentAchievements).forEach((gameId: string) => {
          result.recentAchievements[gameId] = {} as IGameAchievements;
          Object.keys(data.RecentAchievements[gameId]).forEach((id: string) => {
            const raw = data.RecentAchievements[gameId][id];
            const formatted = {} as IAchievement;
            formatted.dateAwarded = raw.DateAwarded;
            formatted.description = raw.Description;
            formatted.gameId = raw.GameID;
            formatted.gameTitle = raw.GameTitle;
            formatted.hardcoreAchieved = raw.HardcoreAchieved === "0" ? true : false;
            formatted.id = raw.ID;
            formatted.isAwarded = raw.IsAwarded === "1" ? true : false;
            formatted.points = parseInt(raw.Points);
            formatted.title = raw.Title;
            formatted.badgeUrl = `${RA_URL}/Badge/${raw.BadgeName}.png`;
            result.recentAchievements[gameId][id] = formatted;
          });
        });
        return result;
      })
      .catch((error: AxiosError) => {
        return { hasErrorResponse: true, errorMessage: error.message } as IUserSummary;
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
    return `${this._rootApiUrl}/API_Get${target}.php${this._authQueryString()}${appendedParams}`;
  };
}
