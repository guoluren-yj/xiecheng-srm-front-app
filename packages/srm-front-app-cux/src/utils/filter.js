/* eslint-disable valid-jsdoc */

// eslint-disable-next-line valid-jsdoc
import { $T } from "srm-mobile-ui";

/**
 *日期过滤函数
 *20160101 ---> 2016-01-01
 * @param {*} value
 * @returns
 */
export const dateServer = (value) => value.replace(/(\d{4})(\d{2})(\d{2})/g, "$1-$2-$3");

// eslint-disable-next-line valid-jsdoc
/**
 *日期过滤函数
 *2019-11-22 00:00:00 ---> 2019-11-22
 * @param {*} value
 * @returns
 */
export const CalcDate = (value) => {
  if (typeof value !== "undefined" && typeof value !== "object") {
    return value.substring(0, 10);
  }
};

// eslint-disable-next-line valid-jsdoc
/**
 *日期过滤函数
 *2019-11-22 06:30:50 ---> 06:30:50
 * @param {*} value
 * @returns
 */
export const CalcTime = (value) => {
  if (typeof value !== "undefined" && typeof value !== "object") {
    return value.substring(10);
  }
};

// eslint-disable-next-line valid-jsdoc
/**
 *字数过滤函数
 *字数超过length个省略号显示
 * @param {*} value  length为想要超过多少时隐藏的长度 默认为10
 * @returns
 */
export const CalcFontLength = (value, length) => {
  if (length && typeof length !== "undefined" && !isNaN(Number(length))) {
    // eslint-disable-next-line no-param-reassign
    length = Number(length);
  } else {
    // eslint-disable-next-line no-param-reassign
    length = 10;
  }
  if (typeof value !== "undefined" && typeof value !== "object" && value.length > length) {
    return value.substring(0, length) + "...";
  }
  return value;

};

// eslint-disable-next-line valid-jsdoc
/**
 数额千分位函数
 *222122122.67 ---> 222,122,122.67
 * @param {*} value
 * @returns
 */
export const CalcMicrometer = (value) => {
  if (typeof value !== "undefined" && typeof value !== "object") {
    return String(value).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
  }
};
// eslint-disable-next-line valid-jsdoc
/**
 小数部分不加逗号的数额千分位函数
 *222122122.6667 ---> 222,122,122.6667
 * @param {*} value
 * @returns
 */
export const thousandBitSeparator = function (value) {
  const decimal = String(value).split(".")[1] || "";//小数部分
  const tempArr = [];
  const revNumArr = String(value).split(".")[0].split("").reverse();//倒序

  // eslint-disable-next-line no-unused-vars
  for (let i in revNumArr) {
    tempArr.push(revNumArr[i]);
    // eslint-disable-next-line eqeqeq
    if ((i + 1) % 3 === 0 && i != revNumArr.length - 1) {
      tempArr.push(",");
    }
  }

  // eslint-disable-next-line vars-on-top
  let zs = tempArr.reverse().join("");//整数部分

  return decimal ? zs + "." + decimal : zs;

};
// eslint-disable-next-line valid-jsdoc
/**
 *金钱过滤函数
 *2 ---> 2.00
 * @param {*} value length
 * @returns
 */
export const CalcMoney = (value, length) => {
  if (length && typeof length !== "undefined" && !isNaN(Number(length))) {
    // eslint-disable-next-line no-param-reassign
    length = Number(length);
  } else {
    // eslint-disable-next-line no-param-reassign
    length = 2;
  }
  if (value !== "" && typeof value !== "undefined" && typeof value !== "object") {
    return Number(value).toFixed(length);
  }
};

/**
 * @description: 过滤并删除已有数据
 * @param {type}
 * @return:
 */
export const FilterArray = (array01, array02) => {
  for (let i = 0; i < array02.length; i++) {
    for (let j = 0; j < array01.length; j++) {
      if (array01[j] === array02[i]) {
        array01.splice(j, 1);
        j = j - 1;
      }
    }
  }
  return array01;
};
/**
 * @description: 过滤百分比
 * @param {*} value
 * @return:
 */
export const getPercentage = (value) => {
  if (value) {
    return value.split("(")[1].split(")")[0];
  }
};

/**
 * @description: 过滤多语言翻译多出的{}内容
 * @param {*} value
 * @return:
 */
export const splitOverFlow = (value) => {
  if (value) {
    return (value.split("{")[0] || "").concat(value.split("}")[1] || "");
  }
};

/**
 * @description: js格式化分钟转为天、时、分 1441 => 1天0时1分
 * @param {*} minutes 分钟
 * @return:
 */

