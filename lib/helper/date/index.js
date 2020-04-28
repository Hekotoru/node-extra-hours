'use strict';

const dateHelper = {};

dateHelper._daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

dateHelper._format2Digit = number => (number < 10 ? '0' : '') + number;

dateHelper.daysAgo = function(number) {
  const date = new Date();
  date.setMonth(date.getMonth(), date.getDate() - number);
  date.setHours(0, 0, 0, 0);
  return date;
};

dateHelper.isBefore = (date1, date2) => new Date(date1) < new Date(date2);

dateHelper.isAfter = (date1, date2) => new Date(date1) > new Date(date2);

dateHelper.secondsToHour = seconds => seconds / 3600;

dateHelper.minutesToHour = minutes => minutes / 60;

dateHelper.fromTime = function(hour) {
  const date = new Date();
  date.setHours(hour);
  return date;
};

dateHelper._isBetween = function(value, from, to) {
  const date = new Date(value);
  return date > from && date < to;
};

dateHelper.isWeekend = date => [0, 6].includes(new Date(date).getDay());

dateHelper.formatWithDay = function(value) {
  const day = new Date(value).getDay();
  const dayOfWeek = dateHelper._daysOfWeek[day];

  return `${dayOfWeek}, ${dateHelper.format(value)}`;
};

dateHelper.format = function(value) {
  const date = new Date(value);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

dateHelper.getCurrentDateWithZohoFormat = function() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

dateHelper.format12hour = function(value) {
  const date = new Date(value);
  const hour = dateHelper._format2Digit(date.getHours() % 12);
  const minute = dateHelper._format2Digit(date.getMinutes());
  const median = date.getHours() < 12 ? 'AM' : 'PM';

  return `${hour}:${minute} ${median}`;
};

dateHelper.parseISO8601Duration = function (iso8601Duration) {
  const iso8601DurationRegex = /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;
  const matches = iso8601Duration.match(iso8601DurationRegex);

  return {
      sign: matches[1] === undefined ? '+' : '-',
      years: matches[2] === undefined ? 0 : Number(matches[2]),
      months: matches[3] === undefined ? 0 : Number(matches[3]),
      weeks: matches[4] === undefined ? 0 : Number(matches[4]),
      days: matches[5] === undefined ? 0 : Number(matches[5]),
      hours: matches[6] === undefined ? 0 : Number(matches[6]),
      minutes: matches[7] === undefined ? 0 : Number(matches[7]),
      seconds: matches[8] === undefined ? 0 : Number(matches[8])
  };
};

module.exports = dateHelper;
