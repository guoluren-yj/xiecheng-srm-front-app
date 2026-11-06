import { SrmUtil, $T } from "srm-mobile-ui";

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
        fieldCode: "itemCode",
        fieldType: "TEXT",
        fieldName: $T("scux.magePrice.model.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("scux.magePrice.model.itemName").$D("物料名称"),
      },
      {
        fieldCode: "uomName",
        fieldType: "TEXT",
        fieldName: $T("scux.magePrice.model.uomName").$D("单位"),
      },
      {
        fieldCode: "specs",
        fieldType: "TEXT",
        fieldName: $T("scux.magePrice.model.specs").$D("规格"),
      },
      {
        fieldCode: "implementPrice",
        fieldType: "TEXT",
        fieldName: $T("scux.magePrice.model.implementPrice").$D("执行单价"),
      },
      {
        fieldCode: "unitPrice",
        fieldType: "TEXT",
        fieldName: $T("scux.magePrice.model.unitPrice").$D("临时单价"),
      },
      {
        fieldCode: "unitPrice",
        fieldType: "TEXT",
        fieldName: $T("scux.magePrice.model.unitPrice").$D("原价"),
      },
      {
        fieldCode: "macioTargetPrice",
        fieldType: "TEXT",
        fieldName: $T("scux.magePrice.model.macioTargetPrice").$D("申请单价"),
      },
      {
        fieldCode: "inhibitionRate",
        fieldType: "TEXT",
        fieldName: $T("scux.magePrice.model.inhibitionRate").$D("抑制率(%)"),
      },
      {
        fieldCode: "suppression",
        fieldType: "TEXT",
        fieldName: $T("scux.magePrice.model.suppression").$D("抑制金额"),
      },
      {
        fieldCode: "rfxQuantity",
        fieldType: "TEXT",
        fieldName: $T("scux.magePrice.model.rfxQuantity").$D("分配数量"),
      },
      {
        fieldCode: "quotationExpiryDateFrom",
        fieldType: "TEXT",
        fieldName: $T("scux.magePrice.model.quotationExpiryDateFrom").$D(
          "价格有效期从"
        ),
      },
      {
        fieldCode: "quotationExpiryDateTo",
        fieldType: "TEXT",
        fieldName: $T("scux.magePrice.model.quotationExpiryDateTo").$D(
          "价格有效期至"
        ),
      },
      {
        fieldCode: "sourceDocument",
        fieldType: "TEXT",
        fieldName: $T("scux.magePrice.model.sourceDocument").$D("来源单据"),
      },
      {
        fieldCode: "orderNum",
        fieldType: "TEXT",
        fieldName: $T("scux.magePrice.model.orderNum").$D("采购申请单号"),
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/tsDnbBMa9pKUwbWbuiaibVOlVx2ib38Q58NW4YiaHRkMfAk?id={id}`,
        method: "get",
      },
    },
  };
}

export { lineInfoDs };
