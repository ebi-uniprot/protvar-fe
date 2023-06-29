import { AMINO_ACID_FULL_NAME } from "../constants/Protein";

export const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key];

export const fullAminoAcidName = (key: string | undefined | null) => {
  if (!key)
    return ""
  if (key==="*")
    key = "ter"
  if (key.toLowerCase() in AMINO_ACID_FULL_NAME) {
    return getKeyValue(key.toLowerCase())(AMINO_ACID_FULL_NAME).name
  }
  return ""
}

export const aminoAcid1to3Letter = (oneLetter: string): string|null => {
  Object.entries(AMINO_ACID_FULL_NAME).forEach(([key, value], index) => {
    if (value.oneLetter === oneLetter.toLowerCase())
      return key;
  });
  return null;
}

export const aminoAcid3to1Letter = (threeLetter: string): string|null => {
  let v = null;
  Object.entries(AMINO_ACID_FULL_NAME).forEach(([key, value], index) => {
    if (key === threeLetter.toLowerCase())
      v = value.oneLetter;
  });
  return v;
}

export function formatRange(xs: number[]) {
  if (xs.length === 0)
    return ''
  if (xs.length === 1)
    return xs[0].toString()
  xs.sort(function (a, b) {
    return a - b
  });
  let start = null;
  let end = null;
  let str = ''

  for (let i = 0; i < xs.length; i++) {
    var num = xs[i];
    //initialize
    if (start == null || end == null) {
      start = num;
      end = num;
    }
    //next number in range
    else if (end === num - 1) {
      end = num;
    }
    //there's a gap
    else {
      //range length 1
      if (start === end) {
        str += start + ",";
      }
      //range length 2
      else if (start === end - 1) {
        str += start + "," + end + ",";
      }
      //range lenth 2+
      else {
        str += start + "-" + end + ",";
      }
      start = num;
      end = num;
    }
  }
  if (start !== null && end !== null) {
    if (start === end) {
      str += start;
    } else if (start === end - 1) {
      str += start + "," + end;
    } else {
      str += start + "-" + end;
    }
  }
  if (str.endsWith(",")) {
    str = str.substring(0, str.length - 1)
  }
  return str
}