export const formatMinutes = (minutes) => {
  // eslint-disable-next-line radix
  let day = parseInt(Math.floor(minutes / 1440));

  let hour = day > 0 ? Math.floor((minutes - day * 1440) / 60) : Math.floor(minutes / 60);

  let minute = hour > 0 ? Math.floor(minutes - day * 1440 - hour * 60) : day > 0 ? Math.floor(minutes - day * 1440) : minutes;

  let time = "";

  day = day > 0 ? day : 0;
  hour = hour > 0 ? hour : 0;
  minute = minute > 0 ? minute : 0;
  time += day + $T("smbl.common.view.day").$D("天");
  time += hour + $T("smbl.common.view.hour").$D("小时");
  time += minute + $T("smbl.common.view.minute").$D("分钟");
  return time;
};

/**
 * @description: 处理金钱整数
 * @param {String} str
 * @return:
 */
export const filterMoneyInt = (str) => {
  if (str || str === 0) {
    let money = String(Number(str).toFixed(4));

    if (money.includes(".")) {
      return money.split(".")[0];
    }
    return money;
  }
};

/**
 * @description: 处理金钱小数
 * @param {String} str
 * @return:
 */
export const filterMoneyFloat = (str, number = 2) => {
  if (str || str === 0) {
    let flotNum = String(str).includes(".") ? String(str).split(".")[1].length : 0;

    if (flotNum >= number) {
      let money = Number(str).toFixed(number);

      return "." + money.split(".")[1];
    }
    flotNum = flotNum < 2 ? 2 : flotNum;
    let money = Number(str).toFixed(flotNum);

    return "." + money.split(".")[1];

  }
};

/**
 * @description: 数值根据语言环境切换分隔符
 * @param {Number} value
 * @returns
 */
export const calcMultipleDelimiter = (value, precision) => {
  //中文：zh-CN 英文：en-US 德语：de-DE 日语：ja-JP
  //取当前语言环境
  let currentLanguage = window.localStorage.getItem("language");
  //转换语言格式
  if (currentLanguage && typeof currentLanguage !== "undefined") {
    currentLanguage = String(currentLanguage.replace("_", "-"));
  } else {
    currentLanguage = "zh-CN";
  }
  //小数位数
  let decimalPointCount = 0;
  //获取小数点的位置
  const decimalPointPos = String(value).indexOf(".") + 1;
  if (decimalPointPos > 0) {
    //获取小数点后的个数
    decimalPointCount = String(value).length - decimalPointPos;
  }
  if (value !== "" && typeof value !== "undefined" && value !== null && !isNaN(Number(value))) {
    //精度是否大于小数位标识
    const isPrecisionFlag = precision - decimalPointCount > 0;
    if (precision !== "" && typeof precision !== "undefined" && precision !== null && !isNaN(Number(precision)) && isPrecisionFlag) {
      return Number(value).toLocaleString(currentLanguage, { maximumFractionDigits: precision, minimumFractionDigits: precision });
    }
    return Number(value).toLocaleString(currentLanguage, { maximumFractionDigits: 20 });
  }
  return value;
};

/**
 * 获取币种对应的精度
 * @param {String} currencyCode
 * @param {String} precisionType
 * financialPrecision 财务精度
 * defaultPrecision 单价精度
 */
export const calcCurrencyPrecision = (currencyCode, precisionType) => {
  if (currencyCode !== "" && precisionType !== "" && currencyCode !== "undefined" && precisionType !== "undefined") {
    let precision = null;
    const currencyInfoMap = JSON.parse(window.localStorage.getItem("currencyInfoMap"));
    const currencyInfo = currencyInfoMap[currencyCode];
    if (currencyInfo && currencyInfo !== null) {
      precision = currencyInfo[precisionType];
    }
    return precision;
  }
};

/**
 * 限制数字输入精度
 * @param {String} value
 * @param {String} precision
 */
export const getNumPrecisionInput = (value, precision) => {
  let mValue;
  mValue = String(value);
  //小数位数
  let decimalPointCount = 0;
  //精度是否大于小数位标识
  let isPrecisionFlag = false;
  //获取小数点的位置
  const decimalPointPos = String(mValue).indexOf(".") + 1;
  //存在小数
  if (decimalPointPos > 0) {
    if (value !== "" && typeof value !== "undefined" && value !== null && !isNaN(Number(value))) {
      //获取小数点后的个数
      decimalPointCount = String(mValue).length - decimalPointPos;
      isPrecisionFlag = decimalPointCount - precision > 0;
      if (isPrecisionFlag) {
        const numberLength = decimalPointPos + precision;
        mValue = mValue.substring(0, numberLength);
      }
    }
  }
  return Number(mValue);
};
