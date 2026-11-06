<template>
  <!-- 组件 -->
  <div v-loading="initLoading" style="min-height: 400px;">
    <section v-if="loading" class="mainDetail">
      <div ref="wrapper" class="contentWrap wrapper">
        <srm-scroll-tab class="content">
          <!-- 基本信息 -->
          <srm-scroll-tab-item :label="getLanguageDefine('baseInfoTab')">
            <ul style="padding: 16px 15px;">
              <customize
                :columns="getColumns('baseInfoTab')"
                :data-source="headInfo"
                :code="getCustomizeCode('baseInfoTab')"
                type="list"
                :need-padding="false"/>
            </ul>
          </srm-scroll-tab-item>

          <!-- 评分明细 -->
          <srm-scroll-tab-item :label="getLanguageDefine('scoreDetailTab')">
            <srm-list :scrollable="false"
                      :data-set="scoreDetailDataSet"
                      :columns="getColumns('scoreDetailTab')"
                      :customize-code="getCustomizeCode('scoreDetailTab')"
                      height="auto"
                      style="height: auto"/>
          </srm-scroll-tab-item>

          <!-- 评分汇总 -->
          <srm-scroll-tab-item :label="getLanguageDefine('scoreSumTab')">
            <srm-list :scrollable="false"
                      :data-set="scoreSumDataSet"
                      :columns="getColumns('scoreSumTab')"
                      :customize-code="getCustomizeCode('scoreSumTab')"
                      height="auto"
                      style="height: auto"/>
          </srm-scroll-tab-item>

          <!-- 参评供应商 -->
          <srm-scroll-tab-item :label="getLanguageDefine('scoreVendorTab')">
            <srm-list :scrollable="false"
                      :data-set="scoreVendorDataSet"
                      :columns="getColumns('scoreVendorTab')"
                      :customize-code="getCustomizeCode('scoreVendorTab')"
                      height="auto"
                      style="height: auto"/>
          </srm-scroll-tab-item>

          <!-- 关联整改单据 -->
          <srm-scroll-tab-item v-if="[ 'FINAL_COLLECTED', 'APPROVING', 'COMPLETED', 'PUBLISHED' ].includes(headInfo.evalStatus) && qectificationDocDataSet.data.length > 0"
                               :label="getLanguageDefine('qectificationDocTab')">
            <srm-list :scrollable="false"
                      :data-set="qectificationDocDataSet"
                      :columns="getColumns('qectificationDocTab')"
                      :customize-code="getCustomizeCode('qectificationDocTab')"
                      height="auto"
                      style="height: auto"/>
          </srm-scroll-tab-item>

          <!-- 供应商申诉情况 -->
          <srm-scroll-tab-item v-if="showComplaint"
                               :label="getLanguageDefine('complaintTab')">
            <srm-list :scrollable="false"
                      :data-set="complaintDataSet"
                      :columns="getColumns('complaintTab')"
                      :customize-code="getCustomizeCode('complaintTab')"
                      height="auto"
                      style="height: auto"/>
          </srm-scroll-tab-item>
        </srm-scroll-tab>
      </div>

      <!-- 弹框 -->
      <srm-popup :visible.sync="visible"
                 :show-header="false"
                 position="right"
                 height="100%">
        <!-- 考评附件 -->
        <srm-list v-if="popName === 'uuid' "
                  :scrollable="false"
                  :data-set="attachDataSet"
                  :columns="getColumns('uuid')"
                  :customize-code="getCustomizeCode('uuid')"
                  height="auto"
                  style="height: auto"/>
        <!-- 评分人信息 -->
        <srm-list v-if="popName === 'scorer' "
                  :scrollable="false"
                  :data-set="scorerDataSet"
                  :columns="getColumns('scorer')"
                  :customize-code="getCustomizeCode('scorer')"
                  height="auto"
                  style="height: auto"/>
        <!-- 评分状态 -->
        <srm-list v-if="popName === 'evaluationStatus' "
                  :scrollable="false"
                  :data-set="evaluationStatusDataSet"
                  :columns="getColumns('evaluationStatus')"
                  :customize-code="getCustomizeCode('evaluationStatus')"
                  height="auto"
                  style="height: auto"/>
        <!-- 汇总得分 -->
        <div v-if="popName === 'sumScore' ">
          <srm-flex style="padding: 16px 15px;font-size: 14px; color: #333333;border-bottom: 8px solid var(--background-color-empty-second); line-height: 20px;">
            {{ $T("sslm.supplierDocManage.model.docManage.choseEvalGranularity").$D("考评颗粒度") }}：{{ supplierName }}
          </srm-flex>
          <srm-list v-if="popName === 'sumScore' "
                    :scrollable="false"
                    :data-set="sumScoreDataSet"
                    :columns="getColumns('sumScore')"
                    :customize-code="getCustomizeCode('sumScore')"
                    height="auto"
                    style="height: auto"/>
        </div>
        <!-- 单据 -->
        <srm-list v-if="popName === 'order' "
                  :scrollable="false"
                  :data-set="orderDataSet"
                  :columns="getColumns('order')"
                  :customize-code="getCustomizeCode('order')"
                  height="auto"
                  style="height: auto"/>
        <!-- 参评品类/参评物料 :customize-code="getCustomizeCode(popName)" -->
        <srm-list v-if="['categoryName','itemName'].includes(popName)"
                  :scrollable="false"
                  :data-set="categoryAndItemDataSet"
                  :columns="getColumns(popName)"
                  height="auto"
                  style="height: auto"/>
      </srm-popup>
    </section>
  </div>
