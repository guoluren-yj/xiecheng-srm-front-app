<template>
  <div>
    <srm-list :data-set="lineDs" :columns="getColumns" :auto-hide-bottom="false"/>
    <srm-bottom-handler :btn-arr="getButtons" type="tooltip"/>
  </div>
</template>
<script>
import { DataSet, $T } from "srm-mobile-ui";
import { verification } from "../dataSource";
export default {
  modules: [ "sodr.workspace", "slod.orderExecution", "sodr.common", "smbl.sellerOrderWorkbench" ],
  props:{
    body:{
      type: Array,
      default: () => [],
    },
    handleOk:{
      type: Function,
      default: () => {},
    },
    handleClose:{
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      lineDs: new DataSet(verification(this)),
    };
  },
  computed:{
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "displayPoNumAndLineNum",
          fieldType: "EMPTY",
          render:(val) => <SrmListHeader>{`${$T("sodr.common.model.common.purchaseOrderNumberAndLineNumber").$D("采购订单号-行号")}${val}`}</SrmListHeader>
        },
        {
          formRow: 1,
          fieldName: $T("sodr.common.model.common.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          formRow: 2,
          fieldName: $T("sodr.common.model.common.clsoeOrCancelQuantity").$D("取消/关闭数量"),
          fieldCode: "closeOrCancelQuantity",
        },
        {
          formRow: 2,
          fieldName: $T("sodr.common.model.common.unitName").$D("单位"),
          fieldCode: "uomCodeAndName",
        },
        {
          formRow: 3,
          fieldName: $T("sodr.common.model.common.materialDescription").$D("物料描述"),
          fieldCode: "itemName",
        },
      ];
    },
    getButtons() {
      return [
        { text: $T("sodr.common.view.button.canceled").$D("取消"),
          type: "danger",
          bordered: true,
          visible: true,
          handler:() => {
            this.handleClose();
            this.$parent.closePopup();
          },
        },
        { text: $T("sodr.common.model.common.determineFeedback").$D("确定反馈"),
          type: "primary",
          bordered: true,
          fill:true,
          visible: true,
          handler:() => {
            this.handleOk();
            this.$parent.closePopup();
          },
        },
      ];
    }
  },
};
</script>