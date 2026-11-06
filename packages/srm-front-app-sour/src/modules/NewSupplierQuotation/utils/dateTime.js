import { $T, } from "srm-mobile-ui";

import moment from "moment";

/**
 * format dateTime to MM-DD || HH:MM or combine
 * */
function formatDateTime(data) {
  const { dateTime, onlyMonthDay = 0, onlyHourMinute = 0, onlyMonthDayHourMinuteSecond = 0 } =
    data || {};

  if (!dateTime) {
    return "";
  }

  const monthDay = `MM[${$T("ssrc.inquiryHall.date.unit.month").$D("月")}]DD[${$T("ssrc.inquiryHall.date.unit.day").$D("日")}]`;
  const hourMinute = "HH:mm";

  let ft = `${monthDay}${hourMinute}`;

  if (onlyMonthDay) {
    ft = monthDay;
  }
  if (onlyHourMinute) {
    ft = hourMinute;
  }

  if (onlyMonthDayHourMinuteSecond) {
    ft = `${monthDay}${hourMinute}:ss`;
  }

  const formatDateTimeValue = moment(dateTime).format(ft);
  return formatDateTimeValue;
}

// foramt time
const formatToDMHM = (data) => {
  const time = moment(data).format("MM-DD HH:mm:ss");
  return time;
};

export { formatDateTime, formatToDMHM };


