import { $T } from "srm-mobile-ui";
// 状态颜色
export const getStatusCodeColor = (code) => {
  // let color = "";
  // let backgroundColor = "";
  // let border = "";
  // let borderRadius = "";
  let type = "";
  switch (code) {
  case "NEW":
  case "WFL_WITHDRAWN":
  case "CLOSE_APPROVAL":
    // 橙色
    type = "warn";
    // color = "rgb(252, 164, 0)";
    // border = "1px solid rgb(254, 244, 226)";
    // backgroundColor = "rgb(254, 244, 226)";
    break;
  case "APPROVAL_REJECTED":
  case "WITHDRAWN":
  case "PURCHASER_REJECTED":
  case "SUPPLIER_REJECTED":
    // 红色
    type = "danger";
    // color = "rgb(245, 99, 73)";
    // border = "1px solid rgba(245, 99, 73, 0.21)";
    // backgroundColor = "rgba(245, 99, 73, 0.21)";
    break;
  case "PURCHASER_SUBMITTED":
  case "SUPPLIER_SUBMITTED":
  case "PURCHASER_PUBLISHED":
  case "SUPPLIER_PUBLISHED":
  case "PART_PROCESSED":
  case "PURCHASER_FEEDBACK":
  case "CONFIRMED":
  case "SUPPLIER_FEEDBACK":
    // 绿色
    type = "success";
    // color = "rgb(71, 184, 131)";
    // border = "1px solid rgb(235, 247, 241)";
    // borderRadius = "5px";
    // backgroundColor = "rgb(235, 247, 241)";
    break;
  case "CLOSED":
  case "DELETED":
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
    logisticsInfo: $T("slod.common.view.panel.logisticsInfo").$D("物流信息"),
    logisticsBtn: $T("slod.common.view.panel.refreshLogisticsInfo").$D("刷新物流信息"),
    update: $T("slod.common.view.panel.update").$D("最近更新"),
    map: $T("slod.common.view.panel.map").$D("轨迹地图"),
    basicInfo: $T("slod.common.view.panel.basicInfo").$D("基础信息"),
    shipInfo: $T("slod.common.view.panel.shipInfo").$D("发货信息"),
    receiveInfo: $T("slod.common.view.panel.receiveInfo").$D("收货信息"),
    attachInfo: $T("slod.common.view.panel.attachInfo").$D("附件信息"),
    operating: $T("slod.common.model.common.operating").$D("操作记录"),
    lineInfo: $T("slod.common.view.panel.lineInfo").$D("明细信息"),
    handleLine: $T("slod.common.view.button.handleLine").$D("待处理"),
    allLine: $T("slod.common.view.button.allLine").$D("全部")
  };
  return key ? config[key] : "";
};

// 获取列表个性化单元编码
export const getCustomize = (key, node) => {
  console.log(node, "node 节点外侧");
  let customCode = null;
  switch (key) {
  case "basicInfo":
    customCode = `SMBL.WORKFLOW.DELIVERY_WORKBENCH.${node}.BASIC.CARD`;
    break;
  case "basicInfoDetail":
    customCode = `SMBL.WORKFLOW.DELIVERY_WORKBENCH.${node}.BASIC.DETAIL`;
    break;
  case "shipInfo":
    customCode = `SMBL.WORKFLOW.DELIVERY_WORKBENCH.${node}.SHIP.CARD`;
    break;
  case "shipInfoDetail":
    customCode = `SMBL.WORKFLOW.DELIVERY_WORKBENCH.${node}.SHIP.DETAIL`;
    break;
  case "receiveInfo":
    customCode = `SMBL.WORKFLOW.DELIVERY_WORKBENCH.${node}.RECEIVE.CARD`;
    break;
  case "receiveInfoDetail":
    customCode = `SMBL.WORKFLOW.DELIVERY_WORKBENCH.${node}.RECEIVE.DETAIL`;
    break;
  case "lineInfo":
    customCode = `SMBL.WORKFLOW.DELIVERY_WORKBENCH.${node}.LINE.CARD`;
    break;
  case "lineInfoDetail":
    customCode = `SMBL.WORKFLOW.DELIVERY_WORKBENCH.${node}.LINE.DETAIL`;
    break;
  case "attachInfo":
    customCode = `SMBL.WORKFLOW.DELIVERY_WORKBENCH.${node}.ATTACH.CARD`;
    break;
  default:
    return;
  }
  return customCode;
};

// 获取列表个性化单元编码
export const getDetailCustomize = (key, node) => {
  console.log(node, "node 节点");
  let customCode = null;
  switch (key) {
  case "basicInfoDetail":
    customCode = `SMBL.WORKFLOW.DELIVERY_WORKBENCH.${node}.BASIC.DETAIL`;
    break;
  case "shipInfoDetail":
    customCode = `SMBL.WORKFLOW.DELIVERY_WORKBENCH.${node}.SHIP.DETAIL`;
    break;
  case "receiveInfoDetail":
    customCode = `SMBL.WORKFLOW.DELIVERY_WORKBENCH.${node}.RECEIVE.DETAIL`;
    break;
  case "lineInfoDetail":
    customCode = `SMBL.WORKFLOW.DELIVERY_WORKBENCH.${node}.LINE.DETAIL`;
    break;
  default:
    return;
  }
  return customCode;
};