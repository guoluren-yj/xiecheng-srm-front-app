import { SrmUtil, $T } from "srm-mobile-ui";

function pcReceiptDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: false,
    queryParameter: { detailFlag: 0 },
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fields: [
      {
        fieldCode: "lineNum",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.lineNum").$D("序号"),
      },
      {
        fieldCode: "statusCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T("spcm.purchaseContractType.model.status").$D("状态"),
      },
      {
        fieldCode: "acceptListNum",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.acceptListNumber").$D("验收单据编号"),
      },
      {
        fieldCode: "title",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.acceptListTitle").$D("验收单据标题"),
      },
      {
        fieldCode: "acceptedQuantity",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.acceptedQuantity").$D("本次验收数量"),
      },
      {
        fieldCode: "acceptorName",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.accepterUserName").$D("验收人"),
      },
      {
        fieldCode: "acceptDate",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.model.common.acceptDate").$D("验收日期"),
      },
    ],
    transport: {
      read: {
        url: "/spcm/v1/{tenantId}/contract-report/receiving/subject-accept/detail",
        method: "get",
      },
    },
  };
}

export default pcReceiptDS;
