/*
 * @Date: 2024-08-26 11:10:34
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T, SrmUtil } from "srm-mobile-ui";
import { SRM_SSLM } from "@/utils/utils";
import { yesOrNoRender } from "@/utils/sslmUtils.js";

const organizationId = SrmUtil.getTenantId();

// 评分信息ds
export const getScoreInfoDs = ({ evalHeaderId } = {}) => ({
  pageSize: 5,
  editable: false,
  autoQuery: false,
  enableQuery: false,
  fields: [
    {
      fieldName: $T("sslm.common.view.supplier.name").$D("供应商名称"),
      fieldCode: "supplierName",
    },
    {
      fieldCode: "supplierNum",
      fieldName: $T("sslm.common.view.supplier.code").$D("供应商编码"),
    },
    {
      fieldCode: "categoryName",
    },
    {
      fieldCode: "categoryCode",
      fieldName: $T("sslm.common.category.categoryCode").$D("品类编码"),
    },
    {
      fieldCode: "itemName",
      fieldName: $T("sslm.common.item.itemName").$D("物料名称"),
    },
    {
      fieldCode:"itemCode",
      fieldName:$T("sslm.common.item.itemCode").$D("物料编码"),
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorCode").$D("指标编码"),
      fieldCode: "indicatorCode",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorName").$D("指标描述"),
      fieldCode: "indicatorName",
    },
    {
      fieldName: $T("sslm.common.model.supplierKpiIndicator.indicatorType").$D("指标类型"),
      fieldCode: "indicatorTypeMeaning",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationStandard").$D("评分标准"),
      fieldCode: "evalStandard",
    },
    {
      fieldCode: "isStandard",
      fieldName: $T("sslm.common.model.archiveFilled.isStandard").$D("符合评分标准"),
    },
    {
      fieldCode: "isVeto",
      fieldName: $T("sslm.common.model.archiveFilled.isVeto").$D("否决该项"),
    },
    {
      fieldName: $T("sslm.common.model.archiveFilled.indOptName").$D("评分选项"),
      fieldCode: "indOptName",
    },
  ],
  transport: {
    read: {
      url: `${SRM_SSLM}/v1/${organizationId}/eval-headers/evaluation/new/${evalHeaderId}`,
      method: "GET",
    },
  },
});

// 评分信息columns
export const getScoreInfoColumns = (evalGranularity, supplierDimension) => [
  {
    fieldCode: "indicatorName",
    fieldType: "EMPTY",
    render:(val, record) => <SrmListHeader showOpenTag={false}>
      <span>{val}</span>
      {record.finalScore &&
         <SrmTag
           type="success"
           slot="right">
           {`${$T("sslm.common.model.archiveFilled.score").$D("得分")}:${record.finalScore}`}
         </SrmTag>
      }
    </SrmListHeader>
  },
  {
    fieldCode:"indicatorCode",
  },
  {
    fieldCode: "supplierName",
    visible: !supplierDimension,
  },
  {
    fieldCode: "categoryName",
    visible: supplierDimension && [ "RULE_SU", "SU+CA" ].includes(evalGranularity),
    fieldName: evalGranularity === "RULE_SU" ?
      $T("sslm.common.model.archiveFilled.suppilerRule").$D("供应商规则") :
      $T("sslm.common.model.archiveFilled.purchaseCategory").$D("采购品类"),
  },
  {
    fieldCode: "itemName",
    visible: supplierDimension && [ "SU+IT" ].includes(evalGranularity),
  },
  {
    fieldCode: "indicatorTypeMeaning",
  },
  {
    fieldCode: "evalStandard",
  },
  {
    fieldCode: "isStandard",
    visible:(_, item) => item.indicatorType === "TICK",
    render:(val) => yesOrNoRender(val),
  },
  {
    fieldCode: "isVeto",
    visible:(_, item) => item.indicatorType === "VETO",
    render:(val) => yesOrNoRender(val),
  },
  {
    fieldCode: "indOptName",
    visible:(_, item) => item.indicatorType === "OPT",
  },
];

// 【全部】卡片columns
export const getAllCardColumns = (evalGranularity, supplierDimension) => [
  {
    fieldCode: "supplierName",
    visible: supplierDimension,
  },
  {
    fieldCode: "supplierNum",
    visible: supplierDimension,
  },
  {
    fieldCode: "categoryName",
    fieldName: evalGranularity === "RULE_SU" ?
      $T("sslm.common.model.archiveFilled.suppilerRule").$D("供应商规则") :
      $T("sslm.common.category.categoryName").$D("品类名称"),
    visible: !supplierDimension && [ "RULE_SU", "SU+CA" ].includes(evalGranularity),
  },
  {
    fieldCode: "categoryCode",
    visible: !supplierDimension && [ "SU+CA" ].includes(evalGranularity),
  },
  {
    fieldCode: "itemName",
    visible: !supplierDimension && [ "SU+IT" ].includes(evalGranularity),
  },
  {
    fieldCode:"itemCode",
    visible: !supplierDimension && [ "SU+IT" ].includes(evalGranularity),
  }
];