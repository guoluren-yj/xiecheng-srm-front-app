import { SrmUtil, $T } from "srm-mobile-ui";

function pcStageDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fields: [
      {
        fieldCode: "stageCode",
        fieldType: "TEXT",
        fieldName: $T("spcm.purchaseContractType.model.stageCode").$D("阶段编码"),
      },
      {
        fieldCode: "stageName",
        fieldType: "TEXT",
        fieldName: $T("spcm.purchaseContractType.model.stageName").$D("阶段名称"),
      },
      {
        fieldCode: "milestoneTime",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.milestoneTime").$D("里程碑时间"),
      },
      {
        fieldCode: "supplierCurrencyName",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.currencyCode").$D("原币币种"),
      },
      {
        fieldCode: "purchaseCurrencyName",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.purchaseCurrencyCode").$D("本币币种"),
      },
      {
        fieldCode: "exchangeRate",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.exchangeRate").$D("汇率:(本币/原币)"),
      },
      {
        fieldCode: "costQuantity",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.supplierCostQuantity").$D("原币费用"),
      },
      {
        fieldCode: "purchaseCostQuantity",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.purchaseCostQuantity").$D("本币费用"),
      },
      {
        fieldCode: "termName",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.paymentTerms").$D("付款条款"),
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.remark").$D("说明"),
      },
      {
        fieldCode: "acceptStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.acceptStatus").$D("验收状态"),
      },
      {
        fieldCode: "acceptListNum",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.acceptListNum").$D("验收单据"),
      },
    ],
    transport: {
      read: {
        url: "/spcm/v1/{tenantId}/contract-report/receiving/stage-accept/detail",
        method: "get",
      },
    },
  };
}

export default pcStageDS;
