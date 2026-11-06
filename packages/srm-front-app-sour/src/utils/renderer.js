import { $T } from "srm-mobile-ui";

/**
 * 评分要素评分区间显示
 * @param {Number} min
 * @param {Number} max
 */

export function scoreIntervalRender(min, max) {
  return `[${min || min === 0 ? min : "-"}, ${max || max === 0 ? max : "-"}]`;
}

/**
 * render yes no 数字或英文渲染为中文
 * @param {*} renderValue 原始值
 * @returns 处理值
 */

export function yesOrNoRenderer(renderValue = null) {
  const translateTorNumber = (value = null) => {
    const result = !value || value === "0" || value === "NO" || value === "N" ? 0 : 1;
    return result;
  };
  const currentValue = translateTorNumber(renderValue);
  return currentValue ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否");
}

/**
 * render 启用 未启用 数字或英文渲染为中文
 * @param {*} renderValue 原始值
 * @returns 处理值
 */

export function enabledOrNotenabledRender(renderValue = null) {
  const translateTorNumber = (value = null) => {
    const result = !value || value === "0" || value === "NO" || value === "N" ? 0 : 1;
    return result;
  };
  const currentValue = translateTorNumber(renderValue);
  return currentValue ? $T("hipspfm.common.status.enabledFlag.enable").$D("启用") : $T("hipspfm.common.status.enabledFlag.unenable").$D("不启用");
}