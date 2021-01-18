////// Enums //////
export enum Fields {
  username = "username",
  apiKey = "apiKey",
  numAchievementsToShow = "numAchievementsToShow",
  showCompletedWithMastered = "showCompletedWithMastered",
}

export enum ConfigCheckboxes {
  userProfile = "User profile",
  lastGamePlaying = "Last seen playing",
  richPresence = "Rich presence",
  recentAchievements = "Recent achievements list",
  masteredSets = "Recent mastered sets list",
}

////// Interfaces //////
/** Object that defines the section cards on the configuration page */
export interface ISections {
  /** Constant string for the drag and drop handler */
  type: string;
  /** Text displayed next the the option checkbox and unique ID */
  text: ConfigCheckboxes;
  /** State of the checkbox */
  checked: boolean;
  /** Optional child setting for this section */
  childText?: ConfigCheckboxes;
  /** Optional child checkbox state for the optional child setting */
  childChecked?: boolean;
}

export interface IAppConfig {
  username: string;
  apiKey: string;
  numAchievementsToShow: number;
  showCompletedWithMastered: boolean;
  sections: ISections[];
}

////// Constants //////
// TODO: Determine actual max value. 30 seems good so far...
export const MAX_ACHIEVEMENTS_TO_SHOW = 30;

/** Default number of recent achievements to display */
export const DEFAULT_ACHIEVEMENT_COUNT = 5;

/** Defaults for section states */
export const DEFAULT_SHOW_USER_PROFILE = true;
export const DEFAULT_SHOW_LAST_GAME = true;
export const DEFAULT_SHOW_RICH_PRESENCE = true;
export const DEFAULT_SHOW_RECENT_ACHIEVEMENTS = true;
export const DEFAULT_SHOW_MASTERED_SETS = true;
export const SECTION_CARD = "SectionCard";

/** The user profile section card */
export const userProfileSection: ISections = {
  text: ConfigCheckboxes.userProfile,
  checked: DEFAULT_SHOW_USER_PROFILE,
  type: SECTION_CARD,
};
/** The last game played section card */
export const lastGamePlayingSection: ISections = {
  text: ConfigCheckboxes.lastGamePlaying,
  checked: DEFAULT_SHOW_LAST_GAME,
  childText: ConfigCheckboxes.richPresence,
  childChecked: DEFAULT_SHOW_RICH_PRESENCE,
  type: SECTION_CARD,
};
/** The recent achievements section card */
export const recentAchievementsSection: ISections = {
  text: ConfigCheckboxes.recentAchievements,
  checked: DEFAULT_SHOW_RECENT_ACHIEVEMENTS,
  type: SECTION_CARD,
};
/** The mastered sets section card */
export const masteredSetsSection: ISections = {
  text: ConfigCheckboxes.masteredSets,
  checked: DEFAULT_SHOW_MASTERED_SETS,
  type: SECTION_CARD,
};

/** The default/fallback configuration for the app */
export const DEFAULT_CONFIG: IAppConfig = {
  username: "",
  apiKey: "",
  numAchievementsToShow: DEFAULT_ACHIEVEMENT_COUNT,
  showCompletedWithMastered: false,
  sections: [userProfileSection, lastGamePlayingSection, recentAchievementsSection, masteredSetsSection],
};

/** Extension Configuration Service key must match what is on Twitch Dev Console */
export const EXT_CONFIG_KEY = "1.3.0";
