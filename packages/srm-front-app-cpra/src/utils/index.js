import { stringify } from "qs";
import { JSEncrypt } from "jsencrypt";
import { SrmUtil, SrmMath, $T } from "srm-mobile-ui";
import { isNil } from "lodash";
import { BASE_URL } from "srm-mobile-ui/packages/request/config";

/**
 * 日期对象转为日期字符串
 * @param date 需要格式化的日期对象
 * @param sFormat 输出格式,默认为yyyy-MM-dd                         年：y，月：M，日：d，时：h，分：m，秒：s
 * @example  dateFormat(new Date())                                "2017-02-28"
 * @example  dateFormat(new Date(),'yyyy-MM-dd')                   "2017-02-28"
 * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')         "2017-02-28 09:24:00"
 * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
 * @example  dateFormat(new Date(),'yyyy-MM-ddThh:mm:ss+08:00')   "2017-02-28T09:24:00+08:00"
 * @returns {boolean}
 */
function dateFormat(date, sFormat) {
  if (!sFormat) {
    // eslint-disable-next-line no-param-reassign
    sFormat = "yyyy-MM-dd";
  }

  if (!(date instanceof Date)) {
    try {
      // eslint-disable-next-line no-use-before-define
      if (isEmpty(date)) {
        return "";
      }
      if (date.lastIndexOf(".") !== -1) {
        // eslint-disable-next-line no-param-reassign
        date = date.substr(0, date.lastIndexOf("."));
      }
      date = date.replace(/\-/g, "/"); // eslint-disable-line
      // eslint-disable-next-line no-param-reassign
      date = new Date(date);
    } catch (e) {
      console.log(e);
    }
  }

  let time = {
    Year: 0,
    TYear: "0",
    Month: 0,
    TMonth: "0",
    Day: 0,
    TDay: "0",
    Hour: 0,
    THour: "0",
    hour: 0,
    Thour: "0",
    Minute: 0,
    TMinute: "0",
    Second: 0,
    TSecond: "0",
    Millisecond: 0,
  };
  time.Year = date.getFullYear();
  time.TYear = String(time.Year).substr(2);
  time.Month = date.getMonth() + 1;
  time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);

  time.Day = date.getDate();
  time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);

  time.Hour = date.getHours();
  time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
  time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
  time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);

  time.Minute = date.getMinutes();
  time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
  time.Second = date.getSeconds();
  time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
  time.Millisecond = date.getMilliseconds();

  return sFormat
    .replace(/yyyy/gi, String(time.Year))
    .replace(/yyy/gi, String(time.Year))
    .replace(/yy/gi, time.TYear)
    .replace(/y/gi, time.TYear)

    .replace(/MM/g, time.TMonth)
    .replace(/M/g, String(time.Month))

    .replace(/dd/gi, time.TDay)
    .replace(/d/gi, String(time.Day))

    .replace(/HH/g, time.THour)
    .replace(/H/g, String(time.Hour))
    .replace(/hh/g, time.Thour)
    .replace(/h/g, String(time.hour))

    .replace(/mm/g, time.TMinute)
    .replace(/m/g, String(time.Minute))
    .replace(/ss/gi, time.TSecond)
    .replace(/s/gi, String(time.Second))
    .replace(/fff/gi, String(time.Millisecond));
}

/**
 * 判断对象为空
 * @param v
 * @return {boolean}
 */
const isEmpty = (v) => {
  if (typeof v === "undefined") {
    return true;
  }
  if (typeof v === "undefined") {
    return true;
  }
  if (v === null) {
    return true;
  }
  if (v === "" || v === "null") {
    return true;
  }
  if (v === 0) {
    return true;
  }
  switch (typeof v) {
    case "string":
      if (v.trim().length === 0) {
        return true;
      }
      break;
    case "boolean":
      if (!v) {
        return true;
      }
      break;
    case "number":
      if (v === 0) {
        return true;
      }
      break;
    case "object":
      return v.length === 0;
    default:
      break;
  }
  return false;
};

/**
 * 手机号码是否正确
 * @param number 手机号码
 * @return Boolean
 * */
