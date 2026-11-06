/*
 * @Date: 2024-10-18 17:54:59
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";

export const getPurchaseLineDS = () => ({
  selection: Infinity,
  pageSize: 5,
  editable: false,
  enableQuery: false,
  showTotalCount: false,
  fields: [
    {
      fieldCode: "organizationCode",
      fieldName: $T("sslm.common.model.purchaseOrgCode").$D("采购组织编码"),
    },
    {
      fieldCode: "organizationName",
      fieldName: $T("sslm.supplierInform.model.supplierInform.organizationName")
        .$D("采购组织名称"),
    },
    {
      fieldCode: "purchaseAgentName",
      fieldName: $T("sslm.supplierInform.model.supplierInform.purchaseAgent").$D("采购组"),
    },
    {
      fieldCode: "termName",
      fieldName: $T("sslm.common.model.paymentTerms").$D("付款条款"),
    },
    {
      fieldCode: "typeName",
      fieldName: $T("sslm.supplierInform.model.supplierInform.payMethod").$D("付款方式"),
    },
    {
      fieldCode: "tradeTermsMeaning",
      fieldName: $T("spfm.importErp.model.importErp.internationalCondition").$D("国贸条件"),
    },
    {
      fieldCode: "tradeTermsSite",
      fieldName: $T("spfm.importErp.model.importErp.internationalSite").$D("国贸地点"),
    },
    {
      fieldCode: "currencyName",
      fieldName: $T("sslm.supplierInform.model.supplierInform.currencyCode").$D("订单货币"),
    },
    {
      fieldCode: "reconciliationAccountMeaning",
      fieldName: $T("sslm.supplierInform.model.supplierInform.controlAccount").$D("统驭科目"),
    },
    {
      fieldCode: "sortNumber",
      fieldName: $T("sslm.supplierInform.model.supplierInform.sortNumber").$D("排序码"),
    },
    {
      fieldCode: "frozenFlag",
      fieldName: $T("sslm.supplierInform.model.purchase.frozenFlag").$D("采购冻结"),
    },
  ],
  transport: {
    read: {
      url: `/sslm/v1/${localStorage.getItem("organizationId")}/supplier-sync-pfs`,
      method: "GET",
      params:{
        customizeUnitCode:"SSLM.SUPPLIER_LIFE_CYCLE.PURCHASE_INFO"
      }
    },
  },
});