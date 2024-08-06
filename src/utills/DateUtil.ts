/**
 * Source: https://www.builder.io/blog/relative-time
 * Convert a date to a relative time string, such as
 * "a minute ago", "in 2 hours", "yesterday", "3 months ago", etc.
 * using Intl.RelativeTimeFormat
 * Note: function not exported, use getRelativeTime instead which
 * safely convert a string into a JavaScript Date object before calling
 * getRelativeTimeString
 */
function getRelativeTimeString(
  date: Date | number,
  lang = navigator.language
): string {
  // Allow dates or times to be passed
  const timeMs = typeof date === "number" ? date : date.getTime();

  // Get the amount of seconds between the given date and now
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

  // Array reprsenting one minute, hour, day, week, month, etc in seconds
  const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];

  // Array equivalent to the above but in the string representation of the units
  const units: Intl.RelativeTimeFormatUnit[] = ["second", "minute", "hour", "day", "week", "month", "year"];

  // Grab the ideal cutoff unit
  const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds));

  // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
  // is one day in seconds, so we can divide our seconds by this to get the # of days
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

  // Intl.RelativeTimeFormat do its magic
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}

export const getRelativeTime = (date: string | Date | null) => {
  if (date) {
    const d = typeof date === "string" ? parseDateString(date) : date;
    if (d)
      return getRelativeTimeString(d)
  }
  return ""
}

export const parseDateString = (dateString: string | null | undefined): Date | null => {
  if (!dateString) {
    return null; // Handle null or empty string
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null; // Handle invalid date strings
  }

  return date;
};

export const getLatestDate = (dateStrings: (string | null | undefined)[]): Date | null => {
  let latestDate: Date | null = null;
  for (const dateString of dateStrings) {
    const date = parseDateString(dateString);
    if (date && (!latestDate || date > latestDate)) {
      latestDate = date;
    }
  }
  return latestDate;
};


export const categoriseDate = (date: Date|null): string => {
  if (!date)
    return "";
  const now = new Date();

  // Resetting time portion for accurate comparison
  now.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const msInDay = 24 * 60 * 60 * 1000;
  const differenceInMs = now.getTime() - date.getTime();
  const differenceInDays = differenceInMs / msInDay;

  if (differenceInDays < 0) {
    return "";  // In case the given date is in the future
  } else if (differenceInDays === 0) {
    return "Today";
  } else if (differenceInDays === 1) {
    return "Yesterday";
  } else if (differenceInDays <= 7) {
    return "Previous 7 days";
  } else if (differenceInDays <= 30) {
    return "Previous 30 days";
  } else if (differenceInDays <= 60) {
    return "Previous 60 days";
  } else if (differenceInDays <= 90) {
    return "Previous 90 days";
  } else if (differenceInDays <= 180) {
    return "Previous 180 days";
  } else if (differenceInDays <= 365) {
    return "Previous year";
  } else {
    return "More than a year ago";
  }
}
