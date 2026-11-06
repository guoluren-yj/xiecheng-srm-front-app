/*
 * @Date: 2024-08-29 17:45:34
 * @Author: LXM <xiaomei.lv@going-link.com>
 * @Version: 0.0.1
 * @Copyright: Copyright (c) 2021, Hand
 */
import { $T, SrmUtil } from "srm-mobile-ui";
import { SRM_SSLM } from "@/utils/utils";
const tenantId = SrmUtil.getTenantId();

export const getIndicatorDS = ({ evalHeaderId } = {}) => ({
  autoQuery:true,
  editable: false,
  enableQuery: false,
  paging: false,
  queryParameter:{
    customizeUnitCode: "SSLM.APPRAISAL_PURCHASER_DETAIL.INDICATOR_LIST"
  },
  fields: [
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorCode").$D("指标编码"),
      fieldCode: "indicatorCode",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorName").$D("指标描述"),
      fieldCode: "indicatorName",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationWay").$D("评分方式"),
      fieldCode: "scoreTypeMeaning",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorType").$D("指标类型"),
      fieldCode: "indicatorTypeMeaning",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationStandard").$D("评分标准"),
      fieldCode: "evalStandard",
    },
    {
      fieldName: $T("sslm.supplierDocManage.model.docManage.scoreWeight").$D("权重"),
      fieldCode: "evalWeight",
    },
    {
      fieldName: $T("sslm.common.model.field.childIndicators").$D("下级指标"),
      fieldCode: "childIndicators",
    },
  ],
  transport: {
    read: {
      url: `${SRM_SSLM}/v1/${tenantId}/kpi-eval-header-datas/eval-manage/indicator/${evalHeaderId}`,
      method: "GET",
    },
  },
});

export const getIndicatorColumns = (_this) => [
  {
    fieldCode: "indicatorName",
    fieldType:"EMPTY",
    formRow: 10,
    render: (val) => <SrmListHeader showOpenTag={false} >
      {val}
    </SrmListHeader>
  },
  {
    fieldCode: "indicatorCode",
    fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorCode").$D("指标编码"),
    formRow: 20,
    formCol:1,
  },
  {
    fieldCode: "scoreTypeMeaning",
    fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationWay").$D("评分方式"),
    formRow: 20,
    formCol:2,
  },
  {
    fieldCode: "indicatorTypeMeaning",
    fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorType").$D("指标类型"),
    formRow: 30,
    formCol:1,
  },
  {
    fieldCode: "evalWeight",
    fieldName: $T("sslm.supplierDocManage.model.docManage.scoreWeight").$D("权重"),
    formRow: 30,
    formCol:2,
  },
  {
    fieldCode: "evalStandard",
    fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationStandard").$D("评分标准"),
    formRow: 40,
  },
  {
    fieldCode: "childIndicators",
    fieldName: $T("sslm.common.model.field.childIndicators").$D("下级指标"),
    formRow: 50,
    visible:(val, data) => data.children,
    render: (val, data) => {
      if (data.children) {
        return <span style="color: var(--color-other-default-b);"
          on-click={(n) => {
            n.stopPropagation();
            _this.viewChildIndicators(data);
          }}>
          {$T("hzero.common.button.view").$D("查看")}
        </span>;
      }
      return "-";
    },
  },
];
