<template>
  <div class="detail-form-wrap">
    <srm-scroll-tab customize-code="">
      <srm-blank size="1px" theme="fill"/>
      <srm-scroll-tab-item
        :label="$T('sslm.vendorEvaluationPlanDetail.content.cardTitle.basicInfo').$D('基本信息')"
        code="baseInfo">
        <customize
          need-padding
          :columns="headerInfoColumns"
          :data-source="headerInfoData"
          code="SMBL.WORKFLOW.SUP_EVALUATION_PLAN_DETAIL.BASICINFO"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('sslm.vendorEvaluationPlanDetail.content.cardTitle.planLine').$D('评估计划行')"
        code="planLine">
        <srm-list
          :scrollable="false"
          :data-set="planLineDs"
          :columns="planLineColumns"
          customize-code="SMBL.WORKFLOW.SUP_EVALUATION_PLAN_DETAIL.LINEINFO"
          @itemClick="openLineDetailPopup"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('sslm.vendorEvaluationPlanDetail.content.cardTitle.attachment').$D('附件')"
        code="attachment">
        <customize
          need-padding
          :columns="attachmentColumns"
          :data-source="headerInfoData"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { getPlanLineDS } from "./datasource/getPlanLineDS";
import { getHeaderInfoColumns, getPlanLineColumns, getAttachmentColumns } from "./utils/getColums";
import { fetchHeaderInfo } from "./api";
export default {
  modules: [ "sslm.vendorEvaluationPlanDetail", "sslm.common", "hzero.common", "hipspfm.common", "smbl.common" ],
  name: "VendorEvaluationPlanApproval",
  components: {
  },
  props: {
    parameters: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      headerInfoData: {},
      headerInfoColumns: getHeaderInfoColumns(),
      planLineColumns: getPlanLineColumns().slice(0, 10),
      planLineDetailColumns: [],
      attachmentColumns: getAttachmentColumns(),
      planLineDs: new DataSet(getPlanLineDS({ evalPlanHeaderId:this.parameters.evalPlanHeaderId })),
    };
  },
  async mounted() {
    this.$loading.show();
    const headerInfo = await this.queryHeaderInfo();
    if (headerInfo) {
      this.headerInfoData = headerInfo;
    }
    const { groupFlag } = this.headerInfoData;
    this.planLineDetailColumns = getPlanLineColumns({ groupFlag, detailModalFlag: true });
    this.planLineColumns = getPlanLineColumns({ groupFlag, detailModalFlag: false }).slice(0, 10);
    this.$loading.hide();
  },
  methods: {
    // 查询头信息
    async queryHeaderInfo() {
      const param = {
        evalPlanHeaderId: this.parameters.evalPlanHeaderId,
        customizeUnitCode: "SSLM.SUP_PLAN_WORKBENCH_DETAIL.BASICINFO"
      };
      try {
        const res = await fetchHeaderInfo(param);
        if (res && !res.failed) {
          return res;
        }
      } catch (error) {
        return {};
      }
    },
    openLineDetailPopup() {
      this.$popup({
        title: this.$T("smbl.common.message.detailInfo").$D("明细信息详情"),
        showHeader: true,
        showClose: false,
        position: "right",
        headerAlign: "center",
        showBack: true,
        content: <SrmForm
          style="padding: 0 15px;"
          customizeType="detail"
          columns={this.planLineDetailColumns}
          dataSet={this.planLineDs}
        />,
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.detail-form-wrap {
  >>> .attachment-uuid-field{
    height:34px;
    .srm-icon.icon-other{
      color: #febf43;
      font-size: 28px;
    }
    .srm-attachment-button{
      margin-left:8px;
      flex-grow: 1;
      display:flex;
      .srm-button{
        flex-grow: 1;
        text-align: left;
        font-weight: 400;
        .srm-button-text{
          font-size: 14px;
          color: #333;
          font-weight: 400;
          width: 100%;
        }
      }
    }
  }
}
</style>
