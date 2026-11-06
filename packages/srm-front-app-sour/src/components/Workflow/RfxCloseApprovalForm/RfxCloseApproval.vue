<template>
  <!-- 寻源单关闭审批 -->
  <div class="rfx-close-container">
    <srm-scroll-tab class="rfx-close-content">
      <srm-scroll-tab-item :label="$T('ssrc.inquiryHall.view.message.button.commonCloseInquiryInfo', [ documentTypeName ]).$D('{documentTypeName}关闭信息')">
        <srm-list :scrollable="false"
                  height="auto"
                  style="height: auto"
                  :data-set="closeBasisDS"
                  :customize-code="getCustomizeCode()"
                  :columns="getBasisColumns()"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { getDocumentTypeName } from "@/utils/globalVariable.js";
import { closeBasisDS } from "./datasource/ds";
import RfxApprovalNew from "@/components/Workflow/RfxApprovalNewForm/RfxApprovalNew.vue";
export default {
  modules: [ "ssrc.inquiryHall", "ssrc.common", "ssrc.bidHall", "hipspfm.common", "ssrc.priceLibraryNew", "hipspfm.expertScoring" ],
  name: "RfxCloseApproval",
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    parameters: {
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      bidFlag: false, // true-新招标 false-询价
      documentTypeName: "",
      closeBasisDS: {},
    };
  },
  beforeMount() {
    this.bidFlag = this.getBidFlag();
    this.documentTypeName = getDocumentTypeName(this.bidFlag);
    this.closeBasisDS = new DataSet(closeBasisDS({ rfxId: this.changeReqId, bidFlag: this.bidFlag, documentTypeName: this.documentTypeName }));
  },
  methods: {
    // 判断是新招标还是询价
    getBidFlag () {
      const { secondarySourceCategory = "" } = this.parameters;
      return secondarySourceCategory === "NEW_BID"; // RFQ-询价 NEW_BID-招标
    },
    getCustomizeCode() {
      return this.bidFlag ? "SMBL.WORKFLOW.CLOSE_RFX_APPROVAL_BID.BASE_FORM" : "SMBL.WORKFLOW.CLOSE_RFX_APPROVAL.BASE_FORM";
    },
    // 基本信息columns
    getBasisColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "rfxTitle",
          fieldType: "EMPTY",
          render: (val, item) => <div style="font-size: 12px;color: #333333;font-weight: 600;">
            {item.rfxTitle}
          </div>,
        },
        {
          formRow: 20,
          fieldCode: "rfxNum",
          render: (value, item) => <a class="rfx-close-link" onClick={() => this.toRfxOrBidDetail(item)}>{value}</a>
        },
        {
          formRow: 30,
          fieldCode: "templateName",
        },
        {
          formRow: 40,
          fieldCode: "terminatedRemark",
        },
        {
          formRow: 50,
          fieldCode: "closeAttachmentUuid",
          render: (val) =>
            <srm-upload attachmentUuid={val} show-icon={false} color="blue" desc-title={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")} />,
        }
      ];
    },
    // 跳转寻源单或者招标单详情
    toRfxOrBidDetail(record) {
      const title = this.bidFlag ? this.$T("ssrc.bidHall.view.title.bidDetails").$D("招标书明细") : this.$T("ssrc.inquiryHall.view.message.title.RFQDetail").$D("询价单明细");
      if (record.rfxHeaderId) {
        this.detailPopup = this.$popup({
          title,
          showHeader: true,
          showBack: true,
          content:<RfxApprovalNew parameters={this.parameters} changeReqId={record.rfxHeaderId} />
        });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.rfx-close-link {
  font-size: 12px;
  color: #276EF1;
  font-weight: 400;
}
>>> .rfx-close-content > div.srm-scroll{
 background: var(--background-color-empty-tab-title);
}
</style>