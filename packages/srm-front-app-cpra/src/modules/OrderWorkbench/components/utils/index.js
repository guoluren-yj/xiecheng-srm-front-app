import BigNumber from "bignumber.js";
import { http, SrmMath, $T } from "srm-mobile-ui";

// 订单状态-颜色 MAP
export const STATUS_COLOR_MAP = {
  PENDING: "warn",
  DELIVERY_DATE_REVIEW: "warn",
  CLOSEING: "warn",
  CANCELING: "warn",
  CANCELLED_PARTIAL: "warn",
  CLOSETOBECOMFIRMED: "warn",
  CANCELTOBECOMFIRMED: "warn",
  APPROVED: "success",
  PUBLISHED: "success",
  CONFIRMED: "success",
  PART_FEED_BACK: "success",
  SUBMITTED: "success",
  SUBMITTED_WFL: "success",
  REJECTED: "danger",
  DELIVERY_DATE_REJECT: "danger",
  CLOSED: "brown",
  CANCELED: "brown",
  PUBLISH_CANCEL: "brown",
};

// 采购申请创建
const checkPermission = (params) => {
  let url = "/iam/hzero/v1/menus/check-permissions";
  return http.post(url, params);
};

const getPermissions = async (code = []) => {
  const permissionsMap = new Map();
  const res = await checkPermission(code);
  if (res && !res.failed) {
    (res || []).forEach((item) => {
      permissionsMap.set(item.code, item.approve);
    });
  }
  return permissionsMap;
};

/**
 * 金额格式化
 * @param {Number} amount 金额
 * @param {Number} precision 精度
 * @param {Boolean} isSupplement 是否补0
 * @returns {Number} 格式化数字
 */
function formatAmount(amount, precision, isSupplement) {
  if (isNaN(parseFloat(amount))) {
    return null;
  }
  const decimal = String(amount).split(".")[1];
  let newPrecision = Number(precision);
  newPrecision = isNaN(newPrecision) ?
    null :
    newPrecision > 20 ?
      20 :
      newPrecision;
  if (
    (decimal && decimal.length && decimal.length < newPrecision ||
      !decimal) &&
    !isSupplement
  ) {
    newPrecision = null;
  }
  return SrmMath.toFormat(amount, newPrecision, BigNumber.ROUND_HALF_CEIL);
}

// 字段对应的精度字段MAP
const precisionMap = {
  quantity: "uomPrecision",
  originalQuantity: "uomPrecision",
  secondaryQuantity: "secondaryUomPrecision",
  quantityTotal: "uomPrecision",
  unitPrice: "defaultPrecision",
  enteredTaxIncludedPrice: "defaultPrecisiosn",
  amount: "financialPrecision",
  taxIncludeAmount: "financialPrecision",
  lineAmount: "financialPrecision",
  taxIncludedLineAmount: "financialPrecision",
  domesticAmount: "domesticFinancialPrecision",
  domesticTaxIncludeAmount: "domesticFinancialPrecision",
  domesticLineAmount: "domesticFinancialPrecision",
  domesticTaxIncludedLineAmount: "domesticFinancialPrecision",
  domesticUnitPrice: "domesticDefaultPrecision",
  domesticTaxIncludedPrice: "domesticDefaultPrecision",
};
// 金额字段
const amountFieldList = [
  "amount",
  "taxIncludeAmount",
  "domesticAmount",
  "domesticTaxIncludeAmount",
  "lineAmount",
  "taxIncludedLineAmount",
  "domesticLineAmount",
  "domesticTaxIncludedLineAmount",
];
// 单价字段
const priceFieldList = [
  "unitPrice",
  "domesticUnitPrice",
  "enteredTaxIncludedPrice",
  "domesticTaxIncludedPrice",
];
// 数量字段
const quantityFieldList = [
  "quantity",
  "quantityTotal",
  "originalQuantity",
  "secondaryQuantity",
];

//                                          补零    考虑价格隐藏  目录化电商来源控制精度
// 金额字段 取财务精度 financialPrecision   是       是            否
// 数字字段 取单位精度 uomPrecision         否       否            是
// 单价字段 取单价精度 defaultPrecision     否       是            否
/**
 * 头行 数量、金额 字段格式化
 * @param {Number} val 字段值
 * @param {Object} item 行信息
 * @param {Object} field 字段属性
 * @param {Object} options options
 * @returns {Number} 格式化字段
 */
function amountRender(val, item, field, options = {}) {
  // 是否考虑处理大数字金额和数量?
  let text = val;
  const { fieldCode } = field;
  // bysourceCode 金额是否根据sourceCode控制精度
  const { bysourceCode = true } = options;
  const amountPriceList = amountFieldList.concat(priceFieldList);
  const precision = item[precisionMap[fieldCode]];
  const { poSourcePlatform, sourceBillTypeCode, priceShieldFlag, sourceCode } =
    item;
  if (priceShieldFlag === 1 && amountPriceList.includes(fieldCode)) {
    return "******";
  }
  const fromEc =
    sourceBillTypeCode === "PURCHASE_REQUEST" &&
    [ "CATALOGUE", "E-COMMERCE" ].includes(poSourcePlatform);
  const notSrm = sourceCode !== "SRM";
  if (quantityFieldList.includes(fieldCode)) {
    text = formatAmount(val, precision);
  } else if (amountFieldList.includes(fieldCode)) {
    text =
      amountPriceList.includes(fieldCode) && (fromEc || notSrm) && !bysourceCode ?
        formatAmount(val) :
        formatAmount(val, precision, true);
  } else if (priceFieldList.includes(fieldCode)) {
    text =
      amountPriceList.includes(fieldCode) && (fromEc || notSrm) ?
        formatAmount(val) :
        formatAmount(val, precision);
  }
  return text;
}

