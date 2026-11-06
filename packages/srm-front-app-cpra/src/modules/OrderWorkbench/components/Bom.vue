<!-- 只读BOM -->
<template>
  <div class="srm-order-billing">
    <!-- <srm-form
      customize-type="detail"
      :data-set="basicDs"
      :columns="getColumns('basic')"/> -->
    <srm-list
      :scrollable="false"
      height="auto"
      style="height: auto"
      :data-set="lineDs"
      :customize-code="customizeCode"
      :columns="getColumns('line')"/>
  </div>
</template>

<script>
/* eslint-disable vue/require-valid-default-prop */
import { dateFormat } from "@/utils/index";
import { DataSet, $T, SrmUtil } from "srm-mobile-ui";
import { formatAmount } from "./utils/index";
export default {
  modules: [ "sodr.workspace", "sodr.common", "hipspfm.common" ],
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
  },
  data() {
    return {
      basicDs:new DataSet({}),
      lineDs: new DataSet({
        autoQuery: false,
        selection: Infinity,
        pageSize: 10,
        editable: false,
        editFlag: false,
        enableQuery: false,
        showTotalCount: false,
        fields: [],
        pathParameter: {
          tenantId: SrmUtil.getTenantId()
        },
        transport: {
          read: {
            method: "get",
            url: "/spuc/v1/{tenantId}/po-item-boms"
          }
        }
      }),
      bomDetailVisible: false,
    };
  },
  computed: {
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const { poHeaderId, poLineId, poLineLocationId, itemCode, itemName, } = this.dataSource;
      this.basicDs.reset();
      this.basicDs.create({ itemCode, itemName });
      this.lineDs.setQueryParameter({ poLineId, poHeaderId, poLineLocationId, customizeUnitCode:this.customizeCode });
      this.lineDs.query();
    },
    clickDetailInfo() {
      this.bomDetailVisible = true;
    },
    getColumns(type) {
      if (type === "basic") {
        return [
          {
            fieldCode: "itemCode",
            fieldName: $T("sodr.workspace.model.common.itemCode").$D("物料编码"),
          },
          {
            fieldCode: "itemName",
            fieldName: $T("sodr.workspace.model.common.itemName").$D("物料名称"),
          },
        ];
      } else if (type === "line") {
        return [
          {
            fieldCode: "orderSeq",
            fieldName: $T("sodr.workspace.model.common.orderSeq").$D("序号"),
          },
          {
            fieldCode: "itemCode",
            fieldName: $T("sodr.workspace.model.common.itemCode").$D("物料编码"),
          },
          {
            fieldCode: "itemName",
            fieldName: $T("sodr.workspace.model.common.itemName").$D("物料名称"),
          },
          {
            fieldCode: "categoryName",
            fieldName: $T("sodr.workspace.model.common.categoryName").$D("物料类别"),
          },
          {
            fieldCode: "quantity",
            fieldName: $T("sodr.workspace.model.common.demandQuantity").$D("需求数量"),
            render: (val, item) => formatAmount(val, item.uomPrecision),
          },
          {
            fieldCode: "uomCodeAndName",
            fieldName: $T("sodr.workspace.model.common.uomId").$D("单位"),
          },
          {
            fieldCode: "invOrganizationName",
            fieldName: $T("sodr.workspace.model.common.invOrganization").$D("收货组织"),
          },
          {
            fieldCode: "needByDate",
            fieldName: $T("sodr.workspace.model.common.needByDate").$D("需求日期"),
            render: (val) => <span>{dateFormat(val)}</span>,
          },
        ];
      }
      return [];
    },
  },
};
</script>

<style lang="stylus" scoped>
</style>
