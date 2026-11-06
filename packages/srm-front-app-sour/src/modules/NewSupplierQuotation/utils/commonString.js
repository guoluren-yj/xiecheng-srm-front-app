import { $T, DataSet, SrmUtil, } from "srm-mobile-ui";

// 竞价提示信息
const getBiddingApplyInfos = (data = {}) => {
  const { result, } = data || {};
  const {
    biddingSignInFlag,
    supplierNumberPlate, // 号牌
  } = result || {};

  let confirmContent = "";

  if (!biddingSignInFlag) {
    // 未签到
    confirmContent = $T("ssrc.biddingHall.view.title.successBiddingParticipateOnly").$D("恭喜您报名成功, 请点击确定按钮进入竞价大厅");
    if (supplierNumberPlate) {
      confirmContent =
        <span>
          { $T("ssrc.biddingHall.view.successParticipateOpenSupplier", [ supplierNumberPlate ]).$D("恭喜您报名成功, 您的牌号是{supplierNumberPlate}, 请点击确定按钮进入竞价大厅") }
        </span>;
    }
  }

  if (biddingSignInFlag) {
    if (supplierNumberPlate) {
      confirmContent =
        <span>
          {$T("ssrc.biddingHall.view.successSignInAndParticipateOpenSupplier", [ supplierNumberPlate ]).$D(
            "恭喜您报名并签到成功, 您的牌号是{supplierNumberPlate}, 请点击确定按钮进入竞价大厅"
          )}
        </span>;
    }

    if (!supplierNumberPlate) {
      confirmContent = $T("ssrc.biddingHall.view.title.successSignInAndParticipateHiddenPlat").$D("恭喜您报名并签到成功，请点击确定按钮进入竞价大厅");
    }
  }

  return confirmContent;
};

const getBiddingSignMessage = (data = {}) => {
  const { result, } = data || {};
  const {
    biddingSignInFlag,
    supplierNumberPlate, // 号牌
  } = result || {};

  let confirmContent = "";

  if (biddingSignInFlag) {
    if (supplierNumberPlate) {
      confirmContent =
        <span>
          {$T("ssrc.biddingHall.view.successSignInOpenSupplier", [ supplierNumberPlate ]).$D(
            "恭喜您签到成功, 您的牌号是{supplierNumberPlate}, 请点击确定按钮进入竞价大厅"
          )}
        </span>;
    } else {
      confirmContent = $T("ssrc.biddingHall.view.title.successSignInHiddenPlat").$D(
        "恭喜签到成功，请点击确定按钮进入竞价大厅"
      );
    }
  }

  if (!biddingSignInFlag) {
    // 未签到
    if (supplierNumberPlate) {
      confirmContent =
        <span>
          { $T("ssrc.biddingHall.view.title.tokenNumberHavedAndToBiddingHall", [ supplierNumberPlate ]).$D("您的牌号是{supplierNumberPlate}, 请点击确定按钮进入竞价大厅") }
        </span>;
    }
  }

  return confirmContent;
};

export { getBiddingApplyInfos, getBiddingSignMessage };

