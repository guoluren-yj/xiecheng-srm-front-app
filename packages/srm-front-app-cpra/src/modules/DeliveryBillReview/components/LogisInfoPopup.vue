<template>
  <srm-popup
    :visible="value"
    height="100%"
    :title="$T('sinv.common.view.message.title.logistics').$D('物流信息')"
    position="top"
    @onClose="$emit('input', false)">
    <!-- 导航 -->

    <!-- 供应商报价明细 -->
    <div class="lineinfo-detail">
      <customize-detail code="SMBL.DELIVERY_BILL_REVIEW.LOGISTIC_INFO" :need-padding="true" :columns="getColumns" :data-source="itemData" />
    </div>
  </srm-popup>
</template>

<script>

export default {
  modules: [ "sinv.common" ],
  props: {
    value: {
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
    };
  },
  computed: {
    getColumns() {
      const columns = [
        {
          fieldName: this.$T("sinv.common.model.common.logisticsCompany").$D("物流公司"),
          fieldCode: "logisticsCompanyMeaning",
        },
        {
          fieldName: this.$T("sinv.common.model.common.logisticsCost").$D("物流费用"),
          fieldCode: "logisticsCost",
        },
        {
          fieldName: this.$T("sinv.common.model.common.logisticsStaff").$D("配送人员"),
          fieldCode: "logisticsStaff",
        },
        {
          fieldName: this.$T("sinv.common.model.common.logisticsContactInfo").$D("联系方式"),
          fieldCode: "logisticsContactInfo",
        },
        {
          fieldName: this.$T("sinv.common.model.common.expressNum").$D("快递单号"),
          fieldCode: "expressNum",
        }
      ];

      return columns;
    },
  },
};
</script>

<style lang="stylus" scoped>
.lineinfo-detail {
  width: 100%;
  height: calc(100vh - 44px);
  overflow-y: auto;
  // background: #F0F2F5;
}
</style>
