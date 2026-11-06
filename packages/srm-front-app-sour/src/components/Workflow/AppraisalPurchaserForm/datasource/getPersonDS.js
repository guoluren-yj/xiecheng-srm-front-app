import { $T, SrmUtil } from "srm-mobile-ui";
import { SRM_SSLM } from "@/utils/utils";
const tenantId = SrmUtil.getTenantId();

const getDsConfig = (evalRespRule, evalHeaderId) => {
  switch (evalRespRule) {
  case "INDICATOR":
    return {
      queryPath: `kpi-eval-header-datas/eval-manage/indicator/${evalRespRule}/${evalHeaderId}`,
    };
  case "RATER":
    return {
      queryPath: `kpi-eval-header-resp-dmss/eval-manage/${evalRespRule}/${evalHeaderId}`,
    };
  default:
    return {
      queryPath: `kpi-eval-header-datas/eval-manage/${evalRespRule}/${evalHeaderId}`,
    };
  }
};

export const getPersonDs = ({ evalHeaderId, evalRespRule } = {}) => {
  const { queryPath, ...dsConfig } = getDsConfig(evalRespRule, evalHeaderId);
  return {
    editable: false,
    enableQuery: false,
    autoQuery:true,
    pageSize: 5,
    ...dsConfig,
    fields: [
      // 指标
      {
        fieldName: $T("spfm.supplierKpiIndicator.model.supplier.indicatorCode").$D("指标编码"),
        fieldCode: "indicatorCode",
      },
      {
        fieldName: $T("spfm.supplierKpiIndicator.model.supplier.indicatorName").$D("指标名称"),
        fieldCode: "indicatorName",
      },
      // 供应商
      {
        fieldCode: "supplierCompanyNum",
        fieldName: $T("sslm.supplierDocManage.model.docManage.venderCode").$D("供应商编码"),
      },
      {
        fieldCode: "supplierCompanyName",
        fieldName: $T("sslm.supplierDocManage.model.docManage.venderName").$D("供应商名称"),
      },
      // 品类
      {
        fieldCode: "categoryCode",
        fieldName: $T("sslm.common.category.categoryCode").$D("品类编码"),
      },
      {
        fieldCode: "categoryName",
        fieldName: $T("sslm.common.category.categoryName").$D("品类名称"),
      },
      // 物料
      {
        fieldCode: "itemCode",
        fieldName: $T("sslm.common.item.itemCode").$D("物料编码"),
      },
      {
        fieldCode: "itemName",
        fieldName: $T("sslm.common.item.itemName").$D("物料名称"),
      },
      // 评分人
      {
        fieldCode: "respLoginName",
        fieldName: $T("sslm.common.model.user.account").$D("账户"),
      },
      {
        fieldCode: "respUserName",
        fieldName: $T("sslm.common.model.user.name").$D("名称"),
      },
      {
        fieldCode: "respWeight",
        fieldName: $T("sslm.supplierKpiIndicator.model.supplier.respWeight").$D("权重%"),
      },
      {
        fieldCode: "assignRuleMeaning",
        fieldName: $T("sslm.common.modal.field.allocationRule").$D("分配规则"),
      },
      {
        fieldCode: "scorer",
        fieldName: $T("sslm.common.modal.grade.realName").$D("评分人"),
      },
      {
        fieldCode: "scoreChildIndicator",
        fieldName: $T("sslm.common.modal.field.scoreChildIndicator").$D("下级评分指标"),
      }
    ],
    transport: {
      read: {
        url: `${SRM_SSLM}/v1/${tenantId}/${queryPath}`,
        method: "GET",
      },
    },
  };
};

