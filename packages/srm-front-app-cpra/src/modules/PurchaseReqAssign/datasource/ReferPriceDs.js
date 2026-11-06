/*
 * @Descripttion:
 * @version:
 * @Author: yanglin
 * @Date: 2022-07-04 16:39:37
 * @LastEditors: yanglin
 * @LastEditTime: 2022-07-11 01:57:13
 */
// 参考价格列表
import { $T, SrmUtil } from "srm-mobile-ui";

function referPriceListDs() {
  return {
    autoQuery: false,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    editFlag: false,
    enableQuery: false,
    data: [],
    showTotalCount: true,
    queryParameter: {
      customizeUnitCode: "SPRM.PURCHASE_EXECUTION.C7NLADDERPRICEMODAL",
    },
    fields: [
      {
        fieldCode: "orderNum",
        fieldName: $T("sodr.common.model.common.sourceOrderNum").$D("来源单号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierCompanyNum",
        fieldName: $T("entity.supplier.code").$D("供应商编码"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("entity.supplier.name").$D("供应商名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierCode",
        fieldName: $T("sodr.common.model.common.localSupplierCompanyNum").$D("本地供应商编码"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "supplierName",
        fieldName: $T("sodr.common.model.common.localSupplierName").$D("本地供应商名称"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "taxPrice",
        fieldName: $T("sodr.common.model.common.taxPrice").$D("单价(含税)"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "unitPrice",
        fieldName: $T("sodr.common.model.common.unitPrice").$D("单价(不含税)"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "uomName",
        fieldName: $T("sodr.common.model.common.uomName").$D("单位"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "currencyCode",
        fieldName: $T("sodr.common.model.common.currencyName").$D("币种"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "taxCode",
        fieldName: $T("sodr.common.model.common.taxType").$D("税种"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "taxRate",
        fieldName: $T("sodr.common.model.common.taxRate").$D("税率"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "ladderInquiryFlag",
        fieldName: $T("sodr.common.model.common.ladderPrice").$D("阶梯价格"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "priceSourceMeaning",
        fieldName: $T("sodr.common.model.common.priceSource").$D("价格来源"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "orderNum",
        fieldName: $T("sodr.common.model.common.sourceOrderNum").$D("来源单号"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "validDate",
        fieldName: $T("sprm.common.model.common.validDate").$D("有效期"),
        fieldType: "TEXT",
      },
      {
        fieldCode: "creationDate",
        fieldName: $T("hzero.common.date.creation").$D("创建日期"),
        fieldType: "TEXT",
      },
    ],
    transport: {
      read: {
        url: `/sprm/v1/${SrmUtil.getTenantId()}/purchase-requests/{prLineId}/price-library`,
        method: "get",
      },
    },
  };
}

export {
  referPriceListDs,
};