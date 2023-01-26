import { AMINO_ACID_FULL_NAME } from "../constants/Protein";

export const getKeyValue = (key: string) => (obj: Record<string, any>) => obj[key];

export const fullAminoAcidName = (key: string | undefined | null) => {
  if (!key)
    return ""
  return AMINO_ACID_FULL_NAME.get(key.toLowerCase())
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