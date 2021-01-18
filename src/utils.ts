import { ConfigCheckboxes, DEFAULT_CONFIG, IAppConfig, ISections } from "./models";

/**
 * Checks each option to ensure that it exists. If it doesn't, a default value is provided.
 * This is needed because if a user updates the extension and there are new config options, runtime errors may occur.
 * @param config Instance of the app configuration to validate
 */
export const validateConfigOptions = (config: IAppConfig): IAppConfig => {
  config.apiKey = config.apiKey ? config.apiKey : DEFAULT_CONFIG.apiKey;
  config.numAchievementsToShow = config.numAchievementsToShow ? config.numAchievementsToShow : DEFAULT_CONFIG.numAchievementsToShow;
  config.showCompletedWithMastered = config.showCompletedWithMastered
    ? config.showCompletedWithMastered
    : DEFAULT_CONFIG.showCompletedWithMastered;
  config.username = config.username ? config.username : DEFAULT_CONFIG.username;
  config.sections = config.sections ? config.sections : DEFAULT_CONFIG.sections;
  return config;
};

/**
 * Returns the state of the section setting provided or undefined if not found.
 * @param id The `ConfigCheckbox` setting to retrieve
 * @param sectionOrder `ISections` array from the state or component props
 */
export const getSectionSetting = (id: ConfigCheckboxes, sectionOrder: ISections[]): boolean | undefined => {
  return sectionOrder.find((section: ISections) => section.text === id)?.checked;
};

/**
 * Returns the index for the setting in the `sectionOrder` array
 * @param id The `ConfigCheckbox` setting to retrieve
 * @param sectionOrder `ISections` array from the state or component props
 */
export const getSectionIndex = (id: ConfigCheckboxes, sectionOrder: ISections[]): number => {
  return sectionOrder.findIndex((section: ISections) => section.text === id);
};
