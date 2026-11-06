<template>
  <div class="srm-order-billing">
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
        :columns="getDetailColumns"/>
    </srm-popup>
  </div>
</template>

<script>
/* eslint-disable vue/require-valid-default-prop */
import { DataSet, $T } from "srm-mobile-ui";
export default {
  modules: [ "sodr.workspace" ],
  name: "BillingInfo",
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
          fieldCode: "invoiceTitle",
          fieldName: $T("sodr.workspace.model.common.invoiceTitle").$D("开票公司名称"),
        },
        {
          fieldCode: "taxRegisterNum",
          fieldName: $T("sodr.workspace.model.common.taxRegisterNum").$D("税号"),
        },
        {
          fieldCode: "invoiceTitleTypeName",
          fieldName: $T("sodr.workspace.model.common.invoiceTitleTypeName").$D("发票类型"),
        },
        {
          fieldCode: "invoiceMethodName",
          fieldName: $T("sodr.workspace.model.common.invoiceMethodName").$D("开票方式"),
        },
        {
          fieldCode: "invoiceTypeName",
          fieldName: $T("sodr.workspace.model.common.invoiceTypeName").$D("发票形式"),
        },
        {
          fieldCode: "invoiceDetailTypeName",
          fieldName: $T("sodr.workspace.model.common.invoiceDetailTypeName").$D("发票明细"),
        },
      ];
    },
    getDetailColumns() {
      return [
        {
          fieldCode: "invoiceTitle",
          fieldName: $T("sodr.workspace.model.common.invoiceTitle").$D("开票公司名称"),
        },
        {
          fieldCode: "taxRegisterNum",
          fieldName: $T("sodr.workspace.model.common.taxRegisterNum").$D("税号"),
        },
        {
          fieldCode: "invoiceTitleTypeName",
          fieldName: $T("sodr.workspace.model.common.invoiceTitleTypeName").$D("发票类型"),
        },
        {
          fieldCode: "invoiceMethodName",
          fieldName: $T("sodr.workspace.model.common.invoiceMethodName").$D("开票方式"),
        },
        {
          fieldCode: "taxRegisterAddress",
          fieldName: $T("sodr.workspace.model.common.taxRegisterAddress").$D("税务登记地址"),
        },
        {
          fieldCode: "invoiceTypeName",
          fieldName: $T("sodr.workspace.model.common.invoiceTypeName").$D("发票形式"),
        },
        {
          fieldCode: "invoiceDetailTypeName",
          fieldName: $T("sodr.workspace.model.common.invoiceDetailTypeName").$D("发票明细"),
        },
        {
          fieldCode: "taxRegisterBank",
          fieldName: $T("sodr.workspace.model.common.taxRegisterBank").$D("开户行"),
        },
        {
          fieldCode: "taxRegisterBankAccount",
          fieldName: $T("sodr.workspace.model.common.taxRegisterBankAccount").$D("开户行账号"),
        },
        {
          fieldCode: "taxRegisterTel",
          fieldName: $T("sodr.workspace.model.common.taxRegisterTel").$D("税务登记电话"),
        },
      ];
    },
    // getDataSet() {
    //   this.dataSet.reset();
    //   this.dataSet.create(this.dataSource);
    //   return this.dataSet;
    // }
  },
  mounted() {
    this.dataSet.reset();
    this.dataSet.create(this.dataSource);
  },
  methods: {
    clickDetailInfo() {
      this.visiblePopup = true;
    }
  },
};
</script>

<style lang="stylus" scoped>
</style>