</template>

<script>
import mx from "./mixin";
import { saveApi } from "./api";
import { DataSet, $T } from "srm-mobile-ui";
import { previewFile } from "srm-mobile-ui/src/utils/index";
import { scoreDetailDs, scoreSumDs, scoreVendorDs, scorerDs, evaluationStatusDs, sumScoreDs, qectificationDocDs, categoryAndItemDs, attachDs, complaintDs } from "./datasource/ds";
export default {
  modules: [ "sslm.supplierDocManage", "sslm.common", "sslm.siteInvestigateReport", "sslm.commonApplication", "hipspfm.common", "sslm.supplyAbility", "hzero.common" ],
  name: "KpiEvalDetailApproval",
  mixins: [ mx ],
  props: {
    parameters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      // 评分明细
      scoreDetailDataSet: new DataSet(scoreDetailDs()),
      // 评分汇总
      scoreSumDataSet: new DataSet(scoreSumDs()),
      // 参评供应商
      scoreVendorDataSet: {},
      // 关联整改报告
      qectificationDocDataSet: {},
      // 评分人信息
      scorerDataSet: {},
      // 评分状态
      evaluationStatusDataSet: {},
      // 汇总得分
      sumScoreDataSet: {},
      // 单据
      orderDataSet: {},
      // 参评品类/参评物料
      categoryAndItemDataSet: new DataSet(categoryAndItemDs()),
      // 考评附件
      attachDataSet: {},
      // 供应商申诉情况
      complaintDataSet: {},
      visible: false,
      popName: "",
      supplierName: "",
      fileList: [],
      forbidBeforeApproveFlag: 0,
    };
  },
  mounted() {
    this.forbidBeforeApproveFlag = this.parameters.forbidBeforeApproveFlag;
    this.scoreVendorDataSet = new DataSet(scoreVendorDs(this.changeReqId));
    this.scoreVendorDataSet.refresh();
    this.complaintDataSet = new DataSet(complaintDs(this.changeReqId, this.parameters.evalLineIDS));
    this.complaintDataSet.refresh();
    this.qectificationDocDataSet = new DataSet(qectificationDocDs(this.changeReqId, {
      orderSource: "kpiEval",
    }));
    this.qectificationDocDataSet.refresh();
  },
  methods: {
    openPopup(name, item) {
      let data = [];
      switch (name) {
      // 考评附件
      case "uuid":
        this.popName = "uuid";
        this.attachDataSet = new DataSet(attachDs(item.evalHeaderId));
        this.attachDataSet.refresh();
        this.visible = true;
        break;
      case "attachmentUuid":
        previewFile({
          bucketName: "private-bucket",
          fileUrl: item.attachmentUrl,
          fileName: item.attachmentName,
        });
        break;
      // 附件
      case "scorerAttachmentUuid":
        this.$showFileList({
          title: $T("sslm.common.model.evaluation.attachment").$D("附件"),
          attachmentUuid: item[name],
        });
        break;
      // 评分人信息
      case "scorer":
        this.scorerDataSet = new DataSet(scorerDs(item.evalDtlId));
        this.scorerDataSet.refresh();
        this.visible = true;
        this.popName = "scorer";
        break;
      // 评分状态
      case "evaluationStatus":
        this.evaluationStatusDataSet = new DataSet(evaluationStatusDs(item.evalDtlId));
        this.evaluationStatusDataSet.refresh();
        this.visible = true;
        this.popName = "evaluationStatus";
        break;
      // 汇总得分
      case "sumScore":
        this.supplierName = `${item.supplierName}${item.categoryName || item.itemName ? ` + ${ item.categoryName || item.itemName }` : ""}`;
        this.sumScoreDataSet = new DataSet(sumScoreDs(item.evalLineId));
        this.sumScoreDataSet.refresh();
        this.visible = true;
        this.popName = "sumScore";
        break;
      // 参评品类
      case "categoryName":
        this.categoryAndItemDataSet = new DataSet(categoryAndItemDs());
        data = this.scoreSumDataSet.data.map((res) => {
          if (res.supplierNum === item.supplierNum) {
            return { "categoryName" : `${res.categoryCode} - ${res.categoryName}` };
          }
        }).filter((e) => e);
        this.categoryAndItemDataSet.setData(data);
        this.visible = true;
        this.popName = "categoryName";
        break;
      // 参评物料
      case "itemName":
        this.categoryAndItemDataSet = new DataSet(categoryAndItemDs());
        data = this.scoreSumDataSet.data.map((res) => {
          if (res.supplierNum === item.supplierNum) {
            return { "itemName" : `${res.itemCode} - ${res.itemName}` };
          }
        }).filter((e) => e);
        this.categoryAndItemDataSet.setData(data);
        this.visible = true;
        this.popName = "itemName";
        break;
      // 单据
      default:
        this.visible = true;
        this.popName = "order";
        break;
      }
    },
    // 审批前调用保存
    beforeApprove() {
      if (!this.forbidBeforeApproveFlag) {
        return new Promise((resolve, reject) => {
          saveApi({
            ...this.headInfo,
            autoPushVendorFlag: Number(this.headInfo.autoPushVendorFlag ? this.headInfo.autoPushVendorFlag : "0"),
            docNum: this.headInfo.docNum,
            docType: this.headInfo.docType,
            evalCycle: this.headInfo.evalCycle,
            evalDateFrom: this.headInfo.evalDateFrom,
            evalDateTo: this.headInfo.evalDateTo,
            evalDimension: this.headInfo.evalDimension,
            evalDimensionValue: this.headInfo.evalDimensionValue,
            evalHeaderId: this.headInfo.evalHeaderId,
            evalName: this.headInfo.evalName,
            evalNum: this.headInfo.evalNum,
            evalStatus: this.headInfo.evalStatus,
            evalTplId: this.headInfo.evalTplId,
            finalCollectFlag: this.headInfo.finalCollectFlag,
            objectVersionNumber: this.headInfo.objectVersionNumber,
            processUnitId: this.headInfo.processUnitId
          }).then((res) => {
            if (res.evalHeaderId) {
              resolve(true);
            } else {
              reject(false);
            }
          });
        });
      }
      return new Promise((resolve) => {
        resolve(true);
      });

    }
  }
};
</script>
