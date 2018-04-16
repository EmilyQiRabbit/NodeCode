/**
 * 时间格式化
 * @param date
 * @returns {string}
 */
export function dateToString(date) {
  const oDate = (new Date(date)).toString() === 'Invalid Date' ? new Date(Number(date)) : new Date(date);
  const sYear = oDate.getFullYear(),
    sMonth = oDate.getMonth() + 1,
    sDate = oDate.getDate(),
    sHour = oDate.getHours(),
    sMinutes = oDate.getMinutes(),
    sSeconds = oDate.getSeconds();
  const cSeconds = sSeconds < 10 ? `0${sSeconds}` : sSeconds;
  const cMonth = sMonth < 10 ? `0${sMonth}` : sMonth;
  const cDate = sDate < 10 ? `0${sDate}` : sDate;
  const cHour = sHour < 10 ? `0${sHour}` : sHour;
  const cMinutes = sMinutes < 10 ? `0${sMinutes}` : sMinutes;
  return  `${sYear}-${cMonth}-${cDate} ${cHour}:${cMinutes}:${cSeconds}`;
}
