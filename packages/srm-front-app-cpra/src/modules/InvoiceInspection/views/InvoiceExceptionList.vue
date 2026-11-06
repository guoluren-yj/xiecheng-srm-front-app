<template>
  <div style="width: 100%; height: 100vh;">
    <srm-list :data-set="checkFailedDataSet"
              :columns="columns"
              customize-code="SMBL.INVOICECHECK.FAILEDLIST"
              :buttons="getButtonsArray"
              @itemClick="toDetail"/>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { checkFailureDataSource } from "../dataSource/CheckFailureDataSource";

import {
  checkInvoiceApi,
} from "../api/index";
export default {
  modules: [ "sfin.invoiceVerification", "hipspfm.invoiceInspection", "sfin.invoiceBill", "hipspfm.common", "sfin.inputInvoice", "sfin.invoiceInspection" ],
  name: "InvoiceExceptionList",
  data() {
    return {
      checkFailedDataSet: new DataSet(checkFailureDataSource()),
    };
  },
  computed: {
    columns() {
      return [ {
        fieldName: this.$T("sfin.inputInvoice.model.data.number").$D("编号"),
        fieldType: "EMPTY",
        fieldCode: "invoiceCode",
        render: (val, record) => <srm-list-header show-open-tag={true}>
          <span style="font-size: 14px;">{val}</span>
          <span slot="right" style={{ color: record.validateStatusCode === "UNCHECK" ? "var(--color-font-default-e)" : "var(--color-other-default)" }}>{record.validateStatusCodeMeaning}</span>
        </srm-list-header>,
      }, {
        fieldName: this.$T("sfin.inputInvoice.model.purchaser").$D("购买方"),
        fieldType: "TEXT",
        fieldCode: "companyName",
      }, {
        fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxInvoiceNum").$D("税务发票号码"),
        fieldType: "TEXT",
        fieldCode: "invoiceNumber",
      }, {
        fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.billingDate").$D("开票日期"),
        fieldType: "TEXT",
        fieldCode: "billingDate",
        render: (val) => {
          let vals = val.split(" ");
          if (vals.length > 0) {
            return vals[0];
          }
          return val;
        },
      }, {
        fieldName: this.$T("sfin.invoiceVerification.model.totalPrice").$D("不含税金额"),
        fieldType: "INPUT_NUMBER",
        editor: false,
        fieldCode: "totalAmount",
        precision: 2,
      }, ];
    },
    getButtonsArray() {
      return [ {
        text: this.$T("hipspfm.common.button.inspection").$D("查验"),
        fill: true,
        visible: true,
        disabled: (checkedList) => checkedList.length === 0,
        callback: (checkedList) => {
          this.clickCheck(checkedList);
        },
      }, ];
    }
  },
  methods: {
    // 跳转详情页
    toDetail(item) {
      this.$router.push({
        name: "InvoiceExceptionDetail",
        query: item.data
      });
    },
    // 点击查验
    clickCheck(checkList) {
      // eslint-disable-next-line consistent-this
      let self = this;
      // eslint-disable-next-line rulesdir/no_hips
      this.$hips.dialog.confirm({
        content:
          this.$T("sfin.invoiceBill.validation.isInvoiceCheck").$D(
            "是否进行发票查验"
          ) + "？",
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          self.checkInvoice(checkList);
        }
      });
    },
    // 确认查验
    checkInvoice(checkList) {
      let comfirmOrderList = [];
      checkList.map((item) => {
        comfirmOrderList.push(item.data);
      });
      this.$loading.show();
      checkInvoiceApi(comfirmOrderList).then((res) => {
        if (res.failed) {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.operationFailed").$D(
              "操作失败"
            ),
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
            duration: 3
          });
          this.$loading.hide();
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D(
              "操作成功"
            ),
            // eslint-disable-next-line no-undef
            key,
            class: "notification",
            duration: 3
          });
          this.checkFailedDataSet.refresh();
          this.checkFailedDataSet.editFlag = false;
          this.$loading.hide();
        }
      });
    },
  }
};
</script>

<style lang="stylus" scoped>

</style>
