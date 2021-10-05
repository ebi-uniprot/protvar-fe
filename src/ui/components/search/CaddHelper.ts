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
    return 'likely benign (15 is the median value for all possible canonical splice site changes and non-synonymous variants in CADD v1.0)';;
  } else if (CADD >= 15 && CADD < 20) {
    return 'potentially deleterious - <5% most deleterious substitutions that you can do to the human genome';
  } else if (CADD >= 20 && CADD < 25) {
    return 'quite likely deleterious - <1% most deleterious substitutions that you can do to the human genome';
  } else if (CADD >= 25 && CADD < 30) {
    return 'probably deleterious <0.5% most deleterious substitutions that you can do to the human genome30 highly likely deleterious';
  } else if (CADD >= 30) {
    return 'highly likely deleterious - <0.1% most deleterious substitutions that you can do to the human genome';
  }
}

export function getCaddCss(CADD: string | undefined) {
  if (CADD === undefined || CADD === '-') {
    return '';
  } else {
    return `label warning cadd-score cadd-score--${getColor(parseFloat(CADD))}`
  }
}