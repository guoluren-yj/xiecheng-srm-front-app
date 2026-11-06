import { $T, } from "srm-mobile-ui";

const headerTimerFormatRender = (data = {}) => {
  const {
    status,
    trialBiddingQueryFlag, // 试竞价标识
    currentDateTime,
    signInEndDate,
    headerQuotationEndDate,
    headerQuotationStartDate,
    startingTrialBiddingEndDate,
    startingTrialBiddingStartDate,
    biddingPausedRealTimeStatus = "", // 竞价暂停时单据的实际状态 SIGN_IN TRIAL_BIDDING BIDDING
    // biddingTrialBiddingFlag,
    biddingPausedDate,
    deferBiddingFlag,
    biddingAutoDeferStartDate,
    trialBiddingFlag,
    unitPriceFlag = 0,
  } = data;

  let currentTime = currentDateTime;
  let endTime = null;
  let onlyShowTime = false;
  let emptyEndLabel = $T("ssrc.common.view.message.undetermined").$D("待定");

  const pausedFlag = status === "PAUSED"; // 暂停标识

  let runningTitle = $T("ssrc.biddingHall.view.label.biddingStartTime").$D("竞价开始时间");
  let endTitle = $T("ssrc.common.view.endTime").$D("截止时间");
  endTime = headerQuotationStartDate;
  endTitle = $T("ssrc.biddingHall.view.label.biddingStartTimeOnlyCount").$D("距竞价开始时间仅剩");

  if (status === "SIGN_IN") {
    runningTitle = $T("ssrc.biddingHall.view.label.biddingSignInEndTime").$D("签到结束时间");
    endTime = signInEndDate;
    currentTime = currentDateTime;
    endTitle = $T("ssrc.biddingHall.view.label.biddingSignInEndTimeOnlyCount").$D("距签到结束时间仅剩");
  }

  if (status === "NOT_START") {
    if (trialBiddingQueryFlag) {
      runningTitle = $T("ssrc.biddingHall.view.label.biddingTrialBiddingStartTime").$D("试竞价开始时间");
      endTime = startingTrialBiddingStartDate;
      currentTime = currentDateTime;
      endTitle = $T("ssrc.biddingHall.view.label.biddingTrialStartTimeOnlyCount").$D("距试竞价开始时间仅剩");
    }
  }

  if (status === "IN_PROGRESS") {
    runningTitle = $T("ssrc.biddingHall.view.label.biddingEndTime").$D("竞价截止时间");
    endTime = biddingAutoDeferStartDate ?? headerQuotationEndDate;
    currentTime = currentDateTime;
    endTitle = $T("ssrc.biddingHall.view.label.biddingEndTimeOnlyCount").$D("距竞价结束时间仅剩");

    if (deferBiddingFlag) {
      // 处于延时竞价中
      // 延时竞价中
      runningTitle = $T("ssrc.biddingHall.view.label.deferBiddingEndTime").$D("延时竞价结束时间");
      endTime = headerQuotationEndDate;
      currentTime = currentDateTime;
      endTitle = $T("ssrc.biddingHall.view.label.deferBiddingEndTimeOnlyCount").$D("距延时竞价结束时间仅剩");
    }

    if (trialBiddingQueryFlag) {
      runningTitle = $T("ssrc.biddingHall.view.label.biddingTrialBiddingEndTime").$D("试竞价结束时间");
      endTime = startingTrialBiddingEndDate;
      currentTime = currentDateTime;
      endTitle = $T("ssrc.biddingHall.view.label.biddingTrialEndTimeOnlyCount").$D("距试竞价结束时间仅剩");
    }
  }

  if (status === "PAUSED") {
    currentTime = biddingPausedDate; // 暂停时，以暂停时间代替当前时间

    if (biddingPausedRealTimeStatus === "NOT_START") {
      if (trialBiddingQueryFlag) {
        runningTitle = $T("ssrc.biddingHall.view.label.biddingTrialBiddingStartTime").$D("试竞价开始时间");
        endTime = startingTrialBiddingStartDate;
        currentTime = currentDateTime;
        endTitle = $T("ssrc.biddingHall.view.label.biddingTrialStartTimeOnlyCount").$D("距试竞价开始时间仅剩");
      }

      if (unitPriceFlag) {
        runningTitle = $T("ssrc.biddingHall.view.label.biddingTrialBiddingStartTime").$D("试竞价开始时间");
        endTime = startingTrialBiddingEndDate;
        currentTime = currentDateTime;
        endTitle = $T("ssrc.biddingHall.view.label.biddingTrialStartTimeOnlyCount").$D("距试竞价开始时间仅剩");
      }
    }

    // 未开始
    if (biddingPausedRealTimeStatus === "NOT_START") {
      if (trialBiddingQueryFlag) {
        runningTitle = $T("ssrc.biddingHall.view.label.biddingTrialBiddingStartTime").$D("试竞价开始时间");
        endTime = startingTrialBiddingEndDate;
        currentTime = currentDateTime;
        endTitle = $T("ssrc.biddingHall.view.label.biddingTrialStartTimeOnlyCount").$D("距试竞价开始时间仅剩");
      }

      if (biddingPausedRealTimeStatus === "TRIAL_BIDDING" || trialBiddingQueryFlag) {
        runningTitle = $T("ssrc.biddingHall.view.label.biddingTrialBiddingStartTime").$D("试竞价开始时间");
        endTime = startingTrialBiddingEndDate;
        currentTime = currentDateTime;
        endTitle = $T("ssrc.biddingHall.view.label.biddingTrialStartTimeOnlyCount").$D("距试竞价开始时间仅剩");
      }
    }

    // 签到中暂停
    if (biddingPausedRealTimeStatus === "SIGN_IN") {
      runningTitle = $T("ssrc.biddingHall.view.label.biddingSignInEndTime").$D("签到结束时间");
      endTime = signInEndDate;
      currentTime = currentDateTime;
      endTitle = $T("ssrc.biddingHall.view.label.biddingSignInEndTimeOnlyCount").$D("距签到结束时间仅剩");
    }

    // 试竞价中暂停
    if (biddingPausedRealTimeStatus === "IN_PROGRESS") {
      if (deferBiddingFlag) {
        // 处于延时竞价中
        // 延时竞价中
        runningTitle = $T("ssrc.biddingHall.view.label.deferBiddingEndTime").$D("延时竞价结束时间");
        endTime = headerQuotationEndDate;
        currentTime = currentDateTime;
        endTitle = $T("ssrc.biddingHall.view.label.deferBiddingEndTimeOnlyCount").$D("距延时竞价结束时间仅剩");
      } else {
        runningTitle = $T("ssrc.biddingHall.view.label.biddingEndTime").$D("竞价截止时间");
        endTime = biddingAutoDeferStartDate ?? headerQuotationEndDate;
        currentTime = currentDateTime;
        endTitle = $T("ssrc.biddingHall.view.label.biddingEndTimeOnlyCount").$D("距竞价结束时间仅剩");
      }

      if (trialBiddingQueryFlag) {
        runningTitle = $T("ssrc.biddingHall.view.label.biddingTrialBiddingEndTime").$D("试竞价结束时间");
        endTime = startingTrialBiddingEndDate;
        currentTime = currentDateTime;
        endTitle = $T("ssrc.biddingHall.view.label.biddingTrialEndTimeOnlyCount").$D("距试竞价结束时间仅剩");
      }
    }
  }


  if (status === "BIDDING_END" || status === "FINISHED" || status === "SUGGESTED") {
    runningTitle = null;
    onlyShowTime = true;
    endTime = headerQuotationEndDate;
    currentTime = null;
    endTitle = $T("ssrc.biddingHall.view.label.biddingFinishTime").$D("竞价完成时间");

    if (trialBiddingQueryFlag) {
      runningTitle = null;
      onlyShowTime = true;
      endTime = startingTrialBiddingEndDate;
      currentTime = null;
      endTitle = $T("ssrc.biddingHall.view.label.biddingTrialFinishTime").$D("试竞价完成时间");
    }
  }

  if (status === "CLOSED") {
    runningTitle = null;
    onlyShowTime = true;
    endTime = headerQuotationEndDate;
    currentTime = null;
    endTitle = $T("ssrc.biddingHall.view.label.biddingFinishedTime").$D("竞价结束时间");
  }

  return {
    currentTime,
    endTime,
    runningTitle,
    onlyShowTime,
    emptyEndLabel,
    endTitle,
    pausedFlag: pausedFlag ? 1 : 0,
  };
};

