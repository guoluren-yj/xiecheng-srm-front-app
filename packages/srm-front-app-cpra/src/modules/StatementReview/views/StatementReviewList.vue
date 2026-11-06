<template>
  <!-- 对账单审核 -->
  <div style="height: 100vh">
    <srm-list :data-set="dataSetList[type]"
              :columns="getListColumns"
              :buttons="getListButtons"
              customize-code="SMBL.BILL_WORKPLACE.PURCHASER_LIST"
              @itemClick="onListItemClick">
      <!-- `${$T('ssta.purchaseSettlePool.view.button.maintainable').$D('可编辑')}`,
           `${$T('ssta.purchaseSettlePool.view.button.cancelable').$D('可取消')}`,
           `${$T('ssta.purchaseSettlePool.view.button.synchronizable').$D('可同步')}`, -->
      <srm-tab-bar slot="filter"
                   :tabs="[
                     `${$T('ssta.purchaseSettlePool.view.button.total').$D('全部')}`,
                     `${$T('ssta.purchaseSettlePool.view.button.auditable').$D('可审核')}`,
                   ]"
                   display="justify"
                   @indexChange="onTabIndexChange"/>
    </srm-list>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import indexDs from "../datasource/indexDs";
export default {
  modules: [ "ssta.purchaseSettlePool" ],
  name: "StatementReviewList",
  data() {
    return {
      type: "ALL",
      dataSetList: {
        "ALL": new DataSet(indexDs("ALL")),
        "APPROVE": new DataSet(indexDs("APPROVE")),
        "UPDATE": new DataSet(indexDs("UPDATE")),
        "CANCEL": new DataSet(indexDs("CANCEL")),
        "SYNC": new DataSet(indexDs("SYNC")),
      },
      approvalMsg: "",
      approvalPop: false,
    };
  },
  computed: {
    getListColumns() {
      return [
        {
          formRow: 1,
          fieldCode: "header",
          fieldType: "EMPTY",
          render: (val, item) => {
            const billStatus = item.billStatus;
            const statusType = {
              SUBMITED: "primary",
              SUBMITED_APPROVING: "warn",
              CANCELING: "warn",
              CANCEL: "info",
              RETURN: "danger",
              CONFIRM: "success",
            };
            return <SrmListHeader>
              {item.billNum}
              <srm-flex slot="right" >
                <SrmButton plain rect style={{ fontWeight: "bold", marginRight:"5px" }} type={statusType[billStatus] || ""}>
                  {item.billStatusMeaning}
                </SrmButton>
                <ActionBar direction="vertical" data={{ cardInfo:{ cardCode:this.type === "ALL" ? "SSTA_RECONCILIATION_ATTENTION" : "SSTA_RECONCILIATION_APPROVE", data:item } }}/>
              </srm-flex>
            </SrmListHeader>;
          }
        },
        { formRow: 2,
          fieldCode: "taxAmount",
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        { formRow: 3, fieldCode: "netAmount",
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        { formRow: 3, fieldCode: "taxIncludedAmount",
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        { formRow: 4, fieldCode: "companyName" },
        { formRow: 5, fieldCode: "supplierCompanyName" },
        { formRow: 6, fieldCode: "currencyCode" },
        { formRow: 7, fieldCode: "creationDate" },
        { formRow: 8, fieldCode: "createdUserName" },
        /**
         * 智能应用需求，将当前功能作为卡片发送到企业微信或其他第三方聊天平台
         */
        // {
        //   formRow: 100,
        //   fieldCode: "sendMessage",
        //   fieldType: "EMPTY",
        //   render: (_, record) => <SrmFlex justify="end">
        //     <ActionBar data={{ cardInfo:{ cardCode:this.type === "ALL" ? "SSTA_RECONCILIATION_ATTENTION" : "SSTA_RECONCILIATION_APPROVE", data:record } }}/>
        //   </SrmFlex>
        // }
      ];
    },
    getListButtons() {
      if (this.type === "APPROVE") {
        return [
          {
            text: this.$T("ssta.purchaseSettlePool.view.button.back").$D("退回"),
            type: "danger",
            bordered: true,
            visible: true,
            disabled: (checkedList) => checkedList.length === 0,
            callback: () => {
              this.$loading.show();
              this.dataSetList[this.type].updateSelected()?.then(() => {
                this.$loading.hide();
              });
            }
          },
          {
            text: this.$T("ssta.purchaseSettlePool.view.button.submit").$D("确认"),
            type: "primary",
            fill: true,
            visible: true,
            disabled: (checkedList) => checkedList.length === 0,
            callback: () => {
              this.$loading.show();
              this.dataSetList[this.type].submitSelected()?.then(() => {
                this.$loading.hide();
              });
            }
          },
        ];
      }
      if (this.type === "UPDATE") {
        return [
          {
            text: this.$T("ssta.purchaseSettlePool.view.button.cancel").$D("取消"),
            type: "danger",
            bordered: true,
            visible: true,
            disabled: (checkedList) => checkedList.length === 0,
            callback: () => {
              this.$loading.show();
              this.dataSetList[this.type].updateSelected()?.then(() => {
                this.$loading.hide();
              });
            }
          },
          {
            text: this.$T("ssta.purchaseSettlePool.view.button.subsubmit").$D("提交"),
            type: "primary",
            fill: true,
            visible: true,
            disabled: (checkedList) => checkedList.length === 0,
            callback: () => {
              this.$loading.show();
              this.dataSetList[this.type].submitSelected()?.then(() => {
                this.$loading.hide();
              });
            }
          },
        ];
      }
      if (this.type === "CANCEL") {
        return [
          {
            text: this.$T("ssta.purchaseSettlePool.view.button.cancel").$D("取消"),
            type: "danger",
            bordered: true,
            visible: true,
            disabled: (checkedList) => checkedList.length === 0,
            callback: () => {
              this.$loading.show();
              this.dataSetList[this.type].updateSelected()?.then(() => {
                this.$loading.hide();
              });
            }
          },
        ];
      }
      if (this.type === "SYNC") {
        return [
          {
            text: this.$T("ssta.purchaseSettlePool.view.button.sync").$D("同步"),
            type: "primary",
            fill: true,
            visible: true,
            disabled: (checkedList) => checkedList.length === 0,
            callback: () => {
              this.$loading.show();
              this.dataSetList[this.type].submitSelected()?.then(() => {
                this.$loading.hide();
              });
            }
          },
        ];
      }
      return [];
    }
  },
  activated() {
    this.dataSetList[this.type].refresh();
  },
  methods: {
    onTabIndexChange(index) {
      if (index === 0) {
        this.type = "ALL";
      }
      if (index === 1) {
        this.type = "APPROVE";
      }
      if (index === 2) {
        this.type = "UPDATE";
      }
      if (index === 3) {
        this.type = "CANCEL";
      }
      if (index === 4) {
        this.type = "SYNC";
      }
      this.dataSetList[this.type].refresh();
      this.dataSetList = { ...this.dataSetList };
    },
    onListItemClick(item) {
      this.$router.push({
        name: "StatementReviewDetail",
        query: {
          id: item.data.billHeaderId,
          type: this.type,
        },
      });
    },
  }
};
</script>