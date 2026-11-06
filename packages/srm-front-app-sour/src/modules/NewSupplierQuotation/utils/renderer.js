import { $T, } from "srm-mobile-ui";
import { isEmpty, isNil, } from "lodash";
import {rgba} from "mockjs/src/mock/random/color";

// status color
const getLineStatusColor = (status = null, options = {}) => {
  let colorObj = {};

  if (isNil(status)) {
    return colorObj;
  }

  const { [status]: customizeColorObj = {} } = options || {};

  colorObj = {
    color: '#0161D5',
    bgColor: 'rgba(10,125,245,0.15)',
  };

  if (status === 'IN_PROGRESS' || status === 1) {
    colorObj = {
      color: '#0161D5',
      bgColor: 'rgba(10,125,245,0.15)',
    };
  }

  if (status === 'PAUSED' || status === 2) {
    colorObj = {
      color: '#F06200',
      bgColor: 'rgba(242,128,26,0.10)',
    };
  }

  if (status === 'NOT_START' || status === 3) {
    colorObj = {
      color: '#4E5769',
      bgColor: '#E5E7EC',
    };
  }

  if (status === 'BIDDING_END' || status === 'SUGGESTED' || status === 'FINISHED' || status === 4) {
    colorObj = {
      color: '#179454',
      bgColor: 'rgba(71, 184, 131, 0.15)',
    };
  }

  if (status === 'CLOSED' || status === 'TRIAL_BIDDING' || status === 5) {
    colorObj = {
      color: '#4E5769',
      bgColor: '#F7F8FA',
    };
  }

  if (status === 6) {
    colorObj = {
      color: '#E11900',
      bgColor: 'rgba(225, 25, 0, 0.1)',
    };
  }

  if (!isEmpty(customizeColorObj)) {
    return customizeColorObj;
  }

  return colorObj;
};

const getWarningStatus = (data = {}) => {
  const {
    status,
    statusMeaning,
    actionProcessRemark,
    trialBiddingQueryFlag,
    supplierSupplementStartAndNotQuoted,
    supplierStatus,
    prohibitQuotationDate,
  } = data || {};

  if (!status) {
    return;
  }

  let newStatus = status;

  let trialStatus = 0;

  // let bgColor = "";

  let currentMessage = "";

  if (status === "PAUSED") {
    currentMessage = $T("ssrc.biddingHall.view.title.biddingPausedReason").$D("竞价单已暂停，暂停原因是：") + actionProcessRemark ?? "";
  }

  if (
    status === "BIDDING_END" ||
    status === "FINISHED"
  ) {
    currentMessage = $T("ssrc.biddingHall.view.title.biddingHallHeaderStatus", [ statusMeaning ]).$D("竞价{status}");
  }

  if (status === "CLOSED") {
    currentMessage = `${$T("ssrc.biddingHall.view.title.biddingClosedReason").$D("竞价单已关闭，关闭原因是：")} ${actionProcessRemark ?? ""}`;
  }

  if (trialBiddingQueryFlag === 1 && status === "IN_PROGRESS") {
    // 试竞价
    // 温馨提醒:模拟竞拍为了让用户快速熟悉网络竞价流程，请勿按照真实价格出价
    currentMessage = $T("ssrc.biddingHall.view.title.biddingHallTrialSupplierBiddingStatusAlertMsg").$D("温馨提醒:模拟竞拍为了让用户快速熟悉网络竞价流程，请勿按照真实价格出价");
    trialStatus = 1;
  }

  // 待补充单价
  if (supplierSupplementStartAndNotQuoted) {
    currentMessage = $T("ssrc.biddingHall.view.title.quotedHasFinishedPleaseSupplementaryPrice").$D("竞价已完成, 请补充单价");
  }

  const frohibitFlag = supplierStatus === "PROHIBIT_QUOTATION";
  if (frohibitFlag) {
    currentMessage = $T("ssrc.biddingHall.view.title.biddingHallProhibittedStatusAlertMsg", [ prohibitQuotationDate ]).$D("您在 {prohibitTime} 被禁止报价，如有异议，请联系本次竞价负责人处理");
    newStatus = 6;
  }

  if (currentMessage) {
    const { bgColor: backgroundColor, color } =
      getLineStatusColor(newStatus) || {};

    return {
      currentMessage,
      backgroundColor,
      color,
      trialStatus,
    };
  }
};

const getStatusTagType = (data = {}) => {
  const { status, } = data || {};

  let type = "primary";

  if (!status) {
    return "";
  }

  if (status === "BIDDING_END" || status === "SUGGESTED" || status === "NOT_START" || status === "FINISHED") {
    type = "brown";
  }

  if (status === "PAUSED" || status === 2) {
    type = "warn";
  }

  if (status === "CLOSED" || status === 5) {
    type = "info";
  }

  return type;
};

// bidding status tag render
const biddingStatusRenderTag = (data = {}) => {
  const { status, statusMeaning = "", } = data || {};

  if (!status) {
    return "";
  }

  const { bgColor: backgroundColor, color } = getLineStatusColor(status) || {};
  let type = getStatusTagType(data);

  return <srm-tag size="small" type={type} style={{ backgroundColor, color, }}>{statusMeaning}</srm-tag>;
};

// quotation_range dynamic label
const getQuotationRangeLabel = (data = {}) => {
  let title = "";
  if (isEmpty(data)) {
    return title;
  }

  const { biddingQuotationMethod, floatType } = data || {};

  if (biddingQuotationMethod === "AUCTION") {
    title = $T("ssrc.biddingHall.model.increasePriceRange").$D("加价幅度");
    if (floatType === "ratio") {
      title = $T("ssrc.biddingHall.model.increasePriceRatio").$D("加价比例");
    }
    if (floatType === "money") {
      title = $T("ssrc.biddingHall.model.increasePriceRange").$D("加价幅度");
    }
  }
  if (biddingQuotationMethod === "BIDDING") {
    title = $T("ssrc.biddingHall.model.decreasePriceRange").$D("降价幅度");
    if (floatType === "ratio") {
      title = $T("ssrc.biddingHall.model.decreasePriceRatio").$D("降价比例");
    }
    if (floatType === "money") {
      title = $T("ssrc.biddingHall.model.decreasePriceRange").$D("降价幅度");
    }
  }

  return title;
};

export {
  biddingStatusRenderTag,
  getQuotationRangeLabel,
  getStatusTagType,
  getWarningStatus,
};
