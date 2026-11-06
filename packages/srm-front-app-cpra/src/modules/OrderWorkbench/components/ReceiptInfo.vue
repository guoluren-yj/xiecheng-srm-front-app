<template>
  <div class="srm-order-receipt">
    <srm-list
      :scrollable="false"
      height="auto"
      style="height: auto"
      :data-set="dataSet"
      :columns="getColumns"
      :customize-code="customizeCode"
      @itemClick="clickDetailInfo"/>
    <srm-popup
      :visible.sync="visiblePopup"
      :position="'right'"
      :show-header="false"
      :height="'100%'">
      <srm-form
        v-if="visiblePopup"
        customize-type="detail"
        :data-set="dataSet"
        :customize-code="customizeDetailCode"
        :columns="getColumns"/>
    </srm-popup>
  </div>
</template>
<script>
/* eslint-disable vue/require-valid-default-prop */
import { DataSet, $T } from "srm-mobile-ui";
export default {
  modules: [ "sodr.workspace" ],
  name: "ReceiptInfo",
  props: {
    dataSource:{
      type:Object,
      default: {},
    },
    customizeCode:{
      type:String,
      default:"",
    },
    customizeDetailCode:{
      type:String,
      default:"",
    }
  },
  data() {
    return {
      dataSet: new DataSet({
        autoQuery: false,
        selection: Infinity,
        pageSize: 10,
        editable: false,
        editFlag: false,
        enableQuery: false,
        fields: [],
      }),
      visiblePopup: false,
    };
  },
  computed: {
    getColumns() {
      return [
        {
          fieldCode: "shipToLocationAddress",
          fieldName:  $T("sodr.workspace.model.common.shipToLocationAddress").$D("收货方地址"),
        },
        {
          fieldCode: "shipToLocContName",
          fieldName:  $T("sodr.workspace.model.common.shipToLocContName").$D("收货方联系人"),
        },
        {
          fieldCode: "shipToLocTelNum",
          fieldName:  $T("sodr.workspace.model.common.shipToLocTelNum").$D("收货联系电话"),
        },
        {
          fieldCode: "billToLocationAddress",
          fieldName:  $T("sodr.workspace.model.common.billToLocationAddress").$D("收单方地址"),
        },
        {
          fieldCode: "billToLocContName",
          fieldName:  $T("sodr.workspace.model.common.billToLocContName").$D("收单方联系人"),
        },
        {
          fieldCode: "billToLocTelNum",
          fieldName:  $T("sodr.workspace.model.common.billToLocTelNum").$D("收单联系电话"),
        },
        {
          fieldCode: "receiverEmailAddress",
          fieldName:  $T("sodr.workspace.model.common.receiverEmailAddress").$D("收单邮箱"),
        },
      ];
    },
    // getDataSet() {
    //   this.dataSet.reset();
    //   console.log("ds", this.dataSource);
    //   debugger;
    //   this.dataSet.create(this.dataSource);
    //   return this.dataSet;
    // }
  },
  mounted() {
    // console.log("ds", this.dataSource);
    this.dataSet.reset();
    this.dataSet.create(this.dataSource);
  },
  methods: {
    clickDetailInfo() {
      this.visiblePopup = true;
    }
  }
};
</script>
<style lang="stylus" scoped>
</style>
