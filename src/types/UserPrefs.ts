export interface UserPrefs {
  sidebarExpanded: boolean
  // future: defaultAssembly, defaultPageSize, colorScheme, etc.
}

export const DEFAULT_PREFS: UserPrefs = {
  sidebarExpanded: false,
}
