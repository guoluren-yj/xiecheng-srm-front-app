<template>
  <div style="height: 100vh">
    <srm-list :data-set="dataSet"
              customize-code="SMBL.CHECK_PAYABLE_INVOICE.LIST"
              :columns="getColumns"
              :buttons="getButtons"
              @itemClick="goToDetail"/>
  </div>
</template>

<script>

import indexDS from "../datasource/indexDS";
import {
  someCheckApi,
  someAdoptApi,
  someRejectApi,
} from "../api/index";
import { DataSet } from "srm-mobile-ui";

export default {
  modules: [ "hipspfm.common", "sodr.common", "entity.customer", "entity.order", "sodr.confirmOrder", "smbl.common", "hipspfm.orderApproval", "hipspfm.orderConfirmation", "sfin.invoiceBill", "ssrc.supplyInfoChange" ],
  name: "CheckPayableInvoiceList",
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
          fieldCode: "invoiceNum",
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader>
            {
              record.invoiceStatus === "SUBMITTED" &&
                 <srm-tag size="small" type="primary">
                   {record.invoiceStatusMeaning}
                 </srm-tag>
            }
            {
              record.invoiceStatus === "RETURN_TO_APPROVE" &&
                 <srm-tag size="small" type="danger">
                   {record.invoiceStatusMeaning}
                 </srm-tag>
            }
            <span>{val}</span>
            <span slot="right">
              {
                record.validateStatusCode === "UNCHECK" &&
                 <span class="status status1">
                   {record.validateStatusCodeMeaning}
                 </span>
              }
              {
                record.validateStatusCode === "CHECK_SUCCESS" &&
                 <span class="status status2">
                   {record.validateStatusCodeMeaning}
                 </span>
              }
              {
                record.validateStatusCode === "CHECK_FAILED" &&
                 <span class="status status3">
                   {record.validateStatusCodeMeaning}
                 </span>
              }
              {
                record.validateStatusCode === "PARTIAL_SUCCESS" &&
                 <span class="status status4">
                   {record.validateStatusCodeMeaning}
                 </span>
              }
              {
                record.validateStatusCode === "PARTIAL_FAILED" &&
                 <span class="status status5">
                   {record.validateStatusCodeMeaning}
                 </span>
              }
            </span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.company").$D("公司"),
          fieldCode: "companyName",
          formRow:10,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.supplierCompanyId").$D("供应商"),
          fieldCode: "supplierName",
          formRow:20,
          render:(val, record) => <span>{ val || record.supplierCompanyName }</span>
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceAmount").$D("发票总额"),
          fieldType: "EMPTY",
          fieldCode: "taxIncludedAmount",
          formRow:30,
          editor: false,
          render:(val, record) => {
            const length = this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision");
            return (
              <div>
                <span>{this.$T(
                  "sfin.invoiceBill.model.invoiceBill.invoiceAmount"
                ).$D("发票总额")}</span>：
                <span style={record.taxIncludedAmountSystem !== val ? "color:var(--color-other-default)" : ""}>{ this.$options.filters.calcMultipleDelimiter(val, length) }</span>
              </div>
            );
          }
        }
      ];
    },
    // 按钮
    getButtons() {
      return [
        {
          text: this.$T("hipspfm.common.message.pass").$D("通过"),
          fill: true,
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            const checkedListData = checkedList.map((v) => v.data);
            this.clickPass(checkedListData);
          },
        },
        {
          text: this.$T("sfin.invoiceBill.sfin.invoiceBill.model.invoiceBill.return").$D("退回"),
          fill: true,
          type:"danger",
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            const checkedListData = checkedList.map((v) => v.data);
            this.clickReturn(checkedListData);
          },
        },
        {
          text: this.$T("hipspfm.common.button.inspection").$D("查验"),
          fill: true,
          type:"warn",
          visible: true,
          disabled: (checkedList) => checkedList.length === 0,
          callback: (checkedList) => {
            const checkedListData = checkedList.map((v) => v.data);
            this.clickInspection(checkedListData);
          },
        },
      ];
    },
  },
  methods: {
    goToDetail(item) {
      const { data } = item;
      const { invoiceHeaderId } = data;

      this.$router.push({
        name: "CheckPayableInvoiceDetail",
        query: { invoiceHeaderId }
      });
    },
    // 点击通过
    clickPass(checkedList) {
      const that = this;
      this.$dialog({
        content:
          this.$T("sfin.invoiceBill.view.message.title.modal.pass").$D(
            "是否确认通过?"
          ) + "?",
        closable: false,
        onOk() {
          that.someConfirmList(checkedList);
        }
      });
    },
    // 点击退回
    clickReturn(checkedList) {
      const that = this;
      this.$dialog({
        content:
          this.$T("sfin.invoiceBill.view.message.title.modal.detail").$D(
            "是否确认退回?"
          ) + "?",
        closable: false,
        onOk() {
          that.someConfirmList(checkedList);
        }
      });
    },
    // 点击查验
    clickInspection(checkedList) {
      const that = this;
      this.$dialog({
        content:
          this.$T("sfin.invoiceBill.view.message.title.modal.inspection").$D(
            "是否确认查验?"
          ) + "?",
        closable: false,
        onOk() {
          that.someInspection(checkedList);
        }
      });
    },
    //确认通过
    someConfirmList(checkedList) {
      someAdoptApi(checkedList).then((res) => {
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
    //确认退回
    someRejectList(checkedList) {
      someRejectApi(checkedList).then((res) => {
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
    //确认查验
    someInspection(checkedList) {
      someCheckApi(checkedList).then((res) => {
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
        .status {
          text-align: right;
          font-weight:bold;
        }

        .status1 {
          color: var(--color-font-default-e);
        }

        .status2 {
          color: var(--color-other-default-b);
        }

        .status3 {
          color: var(--color-other-default);
        }

        .status4 {
          color: var(--color-other-default-c);
        }

        .status5 {
          color: var(--color-other-default-c);
        }
</style>
