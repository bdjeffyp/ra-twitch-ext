////// Enums //////
export enum Fields {
  username = "username",
  apiKey = "apiKey",
  numAchievementsToShow = "numAchievementsToShow",
}

////// Constants //////
// TODO: Determine actual max value. 30 seems good so far...
export const MAX_ACHIEVEMENTS_TO_SHOW = 30;

// Default number of achievements to display
export const DEFAULT_ACHIEVEMENT_COUNT = 5;

export const EMPTY_CONFIG: IAppConfig = {
  username: "",
  apiKey: "",
  numAchievementsToShow: DEFAULT_ACHIEVEMENT_COUNT,
};

// Extension Configuration Service key must match what is on Twitch Dev Console
export const EXT_CONFIG_KEY = "0.1.0";

////// Interfaces //////
export interface IAppState {
  finishedLoading: boolean;
  username: string;
  apiKey: string;
  numAchievementsToShow: number;
}

export interface IAppConfig {
  username: string;
  apiKey: string;
  numAchievementsToShow: number;
}