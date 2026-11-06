import { SrmUtil, $T } from "srm-mobile-ui";

function createDS() {
  return {
    autoQuery: true,
    selection: Infinity,
    editFlag: true,
    queryParameter: {
      customizeUnitCode:
        "SODR.PLAN_SHEET_CREATE.FEEDBACK.LIST_NEW,SODR.PLAN_SHEET_CREATE.FEEDBACK.QUERY_FORM",
    },
    pathParameter: { tenantId: SrmUtil.getTenantId() },
    fields: [
      {
        fieldCode: "serialNum",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.orderSeq").$D("序号"),
      },
      {
        fieldCode: "planStatus",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.planStatusMeaning").$D("状态"),
      },
      {
        fieldCode: "planStatusMeaning",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.planStatusMeaning").$D("状态"),
      },
      {
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.itemName").$D("物料名称"),
      },
      {
        fieldCode: "supplierCompanyCode",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.supplierCode").$D("供应商编码"),
      },
      {
        fieldCode: "supplierCompanyName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.supplierName").$D("供应商名称"),
      },
      {
        fieldCode: "categoryName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.categoryName").$D("物料分类"),
      },
      {
        fieldCode: "availableQuantity",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.availableQuantity").$D(
          "可计划数量"
        ),
      },
      {
        fieldCode: "planQuantity",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sodr.common.model.common.planQuantity").$D(
          "本次计划数量"
        ),
        required: true,
        editor: true,
      },
      {
        fieldCode: "planDate",
        fieldType: "DATE_PICKER",
        fieldName: $T("sodr.common.model.common.planDate").$D(
          "本次计划到货日期"
        ),
        options: {
          format: "yyyy-MM-dd",
        },
        required: true,
        editor: true,
      },
      {
        fieldCode: "supplierRemark",
        fieldType: "INPUT",
        fieldName: $T("sodr.common.model.common.supplierHeaderRemark").$D(
          "供应商备注"
        ),
      },
      {
        fieldCode: "purchaserRemark",
        fieldType: "INPUT",
        fieldName: $T("sodr.common.model.common.purchaserHeaderRemark").$D(
          "采购方备注"
        ),
      },
      {
        fieldCode: "displayPoNum",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.orderNum").$D("订单号"),
      },
      {
        fieldCode: "lineNum",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.displayPoLineNum").$D(
          "订单行号"
        ),
      },
      {
        fieldCode: "lineLocationNum",
        fieldType: "TEXT",
        fieldName: $T(
          "sodr.common.model.common.orderDisplayLineLocationNum"
        ).$D("订单发运号"),
      },
      {
        fieldCode: "netReceivedQuantity",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("sodr.common.model.common.netReceivedQuantitys").$D(
          "净接收数量"
        ),
      },
      {
        fieldCode: "sendingQuantity",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.sendingQuantity").$D(
          "送货中数量"
        ),
      },
      {
        fieldCode: "uomName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.uomCode").$D("单位"),
      },
      {
        fieldCode: "needByDate",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.needDate").$D("需求日期"),
      },
      {
        fieldCode: "promiseDeliveryDate",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.promisedDate").$D(
          "承诺交货日期"
        ),
      },
      {
        fieldCode: "purchaseAgentName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.purchaser").$D("采购员"),
      },
      {
        fieldCode: "companyName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.customer").$D("客户"),
      },
      {
        fieldCode: "invOrganizationName",
        fieldType: "TEXT",
        fieldName: $T("sodr.orderMaintain.sourceFrom.invOrganizationId").$D(
          "库存组织"
        ),
      },
      {
        fieldCode: "inventoryName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.inventoryName").$D("库房"),
      },
      {
        fieldCode: "shipToThirdPartyAddress",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.shipToThirdPartyAddressOne").$D(
          "交货地址"
        ),
      },
      {
        fieldCode: "asnNums",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.asnNums").$D("关联送货单"),
      },
      {
        fieldCode: "creationDate",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.createDate").$D("创建时间"),
      },
      {
        fieldCode: "createdByName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.creator").$D("创建人"),
      },
    ],
    fastQueryField: [
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.itemDescription").$D(
          "物料名称"
        ),
      },
      {
        fieldCode: "poNum",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.orderNum").$D("订单号"),
      },
      {
        fieldCode: "lineNum",
        fieldType: "TEXT",
        fieldName: $T("sodr.common.model.common.displayPoLineNum").$D(
          "订单行号"
        ),
      },
    ],
    transport: {
      read: {
        url: "/spuc/v1/{tenantId}/plans/poline/supplier/list",
        method: "get",
      },
      submit: {
        url: "/spuc/v1/{tenantId}/plans/batch/publish",
        method: "put",
      },
      update: {
        url: "/spuc/v1/{tenantId}/plans/batch",
        method: "put",
      },
    },
  };
}

export default createDS;
