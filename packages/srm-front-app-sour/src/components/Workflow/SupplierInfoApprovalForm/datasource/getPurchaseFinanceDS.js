/*
 * @Date: 2023-04-12 14:34:31
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T } from "srm-mobile-ui";
import { getRedFlag, renderRedNode, renderUpdateTag } from "../utils/utils";
import { yesOrNoRenderer } from "@/utils/renderer";

export const getPurchaseLineDS = () => ({
  editable: false,
  enableQuery: false,
  paging: false,
  fields: [
    {
      fieldCode: "organizationCode",
      fieldName: $T("sslm.supplierInform.model.supplierInform.organizationCode").$D("采购组织"),
    },
    {
      fieldCode: "organizationName",
      fieldName: $T("sslm.supplierInform.model.supplierInform.organizationName")
        .$D("采购组织名称"),
    },
    {
      fieldCode: "purchaseAgentId",
      fieldName: $T("sslm.supplierInform.model.supplierInform.purchaseAgent").$D("采购员"),
    },
    {
      fieldCode: "termId",
      fieldName: $T("sslm.supplierInform.model.supplierInform.termName").$D("付款条款"),
    },
    {
      fieldCode: "typeCode",
      fieldName: $T("sslm.supplierInform.model.supplierInform.payMethod").$D("付款方式"),
    },
    {
      fieldCode: "tradeTerms",
      fieldName: $T("spfm.importErp.model.importErp.internationalCondition").$D("国贸条件"),
    },
    {
      fieldCode: "tradeTermsSite",
      fieldName: $T("spfm.importErp.model.importErp.internationalSite").$D("国贸地点"),
    },
    {
      fieldCode: "currencyCode",
      fieldName: $T("sslm.supplierInform.model.supplierInform.currencyCode").$D("订单货币"),
    },
    {
      fieldCode: "reconciliationAccount",
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
});

export const getPurchaseLineColums = () => [
  {
    fieldCode: "organizationCode",
    fieldType: "EMPTY",
    formRow: 10,
    render: (val, item, field) => <SrmListHeader showOpenTag={false}>
      <span style={{ fontWeight:600 }}>{renderRedNode({ name: field.fieldCode, record:item })}</span>
      <span slot="right" >{renderUpdateTag(item)}</span>
    </SrmListHeader>
  },
  {
    fieldCode: "organizationName",
  },
  {
    fieldCode: "purchaseAgentId",
    code:"purchaseAgentName"
  },
  {
    fieldCode: "termId",
    code:"termName"
  },
  {
    fieldCode: "typeCode",
    code:"typeName"
  },
  {
    fieldCode: "tradeTerms",
    code:"tradeTermsMeaning"
  },
  {
    fieldCode: "tradeTermsSite",
  },
  {
    fieldCode: "currencyCode",
    code:"currencyName"
  },
  {
    fieldCode: "reconciliationAccount",
    code:"reconciliationAccountMeaning"
  },
  {
    fieldCode: "sortNumber",
  },
  {
    fieldCode: "frozenFlag",
    render: (val, item, field) => {
      const redFlag = getRedFlag({ name: field.fieldCode, record:item });
      return <span style={{ color: redFlag && "red" }}>
        {yesOrNoRenderer(val)}
      </span>;
    }
  },
].map((col) => ({ render: (val, item, field) => renderRedNode({ name: field.fieldCode, record:item, code:col.code }), ...col, }));
