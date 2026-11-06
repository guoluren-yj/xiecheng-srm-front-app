<template>
  <srm-popup
    :visible="value"
    height="100%"
    :title="$T('sinv.supplierDelivery.view.message.title.deliveryHeaderInfo').$D('送货单头信息')"
    position="top"
    @onClose="$emit('input', false)">
    <!-- 供应商报价明细 -->
    <div class="lineinfo-detail">
      <!-- 个性化组件替换后的代码 -->
      <customize-detail code="SMBL.DELIVERY_BILL_REVIEW.HEAD_INFO_DETAIL" :need-padding="true" :columns="getColumns" :data-source="itemData" />
    </div>
  </srm-popup>
</template>

<script>
import { dateFormat } from "@/utils/index";
export default {
  modules: [ "hipspfm.common", "sinv.supplierDelivery", "sinv.common", "sinv.purchaseReception" ],
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
          fieldName: this.$T("sinv.common.model.common.supplierCompanyName").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("sinv.purchaseReception.view.message.asnTypeCode").$D("送货单类型"),
          fieldCode: "asnTypeCodeMeaning",
        },
        {
          fieldName: this.$T("sinv.common.model.common.customer").$D("客户"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.supplierSiteName").$D("发货地点"),
          fieldCode: "supplierSiteName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.shipDate").$D("发货日期"),
          fieldCode: "shipDate",
          render: (val) => dateFormat(val)
        },
        {
          fieldName: this.$T("sinv.common.model.common.expectedArriveDate").$D("预计到货日期"),
          fieldCode: "expectedArriveDate",
          render: (val) => dateFormat(val)
        },
        {
          fieldName: this.$T("sinv.common.model.common.shipmentsTotalQuantity").$D("发货总数"),
          fieldCode: "totalQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.common.model.common.transportType").$D("运输类型"),
          fieldCode: "transportTypeMeaning",
        },
        {
          fieldName: this.$T("sinv.common.model.common.invOrganizationName").$D("收货组织"),
          fieldCode: "organizationName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.shipToLocationAddress").$D("收货地点"),
          fieldCode: "shipToLocationAddress",
        },
        {
          fieldName: this.$T("sinv.common.model.common.actualReceiverName").$D("送达方"),
          fieldCode: "actualReceiverName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.immedShippedFlag").$D("是否直发"),
          fieldCode: "immedShippedFlag",
          render: (val) => val ? this.$T("hipspfm.common.status.yes").$D("是") : this.$T("hipspfm.common.status.no").$D("否")
        },
        {
          fieldName: this.$T("sinv.common.table.column.remark").$D("备注"),
          fieldCode: "remark",
          fieldType: "TEXT_AREA",
          disabled: true,
        }
      ];

      return columns;
    },
  },
  methods: {
  },
};
</script>

<style lang="stylus" scoped>
.lineinfo-detail {
  height: 100%;
  overflow-y: auto;
}
</style>