// 开启价格隐藏的相关处理字段
const SHIED_FIELDS = [
  "amount",
  "taxIncludeAmount",
  "unitPrice",
  "enteredTaxIncludedPrice",
  "lineAmount",
  "taxIncludedLineAmount",
  "domesticTaxIncludedPrice",
  "domesticUnitPrice",
  "domesticTaxIncludedLineAmount",
  "domesticLineAmount",
];

/**
 * 处理变更信息提示,只对 fieldType为 TEXT、EMPTY 类型组件有用
 * @param {Object} content 字段值
 * @param {Object} record 行信息
 * @param {Object} field 字段属性
 * @return {ReactDOM} ReactDOM
 */
const renderChangeTip = (content, record, field) => {
  const { fieldCode } = field;
  const { changeMap = {}, priceShieldFlag } = record || {};
  const shieldFlag = priceShieldFlag === 1 && SHIED_FIELDS.includes(fieldCode);
  const tipValue = changeMap[fieldCode] || "【】";
  const dom = content;
  if (fieldCode in changeMap) {
    const tipContent = `${$T("sodr.common.model.common.beforeUpdate").$D(
      "变更前"
    )} : ${tipValue}`;
    if (!shieldFlag) {
      return (
        <srm-tooltip title={tipContent} placement="top">
          <span
            style="color:red"
            onClick={(e) => {
              if (e) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            {dom}
          </span>
        </srm-tooltip>
      );
    }
    return <span style="color:red">{dom}</span>;
  }
  return dom;
};

// 展示是否
function boolRender(val) {
  return Number(val) === 1 ?
    $T("hipspfm.common.status.yes").$D("是") :
    $T("hipspfm.common.status.no").$D("否");
}

/**
 * 操作记录数据处理
 * @param {Array} list 源数据
 * @returns {Array} 数组
 */
function getRecord(list) {
  let data = [];
  /**
   * 动作为【新增行/删除行】的操作记录直接隐藏，
   * 动作为【更新】的操作记录需要按单号+时间进行合并（目前是按照对几个字段进行了更新就显示几个更新记录），
   * 动作为【取消中】之后的【拒绝】需要按单号+时间进行合并（目前是有几行就显示了几+1几条记录）
   * 动作为【分配】的操作记录不允许合并
   * 动作为【更新/变更】的操作记录 对字段进行合并记录
   */
  list.map((item) => {
    if (
      item.processTypeCode === "UPDATE" ||
      item.processTypeCode === "CHANGE" ||
      item.processTypeCode === "ROLLBACK"
    ) {
      if (
        data.findIndex(
          (val) => val.poProcessActionId === item.poProcessActionId
        ) === -1
      ) {
        // 拼接更新的信息
        let updateRecords = [];
        list.map((val) => {
          if (val.poProcessActionId === item.poProcessActionId) {
            updateRecords.push(val);
          }
        });
        let processRemarks =
          updateRecords.map(
            (u) =>
              `\n${u.processUserName ?? ""} ${
                u.processRemark ?
                  u.processRemark :
                  `${$T("sodr.common.model.common.for").$D("将")}【${
                    u.changeFieldNameMeaning ?? ""
                  }】${$T("sodr.common.model.common.from").$D("由")}【${
                    u.priceShieldFlag ? "******" : u.oldValue ?? ""
                  }】${$T("sodr.common.model.common.to").$D("改成")}【${
                    u.priceShieldFlag ? "******" : u.newValue ?? ""
                  }】 ${
                    u.changeTableName === "SODR_PO_HEADER" ?
                      "" :
                      `${$T("sodr.common.model.common.displayLineNum").$D(
                        "行号"
                      )}【${u.displayLineNum ?? ""}】`
                  }`
              }`
          ) || [];
        data.push({ ...item, processRemark: processRemarks.join("\n") });
      }
    } else {
      data.push(item);
    }
  });
  return data.map((e) => {
    e.processTypeMeaning = {
      text: e.processTypeMeaning,
      type: "primary",
    };
    if (e.processTypeCode === "SUBMIT") {
      e.processTypeMeaning.type = "primary";
    } else if (e.processTypeCode === "APV_REJECT") {
      e.processTypeMeaning.type = "danger";
    } else if (e.processTypeCode === "NEW") {
      e.processTypeMeaning.type = "info";
    }
    return e;
  });
}

export {
  getRecord,
  boolRender,
  amountRender,
  formatAmount,
  getPermissions,
  renderChangeTip,
};
