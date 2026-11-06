<template>
  <srm-scroll-tab>
    <srm-scroll-tab-item :label="$T('smpc.product.view.baseInfo').$D('基础信息')" code="baseInfo">
      <srm-form v-if="formDS" :data-set="formDS" :columns="getBasicColumns" />
    </srm-scroll-tab-item>
    <srm-scroll-tab-item :label="$T('smpc.product.view.productInfo').$D('商品信息')" code="productInfo">
      <srm-list :data-set="skuListDS" :columns="getSkuColumns" @itemClick="handleSkuClick" />
    </srm-scroll-tab-item>
  </srm-scroll-tab>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import formDs from "./datasource/formDs";
import skuListDs from "./datasource/skuListDs";
import NewSrmListHeader from "../../NewSrmListHeader.vue";
import SkuDetail from "./SkuDetail.vue";
import { getDataApi } from "./api/index";
export default {
  modules: ["hzero.common", "smpc.product", "sagm.common", "hipspfm.common", "smpc.workbench"],
  name: "SkuUnShelfApprove",
  props: {
    parameters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      formDS: new DataSet(formDs()),
      skuListDS: new DataSet(skuListDs()),
      formData: {},
      visible: false,
    };
  },
  computed: {
    // 基本信息
    getBasicColumns() {
      return [
        {
          fieldCode: "batchNum",
          formRow: 10,
          fieldType: "EMPTY",
          render: (val, record) => <NewSrmListHeader show-open-tag={false}>
            {record.batchNum ? record.batchNum : "-"}
          </NewSrmListHeader>,
        },
        {
          fieldCode: "realName",
          formRow: 20,
        },
        {
          fieldCode: "lastUpdateDate",
          formRow: 30,
        },
        {
          fieldCode: "approveRemark",
          formRow: 40,
        },
      ];
    },
    // 商品信息
    getSkuColumns() {
      return [
        {
          fieldType: "EMPTY",
          formRow: 1,
          render: (val, record) => <NewSrmListHeader show-open-tag>
            {record.skuName ? record.skuName : "-"}
          </NewSrmListHeader>,
        },
        {
          fieldCode: "skuCode",
          formRow: 10,
        },
        {
          fieldCode: "supplierCompanyName",
          formRow: 20,
        },
      ];
    },
  },
  async mounted() {
    this.getData();
  },
  beforeMount() {
    this.batchId = this.parameters.batchId;
    this.sourceFrom = this.parameters.sourceFrom || "CATA";
  },
  methods: {
    // 商品详情点击事件
    handleSkuClick(record) {
      this.$popup({
        headerAlign: "start",
        showHeader: true,
        showClose: false,
        position: "right",
        showBack: true,
        content: <SkuDetail ref="skuDetail" skuId={record.get("skuId")} sourceFrom={this.sourceFrom} />,
      });
    },
    getData() {
      getDataApi(this.batchId, this.sourceFrom).then((res) => {
        if (res) {
          this.formData = res;
          // 设置基础信息
          this.formDS.create(res, 0);
          // 设置商品列表
          this.skuListDS.setData(res.lineList || []);
        }
      });
    },
  },
};
</script>