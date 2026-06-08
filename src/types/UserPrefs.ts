export type Theme = 'light' | 'dark'
export type FontSize = 'sm' | 'md' | 'lg'

export interface UserPrefs {
  sidebarExpanded: boolean
  activityRetentionDismissed: boolean
  theme: Theme
  fontSize: FontSize
  // future: defaultAssembly, defaultPageSize, etc.
}

export const DEFAULT_PREFS: UserPrefs = {
  sidebarExpanded: false,
  activityRetentionDismissed: false,
  // Default to light explicitly so the app never auto-follows the OS/browser
  // dark setting (the cause of the Firefox Nightly / mobile dark-mode bug).
  theme: 'light',
  fontSize: 'md',
}
