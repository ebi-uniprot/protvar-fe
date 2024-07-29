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

export const groupBy = (arr: Array<any>, k: string) => {
  return arr.reduce((group: { [key: string]: any[] }, item) => {
    if (!group[item[k]]) {
      group[item[k]] = [];
    }
    group[item[k]].push(item);
    return group;
  }, {})
}

export const humanFileSize = (size?: number) => {
  if (!size)
    return ''
  var i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return +((size / Math.pow(1024, i)).toFixed(2)) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

// result default TTL 30 days
export const secondsToString = (seconds: number) => {
  // TIP: to find current time in milliseconds, use:
  // var  current_time_milliseconds = new Date().getTime();

  function numberEnding (n: number) {
    return (n > 1) ? 's' : '';
  }

  var temp = Math.floor(seconds);
  var years = Math.floor(temp / 31536000);
  if (years) {
    return years + ' year' + numberEnding(years);
  }
  //TODO: Months! Maybe weeks?
  var days = Math.floor((temp %= 31536000) / 86400);
  if (days) {
    return days + ' day' + numberEnding(days);
  }
  var hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    return hours + ' hour' + numberEnding(hours);
  }
  var minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    return minutes + ' minute' + numberEnding(minutes);
  }
  var seconds = temp % 60;
  if (seconds) {
    return seconds + ' second' + numberEnding(seconds);
  }
  return 'less than a second'; //'just now' //or other string you like;
}