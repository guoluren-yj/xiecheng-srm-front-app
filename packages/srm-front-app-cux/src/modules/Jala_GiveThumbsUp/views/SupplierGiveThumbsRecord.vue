<template>
  <div style="height: 100vh;overflow-y: auto">
    <div class="detail-wrap create-receive-detail-scroll-el" >
      <srm-search
        v-model="queryParams"
        :field="queryField"
        @search="handleSearch"
        @clear="handleSearch"/>
      <srm-list :data-set="likeRecordDs" :scrollable="false" :columns="getRecordClumns"/>
    </div>
  </div>
</template>

<script>
import { DataSet, $T } from "srm-mobile-ui";
import debounce from "lodash/debounce";
import { isEmpty } from "@/utils/index";
import { likeRecord } from "../datasource/index";

export default {
  modules: [ "scux.supplierGiveThumbsUp" ],
  name: "SupplierGiveThumbsRecord",
  data() {
    const {
      app: {
        _route: {
          query: { supplierId },
        },
      },
    } = this.$router;
    return {
      supplierId,
      queryParams: {},
      queryField: [
        {
          fieldCode: "yearDate",
          fieldType: "DATE_PICKER",
          fieldName: $T("scux.supplierGiveThumbsUp.model.yearDate").$D("年度"),
          yearPicker: true,
        },
        {
          fieldCode: "monthlyDate",
          fieldType: "DATE_PICKER",
          fieldName: $T("scux.supplierGiveThumbsUp.model.monthlyDate").$D("月份"),
          yearPicker: true,
          options: {
            monthPicker: true,
          },
        },
      ],
      likeRecordDs: new DataSet(likeRecord(this)),
    };
  },
  computed: {
    getRecordClumns() {
      return [ {
        fieldCode: "supplierName",
        formRow: 0,
        fieldType: "EMPTY",
        visible: isEmpty(this.supplierId),
        render: (val) => <SrmListHeader>{$T("scux.supplierGiveThumbsUp.model.to").$D("为")}【{val}】{$T("scux.supplierGiveThumbsUp.model.like").$D("的点赞")}</SrmListHeader>
      }, {
        fieldCode: "userName",
        formRow: 0,
        fieldType: "EMPTY",
        visible: !isEmpty(this.supplierId),
        render: (val) => <SrmListHeader>{$T("scux.supplierGiveThumbsUp.come.to").$D("来自")}【{val}】{$T("scux.supplierGiveThumbsUp.model.like").$D("的点赞")}</SrmListHeader>
      }, {
        fieldCode: "creationDate",
        formRow: 1,
      }, {
        fieldCode: "coinQuantity",
        formRow: 2,
        render: (val) => <span style="color: var(--color-primary)">{val}{$T("scux.supplierGiveThumbsUp.model.pieces").$D("枚")}</span>
      }, {
        fieldCode: "medalNum",
        formRow: 2,
        render: (val) => <span style="color: var(--color-primary)">{val}{$T("scux.supplierGiveThumbsUp.model.pieces").$D("枚")}</span>
      }, {
        fieldCode: "remark",
      }, ];
    }
  },
  methods: {
    /* eslint-disable */
    handleSearch: debounce(function() {
      this.likeRecordDs.setQueryParameter({...this.queryParams});
      this.likeRecordDs.refresh();
    }, 300),
  },
};
</script>

<style scoped lang="stylus" >
</style>
