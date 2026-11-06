<template>
  <div style="height: 100vh; overflow: auto">
    <div class="main-info">
      <div style="height: 100%; overflow: auto;background:#fff">
        <srm-detail-head :data-source="detailInfo" :columns="getInvoiceDetailHeadColumns"/>
        <customize-detail
          :need-padding="true"
          code="SMBL.CREATE.RECEIVEABLE.INVOICE.DETAIL"
          :data-source="detailInfo"
          :columns="getOrderDetailInfoColumns"/>
      </div>
    </div>
    <srm-bottom-handler
      :btn-arr="getBtnArr"/>
  </div>
</template>

<script>
import {
  getOrderLineApi,
  getOrderTaxApi,
  getOrderLedgerAccountApi,
} from "../api/index";
import { getNeedApi, getSettingsApi } from "../api/index";
export default {
  modules: [ "sodr.sendOrder", "hzero.common", "spuc.common", "sodr.confirmOrder", "hipspfm.common", "sodr.common", "hipspfm.orderConfirmation", "ssrc.inquiryHall", "hipspfm.invoiceBill", "sfin.invoiceBill", "sfin.common", "sfin.supplierChargeEntry", "hipspfm.createInvoice" ],
  name: "CheckPayableInvoiceDetail",
  components: {
  },
  data() {
    return {
      headInfo: {}, // 头信息
      lineInfo: [], // 行信息
      detailInfo:{},
      taxInfo:[], // 税务发票行信息
      ledgerAccount:[], //
      operationPopup: false,
      lineInfoDetail: {},
      oploading: false,
      attachmentUUID: "",
      visible:true,
      priceRules: "",
      reClick: true,
    };
  },
  computed: {
    //发票详情头
    getInvoiceDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "displayTrxNum",
          fieldType: "EMPTY",
          render: (val) =>
            <SrmListHeader>
              <span style="color:#fff">{val}</span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.itemCode").$D("物料编码"),
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.itemName").$D("物料名称"),
          fieldCode: "itemName",
        },
      ];

      return columns;
    },
    // 事务详情信息
    getOrderDetailInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.businessTypee").$D("业务类别"),
          fieldType: "TEXT",
          fieldCode: "businessTypeMeaning",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.specificationsAndModel").$D("规格型号"),
          fieldType: "TEXT",
          fieldCode: "specifications",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.unit").$D("单位"),
          fieldType: "TEXT",
          fieldCode: "uom",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.quantity").$D("数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.remainInvoiceNumber").$D("剩余可开票数量"),
          fieldCode: "remainInvoiceNumber",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceQuantity").$D("本次开票数量"),
          fieldCode: "currentInvoiceNumber",
          fieldType: "INPUT_NUMBER",
          editor: this.detailInfo.quantityUpdFlag,
          editLimit:this.detailInfo.quantityUpdFlag,
          precision: (val, record) => Number(record.uomPrecision)
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxRate").$D("税率"),
          fieldType: "LOV",
          lovCode: "SPRM.TAX",
          fieldCode: "taxRate",
          options:{
            displayField:"description",
            subDisplayField:"taxCode"
          },
          editor:this.detailInfo.taxUpdFlag
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxIncludedPrice").$D("含税单价"),
          fieldCode: "taxPrice",
          fieldType: "INPUT_NUMBER",
          editor: !(this.detailInfo.priceUpdFlag === 0 || this.priceRules === "NET_PRICE"),
          editLimit:!(this.detailInfo.priceUpdFlag === 0 || this.priceRules === "NET_PRICE"),
          precision: (val, record) =>
            // console.log(this.detailInfo.priceUpdFlag === 0 || this.priceRules === "NET_PRICE",333);
            Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "defaultPrecision"))
          ,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.netPrice").$D("不含税单价"),
          fieldCode: "freeTaxPrice",
          fieldType: "INPUT_NUMBER",
          editor: !(this.detailInfo.priceUpdFlag === 0 || this.priceRules === "TAX_INCLUDED_PRICE"),
          editLimit:!(this.detailInfo.priceUpdFlag === 0 || this.priceRules === "TAX_INCLUDED_PRICE"),
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "defaultPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.unitPriceBatch").$D("每"),
          fieldType: "TEXT",
          fieldCode: "unitPriceBatch",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.netAmount").$D("不含税金额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "freeTaxPriceAmountMeaning",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.rawNetPrice").$D("原不含税价"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "rawNetPrice",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxIncludedAmount").$D("含税金额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxPriceAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxAmount").$D("税额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.currencyCode").$D("币种"),
          fieldType: "TEXT",
          fieldCode: "currencyCode",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.trxType").$D("事务类型"),
          fieldType: "TEXT",
          fieldCode: "trxType",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.trxDate").$D("事务日期"),
          fieldType: "TEXT",
          fieldCode: "trxDate",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.parentNumber").$D("父事务编号丨行号"),
          fieldType: "TEXT",
          fieldCode: "parentNumber",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.asnNumAndAsnLineNum").$D("送货单号|行号"),
          fieldType: "TEXT",
          fieldCode: "asnNum",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.poNumAndLineNum").$D("订单号丨行号"),
          fieldType: "TEXT",
          fieldCode: "poNum",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.displayLineLocationNum").$D("发运号"),
          fieldType: "TEXT",
          fieldCode: "lineLocationNum",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.displayReleaseNum").$D("发放号"),
          fieldType: "TEXT",
          fieldCode: "releaseNum",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.billNumber").$D("开票申请单号丨行号"),
          fieldType: "TEXT",
          fieldCode: "billNumber",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.orderTypeName").$D("订单类型"),
          fieldType: "TEXT",
          fieldCode: "orderTypeName",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.companyName").$D("客户公司"),
          fieldType: "TEXT",
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.ouName").$D("业务实体"),
          fieldType: "TEXT",
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.purchaseOrgName").$D("采购组织"),
          fieldType: "TEXT",
          fieldCode: "purchaseOrganizationName",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.organizationName").$D("库存组织"),
          fieldType: "TEXT",
          fieldCode: "repertoryOrganizationName",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.purAgentName").$D("采购员"),
          fieldType: "TEXT",
          fieldCode: "agentName",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.supplierCode").$D("供应商编码"),
          fieldType: "TEXT",
          fieldCode: "supplierCode",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.supplierName").$D("供应商名称"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.supplierSiteName").$D("供应商地址"),
          fieldType: "TEXT",
          fieldCode: "supplierSiteName",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.drawerSupplierName").$D("出票方"),
          fieldType: "TEXT",
          fieldCode: "approvedBy",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.sourceCode").$D("数据来源代码"),
          fieldType: "TEXT",
          fieldCode: "sourceCode",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.externalSystemCode").$D("外部来源系统代码"),
          fieldType: "TEXT",
          fieldCode: "externalSystemCode",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceCreationDate").$D("开票单日期"),
          fieldType: "TEXT",
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.trxYear").$D("事务年度"),
          fieldType: "TEXT",
          fieldCode: "trxYear",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.needInvoiceFlag").$D("移除标识"),
          fieldType: "SWITCH",
          fieldCode: "needInvoiceFlag",
          disabled:true,
        },
      ];
      return columns;
    },
    // 按钮
    getBtnArr() {
      return [
        {
          title: this.$T("hipspfm.createInvoice.view.button.cretae").$D(
            "新建"
          ),
          // eslint-disable-next-line no-return-assign
          handler: this.createWork,
        },
      ];
    },
  },
  async mounted() {
    await this.getPriceRules();
    this.detailInfo = this.$route.query.data;
  },
  methods: {
    // 获取配置中心单价修改规则
    async getPriceRules() {
      const value = "010505";
      //扣款基准价 010531 NET_PRICE=未税单价 TAX_INCLUDED_PRICE=含税单价
      //对账及开票基准价 010505 NET_PRICE=未税单价 TAX_INCLUDED_PRICE=含税单价
      await getSettingsApi().then((res) => {
        this.priceRules = res[value] === "" ? "NET_PRICE" : res[value];
      });
    },
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    createWork() {
      this.$loading.show();
      let params = [];
      params.push(this.detailInfo);
      // eslint-disable-next-line consistent-this
      const _this = this;
      if (this.reClick) {
        this.reClick = false;
        getNeedApi(params).then((res) => {
          _this.$loading.hide();
          if (res.failed) {
            this.$hips.dialog.alert({
              title: this.$T("hipspfm.common.message.operationFailed").$D(
                "操作失败"
              ),
              content: res.message,
              okText: this.$T("hipspfm.common.view.button.gotIt").$D(
                "我知道了"
              ),
              onOk() {}
            });
          } else {
            _this.$router.replace({
              name: "CreateInvoiceDetail",
              query: { invoiceHeaderId: res[0].invoiceHeaderId }
            });
          }
          this.reClick = true;
        });
      }
    },
    // 查看行详情
    showLineDetail(item) {
      this.visible = !this.visible;
      this.currentLineInfo = item;
    },
    //获取订单行信息
    async getOrderLine() {
      this.$loading.show();
      await getOrderLineApi(this.invoiceHeaderId).then((res) => {
        this.$loading.hide();
        if (!res.empty) {
          this.lineInfo = res.content;
        }
        this.loading = true;
      });
    },
    //获取订单税务发票行信息
    async getOrderTax() {
      await getOrderTaxApi(this.invoiceHeaderId).then((res) => {
        this.$loading.hide();
        if (!res.empty) {
          this.taxInfo = res.content;
        }
      });
    },
    // 显示行信息详情
    showLineInfoDetail(data) {
      this.lineInfoDetail = data;
      setTimeout(() => {
        this.visible = true;
      }, 200);
    },
    async getOrderLedgerAccount() {
      const params = {
        "invoiceHeaderId":this.invoiceHeaderId,
        "organizationId":window.localStorage.getItem("tenantId"),
        page:0,
        size:1000
      };
      await getOrderLedgerAccountApi(params).then((res) => {
        this.$loading.hide();
        if (!res.empty) {
          this.ledgerAccount = res.content;
        }
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
>>> .customize-detail{
  padding: 0px 15px 10px 15px !important;
}
</style>
