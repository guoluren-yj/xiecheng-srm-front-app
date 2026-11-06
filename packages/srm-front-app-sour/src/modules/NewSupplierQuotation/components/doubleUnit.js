// TODO  临时代码，后期双单位上线后从/utils/中引用，此代码作废
import { $T } from "srm-mobile-ui";

// 单位和基本单位名称获取
const getUomName = (flag = false) => flag ?
  $T("ssrc.common.model.inquiryHall.basicUomName").$D("基本单位") :
  $T("ssrc.common.model.unit").$D("单位");

// 数量和基本数量名称获取
const getQtyName = (flag = false) => flag ?
  $T("ssrc.common.model.inquiryHall.basicQuantity").$D("基本数量") :
  $T("ssrc.common.model.common.quantity").$D("需求数量");

export {
  getUomName,
  getQtyName,
};
