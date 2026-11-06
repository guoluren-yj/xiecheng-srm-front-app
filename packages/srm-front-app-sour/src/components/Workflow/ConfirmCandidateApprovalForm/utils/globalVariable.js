import { $T } from "srm-mobile-ui";
/**
 * 获取当前模块对应的多语言
 * @param {Function} getName 传入的getName的方法
 * @returns name
 */

const getSourceCategoryName = (bidFlag) => bidFlag ?
  $T("ssrc.common.bid").$D("招标") : $T("ssrc.common.inquiryPrice").$D("询价");

const getDocumentTypeName = (bidFlag) => bidFlag ?
  $T("ssrc.common.view.message.bid").$D("招标书") :
  $T("ssrc.common.view.message.rfx").$D("询价单");

const getCheckPriceName = (bidFlag) => bidFlag ?
  $T("ssrc.common.view.message.target").$D("定标") :
  $T("ssrc.common.view.message.nuclearPrice").$D("核价");

const getOmitName = (bidFlag) => bidFlag ? "" : $T("ssrc.common.inquiryPrice").$D("询价");

const getQuotationName = (bidFlag) => bidFlag ?
  $T("ssrc.common.model.common.tender").$D("投标") :
  $T("ssrc.common.model.common.quotation").$D("报价");

const getSourceName = (bidFlag) => bidFlag ?
  $T("ssrc.common.bid").$D("招标") :
  $T("ssrc.common.model.common.source").$D("寻源");

const getUnitCodePrefix = (bidFlag = false, rfxCode = "", bidCode = "") => bidFlag ? bidCode : rfxCode;

/**
 * 常用常量
 */
const BID = "BID";
const BID_LOWERCASE = "bid";
const INQUIRY = "INQUIRY";
const INQUIRY_LOWERCASE = "inquiry";
const INQUIRY_HALL = "INQUIRY_HALL"; // 用于寻源明细-替换个性化
const INQUIRY_BID = "INQUIRY_BID";
const RFX = "RFX";
const RFX_LOWERCASE = "rfx";
const INQUIRY_HALL_LOWERCASE = "inquiryHall";
const NEW_BID_HALL_LOWERCASE = "newBidHall";

const getCategoryCode = (bidFlag = false) => bidFlag ? BID : RFX;

export {
  getSourceCategoryName,
  getCheckPriceName,
  getOmitName,
  getQuotationName,
  BID,
  BID_LOWERCASE,
  INQUIRY,
  INQUIRY_LOWERCASE,
  RFX,
  RFX_LOWERCASE,
  getDocumentTypeName,
  INQUIRY_HALL,
  INQUIRY_BID,
  getUnitCodePrefix,
  getCategoryCode,
  getSourceName,
  INQUIRY_HALL_LOWERCASE,
  NEW_BID_HALL_LOWERCASE,
};
