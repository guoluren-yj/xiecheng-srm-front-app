import { $T } from "srm-mobile-ui";

export const getStatusCodeColor = (code) => {
  // let color = "";
  // let backgroundColor = "";
  // let border = "";
  // let borderRadius = "";
  let type = "";
  switch (code) {
  case "10_NEW":
    // 橙色
    type = "warn";
    // color = "rgb(252, 164, 0)";
    // border = "1px solid rgb(254, 244, 226)";
    // backgroundColor = "rgb(254, 244, 226)";
    break;
  case "30_REJECTED":
  case "30_SUP_REJECTED":
    // 红色
    type = "danger";
    // color = "rgb(245, 99, 73)";
    // border = "1px solid rgba(245, 99, 73, 0.21)";
    // backgroundColor = "rgba(245, 99, 73, 0.21)";
    break;
  case "20_SUBMITTED":
  case "40_FINISHED":
  case "35_PUBLISH":
    // 绿色
    type = "success";
    // color = "rgb(71, 184, 131)";
    // border = "1px solid rgb(235, 247, 241)";
    // borderRadius = "5px";
    // backgroundColor = "rgb(235, 247, 241)";
    break;
  case "50_DELETED":
    // 灰色
    type = "info";
    // color = "rgb(89, 89, 89)";
    // border = "1px solid rgb(240, 240, 240)";
    // backgroundColor = "rgb(240, 240, 240)";
    break;
  default:
    break;
  }
  // return {
  //   // color,
  //   // border,
  //   // borderRadius,
  //   // backgroundColor
  // };
  return type;
};

// 获取多语言翻译-中文
export const getLanguage = (key) => {
  const config = {
    header: $T("sinv.receiptWorkbench.view.title.detail.receipHeaderInfo").$D("收货单基础信息"),
    line: $T("sinv.receiptWorkbench.view.title.detail.receipLineInfo").$D("收货单明细行信息"),
    attrment: $T("sinv.receiptWorkbench.view.title.detail.attrmentch").$D("附件"),
  };
  return key ? config[key] : "";
};