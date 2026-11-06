<template>
  <srm-popup
    :visible="visible" height="100%" position="right" @onClose="close">
    <!-- <hips-view> -->
    <!-- 导航 -->
    <nav-head
      :title="$T('ssrc.inquiryHall.view.message.tab.allQuotationDetails').$D('供应商报价明细')"
      @goBack="goBack"/>

    <!-- 供应商报价明细 -->
    <div class="lineinfo-detail" :style="{ height: showBackFlag ? 'calc(100vh - 44px)' : '100vh' }">
      <!-- 头部按钮 -->
      <srm-button-group>
        <srm-button fill>
          <srm-upload :show-count="false" :show-icon="false" :attachment-uuid="itemData.pretrialUuid" :desc-title="$T('ssrc.inquiryHall.model.inquiryHall.pretrailAttachment').$D('初审附件')" style="color: var(--font-color-white);"/>
        </srm-button>
      </srm-button-group>

      <!-- 内容区 -->
      <div class="content">
        <!-- 个性化组件替换后的代码 -->
        <customize-detail :columns="getColumns" :data-source="itemData" code="SMBL.NEW_BID_HALL.LIST.RFXPRICE_RFXPRICE_HEADER_DETAIL" />
      </div>
    </div>
  </srm-popup>
</template>

<script>
import NavHead from "@/components/NavHead";
import SrmButtonGroup from "@/components/V5/SrmButtonGroup";

export default {
  modules: [ "ssrc.inquiryHall", "ssrc.bidHall" ],
  components: {
    NavHead,
    SrmButtonGroup,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    itemData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      filePopup: false,
      attachmentUuid: "",
      planFlagChecked: false,
    };
  },
  computed: {
    getColumns() {
      const columns = [
        {
          fieldName: this.$T("ssrc.bidHall.model.bidHall.title").$D("标题"),
          fieldCode: "rfxTitle",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.RFXNo.").$D("询价单号"),
          fieldCode: "rfxNum",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.sourcingCategory").$D("寻源类别"),
          fieldCode: "sourceCategoryMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.purchOrg").$D("采购组织"),
          fieldCode: "purOrganizationName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inEnquiryHall.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inqueryHall.unitName").$D("需求部门"),
          fieldCode: "unitName",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.budgetAmount").$D("预算金额"),
          fieldCode: "budgetAmount",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.quotationCurrencyType").$D("币种"),
          fieldCode: "currencyCodeMeaning",
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.remark").$D("备注"),
          fieldCode: "rfxRemark",
          fieldType: "TEXT_AREA",
          disabled: true,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.pretrailRemark").$D("初审备注"),
          fieldCode: "pretrailRemark",
          fieldType: "TEXT_AREA",
          disabled: true,
        },
        {
          fieldName: this.$T("ssrc.inquiryHall.model.inquiryHall.checkRemark").$D("核价备注"),
          fieldCode: "checkRemark",
          fieldType: "TEXT_AREA",
        },
      ];

      return columns;
    },
  },
  methods: {
    goBack() {
      this.$emit("input", false);
    },
    close() {
      this.$emit("changeVisible", false);
    },
  },
};
</script>

<style lang="stylus" scoped>
.lineinfo-detail {
  width: 100%;
  height: calc(100vh - 44px);
  overflow-y: auto;

  .content {
    padding: 0 15px;
  }
}
>>> .srm-upload{
  color:#fff;
}
</style>
