import { $T, SrmUtil } from "srm-mobile-ui";

function scoreDetailDS(evalGranularity, evalHeaderId) {
  return {
    autoQuery: true,
    selection: Infinity,
    pageSize: 10,
    editable: false,
    enableQuery: false,
    showTotalCount: true,
    queryParameter: {
      customizeUnitCode: "SSLM.EVALUATION_DOC_MANAGE_DETAIL.HEADER,SSLM.EVALUATION_DOC_MANAGE_DETAIL.SCOREDETAILLINE,SSLM.EVALUATION_DOC_MANAGE_DETAIL.SCOREDETAILLINE_SEARCH",
    },
    pathParameter: {
      evalHeaderId,
      tenantId: SrmUtil.getTenantId(),
    },
    fields: [
      {
        fieldCode: "supplierNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.supplierNum").$D("公司编码"),
      },
      {
        fieldCode: "supplierName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.supplier").$D("供应商名称"),
      },
      {
        fieldCode: "erpSupplierNum",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.erpVenderCode").$D("erp供应商编码"),
      },
      {
        fieldCode: "erpSupplierName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.erpVenderName").$D("erp供应商名称"),
      },
      {
        fieldCode: "categoryName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.view.docManage.categoryName").$D("参评品类"),
        visible: (val, item) => item.evalGranularity === "SU+CA",
      },
      {
        fieldCode: "itemName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.view.docManage.itemName").$D("参评物料"),
        visible: (val, item) => item.evalGranularity === "SU+IT",
      },
      {
        fieldCode: "indicatorName",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorName").$D("指标描述"),
      },
      {
        fieldCode: "indicatorCode",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorCode").$D("指标编码"),
      },
      {
        fieldCode: "evalStandard",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationStandard").$D("评分标准"),
      },
      {
        fieldCode: "evalWeight",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.evalWeight").$D("指标权重%"),
      },
      {
        fieldCode: "indicatorType",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorType").$D("指标类型"),
      },
      {
        fieldCode: "scorer",
        fieldType: "TEXT",
        fieldName: $T("sslm.common.view.scorer").$D("评分人"),
      },
      {
        fieldCode: "scoreTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.scoreType").$D("评分方式"),
      },
      {
        fieldCode: "completeFlagMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationStatus").$D("评分状态"),
      },
      {
        fieldCode: "systemMessage",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.processRemark").$D("系统计算消息"),
      },
      {
        fieldCode: "finalScore",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sslm.siteEvalHeader.view.code.finalScore").$D("最终得分"),
        precision: 2,
        editor: false,
        // eslint-disable-next-line no-undefined
        render: (val) => [ null, undefined, "" ].includes(val) ? "-" : String(val),
        //validator: (val, item) => item.get("indicatorType") !== "SCORE" || !val || Number(val) >= Number(item.get("scoreFrom") || 0) && Number(val) <= Number(item.get("scoreTo") || 0)
      },
      {
        fieldCode: "checkDetailScore",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sslm.supplierDocManage.model.docManage.calibrationDetailScore").$D("校准明细得分"),
        precision: 2,
        editor: (val, item) => item.evalStatus === "FINAL_COLLECTED",
        visible: (val, item) => item.checkDetailFlag,
      },
      {
        fieldCode: "dtlRemark",
        fieldType: "INPUT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.dtlRemark").$D("说明"),
        editor: (val, item) => item.evalStatus === "FINAL_COLLECTED",
        visible: (val, item) => item.checkDetailFlag,
      },
      {
        fieldCode: "scoreFrom",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.scoreFrom").$D("分值从"),
        // eslint-disable-next-line no-undefined
        render: (val) => [ null, undefined, "" ].includes(val) ? "-" : String(val),
      },
      {
        fieldCode: "scoreTo",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.scoreTo").$D("分值至"),
      },
      {
        fieldCode: "defaultScore",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.defaultScore").$D("缺省分值"),
      },
      {
        fieldCode: "remark",
        fieldType: "TEXT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.feedbackDescription").$D("反馈备注"),
      },
    ],
    // 查询表单字段
    queryFields: [
      {
        fieldCode: "supplierId",
        fieldType: "LOV",
        fieldName: $T("sslm.supplierDocManage.model.docManage.vendor").$D("供应商"),
        lovCode: "SSLM.KPI_DTL_SUPPLIER",
        options: {
          subDisplayField: "companyNum",
          queryParams: {
            evalHeaderId,
          }
        }
      },
      {
        fieldCode: "categoryIds",
        fieldType: "TREE",
        fieldName: $T("sslm.supplierDocManage.model.docManage.purchaseProduct").$D("采购品类"),
        lovCode: "SSLM.KPI_DTL_CATEGORY",
        visible: evalGranularity === "SU+CA",
        options: {
          subDisplayField: "categoryCode",
          queryParams: {
            evalHeaderId,
          }
        }
      },
      {
        fieldCode: "itemId",
        fieldType: "LOV",
        fieldName: $T("sslm.supplierDocManage.model.docManage.itemName").$D("物料"),
        lovCode: "SSLM.KPI_DTL_ITEM",
        visible: evalGranularity === "SU+IT",
        options: {
          subDisplayField: "itemCode",
          queryParams: {
            evalHeaderId,
          }
        }
      },
      {
        fieldCode: "indicatorId",
        fieldType: "LOV",
        fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationIndicators").$D("考评指标"),
        lovCode: "SSLM.KPI_DTL_INDICATOR",
        options: {
          subDisplayField: "indicatorCode",
          queryParams: {
            evalHeaderId,
          }
        }
      },
      {
        fieldCode: "completeFlag",
        fieldType: "SELECT",
        fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationStatus").$D("评分状态"),
        lovCode: "SSLM.KPI_EVAL_STATUS",
      },
    ],
    transport: {
      read: {
        url: "/sslm/v1/{tenantId}/eval-headers/result/{evalHeaderId}",
        method: "get",
      },
      update: {
        url: "/sslm/v1/{tenantId}/eval-dtl-resps",
        method: "put",
      },
      submit: {
        url: "/sslm/v1/{tenantId}/eval-dtls/save",
        method: "POST",
      },
    },
    events: {
      afterQuery: (ds, data) => {
        setTimeout(() => {
          ds.records.forEach((record) => {
            const evalTplIndOptId = record.getField("evalTplIndOptId");
            evalTplIndOptId.addLovParam("evalTplIndId", record.get("evalTplIndId"));
          });
          ds.hasMore = data[0] && data[0].kpiEvalDetailLineDTOPage && data[0].kpiEvalDetailLineDTOPage.totalElements > ds.records.length;
          ds.paging = true;
          ds.isList = true;
        }, 0);
        const header = data[0] || {};
        const line = header.kpiEvalDetailLineDTOPage && data[0].kpiEvalDetailLineDTOPage.content || [];
        line.forEach((e) => {
          e.evalGranularity = header.evalGranularity;
          e.evalStatus = header.evalStatus;
          e.checkDetailFlag = header.checkDetailFlag;
          e.objectVersionNumber = e.dtlObjectVersionNumber;
        });
        return line;
      }
    }
  };
}

export default scoreDetailDS;
