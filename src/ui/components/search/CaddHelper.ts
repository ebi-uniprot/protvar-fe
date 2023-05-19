export function getColor(CADD: number) {
  if (CADD < 15) {
    return 'DarkGreen';
  } else if (CADD >= 15 && CADD < 20) {
    return 'DarkSeaGreen';
  } else if (CADD >= 20 && CADD < 25) {
    return 'Gold';
  } else if (CADD >= 25 && CADD < 30) {
    return 'DarkOrange';
  } else if (CADD >= 30) {
    return 'FireBrick';
  }
}

export function getTitle(cadd: string | undefined) {
  const CADD = parseFloat(cadd!)
  if (CADD < 15) {
    return '< 15.0 - Likely benign';;
  } else if (CADD >= 15 && CADD < 20) {
    return '15.0 to 19.9 - Potentially deleterious';
  } else if (CADD >= 20 && CADD < 25) {
    return '20.0 to 24.9 - Quite likely deleterious';
  } else if (CADD >= 25 && CADD < 30) {
    return '25.0 to 29.9 - Probably deleterious';
  } else if (CADD >= 30) {
    return '> 29.9 - Highly likely deleterious';
  }
}

export function getCaddCss(CADD: string | undefined) {
  if (CADD === undefined || CADD === '-') {
    return '';
  } else {
    return `label warning cadd-score cadd-score--${getColor(parseFloat(CADD))}`
  }
}