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
        fieldName: $T("scux.orforOrderAllocationApproval.model.num").$D(
          "订单分配单编号"
        ),
        fieldCode: "num",
      },
      {
        fieldName: $T(
          "scux.orforOrderAllocationApproval.model.statusMeaning"
        ).$D("单据状态"),
        fieldCode: "statusMeaning",
      },
      {
        fieldName: $T("scux.orforOrderAllocationApproval.model.processId").$D(
          "流程标识"
        ),
        fieldCode: "processId",
      },
      {
        fieldName: $T(
          "scux.orforOrderAllocationApproval.model.createdByMeaning"
        ).$D("创建人"),
        fieldCode: "createdByMeaning",
      },
      {
        fieldName: $T(
          "scux.orforOrderAllocationApproval.model.creationDate"
        ).$D("创建时间"),
        fieldCode: "creationDate",
      },
      {
        fieldName: $T("scux.orforOrderAllocationApproval.model.prTypeName").$D(
          "运营/采购申请类型"
        ),
        fieldCode: "prTypeName",
      },
      {
        fieldName: $T("scux.orforOrderAllocationApproval.model.fileUuid").$D(
          "分配单行明细"
        ),
        fieldCode: "fileUuid",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/Y2Hs0SXUokdqJUCd3h4qRxrO57iam088yclibbuSl01GcUtByVjGVTOcdyt0n8HplA`,
        method: "get",
      },
    },
  };
}

function lineInfoDs() {
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
        fieldCode: "lastSupplierCompanyNum",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.orforOrderAllocationApproval.model.orforOrderAllocationApproval.lastSupplierCompanyNum"
        ).$D("上次供方"),
      },
      {
        fieldCode: "supplierCompanyIdMeaning",
        fieldType: "TEXT",
        fieldName: $T(
          "scux.orforOrderAllocationApproval.model.orforOrderAllocationApproval.supplierCompanyIdMeaning.new"
        ).$D("此次供方"),
      },
      {
        fieldCode: "poQuantity",
        fieldType: "NUMBER",
        fieldName: $T(
          "scux.orforOrderAllocationApproval.model.orforOrderAllocationApproval.poQuantity"
        ).$D("数量"),
      },
      {
        fieldCode: "totalArbitrage",
        fieldType: "NUMBER",
        fieldName: $T(
          "scux.orforOrderAllocationApproval.model.orforOrderAllocationApproval.totalArbitrage.new"
        ).$D("价差"),
      },
      {
        fieldCode: "taxIncludedLineAmount",
        fieldType: "NUMBER",
        fieldName: $T(
          "scux.orforOrderAllocationApproval.model.orforOrderAllocationApproval.taxIncludedLineAmount"
        ).$D("含税金额"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/qCpchTATua43fZdvx0fzicrOMOuaQcndlqhtGoSEF4dgTiahDph05Jw6ZvrFaHxk0u`,
        method: "post",
      },
    },
  };
}

export { lineInfoDs, headerData };
