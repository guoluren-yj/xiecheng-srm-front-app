<template>
  <div>
    <!-- 内容区 -->
    <srm-scroll-tab class="content">
      <srm-scroll-tab-item :label="$T('sfin.invoiceBill.view.nonConsignmentInvoiceHeader').$D(
        '非寄售发票头信息'
      )">
        <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
          <span>{{ $T("hipspfm.invoiceBill.view.message.NoNonConsignmentInvoiceHeader").$D("暂无非寄售发票头信息") }}</span>
        </div>
        <customize
          v-else
          :need-padding="true"
          code="SMBL.WORKFLOW.CHECK_PAYABLE_INVOICE_APPROVAL.HEADER_INFO"
          :data-source="headInfo"
          :columns="getOrderHeadInfoColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="
          $T('hipspfm.invoiceBill.view.title.validation.basicInformation').$D(
            '基本信息'
          )
        ">
        <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
          <span>{{ $T("hipspfm.invoiceBill.view.message.validation.NoBasicInformation").$D("暂无基本信息") }}</span>
        </div>
        <customize
          v-else
          :need-padding="true"
          code="SMBL.WORKFLOW.CHECK_PAYABLE_INVOICE_APPROVAL.BASIC_INFO"
          :data-source="headInfo"
          :columns="getOrderBasicInfoColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="
          $T('sfin.invoiceBill.model.invoiceBill.invoiceLineNum').$D('发票行')
        ">
        <div v-if="JSON.stringify(lineInfo) == '[]'" class="noContent">
          <span>{{ $T("hipspfm.invoiceBill.view.message.validation.NoInvoiceLineNum").$D("暂无发票行信息") }}</span>
        </div>
        <div
          v-for="(item, index) in lineInfo"
          v-else
          :key="index"
          @click="showLineInfoDetail(item)">
          <customize
            :need-padding="true"
            code="SMBL.WORKFLOW.CHECK_PAYABLE_INVOICE_APPROVAL.LINE_INFO"
            :data-source="item"
            :columns="getOrderLineInfoColumns"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="
          $T('sfin.invoiceBill.view.taxInvoiceRow').$D('税务发票行')
        ">
        <div v-if="taxInfo.length === 0" class="noContent">
          <span>{{ $T("hipspfm.invoiceBill.view.message.validation.NoTaxInvoiceRow").$D("暂无税务发票行信息") }}</span>
        </div>
        <div
          v-for="(item, index) in taxInfo"
          v-else
          :key="index">
          <customize
            :need-padding="true"
            code="SMBL.WORKFLOW.CHECK_PAYABLE_INVOICE_APPROVAL.TAX_LINE_INFO"
            :data-source="item"
            :columns="getTaxInvoiceRowInfoColumns"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="
          $T('sfin.invoiceBill.view.inf').$D('总账科目')
        ">
        <div v-if="JSON.stringify(ledgerAccount) == '[]'" class="noContent">
          <span>{{ $T("hipspfm.invoiceBill.view.message.validation.NoInf").$D("暂无总账科目信息") }}</span>
        </div>
        <div
          v-for="(item, index) in ledgerAccount"
          v-else
          :key="index">
          <customize
            :need-padding="true"
            code="SMBL.WORKFLOW.CHECK_PAYABLE_INVOICE_APPROVAL._ACCOUNT_LINE_INFO"
            :data-source="item"
            :columns="getLedgerAccountInfoColumns"/>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <!-- 行信息弹窗 -->
    <srm-popup
      :visible.sync="visible"
      height="100%"
      position="right"
      :title="
        $T('hipspfm.invoiceBill.view.message.invoiceInformation').$D(
          '发票信息'
        )
      ">
      <div style="height: 100%; overflow: auto">
        <srm-detail-head :data-source="lineInfoDetail" :columns="getInvoiceDetailHeadColumns"/>
        <customize-detail
          :need-padding="true"
          code="SMBL.WORKFLOW.CHECK_PAYABLE_INVOICE.APPROVAL.LINE_INFO_DETAIL"
          :data-source="lineInfoDetail"
          :columns="getOrderLineDetailInfoColumns"/>
      </div>
    </srm-popup>
  </div>
