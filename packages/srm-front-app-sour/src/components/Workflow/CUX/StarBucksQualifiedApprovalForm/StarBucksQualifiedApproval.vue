<template>
  <div class="protocol-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('sslm.common.view.archive.baseInfo').$D('基础信息')">
        <div class="card">
          <customize :need-padding="true" :columns="getHeaderColumns" :data-source="baseInfo" type="list" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smbl.common.view.tab.categoryInfo').$D('品类信息')">
        <div v-for="(item,index) in categoryInfo" :key="index">
          <div class="card">
            <customize :need-padding="true" :columns="getCategoryColumns" :data-source="item" type="list" />
            <srm-blank size="small" theme="fill"/>
          </div>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('smbl.common.view.tab.supplierEvaluationInfo').$D('供应商评估信息')">
        <div class="card">
          <customize :need-padding="true" :columns="getLineColumns" :data-source="supplierEvaluationInfo" type="list" />
        </div>
        <!-- 适配iPhoneX -->
        <!-- <div class="bottom-space-view" /> -->
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import {
  getBaseInfoApi,
  getAccessReqsInfoApi,
  getReportReqsInfoApi
} from "./api/index";
import { SrmUtil } from "srm-mobile-ui";
import { dateFormat } from "@/utils/index";
export default {
  modules: [ "scux.supplierQuery", "sslm.common", "hipspfm.common", "scux.SupplierBackTone", "smbl.common" ],
  name: "StarBucksQualifiedApproval",
  props: {
    parameters: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      requisitionId:"",
      baseInfo:{}, // 基础信息
      supplierEvaluationInfo:{}, // 供应商评估信息
      accessResultsInfo:{}, // 供应商准入调查问卷信息
      categoryInfo:[],
      isRating: false, // 是否无需尽职调查报告
    };
  },
  computed: {
    getHeaderColumns() {
      return [
        {
          fieldCode: "header",
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) => <srm-list-header show-open-tag={false}>
            <span>{ record.qualifiedNumber }</span>
            <span slot="right" class="srm-first-span">
              {record.processStatusMeaning}
            </span>
          </srm-list-header>,
        },
        {
          fieldName: this.$T("scux.supplierQuery.modal.headerInfo.s2pName").$D("S2P供应商名称"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("scux.supplierQuery.modal.headerInfo.purpose").$D("开发目的"),
          fieldType: "TEXT",
          fieldCode: "attributeVarchar3Meaning",
        },
        this.baseInfo.remark && {
          fieldName: this.$T("scux.supplierQuery.modal.headerInfo.detailedPurpose").$D("开发目的详述"),
          fieldType: "TEXT",
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("scux.supplierQuery.modal.headerInfo.expectedDate").$D("预计合作日期"),
          fieldType: "TEXT",
          fieldCode: "attributeDate1",
          render:(val) => dateFormat(val)
        },
        // {
        //   fieldName: this.$T("scux.supplierQuery.modal.supplierQuery.categoryName").$D("品类名称"),
        //   fieldType: "TEXT",
        //   fieldCode: "availableItemCategoryName",
        // },
        // {
        //   fieldName: this.$T("scux.supplierQuery.modal.supplierQuery.supportProduct").$D("支持产品"),
        //   fieldType: "TEXT",
        //   fieldCode: "availableAdapterProducts",
        //   visible:(val) => Boolean(val)
        // },
        // {
        //   fieldName: this.$T("sslm.common.remark").$D("备注"),
        //   fieldType: "TEXT",
        //   fieldCode: "availableRemark",
        //   visible:(val) => Boolean(val)
        // },
        {
          fieldName: this.$T("sslm.common.model.evaluation.attachment").$D("附件"),
          fieldType: "TEXT",
          fieldCode: "headerAttachmentUrl",
          render: (val, item) => {
            if (val) {
              return <srm-button plain={true} onClick={(e) => {
                e.stopPropagation();
                this.previewFile(item);
              }}>
                { this.$T("hipspfm.common.button.viewAttachments").$D("查看附件") }
              </srm-button>;
            }
            return <srm-button plain={true} type="info">
              { this.$T("smbl.common.message.noAttachment").$D("暂无附件") }
            </srm-button>;
          }
        },
      ];
    },
    getCategoryColumns() {
      return [
        {
          fieldName: this.$T("scux.supplierQuery.modal.supplierQuery.categoryName").$D("品类名称"),
          fieldType: "TEXT",
          fieldCode: "itemCategoryName",
        },
        {
          fieldName: this.$T("scux.supplierQuery.modal.supplierQuery.supportProduct").$D("支持产品"),
          fieldType: "TEXT",
          fieldCode: "adapterProducts",
          visible:(val) => Boolean(val)
        },
        {
          fieldName: this.$T("sslm.common.remark").$D("备注"),
          fieldType: "TEXT",
          fieldCode: "evaluateRemark",
          visible:(val) => Boolean(val)
        },
      ];
    },
    getLineColumns() {
      return [
        {
          fieldName: this.$T("scux.supplierQuery.view.accessQuestionnaireEvaluationResults").$D("准入调查问卷评估结果"),
          fieldType: "TEXT",
          fieldCode: "ratingMeaning",
          // formRow: 40,
          // formCol: 10,
        },
        !this.isRating && {
          fieldName: this.$T("scux.supplierQuery.view.supplierQuery.report").$D("尽职调查报告"),
          fieldCode: "reportAttachmentUuid",
          render: (val, record) =>
            <SrmUpload showIcon={false} color="blue"
              descTitle={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")}
              attachmentUuid={record.reportAttachmentUuid}/>
        },
        !this.isRating && {
          fieldName: this.$T("scux.SupplierBackTone.model.labelManagement.ecAssessmentResults").$D("E&C评估结果"),
          fieldType: "TEXT",
          fieldCode: "ecAttributeVarchar1",
          render:(val) => {
            if (val === "GREEN") {
              return <srm-button plain={true} type="success">
                { val }
              </srm-button>;
            } else if (val === "RED") {
              return <srm-button plain={true} type="danger">
                { val }
              </srm-button>;
            }
            return val;
          }
        },
        !this.isRating && {
          fieldName: this.$T("scux.supplierQuery.modal.assessment.comments").$D("E&C评语"),
          fieldType: "TEXT",
          fieldCode: "ecAttributeLongtext1",
        },
        !this.isRating && {
          fieldName: this.$T("scux.supplierQuery.model.finScore").$D("FIN评分"),
          fieldType: "TEXT",
          fieldCode: "ecAttributeVarchar6",
        },
        !this.isRating && {
          fieldName: this.$T("scux.supplierQuery.model.finAssessmentResults").$D("FIN评分结果"),
          fieldType: "TEXT",
          fieldCode: "finAttributeVarchar1",
          render:(val) => {
            if (val === "GREEN") {
              return <srm-button plain={true} type="success">
                { val }
              </srm-button>;
            } else if (val === "RED") {
              return <srm-button plain={true} type="danger">
                { val }
              </srm-button>;
            }
            return val;
          }
        },
        !this.isRating && {
          fieldName: this.$T("scux.supplierQuery.modal.assessment.FINComments").$D("FIN评语"),
          fieldType: "TEXT",
          fieldCode: "finAttributeLongtext1",
        },
      ];
    },
  },
  mounted() {
    this.$loading.show();
    // 获取工作流表单主键id
    this.requisitionId = this.parameters.requisitionId;
    try {
      this.requestData();
    } catch (err) {
      this.$loading.hide();
      // eslint-disable-next-line no-console
      console.log(err, "error");
    } finally {
      this.$loading.hide();
    }
  },
  methods: {
    async requestData() {
      let baseInfoRes = await getBaseInfoApi(this.requisitionId);
      let accessResultsInfo = await getAccessReqsInfoApi(this.requisitionId);
      let reportReqsInfo = await getReportReqsInfoApi(this.requisitionId);
      this.baseInfo = baseInfoRes;
      const qualifiedAttachmentFlag = baseInfoRes.qualifiedAttachmentLines.length > 0;
      const ecIndRespFlag = baseInfoRes.ecIndRespList.length > 0;
      const finIndRespFlag = baseInfoRes.finIndRespList.length > 0;
      // console.log("baseInfoRes::", baseInfoRes);
      // const qualifiedSupRecFlag = baseInfoRes.qualifiedSupRecList.length > 0;
      const reportReqsInfoFlag = reportReqsInfo.length > 0;
      // 品类信息筛选当前准入品类.
      this.categoryInfo = baseInfoRes.qualifiedSupRecList.filter((e) => e.remark !== "old") || [];
      // 构造供应商评估信息
      // this.baseInfo.availableItemCategoryName = qualifiedSupRecFlag ? baseInfoRes.qualifiedSupRecList[0].itemCategoryName : ""; // 品类名称
      // this.baseInfo.availableAdapterProducts = qualifiedSupRecFlag ? baseInfoRes.qualifiedSupRecList[0].adapterProducts : ""; // 支持产品
      // this.baseInfo.availableRemark = qualifiedSupRecFlag ? baseInfoRes.qualifiedSupRecList[0].evaluateRemark : ""; // 备注
      this.baseInfo.headerAttachmentUrl = qualifiedAttachmentFlag ? baseInfoRes.qualifiedAttachmentLines[0].attachmentUrl : ""; // 附件
      this.baseInfo.headerAttachmentDesc = qualifiedAttachmentFlag ? baseInfoRes.qualifiedAttachmentLines[0].attachmentDesc : ""; // 附件名称
      this.baseInfo.headerCreationDate = qualifiedAttachmentFlag ? baseInfoRes.qualifiedAttachmentLines[0].creationDate : ""; // 附件创建日期

      this.supplierEvaluationInfo = {
        ratingMeaning: accessResultsInfo.ratingMeaning, // 准入调查问卷评估结果
        ecAttributeVarchar1: ecIndRespFlag ? baseInfoRes.ecIndRespList[0].attributeVarchar1 : "", // E&C评估结果
        ecAttributeLongtext1: ecIndRespFlag ? baseInfoRes.ecIndRespList[0].attributeLongtext1 : "", // E&C评语
        ecAttributeVarchar6: finIndRespFlag ? baseInfoRes.finIndRespList[0].attributeVarchar6 : "", // FIN评分
        finAttributeVarchar1: finIndRespFlag ? baseInfoRes.finIndRespList[0].attributeVarchar1 : "", // FIN评分结果
        finAttributeLongtext1: finIndRespFlag ? baseInfoRes.finIndRespList[0].attributeLongtext1 : "", // FIN评语
        reportAttachmentUuid: reportReqsInfoFlag ? reportReqsInfo.reverse()[0].attachmentUuid : "", // 尽职调查报告附件
      };

      // 是否无需尽职调查报告
      this.isRating = accessResultsInfo.rating === "LOW";

      // console.log("初始化数据：", this.baseInfo, this.supplierEvaluationInfo);
    },
    // 预览附件
    async previewFile(item) {
      let fileUrl = item.headerAttachmentUrl;
      if (!fileUrl) {
        this.$notification.open({
          message: this.$T("smbl.common.view.message.attachmentPreviewFailed").$D("附件预览失败"),
        });
        return;
      }
      SrmUtil.previewFile({
        bucketName: SrmUtil.getDefaultBucketName(),
        creationDate: item.headerCreationDate,
        fileName: item.headerAttachmentDesc,
        fileUrl: fileUrl,
      });
    },
  }
};
</script>

<style lang="stylus" scoped>
.protocol-approval {
  .card {
    padding-top: 10px;
  }
  .cutting-line {
    margin: 0px 15px;
    height: 1px;
    background: var(--split-line-color-primary);
  }
  >>> .icon-info-circle {
    color: var(--font-color-disable);
  }
}

>>> .srm-popup-content {
  background: var(--background-color-empty-second);
}
.more-info-popup {
  >>> .srm-popup-content {
    background: var(--background-color-empty);
  }
}

.bottom-space-view {
  height: 0px;
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
}

.srm-first-span {
  color:#FFC043
}

</style>