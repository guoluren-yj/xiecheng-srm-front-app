<template>
  <hips-popup v-model="value" class="FullPop" style="height: 100%;width:100%" position="right">
    <div class="lineInfoDetail">
      <hips-nav-bar slot="header" :have-border="false">
        <div slot="left" class="left-button" @click="closePop">
          <img src="@/assets/back@3x.png" class="image-black-default">
        </div>
        <div
          slot="center"
          class="header">
          {{ $T('hipspfm.workFlow.view.message.title.checkPriceDetail').$D('核价结果明细') }}
        </div>
      </hips-nav-bar>
      <div class="lineHead">
        <p>
          <span>{{ $T("ssrc.inquiryHall.view.message.button.bidNum").$D("寻源单编号") }}：</span>
          <span>{{ pricingResultDetail.rfxNum }}</span>
        </p>
        <p>
          <span>{{ $T("ssrc.inquiryHall.view.message.button.bidTitle").$D("寻源单标题") }}：</span>
          <span>{{ pricingResultDetail.rfxTitle }}</span>
        </p>
      </div>
      <div style="height: 100%" class="card">
        <!-- 个性化组件替换后的代码 -->
        <customize-detail :columns="getColumns" :data-source="pricingResultDetail" code="SMBL.WORKFLOW.PRICING_APPROVAL.HEAD_DETAIL"/>
      </div>
    </div>
    <!-- 操作记录弹窗 -->
    <operation-record
      v-model="operationPopup"
      :operation-arr="operationArr"
      :load-refresh="getPricingOperate"/>
  </hips-popup>
</template>

<script>
import uuid from "uuid";
import { View, Popup, NavBar } from "hips";
import { getPricingOperateApi } from "../api/Sw";
import OperationRecord from "@/components/New/OperationRecord";

export default {
  modules: [ "hipspfm.common", "hipspfm.workFlow", "ssrc.inquiryHall" ],
  name: "PricingResultDetail",
  components: {
    OperationRecord,
    [View.name]: View,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  props: {
    value: {
      type: Boolean
    },
    pricingResultDetail: {
      type: Object,
      default: {}
    },
    changeReqId: {
      type: String | Number,
      default: ""
    },
    showFilePop: {
      type: Function
    },
    inJinWorkflow:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uuid: "",
      attachmentUuid: "",
      filePopup: false,
      operationArr: [],
      operationPopup: false
    };
  },
  computed: {
    getColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.company").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.purchOrg").$D("采购组织"),
          fieldCode: "purOrganizationName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.unitName").$D("需求部门"),
          fieldCode: "unitName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingCategory").$D("寻源类别"),
          fieldCode: "sourceCategoryMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingApproach").$D("寻源方式"),
          fieldCode: "sourceMethodMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.biddingDirection").$D("报价方向"),
          fieldCode: "auctionDirectionMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationType").$D("报价方式"),
          fieldCode: "quotationTypeMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.currencyCode").$D("币种"),
          fieldCode: "currencyCodeMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.exchangeRate").$D("汇率"),
          fieldCode: "exchangeRate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.paymentTerms").$D("付款方式"),
          fieldCode: "paymentTypeName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingType").$D("寻源类型"),
          fieldCode: "sourceTypeMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.priceCategory").$D("价格类型"),
          fieldCode: "priceCategoryMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationStartTime").$D("报价开始时间"),
          fieldCode: "quotationStartDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationDeadline").$D("报价截止时间"),
          fieldCode: "quotationEndDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.itemRemark").$D("备注"),
          fieldCode: "rfxRemark",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pretrailRemark").$D("初审备注"),
          fieldCode: "pretrailRemark",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pretrailAttachment").$D("初审附件"),
          fieldCode: "pretrialUuid",
          render: (val) =>
            // return <span style="color: blue">{this.$T('hipspfm.common.button.viewAttachments').$D('查看附件')}</span>
            <srm-upload attachmentUuid={val} show-icon={false} color="blue" desc-title={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")} />,
          callBack:(val, record) => {
            // this.showFilePop(val.pretrialUuid||uuid)
          }
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.budgetAmount").$D("预算金额"),
          fieldCode: "budgetAmount",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.remarkInside").$D("备注(内部)"),
          fieldCode: "internalRemark",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.creationDate").$D("创建日期"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourceAnnouncementFlag").$D("创建寻源公告"),
          fieldCode: "sourceAnnouncementFlag",
          render:(val) => val == 1 ? this.$T("hipspfm.common.status.yes").$D("是") : val == 0 ? this.$T("hipspfm.common.status.no").$D("否") : ""
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.checkRemark").$D("核价备注"),
          fieldCode: "checkRemark",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingTemplate").$D("寻源模板"),
          fieldCode: "templateName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.businessAttachments").$D("商务附件"),
          fieldCode: "businessAttachmentUuid",
          render: (val) =>
            // return <span style="color: blue">{this.$T('hipspfm.common.button.viewAttachments').$D('查看附件')}</span>
            <srm-upload attachmentUuid={val} show-icon={false} color="blue" desc-title={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")} />,
          callBack:(val, record) => {
            // this.showFilePop(val.businessAttachmentUuid||uuid)
          }
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.techAttachments").$D("技术附件"),
          fieldCode: "techAttachmentUuid",
          render: (val) =>
            // return <span style="color: blue">{this.$T('hipspfm.common.button.viewAttachments').$D('查看附件')}</span>
            <srm-upload attachmentUuid={val} show-icon={false} color="blue" desc-title={this.$T("hipspfm.common.button.viewAttachments").$D("查看附件")} />,
          callBack:(val, record) => {
            // this.showFilePop(val.techAttachmentUuid||uuid)
          }
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.view.message.title.record").$D("操作记录"),
          fieldCode: "",
          render: () => <span style="color: blue">{this.$T("hipspfm.workFlow.view.message.viewRecord").$D("查看操作记录")}</span>,
          callBack:(val, record) => {
            this.showOperationPop();
          }
        }
      ];
      return columns;
    }
  },
  async mounted() {
    try {
      this.$loading.show();
      await this.getPricingOperate();
      this.$loading.hide();
    } catch (err) {
      this.$loading.hide();
      // console.log(err,"error")
    }
    this.uuid = uuid();
  },
  methods: {
    closePop() {
      this.$emit("input", false);
    },
    // 获取操作记录信息
    async getPricingOperate() {
      const parmas = {
        page: 0,
        size: 500
      };
      await getPricingOperateApi(parmas, this.changeReqId).then((res) => {
        if (res && !res.empty) {
          this.operationArr = res.content;
        }
      });
    },
    showOperationPop(uuid) {
      this.operationPopup = !this.operationPopup;
    }
  }
};
</script>

<style lang="stylus" scoped>
.font-blue {
  color: var(--color-other-default-b) !important;
}

.card {
  width: 100%;
  color: #666666;
  padding 0 15px 12px 15px;
  background: var(--color-bg-default);
}

.lineInfoDetail {
  background:var(--color-bg-default);
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color:var(--color-font-default);
    text-align: center;
    line-height: 26px;
    font-weight: 700;
    padding: 9px 0;
  }

  .lineHead {
    padding: 8px 15px 12px;
    background-color:var(--color-font-default-d);
    font-family: 'PingFangSC-Medium';
    color:var(--color-font-default);
    font-size: 16px;
    line-height: 24px;
    border-bottom: 8px solid var(--color-border-default);

    li {
      padding: 0;
      margin-bottom: 9px;
      height: 24px;
      display: flex;
      color: var(--color-font-default-e);
    }

    p {
      span {
        color:var(--color-font-default);
        line-height: 24px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}
</style>
