<template>
  <!-- 内容区 -->
  <div class="price-execute-approval">
    <customize :need-padding="true" :data-source="purchasingScheme" :columns="getPurchasingSchemeInfoColumns" />
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getSchemeApi } from "../api";
import { previewFile } from "srm-mobile-ui/src/utils/index";
export default {
  modules: [ "scux.procurementDecisionReview", "scux.commercialTermsPre", "scux.purchaseRecordApproval", "spcm.common" ],
  name: "PurchasingSchemeApproveDetailContent",
  components: {
  },
  props: {
    id: {
      type: String,
      require: false
    }
  },
  data() {
    return {
      purchasingScheme:{},
      schemeReviewId: "",
    };
  },
  computed: {
    // 详情内容
    getPurchasingSchemeInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("scux.procurementDecisionReview.model.schemeReviewIdLov").$D("采购方案评审单号"),
          fieldCode: "schemeReviewNumber",
        },
        {
          fieldName: this.$T("scux.procurementDecisionReview.model.reviewDescription").$D("采购方案描述"),
          fieldCode: "reviewDescription",
          fieldType: "EMPTY",
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.reviewDescription").$D("采购方案描述")}：</span>
            <span>{val}</span>
          </srm-flex>
        },
        {
          fieldName: this.$T("scux.procurementDecisionReview.model.materialName").$D("物资名称"),
          fieldCode: "materialName",
          fieldType: "EMPTY",
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.materialName").$D("物资名称")}：</span>
            <span>{val}</span>
          </srm-flex>
        },
        {
          fieldName: this.$T("scux.procurementDecisionReview.model.materialCategory").$D("物资品类"),
          fieldCode: "materialCategory",
          fieldType: "EMPTY",
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.materialCategory").$D("物资品类")}：</span>
            <span>{val}</span>
          </srm-flex>
        },
        {
          fieldName: this.$T("scux.procurementDecisionReview.model.procurementStrategyMeaning").$D("采购策略"),
          fieldCode: "procurementStrategyMeaning",
          fieldType: "EMPTY",
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.procurementStrategyMeaning").$D("采购策略")}：</span>
            <span>{val}</span>
          </srm-flex>
        },
        {
          fieldName: this.$T("scux.procurementDecisionReview.model.purchaseAmountPg").$D("预估金额（元）"),
          fieldCode: "purchaseAmount",
          render: (val) => this.$options.filters.thousandBitSeparator(val),
        },
        {
          fieldName: this.$T("scux.procurementDecisionReview.model.categoryManager").$D("品类经理"),
          fieldCode: "categoryManager",
        },
        {
          fieldName: this.$T("scux.procurementDecisionReview.model.coreAttachment").$D("核心附件"),
          fieldCode: "filedAddress",
          fieldType: "TEXT",
          render: (val, item) => <div style="color: var(--color-other-default-b); font-size: 14px;" on-click={(e) => {
            e.stopPropagation();
            this.showCoreAttachment(val, item);
          }}>
            <span>{ item.coreAttachmentUuid }</span>
          </div>
        },
        {
          fieldName: this.$T("spcm.common.view.message.title.purchaseAttachmentList").$D("附件信息"),
          fieldCode:"attachmentUuid",
          render: (val) =>
            <div>
              <SrmUpload
                attachmentUuid={val}
                show-icon={false}
                color="#276EF1"
                title={this.$T("scux.commercialTermsPre.model.annexUuid").$D(
                  "相关附件"
                )}
                desc-title={this.$T(
                  "scux.purchaseRecordApproval.view.button.uploadview"
                ).$D("附件查看")}
              />
            </div>
          ,
        },
        {
          fieldName: this.$T("scux.procurementDecisionReview.model.remark").$D("相关说明"),
          fieldCode: "remark",
          fieldType: "EMPTY",
          render: (val) => <srm-flex>
            <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.remark").$D("相关说明")}：</span>
            {val || val === 0 ? <srm-textarea v-model={val} editor={false} autoSize /> : <span>-</span>}
          </srm-flex>
        },
      ];

      return columns;
    },
  },
  mounted() {
    console.log("this.$route.query", this.$route.query);
    this.schemeReviewId = this.$route.query.schemeReviewId;
    this.getScheme();
  },
  methods: {
    async showCoreAttachment(fileUrl, item) {
      previewFile({
        bucketName: "private-bucket",
        fileUrl: fileUrl,
        fileName: item.coreAttachmentUuid,
      });
    },
    async getScheme() {
      await getSchemeApi(this.id || this.schemeReviewId).then((res) => {
        this.purchasingScheme = { ...res };
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.price-execute-approval {
  height: calc(100vh - 64.333vw);
  overflow: auto;
}
>>> .noWrap>div{
  display:flex;
}
>>> .srm-upload{
  width:auto;
}
</style>
