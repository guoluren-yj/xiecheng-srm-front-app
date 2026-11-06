import { $T, SrmUtil } from "srm-mobile-ui";

function headerData(storageHeaderId) {
  return {
    autoQuery: false,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
      storageHeaderId,
    },
    fields: [
      {
        fieldName: $T("scux.inventoryCounting.field.storageHeaderNum").$D("单据编号"),
        fieldCode: "storageHeaderNum",
      },
      {
        fieldName: $T("scux.inventoryCounting.model.title").$D("标题"),
        fieldCode: "title",
      },
      {
        fieldName: $T("scux.inventoryCounting.model.stType").$D("盘点类型"),
        fieldCode: "type",
      },
      {
        fieldName: $T("scux.inventoryCounting.model.stMonth").$D("实盘月份"),
        fieldCode: "stMonth",
      },
      {
        fieldName: $T("scux.inventoryCounting.model.companyName").$D(
          "公司",
        ),
        fieldCode: "companyName",
      },
      {
        fieldName: $T("scux.inventoryCounting.model.ouName").$D(
          "业务实体",
        ),
        fieldCode: "ouName",
      },
      {
        fieldName: $T("scux.inventoryCounting.model.invOrganizationName").$D(
          "库存组织",
        ),
        fieldCode: "invOrganizationName",
      },
      {
        fieldName: $T("scux.inventoryCounting.model.inventoryName").$D("库房"),
        fieldCode: "inventoryName",
      },
      {
        fieldName: $T("scux.inventoryCounting.model.stDate").$D("实盘时间"),
        fieldCode: "stDate",
      },
      {
        fieldName: $T("scux.inventoryCounting.model.createdName").$D("创建人"),
        fieldCode: "createdName",
      },
      {
        fieldName: $T("scux.inventoryCounting.model.creationDate").$D("创建时间"),
        fieldCode: "creationDate",
      },
      {
        fieldName: $T("scux.inventoryCounting.model.documentStatus").$D("单据状态"),
        fieldCode: "statusMeaning",
      },
      {
        fieldName: $T("scux.inventoryCounting.model.stRemark").$D("盘点备注"),
        fieldCode: "remark",
      },
      {
        fieldName: $T("scux.inventoryCounting.model.privateAttachment").$D("内部附件"),
        fieldCode: "attachmentUuid",
      },
      {
        fieldCode: "purchaserInnerAttachmentUuid",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.view.enterAttachment").$D("内部附件"),
        render: (val) => <srm-upload attachmentUuid={val} show-icon color="var(--color-other-default-b)" desc-title={$T("scux.nonCollaborativeSupplier.button.viewAttachments").$D("查看附件")}/>
      },
    ],
    transport: {
      read: {
        url: `/scux2/v1/${SrmUtil.getTenantId()}/ihg/item-storage/header-detail/${storageHeaderId}`,
        method: "get",
      },
    },
  };
}

function lineInfoDs(storageHeaderId) {
  return {
    autoQuery: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: [
      {
        fieldCode: "storageLineNum",
        fieldName: $T("scux.inventoryCounting.field.storageLineNum").$D("行号"),
      },
      {
        fieldCode: "itemCode",
        fieldName: $T("scux.inventoryCounting.field.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "itemName",
        fieldName: $T("scux.inventoryCounting.field.materialName").$D("物料名称"),
      },
      {
        fieldCode: "model",
        fieldName: $T("scux.inventoryCounting.field.model").$D("型号"),
      },
      {
        fieldCode: "price",
        fieldName: $T("scux.inventoryCounting.field.price").$D("单价"),
      },
      {
        fieldCode: "differenceAmount",
        fieldName: $T("scux.inventoryCounting.field.differenceAmount").$D("盈亏金额"),
      },
      {
        fieldCode: "secondaryUomName",
        fieldName: $T("scux.inventoryCounting.field.secondaryUom").$D("辅助计量单位"),
      },
      {
        fieldCode: "categoryCode",
        fieldName: $T("scux.inventoryCounting.field.categoryCode").$D("物料品类编码"),
      },
      {
        fieldCode: "categoryName",
        fieldName: $T("scux.inventoryCounting.field.categoryName").$D("物料品类名称"),
      },
      {
        fieldCode: "specification",
        fieldName: $T("scux.inventoryCounting.field.specification").$D("规格"),
      },
      {
        fieldCode: "currentQuantity",
        fieldName: $T("scux.inventoryCounting.field.currentQuantity").$D("当前库存"),
      },
      {
        fieldCode: "inspectQuantity",
        fieldName: $T("scux.inventoryCounting.field.inspectQuantity").$D("盘点数量"),
      },
      {
        fieldCode: "differenceQuantity",
        fieldName: $T("scux.inventoryCounting.field.differenceQuantity").$D("库存差异"),
      },
      {
        fieldCode: "primaryUomName",
        fieldName: $T("scux.inventoryCounting.field.primaryUomName").$D("单位"),
      },
      {
        fieldCode: "lineRemark",
        fieldName: $T("scux.inventoryCounting.field.lineRemark").$D("盘点备注"),
      },
      {
        fieldCode: "takeResultMeaning",
        fieldName: $T("scux.inventoryCounting.field.takeResult").$D("盘盈盘亏"),
      },
      {
        fieldCode: "periodStartAmount",
        fieldName: $T("scux.inventoryCounting.field.periodStartAmount").$D("期初数"),
      },
      {
        fieldCode: "periodEndAmount",
        fieldName: $T("scux.inventoryCounting.field.periodEndAmount").$D("期末数"),
      },
      {
        fieldCode: "costName",
        fieldName: $T("scux.inventoryCounting.field.cost").$D("成本中心"),
      },
      {
        fieldCode: "invOrganizationName",
        fieldName: $T("scux.inventoryCounting.field.invOrganizationName").$D("库存组织"),
      },
      {
        fieldCode: "inventoryName",
        fieldName: $T("scux.inventoryCounting.field.inventoryName").$D("库房"),
      },
      {
        fieldCode: "orderLineStatusMeaning",
        fieldName: $T("scux.inventoryCounting.field.orderStatusMeaning").$D("出入库单生成状态"),
      },
      {
        fieldCode: "relatedInventory",
        fieldName: $T("scux.inventoryCounting.field.relatedInventorys").$D("关联出入库单号-行号"),
      },
      {
        fieldCode: "orderErrorMessage",
        fieldName: $T("scux.inventoryCounting.field.orderErrorMessage").$D("出入库单生成失败原因"),
      },
      {
        fieldCode: "operation",
        fieldName: $T("scux.inventoryCounting.field.operation").$D("操作"),
      },
    ],
    transport: {
      read: {
        url: `/scux2/v1/${SrmUtil.getTenantId()}/ihg/item-storage/line-detail?storageHeaderId=${storageHeaderId}`,
        method: "get",
      },
    },
  };
}
function attachmentInfo() {
  return {
    // selection: Infinity,
    pageSize: 10,
    enableQuery: false,
    showTotalCount: false,
    editable: true,
    // editFlag: true,
    data: [],
    fields: [
      {
        fieldCode: "purchaserInnerAttachmentUuid",
        fieldType: "TEXT",
        fieldName: $T("spcm.common.view.enterAttachment").$D("内部附件"),
        render: (val) => <srm-upload attachmentUuid={val} show-icon color="var(--color-other-default-b)" desc-title={$T("scux.nonCollaborativeSupplier.button.viewAttachments").$D("查看附件")}/>
      },
    ],
  };
}

export { headerData, attachmentInfo, lineInfoDs };
