/* eslint-disable no-undefined */
import { isArray } from "lodash";
import { SrmUtil } from "srm-mobile-ui";

// 捕获await错误
export async function to(promise, errorExt) {
  try {
    const data = await promise;
    return [null, data];
  } catch (err) {
    if (errorExt) {
      Object.assign(err, errorExt);
    }
    return [err, undefined];
  }
}

// 过滤掉对象值为 undefined 和 空字符串 和 空数组 的属性
export function filterNullValueObject(obj) {
  const result = {};
  if (obj && Object.keys(obj).length >= 1) {
    Object.keys(obj).forEach((key) => {
      if (key && obj[key] !== undefined && obj[key] !== "" && obj[key] !== null) {
        // 如果查询的条件不为空
        if (isArray(obj[key]) && obj[key].length === 0) {
          return;
        }
        result[key] = obj[key];
      }
    });
  }
  return result; // 返回查询条件
}

// 日期格式化
export const dateFormat = (date, format = "YYYY-MM-dd HH:mm:ss") => {
  const year = date.getFullYear();
  const mounth = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const second = date.getSeconds();

  let result = format.replace("YYYY", year);
  result = result.replace("MM", mounth < 10 ? `0${mounth}` : mounth);
  result = result.replace("dd", day < 10 ? `0${day}` : day);
  result = result.replace("HH", hour < 10 ? `0${hour}` : hour);
  result = result.replace("mm", minutes < 10 ? `0${minutes}` : minutes);
  result = result.replace("ss", second < 10 ? `0${second}` : second);
  return result;
};

// 判断日期是否在本周
export function isDateInThisWeek(dateInput) {
  const now = new Date();
  const inputDate = new Date(dateInput);
  now.setHours(0, 0, 0, 0);
  const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const firstDayOfWeek = new Date(now.setDate(now.getDate() - dayOfWeek));
  const nextMonday = new Date(firstDayOfWeek);
  nextMonday.setDate(nextMonday.getDate() + 7);
  return inputDate >= firstDayOfWeek && inputDate < nextMonday;
}

// 获取日期组
export const getDateGroup = (date) => {
  const inWeek = isDateInThisWeek(date);
  if (inWeek) {
    return SrmUtil.$T("smbl.chat.view.dateGroup.thisWeek").$D("本周");
  }
  return dateFormat(new Date(date), "YYYY-MM-dd");
};

// 获取图片宽高
export const getImageSize = (imageFile, result) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const url = event.target.result;
    const img = document.createElement("img");
    img.src = url;
    img.onload = () => {
      result({ width: img.width, height: img.height });
    };
  };
  reader.readAsDataURL(imageFile);
};

// 判断元素是否在视口内
export const isChildInParentView = (parent, child) => {
  const parentRect = parent.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();
  return (
    childRect.top >= parentRect.top &&
    childRect.left >= parentRect.left &&
    childRect.bottom <= parentRect.bottom &&
    childRect.right <= parentRect.right
  );
};
