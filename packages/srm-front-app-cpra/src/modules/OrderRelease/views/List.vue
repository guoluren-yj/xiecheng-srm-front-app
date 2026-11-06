<template>
  <!-- 订单发布 -->
  <div style="height: 100vh">
    <srm-list
      customize-code="SMBL.ORDER_RELEASE.LIST"
      :data-set="dataSet"
      :columns="getColumns"
      :buttons="getButtons"
      @itemClick="goToDetail"/>
  </div>
</template>

<script>
import { indexDs } from "../datasource/indexDs";
import { DataSet, $T } from "srm-mobile-ui";

export default {
  modules: [ "sodr.common" ],
  name: "OrderReleaseList",
  data() {
    return {
      dataSet: new DataSet(indexDs()),
    };
  },
  computed: {
    getColumns() {
      return [
        {
          fieldCode: "head",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>{item.displayPoNum}</span>
          </SrmListHeader>,
          formRow: 10,
        },
        {
          fieldName: $T("sodr.common.model.common.supplier").$D("供应商"),
          fieldCode: "supplierName",
          formRow: 20,
        },
        {
          fieldName: $T("sodr.common.model.common.poTypeCodeMeaning").$D("订单类型"),
          fieldCode: "poTypeCodeMeaning",
          formRow: 30,
        },
        {
          fieldName: $T("sodr.common.model.common.agentName").$D("采购员"),
          fieldCode: "agentName",
          formRow: 30,
        },
        {
          fieldName: $T("sodr.common.model.common.purOrganizationName").$D("采购组织"),
          fieldCode: "purOrganizationName",
          formRow: 40,
        },
        {
          fieldName: $T("sodr.common.model.common.creationDate").$D("创建时间"),
          fieldCode: "erpCreationDate",
          formRow: 50,
        },
      ];
    },
    getButtons() {
      return [
        {
          text: $T("sodr.common.view.button.publish").$D("发布"),
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: () => {
            let that = this;
            that.$dialog({
              content: $T("sodr.common.model.common.confirmPublish").$D("是否确认发布订单") + "?",
              onOk() {
                that.dataSet.submitSelected();
              },
              onCancel() {
              },
            });
          }
        },
      ];
    }
  },
  activated() {
    this.dataSet.refresh();
  },
  methods: {
    goToDetail(item) {
      const { data } = item;
      const { poHeaderId } = data;
      this.$router.push({
        name: "OrderReleaseDetail",
        query: { poHeaderId }
      });
    },
  },
};
</script>