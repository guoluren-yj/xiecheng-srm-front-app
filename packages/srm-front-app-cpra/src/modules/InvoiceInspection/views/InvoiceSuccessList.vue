<template>
  <div style="height: 100vh;width: 100%;">
    <srm-list :data-set="checkSuccessDataSet"
              :columns="columns"
              customize-code="SMBL.INVOICECHECK.SUCCESSLIST"
              :buttons="getButtonsArray"
              @itemClick="toDetail"/>
  </div>
</template>

<script>
import { checkSuccessDataSource } from "../dataSource/CheckSuccessDataSource";
import { DataSet } from "srm-mobile-ui";
import { checkInvoiceApi } from "../api/index";
export default {
  modules: [ "sfin.invoiceBill", "hipspfm.common", "hipspfm.invoiceInspection", "sfin.inputInvoice", "sfin.invoiceVerification", "sfin.invoiceInspection" ],
  name: "InvoiceSuccessList",
  components: {
  },
  data() {
    return {
      checkSuccessDataSet: new DataSet(checkSuccessDataSource()),
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
          <span slot="right" style="color: var(--color-other-default-b);">{record.validateStatusCodeMeaning}</span>
        </srm-list-header>,
      }, {
        fieldName: this.$T("sfin.inputInvoice.model.purchaser").$D("购买方"),
        fieldType: "TEXT",
        fieldCode: "companyName",
      }, {
        fieldName: this.$T("sfin.inputInvoice.model.invoiceNumber").$D("发票号码"),
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
        fieldCode: "totalAmount",
        editor: false,
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
  watch: {
  },
  methods: {
    // 跳转详情页
    toDetail(item) {
      this.$router.push({
        name: "InvoiceSuccessDetail",
        query: item.data
      });
    },
    // 点击查验
    clickCheck(checkList) {
      // eslint-disable-next-line consistent-this
      const self = this;
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
            message: res.message,
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
          this.checkSuccessDataSet.refresh();
          this.checkSuccessDataSet.editFlag = false;
          this.fetchData();
        }
      });
    },
  }
};
</script>

<style lang="stylus" scoped>

</style>
