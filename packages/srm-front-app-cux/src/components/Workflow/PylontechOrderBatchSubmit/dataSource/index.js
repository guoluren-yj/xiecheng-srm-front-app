import { SrmUtil, $T } from "srm-mobile-ui";

function headerData() {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "attributeVarchar40",
        fieldName: $T(
          "scux.PylontechOrderBatchSubmitForm.model.attributeVarchar40",
        ).$D("批量审批单据号"),
      },
      {
        fieldCode: "createdByMeaning",
        fieldName: $T(
          "scux.PylontechOrderBatchSubmitForm.model.createdByMeaning",
        ).$D("发起人"),
      },
      {
        fieldCode: "createdUnitIdMeaning",
        fieldName: $T(
          "scux.PylontechOrderBatchSubmitForm.model.createdUnitIdMeaning",
        ).$D("发起部门"),
      },
      {
        fieldCode: "companyName",
        fieldName: $T("scux.PylontechOrderBatchSubmitForm.model.companyName").$D(
          "公司",
        ),
      },
      {
        fieldCode: "totalTaxIncludeAmount",
        fieldName: $T("scux.PylontechOrderBatchSubmitForm.model.totalAmount").$D(
          "订单汇总金额",
        ),
      },
      {
        fieldCode: "maxTaxIncludeAmount",
        fieldName: $T("scux.PylontechOrderBatchSubmitForm.model.maxAmount").$D(
          "订单最大金额",
        ),
      },
      {
        fieldCode: "currencyCode",
        fieldName: $T("scux.PylontechOrderBatchSubmitForm.model.currencyCode").$D(
          "币种",
        ),
      },
      {
        fieldCode: "attributeVarchar1Meaning",
        fieldName: $T(
          "scux.PylontechOrderBatchSubmitForm.model.attributeVarchar1Meaning",
        ).$D("采购类型"),
      },
      {
        fieldCode: "attributeVarchar7Meaning",
        fieldName: $T(
          "scux.PylontechOrderBatchSubmitForm.model.attributeVarchar7Meaning",
        ).$D("合同类型"),
      },
      {
        fieldCode: "attributeVarchar3Meaning",
        fieldName: $T(
          "scux.PylontechOrderBatchSubmitForm.model.attributeVarchar3Meaning",
        ).$D("印章类型"),
      },
      {
        fieldCode: "attributeLongtext1",
        fieldName: $T(
          "scux.PylontechOrderBatchSubmitForm.model.attributeLongtext1",
        ).$D("补充附件"),
      },
      {
        fieldCode: "attributeLongtext8",
        fieldName: $T(
          "scux.PylontechOrderBatchSubmitForm.model.attributeLongtext8",
        ).$D("说明"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/YpDP74B8xtyL9Bicg5AwaZJJDLqws7I7vSGgwTCCD41k?type=header`,
        method: "get",
      },
    },
  };
}

function lineInfoDs() {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "index",
        fieldName: $T("scux.PylontechOrderBatchSubmitForm.model.index").$D("序号"),
      },
      {
        fieldCode: "displayPoNum",
        fieldName: $T("scux.PylontechOrderBatchSubmitForm.model.displayPoNum").$D("订单号"),
      },
      {
        fieldCode: "supplierIdMeaning",
        fieldName: $T("scux.PylontechOrderBatchSubmitForm.model.supplierName").$D("供应商名称"),
      },
      {
        fieldCode: "taxIncludeAmount",
        fieldName: $T("scux.PylontechOrderBatchSubmitForm.model.taxIncludeAmount").$D(
          "订单金额",
        ),
      },
      {
        fieldCode: "attachmentUuid",
        fieldName: $T("scux.PylontechOrderBatchSubmitForm.model.attachmentUuid").$D("附件"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/YpDP74B8xtyL9Bicg5AwaZJJDLqws7I7vSGgwTCCD41k?type=details`,
        method: "get",
      },
    },
  };
}

export { headerData, lineInfoDs };
