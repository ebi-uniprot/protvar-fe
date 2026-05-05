export interface UserPrefs {
  sidebarExpanded: boolean
  activityRetentionDismissed: boolean
  // future: defaultAssembly, defaultPageSize, colorScheme, etc.
}

export const DEFAULT_PREFS: UserPrefs = {
  sidebarExpanded: false,
  activityRetentionDismissed: false,
}
