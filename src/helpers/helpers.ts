import {
  format,
  isThisMonth,
  isThisYear,
  isToday,
  isYesterday,
} from "date-fns";

export const getUrl = (path: string, params: any = {}) => {
  let url = path;
  Object.keys(params).forEach((key) => {
    url = url.replace(`{${key}}`, params[key]);
  });
  return url;
};

export function formatterDate(date: Date | string) {
  if (isToday(date, {})) {
    return format(date, "hh:mm a");
  } else if (isYesterday(date)) {
    return "yesterday at" + format(date, "hh:mm a");
  } else if (isThisMonth(date)) {
    return format(date, "dd hh:mm a");
  } else if (isThisYear(date)) {
    return format(date, "MMM dd hh:mm a");
  } else {
    return format(date, "yyyy MMM dd hh:mm a");
  }
}
