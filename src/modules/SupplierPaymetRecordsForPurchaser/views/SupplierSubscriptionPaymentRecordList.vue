<template>
  <div class="supplier-payment-record-list">
    <srm-list
      v-if="paymentRecordListDataSet"
      :data-set="paymentRecordListDataSet"
      :columns="getColumns"
      @itemClick="showDetail"/>
    <!-- 续费引导 -->
    <srm-popup :visible.sync="paymentInfoShowFlag" height="100%" position="right" :show-header="false">
      <div class="payment-tip">{{ $T("spfm.supplierInvoic.view.renewalAlertMsg").$D("续费账单如下，请仔细核对账单后确认前往缴费。") }}</div>
      <customize-detail :need-padding="true" :columns="paymentColumns" :data-source="paymentDataSource"/>
      <srm-bottom-handler :btn-arr="paymentInfoButtons" />
    </srm-popup>
  </div>
</template>

<script>
import { DataSet, SrmUtil } from "srm-mobile-ui";
import paymentRecordListDS from "../datasource/PaymentRecordListDS";
import PaymentRecordItemButtons from "../component/PaymentRecordItemButtons";
import renewMakeInvoiceDS from "../datasource/RenewMakeInvoiceDS";
import invoiceInfoDS from "../datasource/InvoiceInfoDS";
import paymentHistoryListDS from "../datasource/PaymentHistoryListDS";
import {
  getMakeInvoiceInfoApi,
  getInvoiceInfoApi,
  getTicketStatusApi,
  saveMakeInvoiceInfoApi,
  sullierPaymentPrePayApi,
  getRenewPaymentInfoApi,
  checkPaymentStateApi,
  cancelcurrentPaymentApi,
  getAmktLovApi,
} from "../api/index";
export default {
  modules: [ "spfm.supplierInvoic", "smbl.common" ],
  name: "SupplierSubscriptionPaymentRecordList",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    PaymentRecordItemButtons,
  },
  data() {
    return {
      paymentRecordListDataSet: null,
      paymentRecordDetailDataSet: null,
      // 缴费-缴费数据
      paymentInfoShowFlag: false,
      paymentDataSource: {},
      // 缴费-确认开票并缴费
      renewMakeInvoiceDateSet: null,
      renewMakeInvoicePopup: null,
      // 开票申请
      applyMakeInvoiceDataSet: null,
      applyMakeInvoicePopup: null,
      // 开票信息
      makeInvoiceInfoDataSet: null,
      // 发票信息
      invoiceInfoDataSet: null,
      // 缴费历史
      paymentHistoryDataSet: null,
      paymentHistoryPopup: null,
      // 记录路由length
      currentRouterLength: 0,
      // 发票类型listData
      invoiceTypeListData: [],
    };
  },
  computed: {
    getColumns() {
      return [ {
        fieldCode: "paymentHeader",
        formRow: 10,
      }, {
        fieldCode: "coreTenantCode",
        formRow: 20,
      }, {
        fieldCode: "coreTenantName",
        formRow: 30,
      }, {
        fieldCode: "supplierTenantCode",
        formRow: 20,
      }, {
        fieldCode: "supplierTenantName",
        formRow: 30,
      }, {
        fieldCode: "paymentFee",
        formRow: 40,
      }, {
        fieldCode: "paymentDate",
        formRow: 50,
      }, {
        fieldCode: "startDate",
        formRow: 60,
      }, {
        fieldCode: "endDate",
        formRow: 60,
      }, {
        fieldCode: "itemButtons",
        formRow: 99999,
        fieldType: "EMPTY",
        visible: () => {
          const userInfo = SrmUtil.getUserInfo();
          return String(SrmUtil.getTenantId()) !== String(userInfo.organizationId);
        },
        render: (v, item) => {
          let buttons = this.getItemButtons(item);
          return <PaymentRecordItemButtons buttons={buttons}/>;
        },
      } ];
    },
    paymentColumns() {
      return [ {
        fieldCode: "coreTenantCode",
        fieldType: "TEXT",
        fieldName: this.$T("spfm.supplierInvoic.model.enterpriseCode").$D("核企编码"),
      }, {
        fieldCode: "coreTenantName",
        fieldType: "TEXT",
        fieldName: this.$T("spfm.supplierInvoic.model.enterpriseName").$D("核企名称"),
      }, {
        fieldCode: "paymentFee",
        fieldType: "TEXT",
        fieldName: this.$T("spfm.supplierInvoic.model.amount").$D("年订阅费金额"),
      }, {
        fieldCode: "startDate",
        fieldType: "TEXT",
        fieldName: this.$T("spfm.supplierInvoic.model.activePeriod").$D("有效期"),
        render: (val, item) => `${SrmUtil.dateFormat(val) || "-"} ${this.$T("spfm.supplierInvoic.view.title.toFlag").$D("至")} ${SrmUtil.dateFormat(item.endDate) || "-"}`,
      }, ];
    },
    getInvoiceColumns() {
      return [
        { fieldCode: "invoiceType", },
        { fieldCode: "invoiceTitle", },
        { fieldCode: "taxNo", },
        { fieldCode: "bankName", },
        { fieldCode: "bankAccount", },
        { fieldCode: "taxAddress", },
        { fieldCode: "taxPhone", },
        { fieldCode: "invoicePerson", },
        { fieldCode: "invoiceEmaill", },
        { fieldCode: "invoicePhone", },
        { fieldCode: "invoiceAddress", },
      ];
    },
    // 续费操作事件-按钮
    paymentInfoButtons() {
      if (this.paymentDataSource.payUserId) {
        return [ {
          title: this.$T("smbl.common.button.cancelPay").$D("取消支付"),
          fill: false,
          bordered: true,
          handler: () => {
            this.$loading.show();
            cancelcurrentPaymentApi(this.paymentDataSource.supplierPaymentId).then(() => {
            }).finally(() => {
              this.$loading.hide();
              this.paymentRecordListDataSet.refresh();
              this.paymentInfoShowFlag = false;
            });
          },
        }, {
          title: this.$T("smbl.common.button.onPay").$D("支付中"),
          fill: true,
          bordered: false,
          handler: () => {
            // 预支付
            this.prePay();
          },
        }, {
          title: this.$T("smbl.common.view.button.cancel").$D("取消"),
          fill: false,
          bordered: true,
          handler: () => {
            this.paymentInfoShowFlag = false;
          },
        }, ];
      }
      return [ {
        title: this.$T("smbl.common.view.button.cancel").$D("取消"),
        fill: false,
        bordered: true,
        handler: () => {
          this.paymentInfoShowFlag = false;
        },
      }, {
        title: this.$T("spfm.supplierInvoic.view.button.toPay").$D("前往缴费"),
        fill: true,
        bordered: false,
        handler: () => {
          // 预支付
          this.prePay();
        },
      }, ];
    },
  },
  beforeMount() {
    this.$loading.show();
    getTicketStatusApi().then((res) => {
      if (res && !res.failed) {
        this.paymentRecordListDataSet = new DataSet(paymentRecordListDS(res));
      }
    }).finally(() => {
      this.$loading.hide();
    });
    this.currentRouterLength = window.history.length;
  },
  methods: {
    // lineItem-行按钮
    getItemButtons(item) {
      let buttons = [];
      // 未开票显示申请开票，其余显示开票信息
      if (item.ticketState === "UNINVOICED") {
        buttons.push({
          "title": this.$T("smbl.common.button.makeInvoiceApply").$D("开票申请"),
          "action": () => {
            this.applyMakeInvoice(item);
          },
        });
      } else {
        buttons.push({
          "title": this.$T("spfm.supplierInvoic.model.billingInformation").$D("开票信息"),
          "action": () => {
            this.checkMakeInvoiceInfo(item);
          },
        });
      }
      // 已开票显示发票信息
      if (item.ticketState === "INVOICE_TICKET") {
        buttons.push({
          "title": this.$T("spfm.supplierInvoic.model.invoiceInformation").$D("发票信息"),
          "action": () => {
            this.checkInvoiceInfo(item);
          },
        });
      }
      if (item.canRenew) {
        if (item.hasBuy) {
          buttons.push({
            "title": this.$T("spfm.supplierInvoic.button.renewalPaying").$D("续费中"),
            "action": () => {
              this.$loading.show();
              checkPaymentStateApi(item.renewId).then((res) => {
                if (!res) {
                  this.itemActionToRenew(item);
                }
              }).finally(() => {
                this.$loading.hide();
              });
            },
          });
        } else {
          // 可续费
          buttons.push({
            "title": this.$T("spfm.supplierInvoic.button.editInvoice").$D("续费"),
            "action": () => {
              this.itemActionToRenew(item);
            },
          });
        }
      }
      // buttons.push({
      //   "title": this.$T("spfm.supplierInvoic.button.historyRecord").$D("缴费历史"),
      //   "action": () => {
      //     this.checkPaymentHistory(item);
      //   },
      // });
      return buttons;
    },
    // 展示详情，防止多语言导致字段显示不完整
    showDetail(record) {
      this.paymentRecordDetailDataSet = new DataSet(paymentRecordListDS());
      this.paymentRecordDetailDataSet.autoQuery = false;
      this.paymentRecordDetailDataSet.create(record.data, 0);
      this.$popup({
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <srm-form data-set={this.paymentRecordDetailDataSet} customize-type="detail" columns={[
          { fieldCode: "paymentNo", },
          { fieldCode: "ticketStateMeaning", },
          { fieldCode: "coreTenantCode", },
          { fieldCode: "coreTenantName", },
          { fieldCode: "supplierTenantCode", },
          { fieldCode: "supplierTenantName", },
          { fieldCode: "paymentFee", },
          { fieldCode: "paymentDate", },
          { fieldCode: "startDate", },
          { fieldCode: "endDate", },
        ]}></srm-form>,
      });
    },
    // ------------------------ 申请开票 ---------------------------
    // 申请开票
    applyMakeInvoice(item) {
      if (this.invoiceTypeListData.length) {
        this.makeInvoice(item, item.supplierTicketId, this.invoiceTypeListData);
        return;
      }
      this.$loading.show();
      getAmktLovApi("AMKT.INVOICE_TYPE").then((res) => {
        if (res && !res.failed) {
          this.invoiceTypeListData = res;
          this.makeInvoice(item, item.supplierTicketId, res);
        }
      }).finally(() => {
        this.$loading.hide();
      });
      // this.$loading.show();
      // getMakeInvoiceInfoApi(item.supplierTicketId).then((res) => {
      //   if (res && !res.failed) {
      //     this.makeInvoice(res, item);
      //   }
      // }).finally(() => {
      //   this.$loading.hide();
      // });
    },
    // 开票申请，开票申请是支付后功能，支付后不允许编辑
    makeInvoice(item, supplierTicketId, listData) {
      this.applyMakeInvoiceDataSet = new DataSet(renewMakeInvoiceDS(true, supplierTicketId, listData));
      this.applyMakeInvoiceDataSet.events.afterQuery = (ds, data) => {
        // 标记可编辑&必填
        if (data.length > 0) {
          data[0].editorFlag = true;
          if (!data[0].supplierPaymentId) {
            data[0].supplierPaymentId = item.supplierPaymentId;
          }
        } else {
          data.push({
            editorFlag: true,
            bankAccount: null,
            bankName: null,
            companyId: null,
            createdBy: 0,
            creationDate: null,
            invoiceAddress: null,
            invoiceEmaill: null,
            invoicePerson: null,
            invoicePhone: null,
            invoiceTitle: null,
            invoiceType: null,
            lastUpdateDate: null,
            lastUpdatedBy: null,
            objectVersionNumber: 0,
            supplierPaymentId: item.supplierPaymentId,
            supplierTicketId: supplierTicketId,
            taxAddress: null,
            taxNo: null,
            taxPhone: null,
            tenantId: SrmUtil.getTenantId(),
          });
        }
        return data;
      };

      // data.editorFlag = false;
      // this.applyMakeInvoiceDataSet = new DataSet(renewMakeInvoiceDS());
      // this.applyMakeInvoiceDataSet.create(data, 0);
      this.applyMakeInvoicePopup = this.$popup({
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <div style="width: 100%; height: 100%; overflow: scroll;">
          <srm-form data-set={this.applyMakeInvoiceDataSet} customize-type="detail" columns={this.getInvoiceColumns}></srm-form>
          <div class="blank-view" />
          <srm-bottom-handler btn-arr={[ {
            title: this.$T("smbl.common.view.button.cancel").$D("取消"),
            bordered: true,
            handler: () => {
              this.applyMakeInvoicePopup.closePopup();
              this.applyMakeInvoicePopup = null;
            },
          }, {
            title: this.$T("smbl.common.button.applyMakeInvoice").$D("申请开票"),
            fill: true,
            bordered: false,
            handler: () => {
              if (!this.applyMakeInvoiceDataSet.validate()) {
                return;
              }
              this.$loading.show();
              let data = this.applyMakeInvoiceDataSet.current.data;
              saveMakeInvoiceInfoApi(data).then((res) => {
                if (res && !res.failed) {
                  // 关闭弹框
                  this.applyMakeInvoicePopup.closePopup();
                  this.applyMakeInvoicePopup = null;
                  this.paymentRecordListDataSet.refresh();
                }
              }).finally(() => {
                this.$loading.hide();
              });
            },
          } ]}/>
        </div>,
      });
    },
    // ------------------------ 缴费历史 ---------------------------
    // 查看并展示缴费历史
    checkPaymentHistory(item) {
      this.paymentHistoryDataSet = new DataSet(paymentHistoryListDS(item.coreTenantCode, item.supplierTenantCode));
      this.paymentHistoryPopup = this.$popup({
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        onClose: () => {
          // 关闭后将dataSet置空，申请开票完成后根据需要刷新列表
          this.paymentHistoryDataSet = null;
        },
        content: <srm-list data-set={this.paymentHistoryDataSet} columns={[
          { fieldCode: "paymentHeader", },
          { fieldCode: "paymentFee", },
          { fieldCode: "paymentDate", },
          { fieldCode: "startDate", },
          {
            fieldCode: "itemButtons",
            formRow: 99999,
            fieldType: "EMPTY",
            render: (v, record) => {
              let buttons = this.getHistoryItemButtons(record);
              return <PaymentRecordItemButtons buttons={buttons}/>;
            },
          }
        ]}/>,
      });
    },
    // 缴费历史的行按钮
    getHistoryItemButtons(item) {
      let buttons = [];
      if (item.ticketState === "UNINVOICED") { // 未开票
        buttons.push({
          "title": this.$T("smbl.common.button.makeInvoiceApply").$D("开票申请"),
          "action": () => {
            this.applyMakeInvoice(item);
          },
        });
      } else if (item.ticketState === "INVOICE_APPLY") { // 开票申请中
        buttons.push({
          "title": this.$T("spfm.supplierInvoic.model.billingInformation").$D("开票信息"),
          "action": () => {
            this.checkMakeInvoiceInfo(item);
          },
        });
      } else if (item.ticketState === "INVOICE_TICKET" || item.ticketState === "INVOICE_REVISION") { // 已开票
        buttons.push({
          "title": this.$T("spfm.supplierInvoic.model.billingInformation").$D("开票信息"),
          "action": () => {
            this.checkMakeInvoiceInfo(item);
          },
        });
        buttons.push({
          "title": this.$T("spfm.supplierInvoic.model.invoiceInformation").$D("发票信息"),
          "action": () => {
            this.checkInvoiceInfo(item);
          },
        });
      }
      return buttons;
    },
    // ------------------------ 发票信息 ---------------------------
    // 查看发票信息
    checkInvoiceInfo(item) {
      this.$loading.show();
      getInvoiceInfoApi(item.supplierInvoiceId).then((res) => {
        if (res && !res.failed) {
          this.showInvoiceInfo(res);
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 展示发票信息
    showInvoiceInfo(data) {
      this.invoiceInfoDataSet = new DataSet(invoiceInfoDS());
      this.invoiceInfoDataSet.create(data, 0);
      this.$popup({
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <div style="width: 100%; height: 100%; overflow: scroll;">
          <srm-form data-set={this.invoiceInfoDataSet} customize-type="detail" columns={[
            { fieldCode: "invoiceCode", },
            { fieldCode: "invoiceNo", },
            { fieldCode: "feeNoTax", },
            { fieldCode: "taxRate", },
            { fieldCode: "taxFee", },
            { fieldCode: "feeIncludeTax", },
            { fieldCode: "expressCompanyMeaning", },
            { fieldCode: "expressNum", }
          ]} />
        </div>,
      });
    },
    // ------------------------ 开票信息 ---------------------------
    // 查看开票信息
    // item：行数据或缴费历史数据，相同模型
    checkMakeInvoiceInfo(item) {
      this.$loading.show();
      getMakeInvoiceInfoApi(item.supplierTicketId).then((res) => {
        if (res && !res.failed) {
          this.showMakeInvoiceInfo(res);
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 显示开票信息
    showMakeInvoiceInfo(data) {
      data.editorFlag = false;
      this.makeInvoiceInfoDataSet = new DataSet(renewMakeInvoiceDS(false));
      this.makeInvoiceInfoDataSet.create(data, 0);
      this.$popup({
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <div style="width: 100%; height: 100%; overflow: scroll;">
          <srm-form data-set={this.makeInvoiceInfoDataSet} customize-type="detail" columns={this.getInvoiceColumns} />
        </div>,
      });
    },
    // ------------------------ 续费 ---------------------------
    // lineItem-续费
    itemActionToRenew(item) {
      this.$loading.show();
      getRenewPaymentInfoApi(item.supplierPaymentId).then((res) => {
        if (res && !res.failed) {
          this.paymentInfoShowFlag = true;
          this.paymentDataSource = res;
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
    // 确认开票并缴费
    confirmInvoiceInfoAndPay(supplierTicketId) {
      this.renewMakeInvoiceDateSet = new DataSet(renewMakeInvoiceDS(true, supplierTicketId));
      this.renewMakeInvoiceDateSet.events.afterQuery = (ds, data) => {
        // 标记可编辑&必填
        if (data.length > 0) {
          data[0].editorFlag = true;
        } else {
          data.push({
            editorFlag: true,
            bankAccount: null,
            bankName: null,
            companyId: null,
            createdBy: 0,
            creationDate: null,
            invoiceAddress: null,
            invoiceEmaill: null,
            invoicePerson: null,
            invoicePhone: null,
            invoiceTitle: null,
            invoiceType: null,
            lastUpdateDate: null,
            lastUpdatedBy: null,
            objectVersionNumber: 0,
            supplierPaymentId: this.paymentDataSource.supplierPaymentId,
            supplierTicketId: this.paymentDataSource.supplierTicketId,
            taxAddress: null,
            taxNo: null,
            taxPhone: null,
            tenantId: SrmUtil.getTenantId(),
          });
        }
        return data;
      };
      this.renewMakeInvoicePopup = this.$popup({
        showHeader: false,
        showClose: false,
        rounded: false,
        height: "100vh",
        position: "right",
        content: <div style="width: 100%; height: 100%; overflow: scroll;">
          <srm-form data-set={this.renewMakeInvoiceDateSet} customize-type="detail" columns={this.getInvoiceColumns}></srm-form>
          <div class="blank-view" />
          <srm-bottom-handler btn-arr={[ {
            title: this.$T("smbl.common.view.button.cancel").$D("取消"),
            bordered: true,
            handler: () => {
              this.renewMakeInvoicePopup.closePopup();
              this.renewMakeInvoicePopup = null;
            },
          }, {
            title: this.$T("spfm.supplierInvoic.view.button.toPay").$D("前往缴费"),
            fill: true,
            bordered: false,
            handler: () => {
              if (!this.renewMakeInvoiceDateSet.validate()) {
                return;
              }
              // 修改后的数据
              let data = this.renewMakeInvoiceDateSet.current.data;
              // saveMakeInvoiceInfoApi
              // 首先保存开票信息，然后跳转支付
              this.$loading.show();
              saveMakeInvoiceInfoApi(data).then((res) => {
                if (res && !res.failed) {
                  // 关闭开票信息弹框
                  this.renewMakeInvoicePopup.closePopup();
                  this.renewMakeInvoicePopup = null;
                  // 获取预支付信息，跳转收银台
                  this.prePay();
                }
              }).finally(() => {
                this.$loading.hide();
              });
            },
          } ]}/>
        </div>,
      });
    },
    // 准备支付，预支付获取支付中心订单id
    prePay() {
      let supplierPaymentId = this.paymentDataSource.supplierPaymentId;
      this.$loading.show();
      let returnUrl = `${window.location.origin}${window.location.pathname}#/public/PaymentResult`;
      sullierPaymentPrePayApi(supplierPaymentId, returnUrl).then((res) => {
        if (res && !res.failed) {
          // 获取到的支付中心订单号
          let paymentOrderNum = res;
          window.localStorage.setItem("beforePaymentRouterLength", String(this.currentRouterLength));
          this.$router.push({
            path: "/Payment",
            query: {
              paymentOrderNum,
            }
          });
        }
      }).finally(() => {
        this.$loading.hide();
      });
    },
  }
};
</script>

<style lang="stylus" scoped>

.supplier-payment-record-list {
  width: 100vw;
  height: 100vh;
}

.payment-tip {
  line-height: 16px;
  background-color: var(--color-ghost-primary);
  color: var(--font-color-primary);
  font-size: 12px;
  padding: 8px 15px;
}

// 适配底部按钮
.blank-view {
  width: 100%;
  height: 100px;
}

</style>
