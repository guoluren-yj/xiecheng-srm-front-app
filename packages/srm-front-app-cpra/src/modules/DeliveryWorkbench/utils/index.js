import { $T } from "srm-mobile-ui";
// 状态颜色
export const getStatusCodeColor = (code) => {
  let color = "";
  // let backgroundColor = "";
  switch (code) {
  case "NEW":
  case "WFL_WITHDRAWN":
  case "CLOSE_APPROVAL":
    // 橙色
    color = "rgb(252, 164, 0)";
    // backgroundColor = "rgb(254, 244, 226)";
    break;
  case "APPROVAL_REJECTED":
  case "WITHDRAWN":
  case "PURCHASER_REJECTED":
  case "SUPPLIER_REJECTED":
    // 红色
    color = "rgb(245, 99, 73)";
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
    color = "rgb(71, 184, 131)";
    // backgroundColor = "rgb(235, 247, 241)";
    break;
  case "CLOSED":
  case "DELETED":
    // 灰色
    color = "rgb(89, 89, 89)";
    // backgroundColor = "rgb(240, 240, 240)";
    break;
  default:
    break;
  }
  return {
    color,
    // backgroundColor
  };
};

// 获取多语言翻译-中文
export const getLanguage = (key) => {
  const config = {
    logisticsInfo: $T("slod.common.view.panel.logisticsInfo").$D("物流信息"),
    logisticsBtn: $T("slod.common.view.panel.refreshLogisticsInfo").$D("刷新物流信息"),
    update: $T("slod.common.view.panel.update").$D("最近更新"),
    map: $T("slod.common.view.panel.map").$D("轨迹地图"),
    basicInfo: $T("slod.common.view.panel.basicInfo").$D("基本信息"),
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
export const getCustomize = (key, hdKey, commonInfo) => {
  const { nodeTemplateCode, customerUnitCode } = commonInfo;
  const configAbc = nodeTemplateCode !== "ASN" ? `_${customerUnitCode?.slice(-1)}` : "";
  let customCode = null;
  switch (key) {
  case "create":
    customCode = `SMBL.DELIVERY_WORKBENCH.${nodeTemplateCode}${configAbc}.CREATE.CARD`;
    break;
  case "listcreate":
    customCode = `SMBL.DELIVERY_WORKBENCH.${nodeTemplateCode}${configAbc}.CREATE.LIST`;
    break;
  case "submit":
    customCode = `SMBL.DELIVERY_WORKBENCH.${nodeTemplateCode}${configAbc}.SUBMIT.CARD`;
    break;
  case "affirm":
    if (hdKey === "left") {
      customCode = `SMBL.DELIVERY_WORKBENCH.${nodeTemplateCode}${configAbc}.AFFIRM.CARD_D`;
    } else {
      customCode = `SMBL.DELIVERY_WORKBENCH.${nodeTemplateCode}${configAbc}.AFFIRM.CARD_H`;
    }
    break;
  case "listaffirm":
    if (hdKey === "left") {
      customCode = null;
    } else {
      customCode = `SMBL.DELIVERY_WORKBENCH.${nodeTemplateCode}${configAbc}.AFFIRM.LIST_H`;
    }
    break;
  case "all":
    if (hdKey === "left") {
      customCode = `SMBL.DELIVERY_WORKBENCH.${nodeTemplateCode}${configAbc}.ALL.CARD_D`;
    } else {
      customCode = `SMBL.DELIVERY_WORKBENCH.${nodeTemplateCode}${configAbc}.ALL.CARD_H`;
    }
    break;
  case "listall":
    if (hdKey === "left") {
      customCode = null;
    } else {
      customCode = `SMBL.DELIVERY_WORKBENCH.${nodeTemplateCode}${configAbc}.ALL.LIST_H`;
    }
    break;
  default:
    return;
  }
  return customCode;
};

// 获取列表个性化单元编码
export const getDetailCustomize = (commonInfo, key) => {
  const { node = "", customizeUnitCode = "" } = commonInfo;
  let customCode = null;
  const configAbc = node !== "ASN" ? `_${customizeUnitCode?.slice(-1)}` : "";
  switch (key) {
  case "basicInfo":
    customCode = `SMBL.DELIVERY_WORKBENCH.${node}${configAbc}.BASIC.CARD`;
    break;
  case "basicInfoDetail":
    customCode = `SMBL.DELIVERY_WORKBENCH.${node}${configAbc}.BASIC.DETAIL`;
    break;
  case "shipInfo":
    customCode = "SMBL.DELIVERY_WORKBENCH.ASN.SHIP.CARD";
    break;
  case "shipInfoDetail":
    customCode = "SMBL.DELIVERY_WORKBENCH.ASN.SHIP.DETAIL";
    break;
  case "receiveInfo":
    customCode = "SMBL.DELIVERY_WORKBENCH.ASN.RECEIVE.CARD";
    break;
  case "receiveInfoDetail":
    customCode = "SMBL.DELIVERY_WORKBENCH.ASN.RECEIVE.DETAIL";
    break;
  case "lineInfo":
    customCode = `SMBL.DELIVERY_WORKBENCH.${node}${configAbc}.LINE.CARD`;
    break;
  case "lineInfoDetail":
    customCode = `SMBL.DELIVERY_WORKBENCH.${node}${configAbc}.LINE.DETAIL`;
    break;
  case "attachInfo":
    customCode = "SMBL.DELIVERY_WORKBENCH.ASN.ATTACH.CARD";
    break;
  default:
    return;
  }
  return customCode;
};