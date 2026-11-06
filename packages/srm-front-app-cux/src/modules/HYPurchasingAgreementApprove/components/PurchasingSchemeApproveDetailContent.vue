<template>
  <!-- 内容区 -->
  <Customize :need-padding="true" :data-source="purchasingScheme" :columns="getPurchasingSchemeInfoColumns" />
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getSchemeApi } from "../api";
import { previewFile } from "srm-mobile-ui/src/utils/index";
export default {
  modules: [ "scux.procurementDecisionReview","scux.commercialTermsPre","scux.purchaseRecordApproval","spcm.common" ],
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
          fieldName: "采购方案评审单号",
          fieldCode: "schemeReviewNumber",
          langCode: "scux.procurementDecisionReview.model.schemeReviewIdLov",
        },
        {
          fieldName: "采购方案描述",
          fieldCode: "reviewDescription",
          langCode: "scux.procurementDecisionReview.model.reviewDescription",
          fieldType: "EMPTY",
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.reviewDescription").$D("采购方案描述")}：</span>
              <span>{val}</span>
            </srm-flex>;
          }
        },
        {
          fieldName: "物资名称",
          fieldCode: "materialName",
          langCode: "scux.procurementDecisionReview.model.materialName",
          fieldType: "EMPTY",
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.materialName").$D("物资名称")}：</span>
              <span>{val}</span>
            </srm-flex>;
          }
        },
        {
          fieldName: "物资品类",
          fieldCode: "materialCategory",
          langCode: "scux.procurementDecisionReview.model.materialCategory",
          fieldType: "EMPTY",
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.materialCategory").$D("物资品类")}：</span>
              <span>{val}</span>
            </srm-flex>;
          }
        },
        {
          fieldName: "采购策略",
          fieldCode: "procurementStrategyMeaning",
          langCode: "scux.procurementDecisionReview.model.procurementStrategyMeaning",
          fieldType: "EMPTY",
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.procurementStrategyMeaning").$D("采购策略")}：</span>
              <span>{val}</span>
            </srm-flex>;
          }
        },
        {
          fieldName: "预估金额（元）",
          fieldCode: "purchaseAmount",
          langCode: "scux.procurementDecisionReview.model.purchaseAmountPg",
          render: (val) => {
            return this.$options.filters.thousandBitSeparator(val);
          },
        },
        {
          fieldName: "品类经理",
          fieldCode: "categoryManager",
          langCode: "scux.procurementDecisionReview.model.categoryManager",
        },
        {
          fieldName: "核心附件",
          fieldCode: "filedAddress",
          langCode: "scux.procurementDecisionReview.model.coreAttachment",
          fieldType: "TEXT",
          render: (val, item) => {
            return <div style="color: var(--color-other-default-b); font-size: 14px;" on-click={(e) => {
              e.stopPropagation();
              this.showCoreAttachment(val, item);
            }}>
              <span>{ item.coreAttachmentUuid }</span>
            </div>;
          }
        },
        {
          fieldName: "附件信息",
          fieldCode:"attachmentUuid",
          langCode: "spcm.common.view.message.title.purchaseAttachmentList",
          render: (val) => {
            return (
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
            );
          },
        },
        {
          fieldName: "相关说明",
          fieldCode: "remark",
          langCode: "scux.procurementDecisionReview.model.remark",
          fieldType: "EMPTY",
          render: (val) => {
            return <srm-flex>
              <span style="flex-shrink: 0; align-self: flex-start;">{this.$T("scux.procurementDecisionReview.model.remark").$D("相关说明")}：</span>
              <span>{val}</span>
            </srm-flex>;
          }
        },
      ];

      return columns;
    },
  },
  mounted() {
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
      await getSchemeApi(this.id || this.schemeReviewId).then((res)=>{
        this.purchasingScheme = { ...res };
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
>>> .noWrap>div{
  display:flex;
}
>>> .srm-upload{
  width:auto;
}
</style>
