import { SrmUtil, $T } from "srm-mobile-ui";

function lineInfoDs () {
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
        fieldCode: "shiftNumber",
        fieldType: "TEXT",
        fieldName: $T("scux.marginTransfer.model.shiftNumber").$D("保证金转移单号"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T("scux.marginTransfer.model.companyName").$D("公司"),
      },
      {
        fieldCode: "shiftTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("scux.marginTransfer.model.depositType").$D("保证金类型"),
      },
      {
        fieldCode: "supplierCompanyCode",
        fieldType: "TEXT",
        fieldName: $T("scux.marginTransfer.model.supplierCompanyCode").$D("供应商编码"),
      },
      {
        fieldCode: "supplierCompanyName",
        fieldType: "TEXT",
        fieldName: $T("scux.marginTransfer.model.supplierCompanyName").$D("供应商名称"),
      },
      {
        fieldCode: "shiftDepositAmount",
        fieldType: "TEXT",
        fieldName: $T("scux.marginTransfer.model.shiftDepositAmount").$D("保证金金额"),
      },
      {
        fieldCode: "ouName",
        fieldType: "TEXT",
        fieldName: $T("scux.marginTransfer.model.ouName").$D("业务实体"),
      },
      {
        fieldCode: "rfxNum",
        fieldType: "TEXT",
        fieldName: $T("scux.marginTransfer.model.rfxNum").$D("招标书编号"),
      },
      {
        fieldCode: "rfxTitle",
        fieldType: "TEXT",
        fieldName: $T("scux.marginTransfer.model.rfxTitle").$D("招标项目名称"),
      },
      {
        fieldCode: "applyUserName",
        fieldType: "TEXT",
        fieldName: $T("scux.marginTransfer.model.applyUserName").$D("申请人"),
      },
      {
        fieldCode: "pcNum",
        fieldType: "TEXT",
        fieldName: $T("scux.marginTransfer.model.pcNum").$D("合同编号"),
      },
      {
        fieldCode: "pcName",
        fieldType: "TEXT",
        fieldName: $T("scux.marginTransfer.model.pcName").$D("合同名称"),
      },
      {
        fieldCode: "typeCodeMeaning",
        fieldType: "TEXT",
        fieldName: $T("scux.marginTransfer.model.typeName").$D("结算方式"),
      },
      {
        fieldCode: "shiftComments",
        fieldType: "TEXT",
        fieldName: $T("scux.marginTransfer.model.shiftComments").$D("备注"),
      },
    ],
    transport: {
      read: {
        url: `/scux/v1/${SrmUtil.getTenantId()}/yx-deposit-shifts/line/{shiftId}`,
        method: "get",
      },
    },
  };
}

export {
  lineInfoDs,
};