const isMobileNumber = (number) =>
  /^(13[0-9]|14[579]|15[012356789]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(
    number
  );

/**
 * 动态修改 document title
 * @param title
 * */
const setDocumentTitle = (title) => {
  document.title = title || document.title;
  let ifr = document.createElement("iframe");
  ifr.onload = function () {
    setTimeout(function () {
      ifr.remove();
    }, 0);
  };
  document.body.appendChild(ifr);
};

const checkTime = (i) => (Number(i) >= 10 ? i : "0" + i);

/**
 *
 * 获取倒计时方法
 * @param {*} time
 * @returns
 */
const leftTime = (time) => {
  let mLeftTime = time - Date.now(); //计算剩余的毫秒数
  let days = parseInt(mLeftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
  let hours = parseInt((mLeftTime / 1000 / 60 / 60) % 24, 10); //计算剩余的小时
  let minutes = parseInt((mLeftTime / 1000 / 60) % 60, 10); //计算剩余的分钟
  let seconds = parseInt((mLeftTime / 1000) % 60, 10); //计算剩余的秒数
  days = checkTime(days);
  hours = checkTime(hours);
  minutes = checkTime(minutes);
  seconds = checkTime(seconds);
  return { days, hours, minutes, seconds };
};

/**
 *将对象拼接成url参数
 * {name: 'aa',age:25} => name=aa&age=25
 * @param {*} data
 * @returns
 */
const queryStr = (data) =>
  Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");

/**
 * 获取url中参数
 *  @param {String} locationsearch
 */
export const GetRequestParameters = (locationsearch) => {
  let url = locationsearch;
  let theRequest = {};
  if (url.indexOf("?") > -1) {
    let str = url.substr(url.indexOf("?") + 1);
    let strs = str.split("&");
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
    }
  }
  return theRequest;
};

/**
 *解决number类型输入框在iOS无效的问题
 *使用on-change方法来控制输入的内容
 *只能输入数字,配合type=number使用
 * @param {*} v 要改变的数组 t 输入框对应的名称
 */

export const numberInputCheckAllNum = (v, t) => {
  let temp = v[t].toString();
  temp = temp.match(/([0-9])*/g);
  if (temp === null || temp === "") {
    v[t] = "";
  } else {
    v[t] = temp.join("");
  }
};

/**
 *解决number类型输入框在iOS无效的问题
 *使用on-change方法来控制输入的内容
 *能输入-和.符号，小数点前任意位数，小数点后只能输入两位
 * @param {*} v 要改变的数组 t 输入框对应的名称
 */

const numberInputCheck1 = (v, t) => {
  let temp = v[t].toString();
  temp = temp.match(/(-)([0-9])*|(\.)|([0-9])*/g);
  if (temp === null || temp === "") {
    v[t] = "";
  } else {
    if (
      temp.includes(".") &&
      (temp[temp.length - 2] !== "." || temp[temp.length - 2] !== "") &&
      temp[temp.length - 2].length > 2
    ) {
      temp[temp.length - 2] = temp[temp.length - 2].slice(
        0,
        temp[temp.length - 2].length - 1
      );
    }
    v[t] = temp.join("");
  }
};
/**
 *解决number类型输入框在iOS无效的问题
 *使用on-change方法来控制输入的内容
 *能输入.符号，10位数
 * @param {*} v 要改变的数组 t 输入框对应的名称
 */

export const numberInputCheck = (v, t) => {
  let temp = v[t].toString();
  temp = temp.match(/\d+(\.\d{0,2})?/g);
  if (temp === null || temp === "") {
    v[t] = "";
  } else if (temp.join("").length >= 10) {
    v[t] = v[t].substring(0, v[t].length - 1);
  } else {
    v[t] = temp.join("");
  }
};

/**
 * 加密算法
 * @param {string} password 密码
 */
export const getCode = function (password) {
  let Encrypt = new JSEncrypt();
  Encrypt.setPublicKey(
    "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJL0JkqsUoK6kt3JyogsgqNp9VDGDp+t3ZAGMbVoMPdHNT2nfiIVh9ZMNHF7g2XiAa8O8AQWyh2PjMR0NiUSVQMCAwEAAQ=="
  );
  return Encrypt.encrypt(password);
};

/**
 * 获取验证文件方法
 * @param {string} fileUrl
 * @param {string} bucketName
 * @param {string} bucketName
 */
export const buildImgUrl = function (fileUrl, bucketName, downApi) {
  const DownApi = downApi
    ? downApi
    : `/hfle/v1/${window.localStorage.organizationId}/files/download`;
  const accessToken = window.localStorage.getItem("user-token");
  const url = encodeURIComponent(fileUrl);
  return `${
    SrmUtil.getApiBaseUrl() + DownApi
  }?access_token=${accessToken}&bucketName=${bucketName}&url=${url}`;
};

/**
 *  判断是否在微信环境
 */
export const isWeChat = function () {
  return navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1;
};

/**
 * 异常抛出封装
 * errorCode错误编码
 * placeField占位符替换值
 */
export const Exception = function (thisVue, errorMessage, placeField) {
  // eslint-disable-next-line
  errorMessage = stringReplace(errorMessage, placeField);
  //自定义弹出框前端校验提示
  thisVue.$notification.open({
    message: errorMessage,
    class: "notification",
  });
  //系统异常抛出终止程序
  throw new Error(errorMessage);
};

// 添加水印
export const paintFixedWaterMarks = (workId) => {
  //在Vue中可改为ES6写法
  console.log(3333333, 4566);
  let wrap = document.createElement("div"); //创建一个div
  wrap.className = "fixed-water-mark"; //给div添加类名
  let wm = document.createElement("canvas"); //单个水印画布
  wm.id = "watermark"; //给canvas标签添加id
  wm.width = 100; //设置canvas宽
  wm.height = 80; //设置canvas高
  wm.style.display = "none"; //设置画布隐藏属性
  wrap.appendChild(wm); //在div中添加画布
  let rwm = document.createElement("canvas"); //重复绘制水印画布，用于整个页面
  rwm.id = "repeat-watermark";
  wrap.appendChild(rwm);
  document.body.appendChild(wrap);
  //绘制单个水印
  let cw = document.getElementById("watermark");
  let ctx = cw.getContext("2d");
  ctx.clearRect(0, 0, 100, 80); //清空矩形
  // eslint-disable-next-line rulesdir/check_js
  ctx.font = "15px 黑体"; //设置字体
  ctx.rotate((-20 * Math.PI) / 180); //逆时针旋转20度
  ctx.fillStyle = "rgba(100,100,100,0.2)"; //填充透明度为0.2的灰色
  ctx.fillText(workId, -10, 60); //填充内容为工号
  //在另一个画布上重复绘制单个水印
  let crw = document.getElementById("repeat-watermark");
  crw.width = window.innerWidth; //设置画布宽度等于窗口显示宽度
  crw.height = window.innerHeight; //设置画布高度等于窗口显示高度
  let ctxr = crw.getContext("2d");
  ctxr.clearRect(0, 0, crw.width, crw.height);
  let pat = ctxr.createPattern(cw, "repeat"); //在水平和垂直方向重复绘制单个水印
  ctxr.fillStyle = pat;
  ctxr.fillRect(0, 0, crw.width, crw.height);
  console.log(ctxr, 4566);
};

// 添加水印
export const paintFixedWaterMark = (workId) => {
  let txtWrap = `<div class='watermarksshell-item'><div class='watermarksshell-item-txt' >${workId}</div> </div>`;
  let result = "";
  for (let i = 0; i < 14; i++) {
    result += txtWrap;
  }
  let htmlFlag = `<div class="watermarksshell">${result}</div>`;
  let wrap = document.createElement("div"); //创建一个div
  wrap.className = "watermarks"; //给div添加类名
  wrap.innerHTML = htmlFlag;
  document.body.appendChild(wrap);
};

/*
 * 占位符替换
 * @param {*}} message  原字符串
 * @param {*} placeFileds 替换子字段，集合
 * 替换{}包含的占位符，支持替换多个，替换顺序，按照集合顺序来
 */
export const stringReplace = function (message, placeFileds) {
  if (placeFileds) {
    placeFileds.forEach((element) => {
      // eslint-disable-next-line no-param-reassign
      message = message.replace(
        message.substring(message.indexOf("{"), message.indexOf("}") + 1),
        element
      );
    });
  }
  return message;
};

/**
 *解决没有传参及传参不为String时，给默认的String
 * @param {*} value 要验证的值 valueStr 默认给的值
 */
const checkStringToDefault = (value, valueStr) => {
  if (!value || typeof value !== "string") {
    // eslint-disable-next-line no-param-reassign
    value = valueStr;
  }
  return value;
};
/**
 * scroll滚动 改变头上index时触发的函数，提取以减少代码冗余
 * @param {*} _index 改变后的index contentLenArr 滚动内容offsetheight集合的名称 navIndex 目前导航的index的名称
 */
export const changeNav = function (_index, contentLenArr, navIndex) {
  // eslint-disable-next-line no-param-reassign
  contentLenArr = checkStringToDefault(contentLenArr, "contentLenArr");
  // eslint-disable-next-line no-param-reassign
  navIndex = checkStringToDefault(navIndex, "navIndex");
  // eslint-disable-next-line no-invalid-this
  const newArr = this[contentLenArr].slice(0, _index);
  const offsetLen = newArr.length ? newArr.reduce((a, b) => a + b) : 0;
  this.$nextTick(() => {
    this.scroll.scrollTo(0, -offsetLen, 600, "bounce");
  });
  this[navIndex] = _index;
};
/**
 * scroll滚动 刷新更新scroll内容长度的函数，提取以减少代码冗余
 * @param {*} getNavArr 头部nav的数组集合名称 contentLenArr 滚动内容offsetheight集合的名称 content 下面滚动部分整体的ref名称
 */
export const refreshScroll = function (contentLenArr, getNavArr, content) {
  // eslint-disable-next-line no-param-reassign
  contentLenArr = checkStringToDefault(contentLenArr, "contentLenArr");
  // eslint-disable-next-line no-param-reassign
  getNavArr = checkStringToDefault(getNavArr, "getNavArr");
  // eslint-disable-next-line no-param-reassign
  content = checkStringToDefault(content, "content");
  this.$nextTick(() => {
    this[contentLenArr] = this[getNavArr].map(
      (item) => this.$refs[item.ref].offsetHeight
    );
    console.log(111, this[getNavArr], this[contentLenArr]);
    const oHeight = this[contentLenArr].reduce((a, b) => a + b) + 460;
    this.$refs[content].style.height = (100 / 667) * oHeight + "vh";
    this.scroll && this.scroll.refresh();
  });
};
/**
 * scroll滚动 滚动时触发的函数，提取以减少代码冗余
 * @param {*} x,y 当前滚动的坐标 _this 当前vue实例 contentLenArr 滚动内容offsetheight集合的名称 navIndex 目前导航的index的名称 lengthArr 记录上次滚动长度的值，减少运算
 */
export const handlerScroll = function (
  x,
  y,
  _this,
  contentLenArr,
  navIndex,
  lengthArr
) {
  // eslint-disable-next-line no-param-reassign
  navIndex = checkStringToDefault(navIndex, "navIndex");
  // eslint-disable-next-line no-param-reassign
  contentLenArr = checkStringToDefault(contentLenArr, "contentLenArr");
  // eslint-disable-next-line no-param-reassign
  lengthArr = checkStringToDefault(lengthArr, "lengthArr");
  (_this[lengthArr] && _this[lengthArr].length) ||
    (_this[lengthArr] = _this[contentLenArr].reduce(
      (pre, cur) => [...pre, pre[pre.length - 1] - cur],
      [0]
    ));
  let contentLenArrLength = _this[contentLenArr].length;
  const index =
    _this[lengthArr]
      .concat(y)
      .sort((a, b) => b - a)
      .lastIndexOf(y) - 1;
  _this[navIndex] =
    index > contentLenArrLength - 1
      ? contentLenArrLength - 1
      : index < 0
      ? 0
      : index;
};

const maxValiDatorForSix = (val) => {
  if (!SrmMath.gt(val, "99999999999999999999.999999")) {
    return $T("smbl.common.message.twentyAndSix").$D(
      "值必须小于99999999999999999999.999999"
    );
  }
};

const maxValiDatorForTen = (val) => {
  if (!SrmMath.gt(val, "99999999999999999999.9999999999")) {
    return $T("smbl.common.message.twentyAndTen").$D(
      "值必须小于99999999999999999999.9999999999"
    );
  }
};

export const yesOrNoRender = (val) =>
  isNil(val)
    ? val
    : Number(val)
    ? $T("smbl.common.message.yes").$D("是")
    : $T("smbl.common.message.no").$D("否");

/**
 * 预览pdf附件
 * @param {String} fileUrl  文件名
 * @param {String} bucketName 桶名
 * @return {undefined}
 */
export async function previewPdf(fileUrl, bucketName) {
  const pdfParams = stringify({
    bucketName: bucketName || SrmUtil.getDefaultBucketName(),
    "access_token": SrmUtil.getUserToken(),
    url: encodeURIComponent(fileUrl),
    type: "mobile",
  });
  const preUrl = `${BASE_URL}/hfle/v1/${SrmUtil.getTenantId()}/file-preview/by-url?${pdfParams}`;
  if (preUrl) {
    // eslint-disable-next-line no-invalid-this
    this.$previewFile({ preUrl });
  }
}

/**
 * 根据双单位配置开启返回显示名称 开启:基本单位，基本数量, 不开启:单位,数量
 * @param {Number} config  双单位配置 1/0
 * @param {String} field 桶名 'quantity'|'uom'|'taxIncludedUnitPrice'
 * @return {String} label
 */
export function getDynamicLabel(config = 0, field = "quantity") {
  const fieldNameObj = {
    uom: {
      base: $T("sodr.common.view.message.basicUomName").$D("基本单位"),
      secondary: $T("sodr.common.model.common.uomCodeAndName").$D("单位"),
    },
    quantity: {
      base: $T("sodr.common.view.message.basicQuantity").$D("基本数量"),
      secondary: $T("sodr.common.model.common.newQuantity").$D("数量"),
    },
    taxIncludedUnitPrice: {
      secondary: $T("sprm.common.model.common.taxIncludedUnitPrice").$D(
        "预估单价（含税）"
      ),
      base: $T("sprm.common.model.common.baseTaxIncludedUnitPrice").$D(
        "预估单价（含税）-基本单位"
      ),
    },
  };
  return !config ? fieldNameObj[field]?.secondary : fieldNameObj[field]?.base;
}

/** 物流模块
 * 根据双单位配置开启返回显示名称 开启:基本单位，基本数量, 不开启:单位,数量
 * @param {Number} config 双单位配置 0 1 2
 * @param {String} field quantity
 * @returns name
 */

export function getLabelName(config = 0, field = "quantity", type = 0) {
  const qualityType = {
    0: [
      $T("sinv.receiptWorkbench.model.receipt.BaseAmount").$D("基本数量"),
      $T("sinv.receiptWorkbench.model.receipt.amount").$D("数量"),
    ],
    1: [
      $T("sinv.receiptExecution.model.receipt.exec.BaseQuantity").$D(
        "执行基本数量"
      ),
      $T("sinv.receiptExecution.model.receipt.exec.quantity").$D("执行数量"),
    ],
    2: [
      $T("sinv.receiptExecution.model.receipt.BaseSourceQuantity").$D(
        "单据基本数量"
      ),
      $T("sinv.receiptExecution.model.receipt.sourceQuantity").$D("单据数量"),
    ],
    3: [
      $T("sinv.receiptExecution.model.receipt.BaseReversedQuantity").$D(
        "退货基本数量"
      ),
      $T("sinv.receiptExecution.model.receipt.reversedQuantity").$D("退货数量"),
    ],
  };
  const fieldNameObj = {
    uomName: {
      base: $T("sinv.receipWorkbench.model.receipt.BaseUoName").$D("基本单位"),
      secondary: $T("sinv.receipWorkbench.model.receipt.uoName").$D("单位"),
    },
    quantity: {
      base: qualityType[type][0],
      secondary: qualityType[type][1],
    },
    leftQuantity: {
      base:
        type === 0
          ? $T("sinv.receiptExecution.model.receipt.BaseLeftQuantity").$D(
              "可执行基本数量"
            )
          : $T("sinv.receiptExecution.model.receipt.BaseCanLeftQuantity").$D(
              "可退货基本数量"
            ),
      secondary:
        type === 0
          ? $T("sinv.receiptExecution.model.receipt.leftQuantity").$D(
              "可执行数量"
            )
          : $T("sinv.receiptExecution.model.receipt.canLeftQuantity").$D(
              "可退货数量"
            ),
    },
  };
  return config ? fieldNameObj[field]?.base : fieldNameObj[field]?.secondary;
}

export {
  isEmpty,
  leftTime,
  queryStr,
  dateFormat,
  isMobileNumber,
  setDocumentTitle,
  numberInputCheck1,
  maxValiDatorForSix,
  maxValiDatorForTen,
};