</template>

<script>
import {
  getInvoiceHeaderApi,
  getInvoiceLineApi,
  getInvoiceTaxApi,
  getSupplierDeductionApi,
} from "./api";
export default {
  modules: [ "ssrc.common", "sodr.common", "hwfp.commom", "sslm.sampleHead", "hwfm.commom", "sprm.common", "sslm.supplierInfoChange", "spcm.common", "scux.commercialTermsPre", "scux.upgradeOrderCreate", "smpc.product", "scux.soSend", "ssrc.projectSetup", "sinv.common", "sqam.common", "scux.watsons", "scux.listOfReviewItems", "smbl.common", "mallf.common", "hipspfm.workFlow", "sslm.commonApplication", "hipspfm.common", "scux.bidEvaluationReport", "sslm.supplyAbility", "hipspfm.supplierLifeCycle", "ssrc.supplyInfoChange", "sslm.supplierDetail", "sslm.common", "sslm.supplierReview", "sslm.sample", "sslm.siteEvalHeader", "sslm.siteInvestigateReport", "spcm.purchaseContractView", "spcm.contractTemplate", "sslm.investigationCorrelation", "spcm.purchaseContractType", "sfin.invoiceBill", "hipspfm.invoiceBill", "entity.supplier", "entity.company", "entity.organization", "entity.item", "sfin.common", "sfin.supplierChargeEntry", "hipspfm.checkPay" ],
  name: "CheckPayInvApproval",
  components: {
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: "",
    },
  },
  data() {
    return {
      headInfo: {},
      visible:false,
      lineInfoDetail:{},
      taxInfo:{},
      lineInfo:[],
      ledgerAccount:[]
    };
  },
  computed: {
    //发票详情头
    getInvoiceDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "poNumAndLineNum",
          fieldType: "EMPTY",
          render: (val, record) =>
            <SrmListHeader>
              <span style="color:#fff">{val}</span>
              <div slot="right">
                <span
                  style="color: #fff">{this.$T("sfin.invoiceBill.model.invoiceBill.invoiceLineNum").$D("发票行") }: { record.invoiceLineNum}</span>
              </div>
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
    // 发票头信息
    getOrderHeadInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxIncludedAmountSystem").$D("含税总额(系统)"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxIncludedAmountSystemMeaning",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxAmountSystem").$D("税额（系统）"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxAmountSystemMeaning",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxationInvoiceNum").$D("税务发票号码"),
          fieldCode: "taxInvoiceNum",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxationInvoiceCode").$D("税务发票代码"),
          fieldCode: "taxInvoiceCode",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceAmount").$D("发票总额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxIncludedAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceTaxAmount").$D("发票税额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxInvoiceDateIssued").$D("开票日期"),
          fieldType: "TEXT",
          fieldCode: "taxInvoiceDateIssued",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.payableInvoice.totalNonTax").$D("未税总额(系统)"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxWithoutAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.deductedTaxIncludedAmount").$D("扣款金额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "deductedTaxIncludedAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.deductionTaxAmount").$D("扣款税额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "deductedTaxAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.drawerSupplierName").$D("出票方"),
          fieldType: "TEXT",
          fieldCode: "paymentAmounted",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceRemark").$D("发票备注"),
          fieldType: "TEXT",
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.supplierSiteName").$D("供应商地址"),
          fieldType: "TEXT",
          fieldCode: "supplierSiteName",
        },
      ];
      return columns;
    },
    //发票基本信息
    getOrderBasicInfoColumns() {
      const columns = [
        {
          fieldCode: "companyName",
          fieldType: "EMPTY",
          formRow:0,
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              <span>{val}</span>
              <div slot="right">
                <span class="status2">{record.invoiceStatusMeaning}</span>
              </div>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.ouName").$D("业务实体"),
          fieldType: "TEXT",
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.purchaseOrgName").$D("采购组织"),
          fieldType: "TEXT",
          fieldCode: "purOrganizationName",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.purAgentNamee").$D("采购员"),
          fieldType: "TEXT",
          fieldCode: "purchaseAgentName",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.currencyCode").$D("币种"),
          fieldType: "TEXT",
          fieldCode: "currencyCode",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.creationDate").$D("创建日期"),
          fieldType: "TEXT",
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.createName").$D("创建人"),
          fieldType: "TEXT",
          fieldCode: "createName",
        },
      ];
      return columns;
    },
    // 发票行信息
    getOrderLineInfoColumns() {
      const columns = [
        {
          fieldCode: "poNumAndLineNum",
          fieldType: "EMPTY",
          formRow:0,
          render: (val, record) =>
            <SrmListHeader>
              <span>{val}</span>
              <div slot="right">
                <span
                  style="color: var(--color-font-default-e)">{ this.$T("sfin.invoiceBill.model.invoiceBill.invoiceLineNum").$D("发票行") }: { record.invoiceLineNum }</span>
              </div>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.itemName").$D("物料名称"),
          fieldType: "TEXT",
          fieldCode: "itemName",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.itemCode").$D("物料编码"),
          fieldType: "TEXT",
          fieldCode: "itemCode",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceQuantity").$D("本次开票数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxIncludedPrice").$D("含税单价"),
          fieldCode: "taxIncludedPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.tax").$D("税额"),
          fieldCode: "taxAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.all.taxIncludedPrice").$D("含税总金额"),
          fieldCode: "taxIncludedAmount",
          fieldType: "INPUT_NUMBER",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
      ];
      return columns;
    },
    // 税务发票行信息
    getTaxInvoiceRowInfoColumns() {
      const columns = [
        {
          fieldCode: "invoiceCode",
          fieldType: "EMPTY",
          formRow:0,
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              {this.$T("sfin.invoiceBill.model.invoiceBill.taxInvoiceCode").$D("发票代码")}:<span>{val}</span>
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
          ,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceNumber").$D("发票号"),
          fieldType: "TEXT",
          fieldCode: "invoiceNumber",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.checkStateExplain").$D("查验状态说明"),
          fieldType: "TEXT",
          fieldCode: "validateMessage",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxInvoiceDateIssued").$D("开票日期"),
          fieldCode: "billingDate",
          render: (val) =>
            // eslint-disable-next-line new-cap
            this.$options.filters.CalcDate(val)
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.checkCodeMeaning").$D("校验码"),
          fieldType: "TEXT",
          fieldCode: "checkCode",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceStatus").$D("发票状态"),
          fieldType: "TEXT",
          fieldCode: "taxInvoiceStatusCodeMeaning",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxAmount").$D("税额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxIncludedAmount").$D("含税金额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxIncludedAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.noDepositInvoiceType").$D("发票种类"),
          fieldType: "TEXT",
          fieldCode: "noDepositInvoiceTypeMeaning",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceDirection").$D("发票方向"),
          fieldType: "TEXT",
          fieldCode: "invoiceDirectionMeaning",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.netAmount").$D("不含税金额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "totalAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
      ];
      return columns;
    },
    // 总账科目行信息
    getLedgerAccountInfoColumns() {
      const columns = [
        {
          fieldCode: "deductionsNum",
          fieldType: "EMPTY",
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              <span>{val}</span>
              <span slot="right">
                <span
                  style="color: var(--color-font-default-e)">{this.$T("sfin.invoiceBill.model.invoiceBill.lineNo").$D("行号") }: { record.relationLineNum }</span>
              </span>
            </SrmListHeader>
          ,
        },
        {
          fieldName: this.$T("sfin.common.model.common.accountSubjectName").$D("总账科目名称"),
          fieldType: "TEXT",
          fieldCode: "accountSubjectName",
        },
        {
          fieldName: this.$T("sfin.common.	model.common.debitCreditCodeMeaning").$D("借贷方"),
          fieldType: "TEXT",
          fieldCode: "debitCreditCodeMeaning",
        },
        {
          fieldName: this.$T("sfin.common.model.common.taxRate").$D("税率(%)"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("sfin.common.model.common.taxIncludedAmountx").$D("含税扣款额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxIncludedAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.supplierChargeEntry.model.relationAmount").$D("已扣款额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "relationAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.supplierChargeEntry.model.remainingDeductionAmount").$D("剩余可扣款额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "remainingDeductionAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.supplierChargeEntry.model.deductionRemark").$D("扣款说明"),
          fieldType: "TEXT",
          fieldCode: "remark",
        },
        {
          fieldName: this.$T("sfin.supplierChargeEntry.model.deductionAmount").$D("本次扣款额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "deductionAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
      ];
      return columns;
    },
    //发票行详细信息
    getOrderLineDetailInfoColumns() {
      const columns = [
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.invoiceQuantity").$D("本次开票数量"),
          fieldCode: "quantity",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.unitPriceBatch").$D("每"),
          fieldCode: "unitPriceBatch",
        },
        {
          fieldName:this.$T("sfin.invoiceBill.model.invoiceBill.rawNetPrice").$D("原不含税价"),
          fieldCode: "orignNetPrice",
          fieldType:"INPUT_NUMBER",
          editor:false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.unit").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldName:this.$T("sfin.invoiceBill.model.invoiceBill.netPrice").$D("不含税单价"),
          fieldCode: "netPrice",
          fieldType: "INPUT_NUMBER",
          editor:false,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.netAmount").$D("不含税金额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "netAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxRate").$D("税率"),
          fieldCode: "taxRate",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxAmount").$D("税额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName:this.$T("sfin.invoiceBill.model.invoiceBill.taxIncludedPrice").$D("含税单价"),
          fieldCode: "taxIncludedPrice",
          fieldType: "INPUT_NUMBER",
          editor:false,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxIncludedAmount").$D("含税金额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxIncludedAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldName:this.$T("sfin.invoiceBill.model.invoiceBill.priceDifferenceFlag").$D("比对结果"),
          fieldCode: "priceDifferenceMsgMeaning",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.specificationsAndModel").$D("规格型号"),
          fieldCode: "specificationsAndModel",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.displayReleaseNum").$D("发放号"),
          fieldCode: "displayReleaseNum",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.displayLineLocationNum").$D("发运号"),
          fieldCode: "displayLineLocationNum",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.asnNum").$D("送货单号|行号"),
          fieldCode: "asnNumAndAsnLineNum",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.thingNumberAndLineNum").$D("事物编号|行号"),
          fieldCode: "trxAndLineNum",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.billNumAndBillLineNum").$D("对账单号|行号"),
          fieldCode: "billNumAndBillLineNum",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.trxDate").$D("事务日期"),
          fieldCode: "trxDate",
        },
      ];

      return columns;
    },
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        // console.log("工作流editFlag值为=》" + this.editFlag);
        this.$loading.show();
        await this.getInvoiceHeader();
        await this.getInvoiceLine();
        await this.getInvoiceTax();
        await this.getSupplierDeduction();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit("GetApprovalTitle", this.$T("hipspfm.checkPay.view.message.InvoiceReviewWorkflow").$D("发票审核工作流"));
  },
  methods: {
    //非寄售发票头信息
    async getInvoiceHeader() {
      const headInfo = await getInvoiceHeaderApi(this.changeReqId);
      this.headInfo = headInfo;
    },
    //发票行
    async getInvoiceLine() {
      this.$loading.show();
      await getInvoiceLineApi(this.changeReqId).then((res) => {
        this.$loading.hide();
        if (!res.empty) {
          this.lineInfo = res.content;
        }
      });
    },
    //税务发票行
    async getInvoiceTax() {
      this.$loading.show();
      await getInvoiceTaxApi(this.changeReqId).then((res) => {
        this.$loading.hide();
        if (!res.impty) {
          this.taxInfo = res.content;
        }
      });
    },
    async getSupplierDeduction() {
      this.$loading.show();
      await getSupplierDeductionApi(this.changeReqId).then((res) => {
        this.$loading.hide();
        if (!res.impty) {
          this.ledgerAccount = res.content;
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
  },
};
</script>

<style lang="stylus" scoped>
  .noContent {
    height: 78px;
    padding-left: 20px;

    span {
      position: relative;
      top: 16px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: var(--color-font-default-b);
      letter-spacing: 0;
      line-height: 22px;
    }
  }
</style>
