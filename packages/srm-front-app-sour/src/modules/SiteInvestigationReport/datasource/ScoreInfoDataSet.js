import { SrmUtil, $T } from "srm-mobile-ui";

function scoreInfoDataSet(id, autoQuery, editable) {
  return {
    autoQuery: autoQuery,
    editable: false,
    editFlag: false,
    selection: 20,
    enableQuery: false,
    showTotalCount: false,
    fields: [
      {
        fieldCode: "indicatorCode",
        fieldType: "EMPTY",
        render: (val) => <srm-list-header show-open-tag={false}>
          {$T("sslm.siteInvestigateReport.modal.mange.projectCode").$D("考察项目编码")}：{val}
        </srm-list-header>,
      }, {
        fieldCode: "indicatorName",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.projectName").$D("考察项目名称"),
      }, {
        fieldCode: "scoreTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.scoreWay").$D("评分方式"),
      }, {
        fieldCode: "evalStandard",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.scoreCriteria").$D("评分标准"),
      }, {
        fieldCode: "indicatorTypeMeaning",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.projectType").$D("考察项目类型"),
      }, {
        fieldCode: "supplierScore",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplierScore").$D("供应商自评得分"),
      }, {
        fieldCode: "supplierRemarks",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplierRemarks").$D("供应商自评意见"),
      }, {
        fieldCode: "attachmentUuid",
        fieldType: "UPLOAD",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.supplierAttachement").$D("供应商反馈附件"),
        showCount: true,
      }, {
        fieldCode: "completeFlag",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.scoreStatus").$D("评分状态"),
        // 代码中处理
        // render: (val) => {
        //   if (val === 1) {
        //     return $T("sslm.siteInvestigateReport.modal.mange.completed").$D("已完成");
        //   } else if (val === 2) {
        //     return $T("sslm.siteInvestigateReport.model.mange.back").$D("退回");
        //   }
        //   return $T("sslm.siteInvestigateReport.modal.mange.unfinished").$D("未完成");
        // },
      }, {
        fieldCode: "evalWeight",
        fieldType: "TEXT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.weight").$D("权重"),
      }, {
        fieldCode: "finalScore",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.score").$D("得分"),
      }, {
        fieldCode: "score",
        fieldType: "INPUT_NUMBER",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.score").$D("得分"),
        editor: editable,
        visible: (val, item) => item.indicatorType === "SCORE",
        required: (val, item) => item.indicatorType === "SCORE",
      }, {
        fieldCode: "scoreFrom",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.scoreFrom").$D("分值从"),
        visible: (val, item) => item.indicatorType !== "TICK" && item.indicatorType !== "VETO" && item.indicatorType !== "OPT",
      }, {
        fieldCode: "scoreTo",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.scoreTo").$D("分值至"),
        visible: (val, item) => item.indicatorType !== "TICK" && item.indicatorType !== "VETO" && item.indicatorType !== "OPT",
      }, {
        fieldCode: "defaultScore",
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.defaultScore").$D("缺省分值"),
      }, {
        fieldCode: "isStandard",
        fieldType: "SELECT",
        displayField: "isStandardMeaning",
        fieldName: $T("sslm.siteInvestigateReport.modal.scorer.isCriteria").$D("符合评分标准"),
        editor: editable,
        visible: (val, item) => item.indicatorType === "TICK",
        required: (val, item) => item.indicatorType === "TICK",
        options: {
          displayField: "meaning",
          valueField: "value",
          listData: [ {
            meaning: $T("smbl.common.view.yes").$D("是"),
            value: "1",
          }, {
            meaning: $T("smbl.common.view.no").$D("否"),
            value: "0",
          }, ],
        }
      }, {
        fieldCode: "isVeto",
        fieldType: "SELECT",
        displayField: "isVetoMeaning",
        fieldName: $T("sslm.siteInvestigateReport.modal.scorer.isVeto").$D("否决该项"),
        editor: editable,
        visible: (val, item) => item.indicatorType === "VETO",
        required: (val, item) => item.indicatorType === "VETO",
        options: {
          displayField: "meaning",
          valueField: "value",
          listData: [ {
            meaning: $T("smbl.common.view.yes").$D("是"),
            value: "1",
          }, {
            meaning: $T("smbl.common.view.no").$D("否"),
            value: "0",
          }, ],
        }
      }, {
        fieldCode: "indOptName",
        displayField: "indOptName",
        fieldType: "LOV",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.indOptName").$D("评分选项"),
        editor: editable,
        visible: (val, item) => item.indicatorType === "OPT",
        required: (val, item) => item.indicatorType === "OPT",
        lovCode: "SSLM.KPI.INDICATOR.OPT.CFG",
        options: {
          queryParams: {
            // evalTplIndId: "91855255270096471",
          },
          valueField: "meaning",
          onClear: (ds) => {
            ds.current.setField("evalTplIndOptId", null);
          },
          callback: (val, fieldCode, display, ds) => {
            if (val && val.length) {
              ds.current.setField("evalTplIndOptId", val[0].value);
            }
          }
        }
      }, {
        fieldCode: "respRemarks",
        fieldType: "INPUT",
        fieldName: $T("sslm.siteInvestigateReport.modal.mange.respRemarks").$D("反馈备注"),
        editor: editable,
      },
    ],
    queryParameter: {
      customizeUnitCode: "SSLM_SITEINVESTIGATEREPORT.SCOREINFO,SSLM_SITEINVESTIGATEREPORT.SCOREINFO_FILTER",
    },
    transport: {
      read: autoQuery ? {
        url: `/sslm/v1/${SrmUtil.getTenantId()}/site-eval-lines/${id}`,
        method: "get",
      } : null,
    },
    events: {
      afterQuery: (ds, datas) => {
        datas.forEach((item) => {
          if (item.isStandard === 0 || item.isStandard === 1) {
            item.isStandard = String(item.isStandard);// 如果是数字1、0，转为字符串；如果为null，展示空
          }
          if (item.isVeto === 0 || item.isVeto === 1) {
            item.isVeto = String(item.isVeto);// 如果是数字1、0，转为字符串；如果为null，展示空
          }
        });
        // 延时操作：此时无法获取records
        setTimeout(() => {
          ds.records.forEach((record) => {
            const indOptName = record.getField("indOptName");
            indOptName.setLovParam({ evalTplIndId: record.data.indicatorId });
          });
        }, 0);
      },
    }
  };
}

export {
  scoreInfoDataSet
};