const getHeaderTimer = (props) => {
  const {
    // countDownShowAllZeroFlag,
    data = {},
  } = props || {};

  const {
    displayBiddingSupHeaderStatus,
    trialBiddingQueryFlag, // 试竞价标识
    currentDateTime,
    signInEndDate,
    startingTrialBiddingEndDate,
    headerQuotationEndDate,
    headerQuotationStartDate,
    startingTrialBiddingStartDate,
    biddingPausedRealTimeStatus,
    // biddingTrialBiddingFlag,
    biddingPausedDate,
    biddingAutoDeferStartDate,
    deferBiddingFlag,
  } = data || {};

  const timeRelativeData = {
    status: displayBiddingSupHeaderStatus,
    trialBiddingQueryFlag, // 试竞价标识
    currentDateTime,
    signInEndDate,
    startingTrialBiddingEndDate,
    headerQuotationEndDate,
    headerQuotationStartDate,
    startingTrialBiddingStartDate,
    biddingPausedRealTimeStatus,
    deferBiddingFlag,
    biddingPausedDate,
    biddingAutoDeferStartDate,
  };

  const timer = headerTimerFormatRender(timeRelativeData);
  return timer;
};

const getTimer = (props = {}) => {
  const {
    // countDownShowAllZeroFlag,
    // data = {},
    type = "header",
  } = props || {};

  let timer = {};
  if (type === "header") {
    timer = getHeaderTimer(props);
  }

  console.log(
    timer,
    "header time"
  );

  return timer;
};

export {
  getTimer,
};