export const getPersonColumns = (_this) => [
  // 指标
  {
    fieldCode: "indicatorCode",
    fieldName: $T("spfm.supplierKpiIndicator.model.supplier.indicatorCode").$D("指标编码"),
    visible:[ "INDICATOR", "SUPPLIER+INDICATOR", "SU+CA+IN", "SU+IT+IN" ].includes(_this.evalRespRule),
  },
  {
    fieldCode: "indicatorName",
    fieldName: $T("spfm.supplierKpiIndicator.model.supplier.indicatorName").$D("指标名称"),
    visible:[ "INDICATOR", "SUPPLIER+INDICATOR", "SU+CA+IN", "SU+IT+IN" ].includes(_this.evalRespRule),
  },
  // 供应商
  {
    fieldCode: "supplierCompanyNum",
    fieldName: $T("sslm.supplierDocManage.model.docManage.venderCode").$D("供应商编码"),
    visible:[ "SUPPLIER", "SUPPLIER+INDICATOR", "SU+CA+IN", "SU+IT+IN" ].includes(
      _this.evalRespRule
    ),
  },
  {
    fieldCode: "supplierCompanyName",
    fieldName: $T("sslm.supplierDocManage.model.docManage.venderName").$D("供应商名称"),
    visible:[ "SUPPLIER", "SUPPLIER+INDICATOR", "SU+CA+IN", "SU+IT+IN" ].includes(
      _this.evalRespRule
    ),
  },
  // 品类
  {
    fieldCode: "categoryCode",
    fieldName: $T("sslm.common.category.categoryCode").$D("品类编码"),
    visible:[ "CATEGORY", "SU+CA+IN" ].includes(_this.evalRespRule),
  },
  {
    fieldCode: "categoryName",
    fieldName: $T("sslm.common.category.categoryName").$D("品类名称"),
    visible:[ "CATEGORY", "SU+CA+IN" ].includes(_this.evalRespRule),
  },
  // 物料
  {
    fieldCode: "itemCode",
    fieldName: $T("sslm.common.item.itemCode").$D("物料编码"),
    visible:[ "ITEM", "SU+IT+IN" ].includes(_this.evalRespRule),
  },
  {
    fieldCode: "itemName",
    fieldName: $T("sslm.common.item.itemName").$D("物料名称"),
    visible:[ "ITEM", "SU+IT+IN" ].includes(_this.evalRespRule),
  },
  // 评分人
  {
    fieldCode: "respLoginName",
    fieldName: $T("sslm.common.model.user.account").$D("账户"),
    visible:[ "RATER" ].includes(_this.evalRespRule),
  },
  {
    fieldCode: "respUserName",
    fieldName: $T("sslm.common.model.user.name").$D("名称"),
    visible:[ "RATER" ].includes(_this.evalRespRule),
  },
  {
    fieldCode: "respWeight",
    fieldName: $T("sslm.supplierKpiIndicator.model.supplier.respWeight").$D("权重%"),
    visible:[ "RATER" ].includes(_this.evalRespRule),
  },
  {
    fieldCode: "assignRuleMeaning",
    fieldName: $T("sslm.common.modal.field.allocationRule").$D("分配规则"),
    visible:![ "RATER" ].includes(_this.evalRespRule),
  },
  {
    fieldCode: "scorer",
    fieldName: $T("sslm.common.modal.grade.realName").$D("评分人"),
    visible:(val, data) => ![ "RATER" ].includes(_this.evalRespRule) && !data.children,
    render:(val, data) => {
      const { children, kpiEvalHeaderRespDmsList } = data;
      if (children || !kpiEvalHeaderRespDmsList) {
        return "-";
      }
      return kpiEvalHeaderRespDmsList.map((n) => {
        const { respUserName, respWeight } = n;
        return respWeight ? `${respUserName}-${respWeight}%` : `${respUserName}`;
      }).join("、");
    }
  },
  {
    fieldCode: "scoreChildIndicator",
    fieldName: $T("sslm.common.modal.field.scoreChildIndicator").$D("下级评分指标"),
    visible:(val, data) => data.children,
    render: (val, data) => {
      if (data.children) {
        return <span style="color: var(--color-other-default-b);"
          on-click={(n) => {
            n.stopPropagation();
            _this.viewScoreChildIndicators(data);
          }}>
          {$T("hzero.common.button.view").$D("查看")}
        </span>;
      }
      return "-";
    },
  }
];
