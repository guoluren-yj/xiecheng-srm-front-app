<template>
  <srm-popup
    :visible="value"
    height="100%"
    :title="$T('hipspfm.common.view.message.title.lineInfo').$D('行信息')"
    position="top"
    @onClose="$emit('input', false)">
    <!-- 供应商报价明细 -->
    <div class="lineinfo-detail">
      <!-- 头部按钮 -->
      <srm-button-group>
        <srm-button fill type="warn" >
          <srm-upload color="white" :show-icon="false" :attachment-uuid="itemData.attachmentUuid" :show-count="false" :desc-title="$T('sinv.common.model.common.lineAttachmentUuid').$D('行附件')" />
        </srm-button>
      </srm-button-group>

      <customize-detail code="SMBL.DELIVERY_BILL_REVIEW.LINE_INFO_DETAIL" :need-padding="true" :columns="getColumns" :data-source="itemData" />
    </div>
  </srm-popup>
</template>

<script>

export default {
  modules: [ "hipspfm.common", "sinv.common", "sodr.common", "sinv.purchaseReception" ],
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
      filePopup: false,
      attachmentUuid: "",
      planFlagChecked: false,
    };
  },
  computed: {
    getColumns() {
      const columns = [
        {
          fieldName: this.$T("sinv.common.model.common.itemName").$D("物料名称"),
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sinv.common.model.common.num").$D("数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sodr.common.model.deliverNumber").$D("发货数量"),
          fieldCode: "shipQuantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sinv.purchaseReception.view.message.lineNum").$D("行号"),
          fieldCode: "displayAsnLineNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.unit").$D("单位"),
          fieldCode: "uomName",
          render: (val, item) => Number(item.unitCodeIsShow) ? `${item.uomCode}/${val}` : val,
        },
        {
          fieldName: this.$T("sinv.common.model.common.displayPoNum").$D("订单号"),
          fieldCode: "displayPoNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.neededDate").$D("需求日期"),
          fieldCode: "neededDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sinv.common.model.common.promiseDeliveryDate").$D("承诺交货日期"),
          fieldCode: "promisedDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sinv.common.model.common.product.number").$D("商品编码"),
          fieldCode: "productNum",
        },
        {
          fieldName: this.$T("sinv.common.model.common.catalog.name").$D("商品目录"),
          fieldCode: "catalogName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.product.name").$D("商品名称"),
          fieldCode: "productName",
        },
        {
          fieldName: this.$T("sinv.common.model.common.purchaseRemark").$D("采购方行备注"),
          fieldCode: "purchaseRemark",
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
  width: 100%;
  overflow-y: auto;
  // background: #F0F2F5;
  height: calc(100vh - 44px);

}
</style>
