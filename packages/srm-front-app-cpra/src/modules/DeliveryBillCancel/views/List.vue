<template>
  <!-- 送货单取消 -->
  <div style="height: 100vh">
    <srm-list
      customize-code="SMBL.DELIVERY_BILL_CANCEL.LIST"
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
  name: "DeliveryBillCancelList",
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
            <span>{item.asnNum}</span>
            <span slot="right">{item.asnTypeCodeMeaning}</span>
          </SrmListHeader>,
          formRow: 10,
        },
        {
          fieldName: $T("sodr.common.model.common.custom").$D("客户"),
          fieldCode: "companyName",
          formRow: 20,
        },
        {
          fieldName: $T("sodr.common.model.common.company").$D("公司"),
          fieldCode: "supplierCompanyName",
          formRow: 30,
        },
        {
          fieldName: $T("sodr.common.model.common.cancelSyncStatus").$D("取消导入状态"),
          fieldCode: "cancelSyncStatusMeaning",
          formRow: 40,
        },
        {
          fieldName: $T("sodr.common.model.common.feedback").$D("反馈信息"),
          fieldCode: "cancelSyncResponseMsg",
          formRow: 40,
        },
        {
          fieldName: $T("sodr.common.model.common.fhDate").$D("发货日期"),
          fieldCode: "shipDate",
          formRow: 50,
        },
        {
          fieldName: $T("sodr.common.model.common.expectedArriveTime").$D("预计到货时间"),
          fieldCode: "expectedArriveDate",
          formRow: 50,
        },
        {
          fieldName: $T("sodr.common.model.common.purchaser").$D("采购员"),
          fieldCode: "purchaseAgentName",
          formRow: 60,
        },
        {
          fieldName: $T("sodr.common.model.common.organizationName").$D("收货组织"),
          fieldCode: "organizationName",
          formRow: 70,
        },
        {
          fieldName: $T("sodr.common.model.common.locationAddress").$D("收货地点"),
          fieldCode: "shipToLocationAddress",
          formRow: 80,
        },

      ];
    },
    getButtons() {
      return [
        {
          text: $T("sodr.common.view.button.canceled").$D("取消"),
          type: "danger",
          bordered: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: () => {
            this.dataSet.updateSelected();
          }
        },
        {
          text: $T("sodr.common.view.button.resync").$D("重新同步"),
          type: "primary",
          fill: true,
          visible: true,
          disabled: (checkedList) => {
            if (checkedList.length === 0) {
              return true;
            }
            if (checkedList.find((val) => val["data"].cancelSyncStatus !== "FAIL")) {
              return true;
            }
          },
          callback: () => {
            this.dataSet.submitSelected();
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
      const { asnHeaderId } = data;
      this.$router.push({
        name: "DeliveryBillCancelDetail",
        query: { asnHeaderId }
      });
    },
  },
};
</script>