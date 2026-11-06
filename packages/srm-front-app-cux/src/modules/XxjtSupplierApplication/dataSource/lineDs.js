import { SrmUtil, $T } from "srm-mobile-ui";

function lineInfoDs() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    // queryParameter: {
    //   ...params
    // },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "targetCode",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.supBidApplication.model.supBidApplication.targetCode"
        ).$D("标的编码"),
      },
      {
        fieldCode: "targetCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.supBidApplication.model.supBidApplication.targetName"
        ).$D("标的名称"),
      },
      {
        fieldCode: "targetClassMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.supBidApplication.model.supBidApplication.targetClass"
        ).$D("标的分级"),
      },
      {
        fieldCode: "supplyAreaName",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.supBidApplication.model.supBidApplication.supplyArea"
        ).$D("供货区域"),
      },
      {
        fieldCode: "validityDateTo",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.supBidApplication.model.supBidApplication.validityDateTo"
        ).$D("有限期至"),
      },
      {
        fieldCode: "supplierTargetStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.supBidApplication.model.supBidApplication.supplierTargetStatus"
        ).$D("状态"),
      },
      {
        fieldCode: "approveStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.supBidApplication.model.supBidApplication.approveStatusMeaning"
        ).$D("审批状态"),
      },
      {
        fieldCode: "supplierOneTimeFlagMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.supBidApplication.model.supBidApplication.supplierOneTimeFlag"
        ).$D("一次性供应商"),
      },
      {
        fieldCode: "developmentFlagMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.supBidApplication.model.supBidApplication.developmentFlag"
        ).$D("研发/新工艺"),
      },
      {
        fieldCode: "contactName",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.supBidApplication.model.supBidApplication.contactName"
        ).$D("联系人姓名"),
      },
      {
        fieldCode: "enterpriseTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.supBidApplication.model.supBidApplication.enterpriseType"
        ).$D("企业类型"),
      },
      {
        fieldCode: "brandName",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.supBidApplication.model.supBidApplication.brand"
        ).$D("品牌"),
      },
      {
        fieldCode: "approvelComment",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.supBidApplication.model.supBidApplication.approvelComment"
        ).$D("审批意见"),
      },
      {
        fieldCode: "lastUpdateUserMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.supBidApplication.model.supBidApplication.lastUpdateUserMeaning"
        ).$D("发起人"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/uhIMaVgLma2rRuRMvdggI6nCGANRs2Bgvp7aQzjov5E?supplierCompanyId={supplierCompanyId}&sourceFrom={sourceFrom}`,
        method: "get",
      },
    },
  };
}

export { lineInfoDs };
