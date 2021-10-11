export const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key];
export const tip = (val: string | undefined) => {
  if (!val)
    return {}
  return {
    "data-balloon-pos": "up",
    "aria-label": val,
    //no animation - instant show
    "data-balloon-blunt": "",
    //remove tooltip after clicking on the button
    //https://github.com/kazzkiq/balloon.css/issues/135
    "data-balloon-nofocus": ""
  }
}