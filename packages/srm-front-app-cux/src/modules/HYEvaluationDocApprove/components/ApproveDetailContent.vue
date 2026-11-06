<template>
  <!-- 内容区 -->
  <div>
    <div class="title">
      头信息
    </div>
    <Customize :need-padding="true" :data-source="headerInfo" :columns="getHeaderInfoColumns()"/>
    <div class="title">
      行信息
    </div>
    <srm-list :data-set="dataSet" :scrollable="false" :columns="getLineColumns()"/>
    <div style="height: 74px"/>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import lineDS from "../datasource/lineDS";
import { getDetailApi } from "../api";

export default {
  modules: [ "scux.procurementDecisionReview", "scux.commercialTermsPre", "scux.purchaseRecordApproval", "spcm.common", "hipspfm.common", "scux.myModoList", "sinv.common", "scux.evaluation", "scux.supplierEvaluationReport" ],
  name: "ApproveDetailContent",
  components: {},
  props: {
    id: {
      type: String | Number,
      require: false
    }
  },
  data() {
    return {
      headerInfo: {},
      schemeReviewId: "",
      dataSet: new DataSet(lineDS())
    };
  },
  beforeMount() {
    this.schemeReviewId = this.$route.query.schemeReviewId;
    this.dataSet.addPathParameter("headerId", this.id || this.schemeReviewId);
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getHeaderInfoColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "comprehensiveArchiveCode",
          fieldName: this.$T("scux.myModoList.model.archiveNumber").$D("档案编码"),
        },
        {
          formRow: 2,
          fieldCode: "archiveDescribe",
          fieldName: this.$T("scux.myModoList.model.archiveDescribe").$D("档案描述"),
          fieldType: "EMPTY",
          render: (val) => {
            return <srm-flex>
              <span
                style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.myModoList.model.archiveDescribe").$D("档案描述")}：</span>
              <span style="word-break: break-all">
                {val}
              </span>
            </srm-flex>;
          }
        },
        {
          formRow: 3,
          fieldCode: "supplierName",
          fieldName: this.$T("scux.myModoList.model.supplierName").$D("供应商"),
        },
        {
          formRow: 4,
          fieldCode: "totalScore",
          fieldName: this.$T("scux.myModoList.model.totalScore").$D("综合得分"),
        },
        {
          formRow: 5,
          fieldCode: "finalConclusion",
          fieldName: this.$T("scux.myModoList.model.finalConclusion").$D("最终结论"),
        },
        {
          formRow: 6,
          fieldCode: "attachmentUuid",
          fieldName: this.$T("spcm.common.view.message.title.purchaseAttachmentList").$D("附件信息"),
          render: (val) => {
            return (
              <div>
                <SrmUpload
                  attachmentUuid={val}
                  show-icon={false}
                  color="#276EF1"
                  title={this.$T("scux.commercialTermsPre.model.annexUuid").$D("相关附件")}
                  desc-title={this.$T(
                    "scux.purchaseRecordApproval.view.button.uploadview"
                  ).$D("附件查看")}
                />
              </div>
            );
          },
        },
        {
          formRow: 8,
          fieldCode: "remark",
          fieldType: "EMPTY",
          render: (val) => {
            return <srm-flex>
              <span
                style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.relatedInstructions").$D("相关说明")}：</span>
              <span>{val}</span>
            </srm-flex>;
          }
        },
      ];
    },
    getLineColumns() {
      return [ {
        formRow: 1,
        fieldCode: "evalName",
        fieldType: "EMPTY",
        render: (val) => {
          return <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">
              {this.$T("scux.myModoList.model.archiveDescribe").$D("档案描述")}：
            </span>
            <span>
              {val}
            </span>
          </srm-flex>;
        }
      }, {
        formRow: 2,
        fieldCode: "lineScore",
        render: (val) => val || "-"
      }, {
        formRow: 2,
        fieldCode: "lineNum",
      }, {
        formRow: 3,
        fieldCode: "evalDimensionMeaning",
        render: (val) => val || "-"
      }, {
        formRow: 3,
        fieldCode: "checkTypeMeaning",
        render: (val) => val || "-"
      }, {
        formRow: 4,
        fieldCode: "evalCycleMeaning",
        render: (val) => val || "-"
      }, {
        formRow: 4,
        fieldCode: "contractName",
        render: (val) => val || "-"
      }, {
        formRow: 5,
        fieldCode: "evalDateFrom",
        render: (val) => val && val.replace("00:00:00", "") || "-"
      }, {
        formRow: 6,
        fieldCode: "evalDateTo",
        render: (val) => val && val.replace("00:00:00", "") || "-"
      } ];
    },
    async getDetail() {
      await getDetailApi(this.id || this.schemeReviewId).then((res) => {
        this.headerInfo = { ...res };
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
.title {
  padding: 12px 15px;
  font-weight: 700;
  font-size: 16px;
  text-align: left;
  color: #333;
  line-height: 22px;
  background: #f6f6f6;
}
</style>
