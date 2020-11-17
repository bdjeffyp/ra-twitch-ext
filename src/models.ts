////// Enums //////
export enum Fields {
  username = "username",
  apiKey = "apiKey",
  numAchievementsToShow = "numAchievementsToShow",
}

////// Interfaces //////
export interface IAppConfig {
  username: string;
  apiKey: string;
  numAchievementsToShow: number;
  showUserProfile: boolean;
  showLastGamePlaying: boolean;
  showRichPresenceMessage: boolean;
  showRecentAchievementList: boolean;
}

////// Constants //////
// TODO: Determine actual max value. 30 seems good so far...
export const MAX_ACHIEVEMENTS_TO_SHOW = 30;

// Default number of achievements to display
export const DEFAULT_ACHIEVEMENT_COUNT = 5;

export const DEFAULT_CONFIG: IAppConfig = {
  username: "",
  apiKey: "",
  numAchievementsToShow: DEFAULT_ACHIEVEMENT_COUNT,
  showUserProfile: true,
  showLastGamePlaying: true,
  showRichPresenceMessage: true,
  showRecentAchievementList: true,
};

// Extension Configuration Service key must match what is on Twitch Dev Console
export const EXT_CONFIG_KEY = "0.1.0";
