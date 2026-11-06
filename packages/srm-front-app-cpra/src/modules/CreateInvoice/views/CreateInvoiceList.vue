<template>
  <div style="height: 100vh">
    <srm-list :data-set="dataSet"
              customize-code="SMBL.CREATE.RECEIVEABLE.INVOICE.LIST"
              :columns="getColumns"
              :buttons="getButtons"
              @itemClick="goToDetail"/>
  </div>
</template>

<script>

import indexDS from "../datasource/indexDS";
import {
  getNeedApi,
  getUnNeedApi,
  getRemoveUnNeedApi
} from "../api/index";
import { DataSet } from "srm-mobile-ui";

export default {
  modules: [ "hipspfm.common", "sodr.common", "entity.customer", "entity.order", "sodr.confirmOrder", "smbl.common", "hipspfm.orderApproval", "hipspfm.orderConfirmation", "sfin.invoiceBill", "ssrc.supplyInfoChange", "hipspfm.createInvoice" ],
  name: "CheckPayableInvoiceList",
  components: {
  },
  data() {
    return {
      dataSet: new DataSet(indexDS()),
    };
  },
  computed: {
    needInvoiceFlag() {
      return this.dataSet.queryParameter.needInvoiceFlag;
    },
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "poNum",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader>
            <span>{val}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.itemName").$D("物料名称"),
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxRate").$D("税率"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxIncludedPrice").$D("含税单价"),
          fieldCode: "taxPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.netPrice").$D("不含税单价"),
          fieldCode: "freeTaxPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.customer").$D("客户"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceQuantity").$D("本次开票数量"),
          fieldCode: "currentInvoiceNumber",
          fieldType: "INPUT_NUMBER",
          editor: false
        },
      ];
    },
    // 按钮
    getButtons() {
      return [
        {
          text: this.$T("hipspfm.createInvoice.view.button.cretae").$D("新建"),
          fill: true,
          visible: !this.needInvoiceFlag,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            const checkedListData = checkedList.map((v) => v.data);
            this.clickCreate(checkedListData);
          },
        },
        {
          text: this.$T("hipspfm.createInvoice.view.button.detach").$D("移除"),
          fill: true,
          type:"danger",
          visible: !this.needInvoiceFlag,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            const checkedListData = checkedList.map((v) => v.data);
            this.clickUnNeed(checkedListData);
          },
        },
        {
          text: this.$T("hipspfm.createInvoice.view.button.revokeRemoval").$D("撤销移除"),
          fill: true,
          visible: this.needInvoiceFlag,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            const checkedListData = checkedList.map((v) => v.data);
            this.clickUndoRemove(checkedListData);
          },
        },
      ];
    },
  },
  methods: {
    goToDetail(item) {
      const { data } = item;
      this.$router.push({
        name: "OrderLineDetail",
        query: { data }
      });
    },
    // 点击创建
    clickCreate(checkedList) {
      const that = this;
      this.$dialog({
        content:
          this.$T("sfin.invoiceBill.view.message.title.modal.create").$D(
            "是否确认创建?"
          ) + "?",
        closable: false,
        onOk() {
          that.someNeed(checkedList);
        }
      });
    },
    // 点击移除
    clickUnNeed(checkedList) {
      const that = this;
      this.$dialog({
        content:
          this.$T("hipspfm.createInvoice.validation.message.confirmRomoveDoc").$D(
            "确定移除该单据?"
          ) + "?",
        closable: false,
        onOk() {
          that.someUnNeed(checkedList);
        }
      });
    },
    // 点击撤销移除
    clickUndoRemove(checkedList) {
      const that = this;
      this.$dialog({
        content:
          this.$T("sfin.invoiceBill.view.message.title.modal.confirmUndoRemove").$D(
            "确定撤销移除该单据?"
          ) + "?",
        closable: false,
        onOk() {
          that.undoRemove(checkedList);
        }
      });
    },
    //确认创建
    someNeed(checkedList) {
      getNeedApi(checkedList).then((res) => {
        if (res.failed) {
          this.$notification.open({
            message: res.message,
            description: "",
            // eslint-disable-next-line no-undef
            key,
            class: "notification"
          });
        } else {
          this.$notification.open({
            message: this.$T(
              "hipspfm.common.message.operationSuccessful"
            ).$D("操作成功"),
            description: "",
            // eslint-disable-next-line no-undef
            key,
            class: "notification"
          });
          // eslint-disable-next-line no-undef
          this.$router.push({
            name: "CreateInvoiceDetail",
            query: { invoiceHeaderId: res[0].invoiceHeaderId }
          });
        }
      });
    },
    //确认移除
    someUnNeed(checkedList) {
      let params = [];
      checkedList.forEach((item) => {
        params.push(item.rcvTrxLineId);
      });
      getUnNeedApi(params).then((res) => {
        if (res.failed) {
          this.$notification.open({
            message: res.message,
            description: "",
            // eslint-disable-next-line no-undef
            key,
            class: "notification"
          });
        } else {
          this.$notification.open({
            message: this.$T(
              "hipspfm.common.message.operationSuccessful"
            ).$D("操作成功"),
            description: "",
            // eslint-disable-next-line no-undef
            key,
            class: "notification"
          });
          this.dataSet.refresh();
        }
      });
    },
    //确认撤销移除
    undoRemove(checkedList) {
      let params = [];
      checkedList.forEach((item) => {
        params.push(item.rcvTrxLineId);
      });
      getRemoveUnNeedApi(params).then((res) => {
        if (res.failed) {
          this.$notification.open({
            message: res.message,
            description: "",
            // eslint-disable-next-line no-undef
            key,
            class: "notification"
          });
        } else {
          this.$notification.open({
            message: this.$T(
              "hipspfm.common.message.operationSuccessful"
            ).$D("操作成功"),
            description: "",
            // eslint-disable-next-line no-undef
            key,
            class: "notification"
          });
          this.dataSet.refresh();
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
      >>> .srm-tag-primary{
            border-radius: 2px;
            margin-right: 8px;
            padding: 2px 4px;
            font-weight: normal;
            font-size: 10px !important;
            background-color: rgba(0,207,194,0.1);
            color: var(--color-other-default-b);
            line-height: 18px;
            position: relative;
            bottom: 2px;
      }
</style>
