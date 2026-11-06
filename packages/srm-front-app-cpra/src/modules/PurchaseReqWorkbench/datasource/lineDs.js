// 申请明细信息
import { SrmUtil, $T } from "srm-mobile-ui";
import { getAttributeApi, getCategoryApi } from "../api";
import { getCreationApi, getUomControlApi, getUomQuantityApi } from "../api/config";

function lineDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    fields: [
      {
        fieldCode: "displayLineNum",
        fieldName: $T("sprm.common.model.common.displayLineNum").$D("行号"),
      },
      {
        fieldCode: "invOrganizationName",
        fieldName: $T("sprm.common.model.common.invOrganizationName").$D("库存组织"),
        fieldType: "LOV",
        lovCode: "SPFM.USER_AUTH.INVORG",
        options: {
          displayField: "organizationName",
          subDisplayField: "organizationCode",
          valueField: "organizationName",
          queryParams: {
            tenantId: SrmUtil.getTenantId(),
            enabledFlag: 1,
            ouId: null,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField(
                "invOrganizationName",
                val[0].organizationName
              );
              ds.current.setField("invOrganizationId", val[0].organizationId);
              if (ds.current.data["itemLimit"].includes("invOrganizationId")) {
                const itemCode = ds.current.getField("itemCode");
                itemCode.options.queryParams["invOrganizationId"] =
                  val[0].organizationId;
              }
            }
          },
          onClear: (ds) => {
            ds.current.setField("invOrganizationName", null);
            ds.current.setField("invOrganizationId", null);
            if (ds.current.data["itemLimit"].includes("invOrganizationId")) {
              ds.current.setField("itemCode", null);
              ds.current.setField("itemName", null);
              ds.current.setField("itemId", null);
              ds.current.setField("itemSpecs", null);
              ds.current.setField("itemModel", null);
              ds.current.setField("categoryId", null);
              ds.current.setField("categoryName", null);
              ds.current.setField("categoryLov", null);
              ds.current.setField("customMadeFlag", null);
              ds.current.setField("uomName", null);
              ds.current.setField("uomCode", null);
              ds.current.setField("uomId", null);
              ds.current.setField("taxCode", null);
              ds.current.setField("taxId", null);
              ds.current.setField("taxRate", null);
              ds.current.setField("taxLov", null);
              ds.current.setField("customAttributeList", null);
              const itemCode = ds.current.getField("itemCode");
              itemCode.options.queryParams["invOrganizationId"] = null;
            }
          },
        },
        required: true,
      },
      {
        fieldCode: "itemCode",
        fieldName: $T("sprm.common.model.common.itemCode").$D("物料编码"),
        fieldType: "LOV",
        lovCode: "SPRM.ITEM_RELATE_PUR_PRICE",
        options: {
          displayField: "itemCode",
          subDisplayField: "itemName",
          valueField: "itemCode",
          queryParams: {
            enabledFlag: 1,
            tenantId: SrmUtil.getTenantId(),
            companyId: null,
            prTypeId: null,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              const { secondaryUomId, uomId, secondaryUomCode, uomCode, secondaryUomName, uomName, secondaryUomCodeAndName, uomCodeAndName } = val[0];
              if (val[0].customMadeFlag === 1) {
                getAttributeApi({
                  customMadeFlag: val[0].customMadeFlag,
                  itemId: val[0].itemId,
                }).then((res) => {
                  ds.current.setField("customAttributeList", [ ...res ]);
                });
              }
              getCategoryApi(val[0].itemId, {
                defaultFlag: 1,
                enabledFlag: 1,
              }).then((res) => {
                if (res && res.length === 1) {
                  ds.current.setField("categoryId", res[0].categoryId);
                  ds.current.setField("categoryName", res[0].categoryName);
                  ds.current.setField("categoryLov", res[0]);
                }
              });
              ds.current.setField("itemCode", val[0].itemCode);
              ds.current.setField("itemName", val[0].itemName);
              ds.current.setField("itemId", val[0].itemId);
              ds.current.setField("itemSpecs", val[0].specifications);
              ds.current.setField("itemModel", val[0].model);
              ds.current.setField("customMadeFlag", val[0].customMadeFlag);
              ds.current.setField("uomCodeAndName", val[0].uomName);
              ds.current.setField("secondaryUomId", secondaryUomId || uomId);
              ds.current.setField("secondaryUomCode", secondaryUomCode || uomCode);
              ds.current.setField("secondaryUomCodeAndName", secondaryUomCodeAndName || uomCodeAndName);
              ds.current.setField("secondaryUomName", secondaryUomName || uomName);
              if (ds.current.data["uomDisplay"] === 1) {
                ds.current.setField("uomCodeAndName", `${uomCode}/${uomName}`);
                ds.current.setField("secondaryUomCodeAndName", secondaryUomId ? `${secondaryUomCode}/${secondaryUomName}` : `${uomCode}/${uomName}`);
              }
              ds.current.setField("uomName", val[0].uomName);
              ds.current.setField("uomCode", val[0].uomCode);
              ds.current.setField("uomId", val[0].uomId);
              ds.current.setField("taxCode", val[0].taxCode);
              ds.current.setField("taxId", val[0].taxId);
              ds.current.setField("taxRate", val[0].taxRate);
              ds.current.setField("lastPurchasePrice", val[0].lastPurchasePrice);
              if (secondaryUomId && uomId && ds.current.get("secondaryQuantity")) {
                getUomQuantityApi([
                  {
                    businessKey: ds.current.get("prLineId") || 1,
                    secondaryUomId: val[0].uomId,
                    secondaryQuantity: ds.current.get("secondaryQuantity"),
                    doublePrimaryUomId: ds.current.get("uomId"),
                    itemId: ds.current.get("itemId"),
                  },
                ]).then((res) => {
                  if (res && !res.failed) {
                    ds.current.setField("quantity", res[0].primaryQuantity);
                  }
                });
              }
            }
          },
          onClear: (ds) => {
            ds.current.setField("itemCode", null);
            ds.current.setField("itemName", null);
            ds.current.setField("itemId", null);
            ds.current.setField("itemSpecs", null);
            ds.current.setField("itemModel", null);
            ds.current.setField("categoryId", null);
            ds.current.setField("categoryName", null);
            ds.current.setField("categoryLov", null);
            ds.current.setField("customMadeFlag", null);
            ds.current.setField("uomCodeAndName", null);
            ds.current.setField("uomName", null);
            ds.current.setField("uomCode", null);
            ds.current.setField("uomId", null);
            ds.current.setField("taxCode", null);
            ds.current.setField("taxId", null);
            ds.current.setField("taxRate", null);
            ds.current.setField("taxLov", null);
            ds.current.setField("customAttributeList", null);
            ds.current.setField("lastPurchasePrice", null);
          },
        },
        disabled: (val, item) => {
          if (item.itemLimit) {
            if (item.itemLimit.includes("invOrganizationId") && !item["invOrganizationId"]) {
              return true;
            }
            if (item.itemLimit.includes("categoryId") && !item["categoryId"]) {
              return true;
            }
            return item["prSourcePlatform"] !== "SRM" && item["prSourcePlatform"];
          }
          return false;
        },
      },
      {
        fieldCode: "itemName",
        fieldName: $T("sprm.common.model.common.itemName").$D("物料名称"),
        fieldType: "INPUT",
        required: true,
      },
      {
        fieldCode: "itemModel",
        fieldType: "INPUT",
        disabled: (val, item) => item["prSourcePlatform"] !== "SRM" && item["prSourcePlatform"],
        fieldName: $T("sprm.common.model.common.itemModel").$D("型号"),
      },
      {
        fieldCode: "itemSpecs",
        fieldType: "INPUT",
        disabled: (val, item) => item["prSourcePlatform"] !== "SRM" && item["prSourcePlatform"],
        fieldName: $T("sprm.common.model.common.itemSpecs").$D("规格"),
      },
      {
        fieldCode: "categoryName",
        fieldName: $T("sprm.common.model.common.categoryName").$D("物料分类"),
        fieldType: "LOV",
        lovCode: "SPRM.ITEM_CATEGOR_TILED",
        options: {
          displayField: "categoryName",
          subDisplayField: "categoryCode",
          valueField: "categoryName",
          queryParams: {
            enabledFlag: 1,
            purchaseOrgId: null,
            queryCategoryId: null,
            prTypeId: null,
            itemId: null,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("categoryName", val[0].categoryName);
              ds.current.setField("categoryId", val[0].categoryId);
              if (ds.current.data["itemLimit"].includes("categoryId")) {
                const itemCode = ds.current.getField("itemCode");
                itemCode.options.queryParams["categoryId"] = val[0].categoryId;
              }
            }
          },
          onClear: (ds) => {
            ds.current.setField("categoryName", null);
            ds.current.setField("categoryId", null);
            if (ds.current.data["itemLimit"].includes("categoryId")) {
              ds.current.setField("itemCode", null);
              ds.current.setField("itemName", null);
              ds.current.setField("itemId", null);
              ds.current.setField("itemSpecs", null);
              ds.current.setField("itemModel", null);
              ds.current.setField("categoryId", null);
              ds.current.setField("categoryName", null);
              ds.current.setField("categoryLov", null);
              ds.current.setField("customMadeFlag", null);
              ds.current.setField("uomName", null);
              ds.current.setField("uomCode", null);
              ds.current.setField("uomId", null);
              ds.current.setField("taxCode", null);
              ds.current.setField("taxId", null);
              ds.current.setField("taxRate", null);
              ds.current.setField("taxLov", null);
              ds.current.setField("customAttributeList", null);
              const itemCode = ds.current.getField("itemCode");
              itemCode.options.queryParams["categoryId"] = null;
            }
          },
        },
      },
      {
        fieldCode: "customMadeFlag",
        fieldName: $T("sprm.common.model.common.customMadeFlag").$D("是否定制"),
        render: (val) => val === 1 ? $T("hipspfm.common.status.yes").$D("是") : $T("hipspfm.common.status.no").$D("否"),
      },
      {
        fieldCode: "customAttributeList",
        fieldName: $T("sprm.common.model.common.customAttributeList").$D(
          "物料定制属性"
        ),
        render: (val, item) =>
          item.customMadeFlag === 1 ?
            <span style="color: var(--color-other-default-b)">
              {$T("hipspfm.common.button.view").$D("查看")}
            </span> :
            "-"
        ,
      },
      {
        fieldCode: "neededDate",
        fieldName: $T("sprm.common.model.common.neededDate").$D("需求日期"),
        fieldType: "DATE",
        required: true,
      },
      {
        fieldCode: "productNum",
        disabled: (val, item) => item["freightLineFlag"] === 1,
        fieldName: $T("sprm.common.model.common.productNum").$D("商品编码"),
      },
      {
        fieldCode: "productName",
        disabled: (val, item) => item["freightLineFlag"] === 1,
        fieldName: $T("sprm.common.model.common.productName").$D("商品名称"),
      },
      {
        fieldCode: "thirdSkuCode",
        fieldName: $T("sprm.common.model.common.thirdSkuCode").$D("第三方商品编码"),
      },
      {
        fieldCode: "thirdSkuName",
        fieldName: $T("sprm.common.model.common.thirdSkuName").$D("第三方商品名称"),
      },
      {
        fieldCode: "catalogName",
        disabled: (val, item) => item["freightLineFlag"] !== 1,
        fieldName: $T("sprm.common.model.common.catalogName").$D("商品目录"),
      },
      {
        fieldCode: "skuType",
        fieldName: $T("sprm.common.model.common.skuTypeMark").$D("定制品标示"),
      },
      {
        fieldCode: "customSpecsJson",
        fieldName: $T("sprm.common.model.common.customSpecsJson").$D("定制品属性"),
        render: () => <span style="color: var(--color-other-default-b)">{$T("hipspfm.common.button.view").$D("查看")}</span>,
      },
      {
        fieldCode: "receiveAddress",
        fieldType: "INPUT",
        disabled: (val, item) => item["prSourcePlatform"] !== "SRM" && item["prSourcePlatform"],
        fieldName: $T("sprm.common.model.receiveAddress").$D("收货地址"),
      },
      {
        fieldCode: "receiveContactName",
        fieldType: "INPUT",
        disabled: (val, item) => item["prSourcePlatform"] !== "SRM" && item["prSourcePlatform"],
        fieldName: $T("sprm.common.model.common.receiveContactName").$D("收货联系人"),
      },
      {
        fieldCode: "internationalTelCode",
        fieldType: "SELECT",
        lookupCode: "HPFM.IDD",
        disabled: (val, item) => item["prSourcePlatform"] !== "SRM" && item["prSourcePlatform"],
        fieldName: $T("sprm.common.model.common.internationalTelCode").$D("国别码"),
      },
      {
        fieldCode: "receiveTelNum",
        fieldType: "INPUT_NUMBER",
        disabled: (val, item) => item["prSourcePlatform"] !== "SRM" && item["prSourcePlatform"],
        fieldName: $T("sprm.common.model.common.receiverTelNum").$D("收货联系电话"),
      },
      {
        fieldCode: "quantity",
        fieldName: $T("sprm.common.model.common.reqQuantity").$D("数量"),
        fieldType: "INPUT_NUMBER",
        required: (val, item) => ![ "E-COMMERCE", "CATALOGUE" ].includes(item.prSourcePlatform),
        disabled: (val, item) => [ "E-COMMERCE", "CATALOGUE" ].includes(item.prSourcePlatform) || item["uomControlFlag"] === 1,
        inputChange: (val, valueField, displayField, ds) => {
          if (val) {
            if (ds.get("uomControlFlag") === 0) {
              ds.setField("secondaryQuantity", val);
            }
          }
        },
      },
      {
        fieldCode: "secondaryQuantity",
        fieldName: $T("sprm.common.model.common.reqQuantity").$D("数量"),
        fieldType: "INPUT_NUMBER",
        required: (val, item) => ![ "E-COMMERCE", "CATALOGUE" ].includes(item.prSourcePlatform) && item["uomControlFlag"] === 1,
        inputChange: (val, valueField, displayField, ds) => {
          if (val) {
            if (ds.get("uomControlFlag") === 1) {
              if (ds.get("itemId")) {
                getUomQuantityApi([
                  {
                    businessKey: ds.get("prLineId") || 1,
                    secondaryUomId: ds.get("secondaryUomId"),
                    secondaryQuantity:val,
                    doublePrimaryUomId: ds.get("uomId"),
                    itemId: ds.get("itemId"),
                  },
                ]).then((res) => {
                  if (res && !res.failed) {
                    ds.setField("quantity", res[0].primaryQuantity);
                  }
                });
              } else {
                ds.setField("quantity", val);
              }
            }
          }
        },
        disabled: (val, item) => [ "E-COMMERCE", "CATALOGUE" ].includes(item.prSourcePlatform),
      },
      {
        fieldCode: "secondaryUomName",
        displayField: "secondaryUomCodeAndName",
        fieldName: $T("sprm.common.model.common.uomCodeAndName").$D("单位"),
        fieldType: "LOV",
        lovCode: "SMDM_ITEM_ORG_UOM",
        options: {
          displayField: "uomCodeAndName",
          valueField: "uomName",
          queryParams: {
            enabledFlag: 1,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("secondaryUomCodeAndName", val[0].uomName);
              ds.current.setField("secondaryUomName", val[0].uomName);
              ds.current.setField("secondaryUomCode", val[0].uomCode);
              ds.current.setField("secondaryUomId", val[0].uomId);
              ds.current.setField("secondaryUomPrecision", val[0].uomPrecision);
              if (ds.current.get("uomControlFlag") === 1) {
                if (ds.current.get("itemId")) {
                  getUomQuantityApi([
                    {
                      businessKey: ds.current.get("prLineId") || 1,
                      secondaryUomId: val[0].uomId,
                      secondaryQuantity: ds.current.get("secondaryQuantity"),
                      doublePrimaryUomId: ds.current.get("uomId"),
                      itemId: ds.current.get("itemId"),
                    },
                  ]).then((res) => {
                    if (res && !res.failed) {
                      ds.current.setField("quantity", res[0].primaryQuantity);
                    }
                  });
                } else {
                  ds.current.setField("uomCodeAndName", val[0].uomName);
                  if (ds.current.data["uomDisplay"] === 1) {
                    ds.current.setField("uomCodeAndName", `${val[0].uomCode}/${val[0].uomName}`);
                  }
                  ds.current.setField("uomName", val[0].uomName);
                  ds.current.setField("uomCode", val[0].uomCode);
                  ds.current.setField("uomId", val[0].uomId);
                  ds.current.setField("uomPrecision", val[0].uomPrecision);
                }
              }
            }
          },
          onClear: (ds) => {
            ds.current.setField("secondaryUomCodeAndName", null);
            ds.current.setField("secondaryUomName", null);
            ds.current.setField("secondaryUomCode", null);
            ds.current.setField("secondaryUomId", null);
            ds.current.setField("secondaryUomPrecision", null);
          },
        },
        required: (val, item) => item["uomControlFlag"] === 1,
      },
      {
        fieldCode: "uomName",
        displayField: "uomCodeAndName",
        fieldName: $T("sprm.common.model.common.uomCodeAndName").$D("单位"),
        fieldType: "LOV",
        lovCode: "SMDM.DUAL_UOM",
        options: {
          displayField: "uomName",
          subDisplayField: "uomCode",
          valueField: "uomName",
          queryParams: {
            enabledFlag: 1,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("uomCodeAndName", val[0].uomName);
              if (ds.current.data["uomDisplay"] === 1) {
                ds.current.setField("uomCodeAndName", `${val[0].uomCode}/${val[0].uomName}`);
              }
              ds.current.setField("uomName", val[0].uomName);
              ds.current.setField("uomCode", val[0].uomCode);
              ds.current.setField("uomId", val[0].uomId);
              ds.current.setField("uomPrecision", val[0].uomPrecision);
              if (ds.current.get("uomControlFlag") === 0) {
                ds.current.setField("secondaryUomCodeAndName", val[0].uomName);
                ds.current.setField("secondaryUomName", val[0].uomName);
                ds.current.setField("secondaryUomCode", val[0].uomCode);
                ds.current.setField("secondaryUomId", val[0].uomId);
                ds.current.setField("secondaryUomPrecision", val[0].uomPrecision);
              }
            }
          },
          onClear: (ds) => {
            ds.current.setField("uomCodeAndName", null);
            ds.current.setField("uomName", null);
            ds.current.setField("uomCode", null);
            ds.current.setField("uomId", null);
            ds.current.setField("uomPrecision", null);
          },
        },
        disabled: (val, item) => item["uomControlFlag"] === 1,
        required: true,
      },
      {
        fieldCode: "taxCode",
        displayField: "taxCode",
        fieldName: $T("sprm.common.model.common.taxLov").$D("税种"),
        fieldType: "LOV",
        lovCode: "SMDM.TAX",
        options: {
          displayField: "taxCode",
          subDisplayField: "taxRate",
          valueField: "taxCode",
          queryParams: {
            enabledFlag: 1,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("taxCode", val[0].taxCode);
              ds.current.setField("taxRate", val[0].taxRate);
              ds.current.setField("taxId", val[0].taxId);
              ds.current.setField("taxLov", val[0]);
            }
          },
          onClear: (ds) => {
            ds.current.setField("taxCode", null);
            ds.current.setField("taxRate", null);
            ds.current.setField("taxId", null);
            ds.current.setField("taxLov", null);
          },
        },
      },
      {
        fieldCode: "taxRate",
        fieldName: $T("sprm.common.model.common.taxRate").$D("税率"),
      },
      {
        fieldCode: "currencyCode",
        disabled: () => true,
        fieldName: $T("sprm.common.model.common.currencyCode").$D("币种"),
      },
      {
        fieldCode: "secondaryTaxInUnitPrice",
        fieldName: $T("sprm.common.model.common.taxIncludedUnitPrice").$D("预估单价(含税)"),
        fieldType: "INPUT_NUMBER",
        editor: (val, item) => item.linePriceHiddenFlag !== 1,
        render: (val, item) => {
          let length;
          if (item.linePriceHiddenFlag === 1) {
            return item.taxIncludedUnitPriceMeaning;
          }
          if (item.prSourcePlatform === "SRM") {
            length = item.localFinancialPrecision;
          }
          return SrmUtil.getNumberPrecision(val, length);
        },
        disabled: (val, item) => [ "E-COMMERCE", "CATALOGUE" ].includes(item.prSourcePlatform),
      },
      {
        fieldCode: "taxIncludedUnitPrice",
        fieldName: $T("sprm.common.model.common.taxIncludedUnitPrice").$D("预估单价(含税)"),
        fieldType: "INPUT_NUMBER",
        editor: (val, item) => item.linePriceHiddenFlag !== 1 && item.uomControlFlag !== 1,
        render: (val, item) => {
          let length;
          if (item.linePriceHiddenFlag === 1) {
            return item.taxIncludedUnitPriceMeaning;
          }
          if (item.prSourcePlatform === "SRM") {
            length = item.localFinancialPrecision;
          }
          return SrmUtil.getNumberPrecision(val, length) ? Number(String(SrmUtil.getNumberPrecision(val, length)).replace(/,/g, "")) : val;
        },
        disabled: (val, item) => [ "E-COMMERCE", "CATALOGUE" ].includes(item.prSourcePlatform),
      },
      {
        fieldCode: "lastPurchasePrice",
        fieldName: $T("sprm.common.model.common.lastPurchasePrice").$D("上次采购单价"),
      },
      {
        fieldCode: "taxIncludedLineAmount",
        fieldName: $T("sprm.common.model.common.taxIncludedLineAmount").$D("行金额"),
        render: (val, item) => {
          let length;
          if (item.linePriceHiddenFlag === 1) {
            return item.taxIncludedLineAmountMeaning;
          }
          if (item.prSourcePlatform === "SRM") {
            length = item.localFinancialPrecision;
          }
          return SrmUtil.getNumberLocalized(val, length);
        },
        disabled: () => true,
      },
      {
        fieldCode: "localCurrencyNoTaxSum",
        fieldName: $T("sprm.common.model.common.localCurrencyNoTaxSum").$D("本币金额(不含税)"),
        render: (val, item) => {
          let length;
          if (item.linePriceHiddenFlag === 1) {
            return item.taxIncludedLineAmountMeaning;
          }
          if (item.prSourcePlatform === "SRM") {
            length = item.localFinancialPrecision;
          }
          return SrmUtil.getNumberLocalized(val, length);
        },
        disabled: () => true,
      },
      {
        fieldCode: "localCurrencyTaxSum",
        fieldName: $T("sprm.common.model.common.localCurrencyTaxSum").$D(
          "本币金额(含税)"
        ),
        fieldType: "INPUT_NUMBER",
        disabled: () => true,
        editor: (val, item) => item.linePriceHiddenFlag !== 1,
        render: (val, item) => {
          let length;
          if (item.linePriceHiddenFlag === 1) {
            return item.localCurrencyNoTaxSumMeaning;
          }
          if (item.prSourcePlatform === "SRM") {
            length = item.localFinancialPrecision;
          }
          return SrmUtil.getNumberLocalized(val, length);
        },
      },
      {
        fieldCode: "localCurrencyNoTaxUnit",
        disabled: () => true,
        fieldName: $T("sprm.common.model.common.localCurrencyNoTaxUnit").$D("本币单价(不含税)"),
        render: (val, item) => {
          let length;
          if (item.linePriceHiddenFlag === 1) {
            return item.taxIncludedLineAmountMeaning;
          }
          if (item.prSourcePlatform === "SRM") {
            length = item.localFinancialPrecision;
          }
          return SrmUtil.getNumberPrecision(val, length) ? Number(String(SrmUtil.getNumberPrecision(val, length)).replace(/,/g, "")) : val;
          // return Number(SrmUtil.getNumberPrecision(val, length));
        },
      },
      {
        fieldCode: "localCurrencyTaxUnit",
        disabled: () => true,
        fieldName: $T("sprm.common.model.common.localCurrencyTaxUnit").$D("本币单价(含税)"),
        render: (val, item) => {
          let length;
          if (item.linePriceHiddenFlag === 1) {
            return item.taxIncludedLineAmountMeaning;
          }
          if (item.prSourcePlatform === "SRM") {
            length = item.localFinancialPrecision;
          }
          return SrmUtil.getNumberPrecision(val, length) ? Number(String(SrmUtil.getNumberPrecision(val, length)).replace(/,/g, "")) : val;
          // return Number(SrmUtil.getNumberPrecision(val, length));
        },
      },
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("sprm.common.model.common.supplierCompanyId").$D("建议供应商"),
        fieldType: "LOV",
        lovCode: "SPRM.SUPPLIER",
        options: {
          queryParams: {
            enabledFlag: 1,
            companyId: null,
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("supplierCompanyName", val[0].displaySupplierName);
              ds.current.setField("supplierCompanyNum", val[0].supplierCompanyNum);
              ds.current.setField("supplierCompanyId", val[0].supplierCompanyId);
              ds.current.setField("supplierTenantId", val[0].supplierTenantId);
              ds.current.setField("displaySupplierName", val[0].displaySupplierName);
            }
          },
          onClear: (ds) => {
            ds.current.setField("supplierCompanyNum", null);
            ds.current.setField("supplierCompanyNum", null);
            ds.current.setField("supplierCompanyId", null);
            ds.current.setField("supplierTenantId", null);
            ds.current.setField("displaySupplierName", null);
          }
        },
        disabled: (val, item) => item["prSourcePlatform"] !== "SRM" && item["prSourcePlatform"],
        render: (val, item) => item.displaySupplierName
      },
      {
        fieldCode: "prRequestedName",
        displayField: "prRequestedNumAndName",
        fieldName: $T("sprm.common.model.common.prRequestedName").$D("申请人"),
        fieldType: "LOV",
        lovCode: "SPCM.ACCEPT_USER",
        options: {
          displayField: "userName",
          subDisplayField: "loginName",
          valueField: "userName",
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("prRequestedName", val[0].userName);
              ds.current.setField("prRequestedNum", val[0].loginName);
              ds.current.setField("prRequestedNumAndName", `${val[0].loginName}-${val[0].userName}`);
            }
          },
          onClear: (ds) => {
            ds.current.setField("prRequestedName", null);
            ds.current.setField("prRequestedNum", null);
            ds.current.setField("prRequestedNumAndName", null);
          },
        },
      },
      {
        fieldCode: "purchaseAgentName",
        fieldName: $T("sprm.common.model.common.purchaseAgentName").$D("采购员"),
        fieldType: "LOV",
        lovCode: "SPRM.PURCHASE_AGENT",
        options: {
          displayField: "purchaseAgentName",
          subDisplayField: "purchaseAgentCode",
          valueField: "purchaseAgentName",
          queryParams: {
            tenantId: SrmUtil.getTenantId(),
          },
          callback: (val, valueField, displayField, ds) => {
            if (val && val[0]) {
              ds.current.setField("purchaseAgentName", val[0].purchaseAgentName);
              ds.current.setField("purchaseAgentId", val[0].purchaseAgentId);
            }
          },
          onClear: (ds) => {
            ds.current.setField("purchaseAgentName", null);
            ds.current.setField("purchaseAgentId", null);
          },
        },
      },
      {
        fieldCode: "executorName",
        fieldName: $T("sprm.common.model.common.executorName").$D("需求执行人"),
      },
      {
        fieldCode: "remark",
        fieldName: $T("sprm.common.model.common.remark").$D("备注"),
        fieldType: "TEXT_AREA",
      },
      {
        fieldCode: "attachmentUuid",
        fieldName: $T("sprm.common.model.common.attachment").$D("附件"),
        render: (val) =>
          <SrmFlex>
            <srm-attachment-button
              attachments={[
                {
                  attachmentUuid: val,
                  title: $T("sprm.common.view.uploadAttachment").$D("上传附件"),
                  displayType: "grid",
                  showInfo: true,
                  uploadButton: "fixed",
                },
              ]}
              show-total
              title={$T("sprm.common.view.uploadAttachment").$D("上传附件")}
            />
          </SrmFlex>
        ,
      },
      {
        fieldCode: "executorRecordDetail",
        fieldName: $T("sprm.common.model.common.executorRecordDetail").$D("执行单据详情"),
        render: () => <span style="color: var(--color-other-default-b)">{$T("hipspfm.common.button.view").$D("查看")}</span>,
      },
    ],
    queryParameter: {
      customizeUnitCode: "SPRM.PURCHASE_PLAFORM_QUERY.PURCHASELINE",
    },
    pathParameter: {
      tenantId: SrmUtil.getTenantId(),
      prHeaderId: null,
    },
    transport: {
      read: {
        url: "sprm/v1/{tenantId}/purchase-requests/{prHeaderId}/lines",
        method: "get",
      },
      destroy: {
        url: "sprm/v1/{tenantId}/purchase-requests/{prHeaderId}/lines",
        method: "delete",
      },
    },
    events: {
      // 查询数据后操作
      afterQuery(ds, result) {
        // 业务规则配置
        Promise.all([
          // 物料限定范围规则
          getCreationApi("SITE.SPUC.PR.CREATION.ITEM_LIMIT", [
            { "fullPathCode":"SITE.SPUC.PR.CREATION.ITEM_LIMIT" },
          ]),
          // 单位显示
          getCreationApi("SITE.SMDM.UOM_DISPLAY_CONFIGURATION", [
            { "fullPathCode":"SITE.SMDM.UOM_DISPLAY_CONFIGURATION" }
          ]),
          // 单位显示
          getUomControlApi(),
        ]).then((list) => {
          const [ itemLimit ] = list[0];
          const [ uomDisplay ] = list[1];
          const { SPRM } = list[2];
          result.map((res) => {
            res["supplierCompanyName"] = res.displaySupplierName;
            // 物料根据库存组织和物料分类选择
            res["itemLimit"] = itemLimit;
            // 单位显示格式 单位编码/单位名称
            res["uomDisplay"] = uomDisplay;
            // 双单位配置
            res["uomControlFlag"] = SPRM;
            // 价格隐藏
            if (res.linePriceHiddenFlag === 1) {
              // 预估单价(含税)
              res["taxIncludedUnitPriceMeaning"] = "***";
              // localCurrencyTaxSum
              res["localCurrencyTaxSumMeaning"] = "***";
            }
          });
        });
      },
    },
  };
}

export default lineDs;
