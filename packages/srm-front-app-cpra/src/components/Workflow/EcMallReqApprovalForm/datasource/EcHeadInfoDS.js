import { $T } from "srm-mobile-ui";
function EcHeadInfoDS() {
  return {
    autoQuery: false,
    selection: 0,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    fields: [
      {
        fieldCode: "displayPrNum",
        fieldName: $T("sprm.common.displayPrNum").$D("采购申请编号"),
      },
      {
        fieldCode: "prTypeName",
        fieldName: $T("sprm.common.model.common.sqType").$D("申请类型"),
      },
      {
        fieldCode: "amount",
        fieldName: $T("sprm.common.model.common.amount").$D("申请总额"),
      },
      {
        fieldCode: "createByName",
        fieldName: $T("sprm.common.model.common.createdName").$D("创建人"),
      },
      {
        fieldCode: "purchaseAgentName",
        fieldName: $T("sprm.common.model.purchaserName").$D("采购员"),
      },
      {
        fieldCode: "companyName",
        fieldName: $T("sprm.common.model.common.companyName").$D("公司"),
      },
      {
        fieldCode: "ouName",
        fieldName: $T("sprm.common.model.common.ouName").$D("业务实体"),
      },
      {
        fieldCode: "purchaseOrgName",
        fieldName: $T("sprm.common.model.common.purchaseOrgName").$D("采购组织"),
      },
      {
        fieldCode: "prSourcePlatformMeaning",
        fieldName: $T("sprm.common.model.common.prSourcePlatform").$D("单据来源"),
      },
      {
        fieldCode: "prSourcePlatform",
        fieldName: $T("sprm.common.model.common.prSourcePlatform").$D("单据来源"),
      },
      {
        fieldCode: "paymentMethodName",
        fieldName: $T("sprm.common.model.common.paymentMethodCode").$D("支付方式"),
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("sprm.common.model.common.creationTime").$D("创建日期"),
      },
      {
        fieldCode: "lotNum",
        fieldName: $T("sprm.common.model.common.lotNum").$D("批次号"),
      },
      {
        fieldCode: "prRequestedName",
        fieldName: $T("sprm.common.model.common.applicant").$D("申请人"),
        render(val, record) {
          return `${val}-${record.prRequestedNum}`;
        },
      },
      {
        fieldCode: "requestDate",
        fieldName: $T("sprm.common.model.common.requestDate").$D("申请日期"),
      },
      {
        fieldCode: "originalCurrency",
        fieldName: $T("sprm.common.model.common.originalCurrency").$D("原币币种"),
      },
      {
        fieldCode: "remark",
        fieldName: $T("sprm.common.model.common.applyExplain").$D("申请说明"),
      },
    ],
    transport: {},
  };
}

export default EcHeadInfoDS;