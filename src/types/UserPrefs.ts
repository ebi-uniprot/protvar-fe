import { ResultColumnsPref } from '../constants/resultColumns'

export type Theme = 'light' | 'dark'
export type FontSize = 'sm' | 'md' | 'lg'

export interface UserPrefs {
  sidebarExpanded: boolean
  activityRetentionDismissed: boolean
  theme: Theme
  fontSize: FontSize
  resultColumns?: ResultColumnsPref   // undefined = default columns
  filterRailCollapsed?: boolean       // result page filter rail hidden (wide screens)
  // future: defaultAssembly, defaultPageSize, etc.
}

export const DEFAULT_PREFS: UserPrefs = {
  // first visit: sidebar (and the result page's filter rail) open, so new users see both; their own
  // collapse/expand choice is remembered from then on
  sidebarExpanded: true,
  activityRetentionDismissed: false,
  // Default to light explicitly so the app never auto-follows the OS/browser
  // dark setting (the cause of the Firefox Nightly / mobile dark-mode bug).
  theme: 'light',
  fontSize: 'md',
}
