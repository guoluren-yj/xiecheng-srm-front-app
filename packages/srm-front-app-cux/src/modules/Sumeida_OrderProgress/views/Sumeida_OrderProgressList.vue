<template>
  <div style="height: 100vh">
    <nav-head title="维护/查看订单执行进度"/>
    <SrmList :style="{height: showBackFlag ? 'calc(100vh - 44px)' : '100vh'}"
             :data-set="dataSet"
             :columns="getColumns()"
             @itemClick="onItemClick"/>
  </div>
</template>

<script>
import NavHead from "@/components/NavHead";
import orderProgressDataSet from "../datasource/OrderProgressDataSet";
import { DataSet } from "srm-mobile-ui";

export default {
  modules: [ "smbl.common","sodr.common" ],
  name: "SumeidaOrderProgressList",
  components: {
    NavHead
  },
  data() {
    return {
      dataSet: new DataSet(orderProgressDataSet()),
      showDetailPopup: false,
    };
  },
  methods: {
    onSubmit() {
      this.$notification.open({
        message: this.$T("smbl.common.message.saveSuccess").$D("保存成功"),
        class: "notification",
        duration: 3
      });
      this.showDetailPopup = false;
      this.dataSet.refresh();
    },
    onItemClick(item) {
      console.log("onItemClick", item);
      this.$router.push({ path: "/SumeidaOrderProgressDetail", query: { poHeaderId: item.get("poHeaderId") } });
    },
    getColumns() {
      return [ {
        fieldCode: "customHeader",
        fieldType: "EMPTY",
        render: (val, item) => {
          return <SrmListHeader>
            <span>{item.displayPoNum}</span>
          </SrmListHeader>;
        }
      }, {
        fieldCode: "companyName",
        fieldName: "公司",
        langCode: "sodr.common.model.common.companyName",
      }, {
        fieldCode: "supplierName",
        fieldName: "供应商",
        langCode: "sodr.common.model.common.supplier",
      }, {
        fieldCode: "orderTypeName",
        fieldName: "销售订单号",
        langCode: "sodr.common.model.common.saleOrderNum",
      }, {
        fieldCode: "actualDate",
        fieldName: "实际时间",
        langCode: "sodr.common.model.common.actualDate",
      }, {
        fieldCode: "needByDate",
        fieldName: "需求日期",
        langCode: "sodr.common.model.common.needDate",
      }, ];
    },
  }
};
</script>

<style scoped lang="stylus">
</style>
