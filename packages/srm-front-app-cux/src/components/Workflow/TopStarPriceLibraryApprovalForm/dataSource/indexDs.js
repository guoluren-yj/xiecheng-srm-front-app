import { SrmUtil, $T } from "srm-mobile-ui";

function lineInfoDs() {
  return {
    autoQuery: false,
    paging: false,
    editable: false,
    editFlag: false,
    enableQuery: false,
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldName: $T("scux.pricelibrary.model.pricelibrary.sourceNum").$D(
          "来源单号"
        ),
        fieldCode: "sourceNum",
      },
      {
        fieldName: $T("scux.pricelibrary.model.pricelibrary.createdByName").$D(
          "创建人"
        ),
        fieldCode: "createdByName",
      },
      {
        fieldName: $T(
          "scux.pricelibrary.model.pricelibrary.priceCategoryMeaning"
        ).$D("价格类型"),
        fieldCode: "priceCategoryMeaning",
      },
      {
        fieldName: $T("scux.pricelibrary.model.pricelibrary.remark").$D(
          "附注记录信息"
        ),
        fieldCode: "remark",
      },
      {
        fieldName: $T("scux.pricelibrary.model.pricelibrary.supplierName").$D(
          "ERP供应商名称"
        ),
        fieldCode: "supplierName",
      },
      {
        fieldName: $T(
          "scux.pricelibrary.model.pricelibrary.invOrganizationName"
        ).$D("库存组织"),
        fieldCode: "invOrganizationName",
      },
      {
        fieldName: $T("scux.pricelibrary.model.pricelibrary.itemCode").$D(
          "物料编码"
        ),
        fieldCode: "itemCode",
      },
      {
        fieldName: $T("scux.pricelibrary.model.pricelibrary.itemName").$D(
          "物料名称"
        ),
        fieldCode: "itemName",
      },
      {
        fieldName: $T(
          "scux.pricelibrary.model.pricelibrary.priceBatchQuantity"
        ).$D("价格批量"),
        fieldCode: "priceBatchQuantity",
      },
      {
        fieldName: $T("scux.pricelibrary.model.pricelibrary.unitPrice").$D(
          "单价(未税)"
        ),
        fieldCode: "unitPrice",
      },
      {
        fieldName: $T(
          "scux.pricelibrary.model.pricelibrary.quotationExpiryDateFrom"
        ).$D("有效期从"),
        fieldCode: "quotationExpiryDateFrom",
        // fieldType: "DATE",
      },
      {
        fieldName: $T(
          "scux.pricelibrary.model.pricelibrary.quotationExpiryDateTo"
        ).$D("有效期至"),
        fieldCode: "quotationExpiryDateTo",
        // fieldType: "DATE",
      },
      {
        fieldName: $T("scux.pricelibrary.model.pricelibrary.taxRate").$D(
          "税率(%)"
        ),
        fieldCode: "taxRate",
      },
      {
        fieldName: $T("scux.pricelibrary.model.pricelibrary.taxCode").$D(
          "税码"
        ),
        fieldCode: "taxCode",
      },
      {
        fieldName: $T("scux.pricelibrary.model.pricelibrary.uomNum").$D(
          "价格单位"
        ),
        fieldCode: "uomNum",
      },
      {
        fieldName: $T("scux.pricelibrary.model.pricelibrary.currencyCode").$D(
          "币种"
        ),
        fieldCode: "currencyCode",
      },
      {
        fieldName: $T("scux.pricelibrary.model.pricelibrary.ouName").$D(
          "业务实体"
        ),
        fieldCode: "ouName",
      },
      {
        fieldName: $T(
          "scux.pricelibrary.model.pricelibrary.purOrganizationName"
        ).$D("采购组织编码"),
        fieldCode: "purOrganizationName",
      },
      {
        fieldName: $T(
          "scux.pricelibrary.model.pricelibrary.purchaseAgentName"
        ).$D("采购组"),
        fieldCode: "purchaseAgentName",
      },
    ],
    transport: {
      read: {
        url: `/marmot/v1/${SrmUtil.getTenantId()}/marmot-api/Mbw4h1EzfrTTsdp0r4wPUyn93YPZmicvV0QrDkhgHibtA`,
        method: "GET",
      },
    },
  };
}
export { lineInfoDs };
