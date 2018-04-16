/**
 * tool.js
 */
/**
 * 时间格式转换 time ms
 * @param time
 * @param showMs 是否显示毫秒
 * @param showYear 是否显示年
 * @returns {*}
 */
/*eslint-disable prefer-template*/
const formatTime = ({time, showMs = false, showYear = false}) => {
  if (!time) {
    return '';
  }
  if (typeof (time) !== 'number' || (typeof (time) === 'string' && time.indexOf('-') !== -1)) {
    return time;
  }
  const date = new Date(Number(time));
  const H = date.getHours() <= 9 ? '0' + date.getHours() : date.getHours();
  const M = date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes();
  const S = date.getSeconds() <= 9 ? '0' + date.getSeconds() : date.getSeconds();
  let MS = date.getMilliseconds();
  if (MS <= 9) {
    MS = '00' + MS;
  } else if (MS <= 99) {
    MS = '0' + MS;
  }

  const hms = showMs ? ` ${H}:${M}:${S}.${MS}` : ` ${H}:${M}:${S}`;
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month <= 9 ? '0' + month : month;

  let day = date.getDate();
  day = day <= 9 ? '0' + day : day;

  return (showYear ? year + '-' : '') + month + '-' + day + hms;
};
const toolFuc = {
  formatTime,
}

export default toolFuc;
