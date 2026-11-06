<!--eslint-disable-->
<template>
  <div>
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.ConsolidatedPpprovalFrom.title.basics').$D('基础信息')"
      >
        <srm-form :data-set="headerDataDs" :columns="getHeaderInfoColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="
          $T('scux.ConsolidatedPpprovalFrom.title.billInfo').$D('准入单据信息')
        "
      >
        <srm-list :data-set="billInfoDataDs" :columns="getBillInfoColumns" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <srm-popup
      :visible.sync="visibleFull"
      height="100%"
      show-back
      :title="
        $T('scux.ConsolidatedPpprovalFrom.title.detail.result').$D(
          '评估结果详情'
        )
      "
      :show-close="false"
    >
      <div v-for="(item, key) in detailDate" :key="key">
        <div class="srm-popup-list">
          <p>{{ item.departName }}: {{ item.evaluationResultMeaning }}</p>
          <p>Line director: {{ item.directoryResultMeaning }}</p>
        </div>
      </div>
    </srm-popup>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import { headerDs, billInfoDs } from "./datasource";
import { View, NavBar } from "hips";
import { getDetailApi } from "./api";

export default {
  modules: [ "scux.ConsolidatedPpprovalFrom", "hzero.common" ],
  name: "ConsolidatedPpprovalFrom",
  components: {
    [View.name]: View,
    [NavBar.name]: NavBar,
  },
  props: {
    parameters: {
      type: Object,
    },
  },
  data() {
    const { composeNum } = this.parameters;
    return {
      headerDataDs: new DataSet(headerDs({ composeNum })),
      billInfoDataDs: new DataSet(billInfoDs({ composeNum })),
      detailDate: [],
      visibleFull: false,
    };
  },
  computed: {
    // 基础信息
    getHeaderInfoColumns() {
      return [
        { fieldCode: "composeNum" },
        { fieldCode: "composeName" },
        { fieldCode: "remark" },
      ];
    },
    // 准入单据信息
    getBillInfoColumns() {
      return [
        {
          fieldCode: "supplierAccessNum",
          render: (value, record) => <a style={{ color: "rgb(10, 114, 9)" }} onClick={() => this.onSupplierAccessNum(record)}>{value}</a>
        },
        { fieldCode: "supplierCompanyName" },
        { fieldCode: "conSupCompanyName" },
        { fieldCode: "factoryName" },
        { fieldCode: "categoryName" },
        { fieldCode: "developmentPurpose" },
        { fieldCode: "passProject" },
        { fieldCode: "range" },
        {
          fieldName: $T(
            "scux.ConsolidatedPpprovalFrom.model.evaluationResult"
          ).$D("评估结果详情"),
          render: (_, record) =>
            <a style={{ color: "rgb(10, 114, 9)" }} onClick={() => this.handleDetail(record)}>
              {$T("scux.ConsolidatedPpprovalFrom.model.detail").$D("查看")}
            </a>
        },
      ];
    },
  },
  methods: {
    handleDetail(record = {}) {
      const { supplierAccessNum } = record;
      getDetailApi({
        composeNum: this.parameters.composeNum,
        supplierAccessNum,
      }).then((res) => {
        if (res?.content) {
          this.detailDate = res?.content || [];
          this.visibleFull = true;
        }
      });
    },
    onSupplierAccessNum(record = {}) {
      const { requisitionId } = record;
      this.$router.push({
        path: "/appSour/StarbucksDevelopApproval",
        query: { requisitionId },
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
.navbar {
  font-weight: 900;
}

.srm-popup-list {
  display: flex;
  font-size: 12px;
  padding: 5px 10px;

  p {
    width: 50%;
  }
}
</style>