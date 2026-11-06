import { getBaseInfoApi, getScoreSumApi, getOrderApi, getLovApi } from "./api";
import { DataSet, $T } from "srm-mobile-ui";
import { scoreDetailDs, scoreSumDs, orderDs } from "./datasource/ds";
import { dateFormat } from "@/utils/index";

export default {
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
    parameters: {
      type: Object,
    }
  },
  data() {
    return {
      initLoading: true,
      loading: false,
      headInfo: {}, // 基本信息
      showComplaint: false, // 是否显示供应商申诉情况tab
      granularity:false,
    };
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.initLoading = true;
        await this.fetchData();
        this.loading = true;
      } catch (err) {
        this.initLoading = false;
      } finally {
        this.initLoading = false;
      }
    }
  },
  methods: {
    // 基本信息
    async fetchData() {
      await getBaseInfoApi(this.changeReqId, {
        customizeUnitCode: "SSLM.EVALUATION_DOC_MANAGE_DETAIL.HEADER,SSLM.EVALUATION_DOC_MANAGE_DETAIL.SCOREDETAILLINE,SSLM.EVALUATION_DOC_MANAGE_DETAIL.SCOREDETAILLINE_SEARCH",
        tplId: this.parameters.tplId,
      }).then((res) => {
        this.headInfo = { ...res };
        this.getLovCode();
        this.getOrder();
        this.scoreDetailDataSet = new DataSet(scoreDetailDs());
        this.scoreDetailDataSet.setData(res.kpiEvalDetailLineDTOPage ? res.kpiEvalDetailLineDTOPage.content : []);
        // 供应商是否发起过申诉
        const { supplierAppealFlag = false, evalStatus = "" } = res;
        this.showComplaint = [ "APPEALING" ].includes(evalStatus) || supplierAppealFlag;
        // 单据类型
        this.granularity = res.evalGranularity || false;
      });
      await getScoreSumApi(this.changeReqId, {
        customizeUnitCode: "SSLM.EVALUATION_DOC_MANAGE_DETAIL.HEADER,SSLM.EVALUATION_DOC_MANAGE_DETAIL.SCOREDETAILLINE,SSLM.EVALUATION_DOC_MANAGE_DETAIL.SCOREDETAILLINE_SEARCH",
        tplId: this.parameters.tplId,
      }).then((res) => {
        this.scoreSumDataSet = new DataSet(scoreSumDs());
        this.scoreSumDataSet.setData(res.kpiEvalDetailLineDTOPage ? res.kpiEvalDetailLineDTOPage.content : []);
      });
    },
    // 单据
    getOrder() {
      getOrderApi([
        this.headInfo.docNum
      ]).then((res) => {
        this.orderDataSet = new DataSet(orderDs());
        this.orderDataSet.setData(Object.values(res));
      });
    },
    // 获取 多语言配置
    getLanguageDefine(key) {
      const languageList = {
        "baseInfoTab": $T("sslm.supplierDocManage.model.evalDocManage.baseInfo").$D("基本信息"),
        "scoreDetailTab": $T("sslm.supplierDocManage.model.evalDocManage.scoreDetail").$D("评分明细"),
        "scoreSumTab": $T("sslm.supplierDocManage.model.evalDocManage.scoreSum").$D("评分汇总"),
        "scoreVendorTab": $T("sslm.supplierDocManage.model.evalDocManage.scoreVendor").$D("参评供应商"),
        "qectificationDocTab": $T("sslm.common.view.tabs.qectificationDoc").$D("关联整改单据"),
        "complaintTab": $T("sslm.supplierDocManage.model.evalDocManage.complaintStatus").$D("供应商申诉情况"),
      };
      return languageList[key] || key;
    },
    // 获取 个性化配置
    getCustomizeCode(code) {
      const codeList = {
        "baseInfoTab": "SMBL.WORKFLOW.KPI_EVAL_DETAIL.BASIC",
        "scoreDetailTab": "SMBL.WORKFLOW.KPI_EVAL_DETAIL.SCORE_DETAIL",
        "scoreSumTab": "SMBL.WORKFLOW.KPI_EVAL_DETAIL.SCORE_SUM",
        "scoreVendorTab": "SMBL.WORKFLOW.KPI_EVAL_DETAIL.SCORE_VENDOR",
        "qectificationDocTab": "SMBL.WORKFLOW.KPI_EVAL_DETAIL.RELATED_DOC",
        "scorer": "SMBL.WORKFLOW.KPI_EVAL_DETAIL.SCORER",
        "evaluationStatus": "SMBL.WORKFLOW.KPI_EVAL_DETAIL.STATUS",
        "sumScore": "SMBL.WORKFLOW.KPI_EVAL_DETAIL.SUM_SCORE",
        "order": "SMBL.WORKFLOW.KPI_EVAL_DETAIL.ORDER",
        "uuid": "",
        "complaintTab": "SMBL.WORKFLOW.KPI_EVAL_DETAIL.COMPLAINT"
      };
      return codeList[code] || "";
    },
    getLovCode() {
      getLovApi({
        methodCode:"SSLM.KPI_EVAL_METHOD"
      }).then((res) => {
        this.headInfo["autoPushVendorFlag"] = this.headInfo["autoPushVendorFlag"] === 1 ? "1" : "0";
        this.headInfo["kpiMethodMeaning"] = this.headInfo["kpiMethod"] ? res["methodCode"].find((val) => val.value === this.headInfo["kpiMethod"]).meaning : "";
      });
    },
    // 获取字段
    getFieldInfo(code) {
      let columnList = [
        {
          fieldCode: "evalNum",
          fieldName: $T("sslm.common.model.archive.num").$D("档案编码"),
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            { $T("sslm.common.model.archive.num").$D("档案编码") }：{item.evalNum}
          </SrmListHeader>,
          formRow: 10,
        },
        {
          fieldCode: "evalName",
          fieldName: $T("sslm.common.model.archive.describe").$D("档案描述"),
          fieldType: "TEXT",
          formRow: 20,
        },
        {
          fieldCode: "evalStatusMeaning",
          fieldName: $T("sslm.common.model.archive.status").$D("档案状态"),
          fieldType: "TEXT",
          formRow: 30,
        },
        {
          fieldCode: "evalTplName",
          fieldName: $T("sslm.common.model.evaluation.evalTplName").$D("考评模板"),
          fieldType: "TEXT",
          formRow: 40,
        },
        {
          fieldCode: "evalDimensionMeaning",
          fieldName: $T("sslm.common.view.archiveFilled.evaluationDimension").$D("考评维度"),
          fieldType: "TEXT",
          formRow: 50,
        },
        {
          fieldCode: "evalDimensionValueMeaning",
          fieldName: $T("sslm.common.model.archive.evaluation.dimensionValue").$D("维度值"),
          fieldType: "TEXT",
          formRow: 60,
        },
        {
          fieldCode: "evalCycleMeaning",
          fieldName: $T("sslm.common.model.archive.evaluationCycle").$D("考评周期"),
          fieldType: "TEXT",
          formRow: 70,
        },
        {
          fieldCode: "processUserName",
          fieldName: $T("sslm.common.model.evaluation.charger").$D("考评负责人"),
          fieldType: "TEXT",
          formRow: 70,
        },
        {
          fieldCode: "creationDate",
          fieldName: $T("sslm.common.view.archiveFilled.archiveCreateTime").$D("建档时间"),
          fieldType: "TEXT",
          formRow: 80,
        },
        {
          fieldCode: "evalDateFrom",
          fieldName: $T("sslm.common.model.archive.evaluation.dateFrom").$D("考评日期从"),
          fieldType: "TEXT",
          render: (val) => dateFormat(val),
          formRow: 90,
        },
        {
          fieldCode: "evalDateTo",
          fieldName: $T("sslm.common.model.archive.evaluation.dateTo").$D("考评日期至"),
          fieldType: "TEXT",
          render: (val) => dateFormat(val),
          formRow: 100,
        },
        {
          fieldCode: "kpiMethodMeaning",
          fieldName: $T("sslm.common.model.archive.kpiMethod").$D("考评方式"),
          fieldType: "TEXT",
          formRow: 110,
        },
        {
          fieldCode: "trxLineFlagMeaning",
          fieldName: $T("sslm.supplierDocManage.model.evalDocManage.evaluateScope").$D("选择参评供应商范围"),
          fieldType: "TEXT",
          formRow: 120,
        },
        {
          fieldCode: "docTypeMeaning",
          fieldName: $T("sslm.supplierDocManage.model.evalDocManage.docType").$D("单据类型"),
          fieldType: "TEXT",
          visible: (val, item) => item.evalTplType === "BDKPI_EVAL" ? 1 : 0,
          formRow: 130,
        },
        {
          fieldCode: "docNum",
          fieldName: $T("sslm.supplierDocManage.model.evalDocManage.docNum").$D("单据"),
          fieldType: "TEXT",
          render: (val, item) => val ? <span style="color: #276ef1" onClick={(e) => {
            e.stopPropagation();
            this.openPopup("order", item);
          }}>{$T("sslm.common.view.message.view").$D("查看")}</span> : "-",
          visible: (val, item) => item.evalTplType === "BDKPI_EVAL" ? 1 : 0,
          formRow: 130,
        },
        {
          fieldCode: "cooperationDays",
          fieldName: $T("sslm.supplierDocManage.model.evalDocManage.cooperationDay").$D("合作天数"),
          fieldType: "TEXT",
          visible: (val, item) => item.trxLineFlag === 2 ? 1 : 0,
          formRow: 140,
        },
        {
          fieldCode: "evalRuleRemark",
          fieldName: $T("sslm.supplierDocManage.model.evalDocManage.ruleDesc").$D("考评规则说明"),
          fieldType: "TEXT",
          formRow: 150,
        },
        {
          fieldCode: "remark",
          fieldName: $T("sslm.common.view.archiveFilled.evaluationRemark").$D("考评说明"),
          fieldType: "TEXT",
          formRow: 160,
        },
        {
          fieldCode: "attachmentUuid",
          fieldName: $T("sslm.common.view.archiveFilled.appraisalAttachment").$D("考评附件"),
          fieldType: "TEXT",
          render: (val, item) => <span style="color: #276ef1" onClick={(e) => {
            e.stopPropagation();
            this.openPopup("uuid", item);
          }}>{$T("hipspfm.common.button.viewAttachments").$D("查看附件")}</span>,
          formRow: 170,
        },
        {
          fieldCode: "processUnitName",
          fieldName: $T("sslm.supplierDocManage.model.evalDocManage.evaluationDepart").$D("考评负责人部门"),
          fieldType: "TEXT",
          formRow: 180,
        },
        {
          fieldCode: "autoPushVendorFlag",
          fieldName: $T("sslm.supplierDocManage.model.evalDocManage.publishToSupplier").$D("审批后自动发布至供应商"),
          fieldType: "SELECT",
          displayField: "autoPushVendorFlageMeaning",
          lovCode: "HPFM.FLAG",
          editor: () => true,
          visible: (val, item) => [ "APPROVING", "PUBLISHED", "COMPLETED" ].includes(item.evalStatus) ? 1 : 0,
          formRow: 190,
        },
        {
          fieldCode: "supplierNum",
          fieldName: $T("sslm.common.model.supplierNum").$D("供应商编码"),
          fieldType: "TEXT",
          formRow: 10,
        },
        {
          fieldCode: "supplierName",
          fieldName: $T("sslm.common.model.supplierName").$D("供应商名称"),
          fieldType: "TEXT",
          formRow: 20,
        },
        {
          fieldCode: "erpSupplierNum",
          fieldName: $T("sslm.common.view.erpSupplier.erpSupplierNum").$D("erp供应商编码"),
          fieldType: "TEXT",
          formRow: 30,
        },
        {
          fieldCode: "erpSupplierName",
          fieldName: $T("sslm.common.view.erpSupplier.erpSupplierName").$D("erp供应商名称"),
          fieldType: "TEXT",
          formRow: 40,
        },
        {
          fieldCode: "categoryName",
          fieldName: $T("sslm.supplierDocManage.view.docManage.categoryName").$D("参评品类"),
          fieldType: "TEXT",
          visible: () => this.headInfo.evalGranularity === "SU+CA" ? 1 : 0,
          formRow: 50,
        },
        {
          fieldCode: "itemName",
          fieldName: $T("sslm.supplierDocManage.view.docManage.itemName").$D("参评物料"),
          fieldType: "TEXT",
          visible: () => this.headInfo.evalGranularity === "SU+IT" ? 1 : 0,
          formRow: 50,
        },
        {
          fieldCode: "categoryNameHead",
          fieldType: "EMPTY",
          render: (val, item) => item.categoryName,
        },
        {
          fieldCode: "itemNameHead",
          fieldType: "EMPTY",
          render: (val, item) => item.itemName,
        },
        {
          fieldCode: "lookCategoryName",
          fieldName: $T("sslm.supplierDocManage.view.docManage.categoryName").$D("参评品类"),
          fieldType: "TEXT",
          visible: () => this.headInfo.evalGranularity === "SU+CA" ? 1 : 0,
          render: (val, item) => <span style="color: #276ef1" onClick={(e) => {
            e.stopPropagation();
            this.openPopup("categoryName", item);
          }}>{$T("sslm.supplierDocManage.view.docManage.categoryName").$D("参评品类")}</span>,
          formRow: 50,
        },
        {
          fieldCode: "lookItemName",
          fieldName: $T("sslm.supplierDocManage.view.docManage.itemName").$D("参评物料"),
          fieldType: "TEXT",
          visible: () => this.headInfo.evalGranularity === "SU+IT" ? 1 : 0,
          render: (val, item) => <span style="color: #276ef1" onClick={(e) => {
            e.stopPropagation();
            this.openPopup("itemName", item);
          }}>{$T("sslm.supplierDocManage.view.docManage.itemName").$D("参评物料")}</span>,
          formRow: 50,
        },
        {
          fieldCode: "indicatorName",
          fieldName: $T("sslm.common.model.indicator.desc").$D("指标描述"),
          fieldType: "TEXT",
          formRow: 60,
        },
        {
          fieldCode: "indicatorCode",
          fieldName: $T("sslm.common.model.indicator.code").$D("指标编码"),
          fieldType: "TEXT",
          formRow: 70,
        },
        {
          fieldCode: "indicatorTypeMeaning",
          fieldName: $T("sslm.common.model.supplierKpiIndicator.indicatorType").$D("指标类型"),
          fieldType: "TEXT",
          formRow: 70,
        },
        {
          fieldCode: "evalStandard",
          fieldName: $T("sslm.common.model.archiveFilled.scoreStandard").$D("评分标准"),
          fieldType: "TEXT",
          formRow: 80,
        },
        {
          fieldCode: "evalWeight",
          fieldName: $T("sslm.common.view.weight").$D("权重（%）"),
          fieldType: "TEXT",
          formRow: 90,
        },
        {
          fieldCode: "evaluationPerson",
          fieldName: $T("sslm.common.view.scorer").$D("评分人"),
          fieldType: "TEXT",
          render: (val, item) => <span style="color: #276ef1" onClick={(e) => {
            e.stopPropagation();
            this.openPopup("scorer", item);
          }}>{$T("sslm.common.view.message.view").$D("查看")}</span>,
          formRow: 90,
        },
        {
          fieldCode: "scoreTypeMeaning",
          fieldName: $T("sslm.common.model.score.method").$D("评分方式"),
          fieldType: "TEXT",
          formRow: 100,
        },
        {
          fieldCode: "completeFlag",
          fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationStatus").$D("评分状态"),
          fieldType: "TEXT",
          render: (val, item) => <span style="color: #276ef1" onClick={(e) => {
            e.stopPropagation();
            this.openPopup("evaluationStatus", item);
          }}>{val === 1 ? $T("sslm.supplierDocManage.model.docManage.complete").$D("完成") : $T("sslm.supplierDocManage.model.docManage.incomplete").$D("未完成")}</span>,
          formRow: 100,
        },
        {
          fieldCode: "processRemark",
          fieldName: $T("sslm.supplierDocManage.model.docManage.processRemark").$D("系统计算说明"),
          fieldType: "TEXT",
          formRow: 110,
        },
        {
          fieldCode: "finalScore",
          fieldName: $T("sslm.supplierDocManage.model.docManage.score").$D("得分"),
          fieldType: "TEXT",
          formRow: 120,
        },
        {
          fieldCode: "score",
          fieldName: $T("sslm.supplierDocManage.model.docManage.score").$D("得分"),
          fieldType: "TEXT",
          formRow: 120,
        },
        {
          fieldCode: "checkDetailScore",
          fieldName: $T("sslm.common.model.archiveFilled.checkDetailScore").$D("校准明细得分"),
          fieldType: "TEXT",
          visible: () => this.headInfo.checkDetailFlag ? 1 : 0,
          formRow: 120,
        },
        {
          fieldCode: "dtlRemark",
          fieldName: $T("sslm.commonApplication.model.coApp.remark").$D("说明"),
          fieldType: "TEXT",
          visible: () => this.headInfo.checkDetailFlag ? 1 : 0,
          formRow: 130,
        },
        {
          fieldCode: "scoreFrom",
          fieldName: $T("sslm.common.model.archiveFilled.scoreFrom").$D("分值从"),
          fieldType: "TEXT",
          formRow: 140,
        },
        {
          fieldCode: "scoreTo",
          fieldName: $T("sslm.common.model.archiveFilled.scoreTo").$D("分值至"),
          fieldType: "TEXT",
          formRow: 140,
        },
        {
          fieldCode: "defaultScore",
          fieldName: $T("sslm.supplierDocManage.model.docManage.scoreDefault").$D("缺省分值"),
          fieldType: "TEXT",
          formRow: 150,
        },
        {
          fieldCode: "respRemarks",
          fieldName: $T("sslm.supplierDocManage.model.docManage.feedbackDescription").$D("反馈备注"),
          fieldType: "TEXT",
          formRow: 160,
        },
        {
          fieldCode: "lineScore",
          fieldName: $T("sslm.supplierDocManage.model.docManage.sumScore").$D("汇总得分"),
          fieldType: "TEXT",
          render: (val, item) => <span style="color: #276ef1" onClick={(e) => {
            e.stopPropagation();
            this.openPopup("sumScore", item);
          }}>{item.lineScore}</span>,
          formRow: 60,
        },
        {
          fieldCode: "checkCollectScore",
          fieldName: $T("sslm.supplierDocManage.model.docManage.checkCollectScore").$D("校准得分"),
          fieldType: "TEXT",
          visible: () => this.headInfo.checkCollectFlag ? 1 : 0,
          formRow: 60,
        },
        {
          fieldCode: "lineEntityRemark",
          fieldName: $T("sslm.commonApplication.model.coApp.remark").$D("说明"),
          fieldType: "TEXT",
          visible: () => this.headInfo.checkCollectFlag ? 1 : 0,
          formRow: 70,
        },
        {
          fieldCode: "suggestStrategiesMeaning",
          fieldName: $T("sslm.supplierDocManage.model.docManage.suggestedStrategy").$D("建议策略"),
          fieldType: "TEXT",
          formRow: 80,
        },
        {
          fieldCode: "levelCode",
          fieldName: $T("sslm.common.model.archiveFilled.level").$D("等级"),
          fieldType: "TEXT",
          formRow: 80,
        },
        {
          fieldCode: "checkLevelDesc",
          fieldName: $T("sslm.supplierDocManage.model.docManage.checkLevelDesc").$D("校准等级"),
          fieldType: "TEXT",
          visible: () => this.headInfo.checkLevelFlag ? 1 : 0,
          formRow: 90,
        },
        {
          fieldCode: "rankNum",
          fieldName: $T("sslm.common.model.appraisal.ranking").$D("考评排名"),
          fieldType: "TEXT",
          formRow: 90,
        },
        {
          fieldCode: "toStageDescription",
          fieldName: $T("sslm.common.model.archiveFilled.toStageDescription").$D("升降级阶段"),
          fieldType: "TEXT",
          visible: (val, item) => item.availableFlag && item.liftStageFlag ? 1 : 0,
          formRow: 100,
        },
        {
          fieldCode: "scoreVendorHead",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex >{item.supplierNum}-{item.supplierName}</SrmFlex>,
          formRow: 10,
        },
        {
          fieldCode: "loginName",
          fieldName: $T("sslm.siteInvestigateReport.modal.scorer.scoreUser").$D("评分用户"),
          fieldType: "TEXT",
          formRow: 10,
        },
        {
          fieldCode: "userName",
          fieldName: $T("sslm.siteInvestigateReport.modal.scorer.describe").$D("评分人描述"),
          fieldType: "TEXT",
          formRow: 20,
        },
        {
          fieldCode: "respWeight",
          fieldName: $T("sslm.common.view.weight").$D("权重（%）"),
          fieldType: "TEXT",
          formRow: 20,
        },
        {
          fieldCode: "isStandard",
          fieldName: $T("sslm.siteInvestigateReport.modal.scorer.isCriteria").$D("符合评分标准"),
          fieldType: "TEXT",
          formRow: 30,
        },
        {
          fieldCode: "isVeto",
          fieldName: $T("sslm.siteInvestigateReport.modal.scorer.isVeto").$D("否决该项"),
          fieldType: "TEXT",
          formRow: 40,
        },
        {
          fieldCode: "indOptName",
          fieldName: $T("sslm.siteInvestigateReport.model.mange.indOptName").$D("评分选项"),
          fieldType: "TEXT",
          formRow: 40,
        },
        {
          fieldCode: "scorerAttachmentUuid",
          fieldName: $T("sslm.siteInvestigateReport.view.tabs.attachmentInfo").$D("附件信息"),
          fieldType: "TEXT",
          render: (val, item) => <span style="color: #276ef1" onClick={(e) => {
            e.stopPropagation();
            this.openPopup("scorerAttachmentUuid", item);
          }}>{$T("sslm.common.view.message.view").$D("查看")}</span>,
          formRow: 60,
        },
        {
          fieldCode: "feedback",
          fieldName: $T("sslm.siteInvestigateReport.modal.mange.respRemarks").$D("反馈备注"),
          fieldType: "TEXT",
          formRow: 70,
        },
        {
          fieldCode: "sumScoreHead",
          fieldType: "EMPTY",
          render: (val, item) => <SrmFlex style="font-weight: 600;">{item.indicatorCode}-{item.indicatorName}</SrmFlex>,
          formRow: 10,
        },
        {
          fieldCode: "benchmarkScore",
          fieldName: $T("sslm.supplierDocManage.model.docManage.benchmarkScore").$D("基准分值"),
          fieldType: "TEXT",
          formRow: 20,
        },
        {
          fieldCode: "vetoFlag",
          fieldName: $T("sslm.supplierDocManage.model.docManage.vetoFlag").$D("已否决"),
          fieldType: "TEXT",
          formRow: 40,
        },
        {
          fieldCode: "displayTrxNum",
          fieldName: $T("sslm.common.model.archiveFilled.displayTrxNum").$D("采购单号"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "supplierCompanyName",
          fieldName: $T("sslm.common.model.archiveFilled.supplierCompanyName").$D("供应商"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "docHead",
          fieldType: "EMPTY",
          render: (val, item) => {
            const problemStatus = item.problemStatus;
            const statusType = {
              NEW: "primary",
            };
            return <SrmListHeader>
              {item.problemNum}
              <SrmButton slot="right" plain rect style={{ fontWeight: "bold" }} type={statusType[problemStatus]}>
                {item.problemStatusMeaning}
              </SrmButton>
            </SrmListHeader>;
          }
        },
        {
          fieldCode: "problemTitle",
          fieldName: $T("sslm.common.model.archiveFilled.problemTitle").$D("整改标题"),
          fieldType: "TEXT",
        },
        {
          fieldCode: "attachmentName",
          fieldType: "EMPTY",
          fieldName: $T("sslm.supplyAbility.model.supplyAbility.attachmentDesc").$D("附件名称"),
          render: (val, item) => <SrmListHeader>
            <span style="color: #276ef1" onClick={(e) => {
              e.stopPropagation();
              this.openPopup("attachmentUuid", item);
            }}>{val}</span>
          </SrmListHeader>,
          formRow: 10,
        },
        {
          fieldCode: "uploadUserName",
          fieldName: $T("sslm.supplyAbility.model.supplyAbility.realName").$D("上传人"),
          fieldType: "TEXT",
          formRow: 20,
        },
        {
          fieldCode: "uploadTime",
          fieldName: $T("sslm.supplyAbility.model.supplyAbility.uploadDate").$D("上传时间"),
          fieldType: "TEXT",
          formRow: 30,
        },
      ];
      return columnList.find((v) => v.fieldCode === code);
    },
    // 获取字段
    getcomplaintFieldInfo(code) {
      let columnList = [
        // 供应商申诉情况
        {
          fieldCode: "lineStatusMeaning",
          fieldName: $T("hzero.common.status").$D("状态"),
          fieldType: "TEXT",
          formRow: 10,
        },
        {
          fieldCode: "supplierNum",
          fieldName: $T("sslm.common.view.supplier.code").$D("供应商编码"),
          fieldType: "TEXT",
          formRow: 20,
        },
        {
          fieldCode: "supplierName",
          fieldName: $T("sslm.common.view.supplier.name").$D("供应商名称"),
          fieldType: "TEXT",
          formRow: 30,
        },
        {
          fieldCode: "lineScore",
          fieldName: $T("sslm.supplierDocManage.model.docManage.sumScore").$D("汇总得分"),
          fieldType: "TEXT",
          render: (val, item) => <span style="color: #276ef1" onClick={(e) => {
            e.stopPropagation();
            this.openPopup("sumScore", item);
          }}>{item.lineScore}</span>,
          formRow: 40,
        },
        {
          fieldCode: "levelCode",
          fieldName: $T("sslm.supplierDocManage.model.docManage.oldGrade").$D("原等级"),
          fieldType: "TEXT",
          formRow: 50,
        },
        {
          fieldCode: "rankNum",
          fieldName: $T("sslm.supplierDocManage.model.docManage.oldRanking").$D("原排名"),
          fieldType: "TEXT",
          formRow: 60,
        },
        {
          fieldCode: "appealRemark",
          fieldName: $T("sslm.common.model.feedback.complaintRemark").$D("申诉说明"),
          fieldType: "TEXT",
          formRow: 70,
        },
        {
          fieldCode: "attachmentUuid",
          fieldName: $T("sslm.common.model.evaluation.supplierAttachment").$D("供方上传附件"),
          fieldType: "UPLOAD",
          formRow: 80,
        },
        {
          fieldCode: "appealCheckCollectScore",
          fieldName: $T("sslm.common.model.feedback.calibrationGrade").$D("校准分数"),
          fieldType: "TEXT",
          formRow: 90,
        },
        {
          fieldCode: "appealLevelCode",
          fieldName: $T("sslm.common.model.feedback.newRank").$D("新等级"),
          fieldType: "TEXT",
          formRow: 100,
        },
        {
          fieldCode: "appealRankNum",
          fieldName: $T("sslm.common.model.feedback.newRanking").$D("新排名"),
          fieldType: "TEXT",
          formRow: 110,
        },
        {
          fieldCode: "appealReply",
          fieldName: $T("sslm.common.model.feedback.appealReply").$D("采购方回复"),
          fieldType: "TEXT",
          formRow: 120,
        },
        {
          fieldCode: "categoryCode",
          fieldName: $T("sslm.common.category.categoryCode").$D("品类编码"),
          fieldType: "TEXT",
          formRow: 130,
        },
        {
          fieldCode: "categoryName",
          fieldName: $T("sslm.common.category.categoryName").$D("品类名称"),
          fieldType: "TEXT",
          formRow: 140,
        },
        {
          fieldCode: "itemCode",
          fieldName: $T("sslm.common.item.itemCode").$D("物料编码"),
          fieldType: "TEXT",
          formRow: 150,
        },
        {
          fieldCode: "itemName",
          fieldName: $T("sslm.common.item.itemName").$D("物料名称"),
          fieldType: "TEXT",
          formRow: 160,
        },
      ];
      return columnList.find((v) => v.fieldCode === code);
    },
  },
  // 获取字段配置
  computed: {
    // 字段
    getColumns() {
      return (name) => {
        let list = [];
        switch (name) {
        case "baseInfoTab":
          list = [ "evalNum", "evalName", "evalTplName", "evalDimensionMeaning", "evalDimensionValueMeaning", "evalCycleMeaning", "processUserName",
            "creationDate", "evalDateFrom", "evalDateTo", "kpiMethodMeaning", "trxLineFlagMeaning", "docTypeMeaning", "docNum", "autoPushVendorFlag",
            "evalRuleRemark", "remark", "attachmentUuid", "processUnitName", "cooperationDays" ];
          break;
        case "scoreDetailTab":
          list = [ "supplierNum", "supplierName", "erpSupplierNum", "erpSupplierName", "categoryName", "itemName", "indicatorName", "indicatorCode",
            "indicatorTypeMeaning", "evalStandard", "evalWeight", "evaluationPerson", "scoreTypeMeaning", "completeFlag", "processRemark", "finalScore",
            "checkDetailScore", "dtlRemark", "scoreFrom", "scoreTo", "defaultScore", "respRemarks" ];
          break;
        case "scoreSumTab":
          list = [ "supplierNum", "supplierName", "erpSupplierNum", "erpSupplierName", "categoryName", "itemName", "lineScore", "checkCollectScore",
            "lineEntityRemark", "suggestStrategiesMeaning", "levelCode", "checkLevelDesc", "rankNum", "toStageDescription" ];
          break;
        case "scoreVendorTab":
          list = [ "scoreVendorHead", "lookCategoryName", "lookItemName", ];
          break;
        case "qectificationDocTab":
          list = [ "docHead", "problemTitle" ];
          break;
        case "complaintTab":
          list = this.granularity === "SU+CA" ?
            [ "lineStatusMeaning", "supplierNum", "supplierName", "lineScore", "levelCode", "rankNum", "appealRemark", "attachmentUuid", "appealCheckCollectScore", "appealLevelCode", "appealRankNum", "appealReply", "categoryCode", "categoryName" ] :
            this.granularity === "SU+IT" ?
              [ "lineStatusMeaning", "supplierNum", "supplierName", "lineScore", "levelCode", "rankNum", "appealRemark", "attachmentUuid", "appealCheckCollectScore", "appealLevelCode", "appealRankNum", "appealReply", "itemCode", "itemName" ] :
              [ "lineStatusMeaning", "supplierNum", "supplierName", "lineScore", "levelCode", "rankNum", "appealRemark", "attachmentUuid", "appealCheckCollectScore", "appealLevelCode", "appealRankNum", "appealReply" ];
          break;
        case "scorer":
          list = [ "loginName", "userName", "respWeight" ];
          break;
        case "evaluationStatus":
          list = [ "loginName", "userName", "respWeight", "defaultScore", "isStandard", "isVeto", "indOptName", "score", "scorerAttachmentUuid", "feedback" ];
          break;
        case "sumScore":
          list = [ "sumScoreHead", "benchmarkScore", "evalWeight", "scoreTypeMeaning", "indicatorTypeMeaning", "vetoFlag", "processRemark", "finalScore" ];
          break;
        case "order":
          list = [ "displayTrxNum", "supplierCompanyName" ];
          break;
        case "categoryName":
          list = [ "categoryNameHead" ];
          break;
        case "itemName":
          list = [ "itemNameHead" ];
          break;
        case "uuid":
          list = [ "attachmentName", "uploadUserName", "uploadTime", "remark" ];
          break;
        default:
          break;
        }
        let columns = list.map((res) => {
          if (name === "sumScore" && res === "evalWeight") {
            return {
              ...this.getFieldInfo(res),
              fieldName : $T("sslm.common.model.archiveFilled.indexWeight").$D("指标权重")
            };
          }
          if (name === "uuid" && res === "remark") {
            return {
              ...this.getFieldInfo(res),
              fieldName : $T("sslm.supplyAbility.model.supplyAbility.remark").$D("备注")
            };
          }
          if (name === "complaintTab") {
            return {
              ...this.getcomplaintFieldInfo(res),
            };
          }
          return {
            ...this.getFieldInfo(res),
          };
        });
        return columns;
      };
    },
  }
};