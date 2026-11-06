import { SrmUtil, $T } from "srm-mobile-ui";

function amountDatasource(record) {
  return {
    autoQuery: false,
    editable: false,
    enableQuery: false,
    paging: false,
    fields: [
      {
        fieldName: $T("spcm.common.model.common.pcNum").$D("协议编号"),
        fieldCode: "pcNum",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("spcm.common.model.common.pcName").$D("协议名称"),
        fieldCode: "pcName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("spcm.common.model.pcType").$D("协议类型"),
        fieldCode: "pcTypeName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("spcm.starbucks.AmountApprovedThisTime").$D("本次审批金额"),
        fieldCode: "executeApprovalAmount",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("spcm.contractmoney.srfounder").$D("采购申请创建人"),
        fieldCode: "srCreateByRealName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("spcm.contractmoney.contractCreator").$D("协议创建人"),
        fieldCode: "createByRealName",
        fieldType: "TEXT",
      },
      {
        fieldName: $T("hzero.common.status").$D("状态"),
        fieldCode: "pcStatusCodeMeaning",
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/spcm/v1/${SrmUtil.getTenantId()}/purchase-contract-starbucks-cumulative-amount/contract-record`,
        method: "get",
        params: {
          asyncCountFlag: "DEFAULT",
          msaMpaHeaderId: record?.attributeVarchar10,
          supplierCompanyId: record?.supplierCompanyId,
          createCode: record?.attributeVarchar33,
        }
      },
    },
  };
}

export {
  amountDatasource,
};