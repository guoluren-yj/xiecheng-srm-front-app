import { $T } from "srm-mobile-ui";

// 单位和基本单位名称获取
const getUomName = (flag = false) => flag ?
  $T("ssrc.common.model.inquiryHall.basicUomName").$D("基本单位") :
  $T("ssrc.common.model.unit").$D("单位");

// 数量和基本数量名称获取
const getQtyName = (flag = false) => flag ?
  $T("ssrc.common.model.inquiryHall.basicQuantity").$D("基本数量") :
  $T("ssrc.common.model.common.quantity").$D("需求数量");

// 可供数量
const getAvailableQtyName = (flag = false) => flag ?
  $T("ssrc.common.model.inquiryHall.basicAvailableQuantity").$D("基本可供数量") :
  $T("ssrc.common.model.common.availableQuantity").$D("可供数量");

const getLadderFrom = (flag = false) => flag ?
  $T("ssrc.common.model.inquiryHall.basicLadderFrom").$D("基本数量从") :
  $T("ssrc.common.model.common.ladderFrom").$D("数量从");

const getLadderTo = (flag = false) => flag ?
  $T("ssrc.common.model.inquiryHall.basicLadderTo").$D("基本数量至") :
  $T("ssrc.common.model.common.ladderTo").$D("数量至");
// 带符号的阶梯报价范围
const getLadderFromQuote = (flag = false) => flag ?
    $T("ssrc.common.model.inquiryHall.basicLadderFrom").$D("基本数量从(>=)") :
    $T("ssrc.common.model.common.ladderFrom").$D("数量从(>=)");


// 报价单位和数量
const getQuantityAndUomCombine = (flag = false) => flag ?
  $T("ssrc.common.basicQuantityAndUomCombine").$D("基本数量-基本单位") :
  $T("ssrc.common.quantityAndUomCombine").$D("数量-单位");

// 单价含税
const getPriceName = (flag = false) => flag ?
  $T("ssrc.common.model.supQuo.basicUnitPriceTax").$D("基本单价(含税)") :
  $T("ssrc.common.model.common.taxPrice").$D("单价(含税)");

// 单价不含税
const getNetPriceName = (flag = false) => flag ?
  $T("ssrc.common.model.supQuo.basicNetPrice").$D("基本单价(不含税)") :
  $T("ssrc.common.model.common.netPrice").$D("单价(不含税)");

// 阶梯报价含税
const getLadderPriceName = (flag = false) => flag ?
  $T("ssrc.common.model.supQuo.basicValidTaxPrice").$D("基本有效报价(含税)") :
  $T("ssrc.common.model.common.validLadderTaxPrice").$D("有效阶梯报价（含税）");

// 阶梯报价不含税
const getNetLadderPriceName = (flag = false) => flag ?
  $T("ssrc.common.model.supQuo.basicValidUnTaxQuotationPrice").$D("基本有效报价(不含税)") :
  $T("ssrc.common.model.common.validLadderNetPrice").$D("有效阶梯报价(不含税)");

const getValidPriceName = (flag = false) => flag ?
  $T("ssrc.common.model.supQuo.basicValidTaxPrice").$D("基本有效报价(含税)") :
  $T("ssrc.common.model.common.validPrice").$D("有效报价(含税)");

const getValidNetPriceName = (flag = false) => flag ?
  $T("ssrc.common.model.supQuo.basicValidUnTaxQuotationPrice").$D("基本有效报价(不含税)") :
  $T("ssrc.common.model.common.validNetPrice").$D("有效报价(不含税)");

const getTooltipsName = (flag = false) => flag ?
  $T("ssrc.common.previewSubmitValidBasicPrice").$D("上一次提交的基本有效单价") :
  $T("ssrc.common.previewSubmitValidPrice").$D("上一次提交的有效单价");

const getQuotationPrice = (flag = false) => flag ?
  $T("ssrc.common.model.inquiryHall.basicUnitPrice").$D("基本单价") :
  $T("ssrc.common.model.common.unitPrice").$D("单价");

const getAllottedQuantity = (flag = false) => flag ?
    $T("ssrc.common.model.inquiryHall.basicAllottedQuantity").$D("基本分配数量") :
    $T("ssrc.common.model.inquiryHall.allottedQuantity").$D("分配数量");

export {
  getUomName,
  getQtyName,
  getAvailableQtyName,
  getLadderFrom,
  getLadderTo,
  getQuantityAndUomCombine,
  getPriceName,
  getNetPriceName,
  getLadderPriceName,
  getNetLadderPriceName,
  getValidPriceName,
  getValidNetPriceName,
  getTooltipsName,
  getQuotationPrice,
  getAllottedQuantity,
  getLadderFromQuote
};
