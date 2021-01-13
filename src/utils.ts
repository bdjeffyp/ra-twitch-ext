import { DEFAULT_CONFIG, IAppConfig } from "./models";

/**
 * Checks each option to ensure that it exists. If it doesn't, a default value is provided.
 * This is needed because if a user updates the extension and there are new config options, runtime errors may occur.
 * @param config Instance of the app configuration to validate
 */
export const validateConfigOptions = (config: IAppConfig): IAppConfig => {
  config.apiKey = config.apiKey ? config.apiKey : DEFAULT_CONFIG.apiKey;
  config.numAchievementsToShow = config.numAchievementsToShow ? config.numAchievementsToShow : DEFAULT_CONFIG.numAchievementsToShow;
  config.sectionOrder = config.sectionOrder ? config.sectionOrder : DEFAULT_CONFIG.sectionOrder;
  config.showCompletedWithMastered = config.showCompletedWithMastered
    ? config.showCompletedWithMastered
    : DEFAULT_CONFIG.showCompletedWithMastered;
  config.showLastGamePlaying = config.showLastGamePlaying ? config.showLastGamePlaying : DEFAULT_CONFIG.showLastGamePlaying;
  config.showRecentAchievementList = config.showRecentAchievementList
    ? config.showRecentAchievementList
    : DEFAULT_CONFIG.showRecentAchievementList;
  config.showMasteredSetsList = config.showMasteredSetsList ? config.showMasteredSetsList : DEFAULT_CONFIG.showMasteredSetsList;
  config.showRichPresenceMessage = config.showRichPresenceMessage ? config.showRichPresenceMessage : DEFAULT_CONFIG.showRichPresenceMessage;
  config.showUserProfile = config.showUserProfile ? config.showUserProfile : DEFAULT_CONFIG.showUserProfile;
  config.username = config.username ? config.username : DEFAULT_CONFIG.username;

  return config;
};
