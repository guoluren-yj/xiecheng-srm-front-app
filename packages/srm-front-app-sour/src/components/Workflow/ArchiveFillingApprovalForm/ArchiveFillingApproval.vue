<template>
  <div style="min-height: 400px;">
    <div>
      <srm-scroll-tab>
        <!-- 基本信息 -->
        <srm-scroll-tab-item :label="$T('sslm.common.model.archive.baseInfo').$D('基本信息')">
          <srm-list :scrollable="false"
                    :data-set="baseDataSet"
                    :columns="getBaseColumns"
                    customize-code="SMBL.WORKFLOW.ARCHIVE_FILLING_APPROVAL.BASE_INFO"
                    height="auto"
                    style="height: auto"/>
        </srm-scroll-tab-item>

        <!-- 评分明细 -->
        <srm-scroll-tab-item :label="$T('sslm.common.model.score.detail').$D('评分明细')">
          <srm-list :scrollable="false"
                    :data-set="scoreDataSet"
                    :columns="getScoreColumns"
                    customize-code="SMBL.WORKFLOW.ARCHIVE_FILLING_APPROVAL.SCORE_INFO"
                    height="auto"
                    style="height: auto"/>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>
  </div>
</template>

<script>
import { getAppraisalAttachmentApi } from "./api";
import { dateFormat } from "@/utils/index";
import { DataSet, $T } from "srm-mobile-ui";
import { commonDs, baseDs, scoreDataSet } from "./datasource/indexDs.js";
export default {
  modules: [ "sslm.common", "sslm.enterpriseInform", "sslm.supplierDocManage", "smbl.common" ],
  name: "ArchiveFillingApproval",
  props: {
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      appraisalAttachmentList:[],
      appraisalAttachmentCount:0,
      evalGranularity:"",
      // 基本信息
      baseDataSet: new DataSet(commonDs()),
      // 评分明细
      scoreDataSet: new DataSet(commonDs()),
    };
  },
  computed: {
    // 基本信息
    getBaseColumns() {
      const columns = [
        {
          formRow: 10,
          formCol: 10,
          fieldName: $T("sslm.common.model.archive.fileCode").$D("档案编码"),
          fieldCode: "evalNum",
          fieldType: "TEXT",
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: $T("sslm.common.model.archive.fileDescribe").$D("档案描述"),
          fieldCode: "evalName",
          fieldType: "TEXT",
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: $T("sslm.common.model.archive.status").$D("档案状态"),
          fieldCode: "evalStatusMeaning",
          fieldType: "TEXT",
        },
        {
          formRow: 30,
          formCol: 20,
          fieldName: $T("sslm.common.model.archive.evaluation.evalTplName").$D("考评模板"),
          fieldCode: "evalTplName",
          fieldType: "TEXT",
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: $T("sslm.common.model.archive.evaluation.dimension").$D("考评维度"),
          fieldCode: "evalDimensionMeaning",
          fieldType: "TEXT",
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: $T("sslm.common.model.archive.evaluation.dimensionValue").$D("维度值"),
          fieldCode: "evalDimensionValueMeaning",
          fieldType: "TEXT",
        },
        {
          formRow: 60,
          formCol: 10,
          fieldName: $T("sslm.common.model.archive.evaluation.cycle").$D("考评周期"),
          fieldCode: "evalCycleMeaning",
          fieldType: "TEXT",
        },
        {
          formRow: 60,
          formCol: 20,
          fieldName: $T("sslm.common.model.archive.evaluation.charger").$D("考评负责人"),
          fieldCode: "processUserName",
          fieldType: "TEXT",
        },
        {
          formRow: 70,
          formCol: 10,
          fieldName: $T("sslm.common.model.archive.create.time").$D("建档时间"),
          fieldCode: "creationDate",
          fieldType: "TEXT",
        },
        {
          formRow: 80,
          formCol: 10,
          fieldName: $T("sslm.common.model.evaluation.date.after").$D("考评日期从"),
          fieldCode: "evalDateFrom",
          fieldType: "TEXT",
          render: (val) => dateFormat(val),
        },
        {
          formRow: 90,
          formCol: 10,
          fieldName: $T("sslm.common.model.evaluation.date.before").$D("考评日期至"),
          fieldCode: "evalDateTo",
          fieldType: "TEXT",
          render: (val) => dateFormat(val),
        },
        {
          formRow: 100,
          formCol: 10,
          fieldName: $T("sslm.common.model.evaluation.rule").$D("考评规则说明"),
          fieldCode: "evalRuleRemark",
          fieldType: "TEXT",
        },
        {
          formRow: 110,
          formCol: 10,
          fieldName: $T("sslm.common.model.evaluation.remark").$D("考评说明"),
          fieldCode: "remark",
          fieldType: "TEXT",
        },
        {
          formRow: 120,
          formCol: 10,
          fieldName: $T("sslm.common.model.evaluation.appraisalAttachment").$D("考评附件"),
          fieldCode: "appraisalAttachment",
          fieldType: "TEXT",
          render: () => <SrmButton plain rect onClick={() => this.showHeaderAttachment()}>
            {this.$T("smbl.common.button.viewAttachments").$D("查看附件")} ({this.appraisalAttachmentCount})
          </SrmButton>
        },
      ];
      return columns;
    },
    // 评分详情
    getScoreColumns() {
      const columns = [
        {
          fieldCode: "supplierNum",
          fieldType:"EMPTY",
          formRow:0,
          render:(val, record) => <SrmListHeader>
            <span>{$T("sslm.supplierDocManage.model.docManage.venderCode").$D("供应商编码")}：{record.supplierNum}</span>
            <span
              slot="right"
              class="item-num">
              {record.bidLineItemNum}
            </span>
          </SrmListHeader>
        },
        {
          formRow: 10,
          formCol: 10,
          fieldName: $T("sslm.supplierDocManage.model.docManage.venderName").$D("供应商名称"),
          fieldCode: "supplierName",
          fieldType: "TEXT",
        },
        {
          formRow: 20,
          formCol: 10,
          fieldName: $T("sslm.supplierDocManage.model.docManage.erpVenderCode").$D("erp供应商编码"),
          fieldCode: "erpSupplierNum",
          fieldType: "TEXT",
        },
        {
          formRow: 30,
          formCol: 10,
          fieldName: $T("sslm.supplierDocManage.model.docManage.erpVenderName").$D("erp供应商名称"),
          fieldCode: "erpSupplierName",
          fieldType: "TEXT",
        },
        {
          formRow: 40,
          formCol: 10,
          fieldName: $T("sslm.common.model.archiveFilled.scoreItem").$D("评分细则"),
          fieldCode: "indicatorName",
          fieldType: "TEXT",
        },
        {
          formRow: 50,
          formCol: 10,
          fieldName: $T("sslm.common.model.archiveFilled.completeFlag").$D("评分状态"),
          fieldCode: "completeFlagMeaning",
          fieldType: "TEXT",
        },
        this.evalGranularity === "SU+IT" && {
          formRow: 60,
          formCol: 10,
          fieldName: $T("sslm.common.model.archiveFilled.item").$D("物料"),
          fieldCode: "itemName",
          fieldType: "TEXT",
          render: (val, record) => record.itemName
        },
        this.evalGranularity === "SU+CA" && {
          formRow: 70,
          formCol: 10,
          fieldName: $T("sslm.common.model.archiveFilled.purchaseCategory").$D("采购品类"),
          fieldCode: "itemName",
          fieldType: "TEXT",
          render: (val, record) => record.categoryName
        },
        this.evalGranularity === "RULE_SU" && {
          formRow: 80,
          formCol: 10,
          fieldName: $T("sslm.common.model.archiveFilled.suppilerRule").$D("供应商规则"),
          fieldCode: "itemName",
          fieldType: "TEXT",
          render: (val, record) => record.categoryName
        },
        {
          formRow: 90,
          formCol: 10,
          fieldName: $T("sslm.supplierDocManage.model.docManage.evaluationStandard").$D("评分标准"),
          fieldCode: "evalStandard",
          fieldType: "TEXT",
        },
        {
          formRow: 100,
          formCol: 10,
          fieldName: $T("sslm.supplierDocManage.model.docManage.indicatorType").$D("指标类型"),
          fieldCode: "indicatorTypeMeaning",
          fieldType: "TEXT",
        },
        {
          formRow: 100,
          formCol: 20,
          fieldName: $T("sslm.supplierDocManage.model.docManage.score").$D("得分"),
          fieldCode: "finalScore",
          fieldType: "TEXT",
        },
        {
          formRow: 110,
          formCol: 10,
          fieldName: $T("sslm.supplierDocManage.model.docManage.evalWeight").$D("指标权重%"),
          fieldCode: "evalWeight",
          fieldType: "TEXT",
        },
        {
          formRow: 120,
          formCol: 10,
          fieldName: $T("sslm.supplierDocManage.model.docManage.scoreFrom").$D("分值从"),
          fieldCode: "scoreFrom",
          fieldType: "TEXT",
        },
        {
          formRow: 120,
          formCol: 20,
          fieldName: $T("sslm.supplierDocManage.model.docManage.scoreTo").$D("分值至"),
          fieldCode: "scoreTo",
          fieldType: "TEXT",
        },
        {
          formRow: 130,
          formCol: 10,
          fieldName: $T("sslm.supplierDocManage.model.docManage.gradersWeight").$D("评分人权重%"),
          fieldCode: "respWeight",
          fieldType: "TEXT",
        },
        {
          formRow: 130,
          formCol: 20,
          fieldName: $T("sslm.supplierDocManage.model.docManage.isStandard").$D("符合评分标准"),
          fieldCode: "isStandardChange",
          fieldType: "TEXT",
        },
        {
          formRow: 140,
          formCol: 10,
          fieldName: $T("sslm.common.model.archiveFilled.isVeto").$D("否决该项"),
          fieldCode: "isVetoChange",
          fieldType: "TEXT",
        },
        {
          formRow: 140,
          formCol: 20,
          fieldName: $T("sslm.supplierDocManage.model.archiveFilled.indOptName").$D("评分选项"),
          fieldCode: "indOptName",
          fieldType: "TEXT",
        },
        {
          formRow: 150,
          formCol: 10,
          fieldName: $T("sslm.supplierDocManage.model.docManage.feedbackDescription").$D("反馈备注"),
          fieldCode: "remark",
          fieldType: "TEXT",
        },
        {
          formRow: 160,
          formCol: 10,
          fieldName: $T("sslm.supplierDocManage.model.docManage.transmitReason").$D("转交原因"),
          fieldCode: "transformReason",
          fieldType: "TEXT",
        },
        {
          formRow: 170,
          formCol: 10,
          fieldName: $T("sslm.common.model.evaluation.attachment").$D("附件"),
          fieldCode: "scorerAttachmentUuid",
          fieldType: "UPLOAD",
        },
      ];
      return columns;
    },
  },
  mounted() {
    this.$loading.show();
    try {
      const { evalHeaderId, submitUserId } = this.parameters || {};
      this.baseDataSet = new DataSet(baseDs({ evalHeaderId, submitUserId }));
      this.scoreDataSet = new DataSet(scoreDataSet({ evalHeaderId, submitUserId }));
      this.baseDataSet.refresh().then(() => {
        const { evalGranularity } = this.baseDataSet.current && this.baseDataSet.current.data || {};
        this.evalGranularity = evalGranularity || "";
      });
      this.getAppraisalAttachmentInfo(evalHeaderId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    } finally {
      this.$loading.hide();
    }
  },
  methods: {
    // 考评附件回调
    showHeaderAttachment() {
      this.$showFileList({
        fileList: this.appraisalAttachmentList.map((e) => ({
          fileUrl: e.attachmentUrl,
          fileName: e.attachmentName,
          fileSize: e.attachmentSize,
          creationDate: e.creationDate,
          bucketName: "private-bucket",
        }))
      });
    },
    // 获取考评附件
    getAppraisalAttachmentInfo(evalHeaderId) {
      const getUserId = JSON.parse(window.localStorage.getItem("userInfo")).id;
      const params = {
        evalHeaderId,
        page: 0,
        size: 10000,
        uploadUserId: getUserId
      };
      getAppraisalAttachmentApi(params).then((res) => {
        if (res && res.content) {
          this.appraisalAttachmentList = res.content;
          this.appraisalAttachmentCount = res.totalElements;
        }
      });
    }
  }
};
</script>
