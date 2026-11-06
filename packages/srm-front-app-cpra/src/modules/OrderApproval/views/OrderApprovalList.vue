<template>
  <div style="height: 100vh">
    <srm-list :data-set="dataSet"
              customize-code="SMBL.ORDER_APPROVAL.LIST"
              :columns="getColumns"
              :buttons="getButtons"
              @itemClick="goToDetail"/>
  </div>
</template>

<script>

import indexDS from "../datasource/indexDS";
import { DataSet } from "srm-mobile-ui";
import {
  someAdoptApi,
  someRejectApi,
} from "../api/index";

export default {
  modules: [ "hipspfm.orderApproval", "hipspfm.common", "sodr.orderApproval", "sprm.common" ],
  name: "OrderApprovalList",
  components: {
  },
  data() {
    return {
      dataSet: new DataSet(indexDS()),
    };
  },
  computed: {
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "customHeader",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>{item.displayPoNum}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("hipspfm.common.message.supplier").$D("供应商"),
          fieldCode: "supplierName",
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.agentName").$D("采购员"),
          fieldCode: "agentName",
        },
        {
          fieldName: this.$T("hipspfm.common.message.createTime").$D("创建时间"),
          fieldCode: "erpCreationDate",
        },
        {
          fieldName: this.$T("sodr.orderApproval.model.common.taxIncludeAmount").$D("含税金额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxIncludeAmount",
          editor: false,
          precision: (val, item, field, record) => {
            // erp订单及电商申请转订单不做精度控制
            // erp订单：sourceCode="SRM"&&poSourcePlatform="ERP"
            const erpFlag = record.sourceCode === "SRM" && record.poSourcePlatform === "ERP";
            // 电商申请转订单：sourceCode="SAP"&&poSourcePlatform="E-COMMERCE"
            const sapFlag = record.sourceCode === "SAP" && record.poSourcePlatform === "E-COMMERCE";
            if (!erpFlag && !sapFlag) {
              return Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision"));
            }
          },
        },
      ];
    },
    // 按钮
    getButtons() {
      return [
        {
          text: this.$T("hipspfm.common.message.reject").$D("拒绝"),
          fill: true,
          type: "danger",
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            const checkedListData = checkedList.map((i) => i.toData());
            this.clickReject(checkedListData);
          },
        },
        {
          text: this.$T("hipspfm.common.message.pass").$D("通过"),
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            const checkedListData = checkedList.map((i) => i.toData());
            this.clickAdopt(checkedListData);
          },
        },
      ];
    },
  },
  methods: {
    goToDetail(item) {
      const { data } = item;
      const { poHeaderId, orgName } = data;

      this.$router.push({
        name: "OrderApprovalDetail",
        query: { poHeaderId, orgName }
      });
    },
    // 点击通过
    clickAdopt(checkedList) {
      const that = this;
      this.$dialog({
        content:
          this.$T("hipspfm.orderApproval.view.message.passOrderOrNot").$D(
            "是否通过该订单"
          ) + "?",
        closable: false,
        onOk() {
          that.someAdoptList(checkedList);
        }
      });
    },
    //确认通过
    someAdoptList(checkedList) {
      this.$loading.show();
      someAdoptApi(checkedList).then((res) => {
        this.$loading.hide();
        if (res) {
          if (res.failed) {
            this.$notification.open({
              message: res.message,
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
              duration: 3
            });
          } else {
            this.$notification.open({
              message: this.$T("hipspfm.common.view.validation.approvelSuccess").$D(
                "审批通过成功"
              ),
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
              duration: 3
            });
            this.dataSet.refresh();
          }
        }
      });
    },
    //点击拒绝
    clickReject(checkedList) {
      const that = this;

      this.$dialog({
        content:
          this.$T("hipspfm.orderApproval.view.message.rejectOrderOrNot").$D(
            "是否拒绝该订单"
          ) + "?",
        closable: false,
        onOk() {
          that.someRejectList(checkedList);
        }
      });
    },
    //确认拒绝
    someRejectList(checkedList) {
      this.$loading.show();
      someRejectApi(checkedList).then((res) => {
        this.$loading.hide();
        if (res) {
          if (res.failed) {
            this.$notification.open({
              message: res.message,
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
              duration: 3
            });
          } else {
            this.$notification.open({
              message: this.$T("hipspfm.common.view.validation.rejectSuccess").$D(
                "审批拒绝成功"
              ),
              // eslint-disable-next-line no-undef
              key,
              class: "notification",
              duration: 3
            });
            this.dataSet.refresh();
          }
        }
      });
    },
    // 退出子应用
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style lang="stylus" scoped>

</style>
