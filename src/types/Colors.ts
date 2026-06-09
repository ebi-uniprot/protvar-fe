export const BLACK = {r:0, g:0, b:0}
export const BLUE = {r:0, g:0 , b: 255}
export const GREEN = {r:0, g:255 , b: 0}
export const CYAN = {r:0, g:255, b:255}
export const RED = {r:255, g:0 , b: 0}
export const MAGENTA = {r:255, g:0, b:255}
export const YELLOW = {r: 255, g: 255, b: 0}
export const WHITE = {r:255, g:255, b:255}

// Mol* 3D viewer background. Navy in dark theme (matches --color-bg-primary
// dark = #0e2438), white otherwise. Read from <html data-theme> at call time.
export const VIEWER_DARK_BG = {r:14, g:36, b:56}
export const viewerBgColor = () =>
  (typeof document !== 'undefined' &&
   document.documentElement.getAttribute('data-theme') === 'dark')
    ? VIEWER_DARK_BG : WHITE