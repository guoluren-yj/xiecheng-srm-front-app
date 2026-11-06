<template>
  <div style="height: 100vh; overflow: auto">
    <div class="main-info">
      <!-- 头信息 -->
      <srm-detail-head :data-source="headInfo" :columns="getDetailHeadColumns">
        <div class="button-right-margin">
          <srm-button size="small" icon="icon-paperclip">
            <srm-upload
              :is-tab="true"
              :show-icon="false"
              :show-count="false"
              color="blue"
              :file-arr="fileArr"
              :desc-title="
                $T('ssrc.inquiryHall.button.inquiryHall.file').$D('详情附件')
              "/>
          </srm-button>
          <srm-button
            size="small"
            type="warn"
            icon="icon-clock"
            @click="showOperationPop">
            <span>{{
              $T("hipspfm.common.message.title.operationRecord").$D("操作记录")
            }}</span>
          </srm-button>
        </div>
      </srm-detail-head>

      <!-- 内容区域 -->
      <srm-scroll-tab class="content" content-scroll>
        <srm-scroll-tab-item :label="getInvoiceHeaderTitle(headInfo)">
          <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
            <span>{{ $T("hipspfm.invoiceBill.view.message.NoNonConsignmentInvoiceHeader").$D("暂无非寄售发票头信息") }}</span>
          </div>
          <customize
            v-else
            :need-padding="true"
            code="SMBL.CHECK_PAYABLE_INVOICE.HEADER_INFO"
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
            code="SMBL.CHECK_PAYABLE_INVOICE.BASIC_INFO"
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
              code="SMBL.CHECK_PAYABLE_INVOICE.LINE_INFO"
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
              code="SMBL.CHECK_PAYABLE_INVOICE.TAX_LINE_INFO"
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
              code="SMBL.CHECK_PAYABLE_INVOICE.LEDGER_ACCOUNT_LINE_INFO"
              :data-source="item"
              :columns="getLedgerAccountInfoColumns"/>
          </div>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>

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
          code="SMBL.CHECK_PAYABLE_INVOICE.LINE_INFO_DETAIL"
          :data-source="lineInfoDetail"
          :columns="getOrderLineDetailInfoColumns"/>
      </div>
    </srm-popup>
    <!-- 操作记录弹窗 -->
    <operation-record
      v-model="operationPopup"
      :operation-arr="operationArr"
      :load-refresh="getOperationRecords"
      :loading="oploading"/>
    <!-- 审核意见 -->
    <hips-popup v-model="showAuditAppr" class="FullPop" style="width:100%" position="top">
      <div class="contentText">
        <hips-textarea
          v-model="auditOpinionAppr"
          :label="$T('sfin.invoiceBill.model.invoiceBill.approvedRemark').$D('审核意见')"
          :placeholder="'    '+$T('hipspfm.invoiceBill.message.validation.approvedRemark').$D('请输入审核意见')+'('+$T('hipspfm.invoiceBill.message.validation.notRequired').$D('非必填')+')'"
          label-position="top"
          auto-height
          :max-height="168"/>
      </div>
      <div class="handlerWrap">
        <span
          class="reset"
          @click="showAuditAppr = false">{{ $T("hipspfm.common.button.cancle").$D("取消") }}</span>
        <span class="submitWrap" @click="submit">{{ $T("hipspfm.common.message.pass").$D("通过") }}</span>
      </div>
    </hips-popup>
    <hips-popup v-model="showAuditRej" class="FullPop" style="width:100%" position="top">
      <div class="contentText">
        <hips-textarea
          v-model="auditOpinionRej"
          :label="$T('sfin.invoiceBill.model.invoiceBill.approvedRemark').$D('审核意见')"
          :placeholder="'    '+$T('hipspfm.invoiceBill.message.validation.approvedRemark').$D('请输入审核意见')+'('+$T('hipspfm.invoiceBill.message.validation.notRequired').$D('非必填')+')'"
          label-position="top"
          auto-height
          :max-height="168"/>
      </div>
      <div class="handlerWrap">
        <span
          class="reset"
          @click="showAuditRej = false">{{ $T("hipspfm.common.button.cancle").$D("取消") }}</span>
        <span
          class="cancleWrap"
          @click="cancle">{{ $T("sfin.invoiceBill.sfin.invoiceBill.model.invoiceBill.return").$D("退回") }}</span>
      </div>
    </hips-popup>
    <srm-bottom-handler
      :btn-arr="getBtnArr"/>
  </div>
</template>

<script>
import {
  getOrderHeaderApi,
  getOrderLineApi,
  getOrderTaxApi,
  getFileUUIDApi,
  getOpRecordApi,
  getApproveConfirmApi,
  getApproveRejectApi,
  getOrderLedgerAccountApi,
} from "../api/index";
import uuid from "uuid";
import { Popup, NavBar, Textarea } from "hips";
import { getSettingsApi } from "@/modules/CreateInvoice/api";
import OperationRecord from "@/components/OperationRecord";
export default {
  modules: [ "sodr.sendOrder", "hzero.common", "spuc.common", "sodr.confirmOrder", "hipspfm.common", "sodr.common", "hipspfm.orderConfirmation", "ssrc.inquiryHall", "hipspfm.invoiceBill", "sfin.invoiceBill", "sfin.common", "sfin.supplierChargeEntry" ],
  name: "CheckPayableInvoiceDetail",
  components: {
    OperationRecord,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Textarea.name]: Textarea
  },
  data() {
    return {
      headInfo: {}, // 头信息
      lineInfo: [], // 行信息
      taxInfo:[], // 税务发票行信息
      ledgerAccount:[], //
      operationPopup: false,
      lineInfoDetail: {},
      operationArr: [], //操作记录
      basePrice: "NET_PRICE",
      showAuditAppr: false, // 审批模态框
      showAuditRej: false,
      auditOpinionAppr: "", //审批意见
      auditOpinionRej: "", //审批意见
      oploading: false,
      attachmentUUID: "",
      visible:false
    };
  },
  computed: {
    showWarning() {
      const headInfo = this.headInfo;
      return (
        headInfo.taxIncludedAmountSystemMeaning ===
          headInfo.taxIncludedAmountMeaning &&
        headInfo.taxAmountMeaning === headInfo.taxAmountSystemMeaning
      );
    },
    getInvoiceHeaderTitle() {
      return (headInfo) => {
        if (headInfo.businessType === "CONSIGNMENT") {
          return this.$T("sfin.invoiceBill.view.consignmentInvoiceHeader").$D(
            "寄售发票头信息"
          );
        }
        return this.$T("sfin.invoiceBill.view.nonConsignmentInvoiceHeader").$D(
          "非寄售发票头信息"
        );
      };
    },
    fileArr() {
      if (!Object.keys(this.headInfo).length) {
        return [];
      }
      return [
        {
          title: this.$T(
            "sfin.invoiceBill.model.invoiceBill.supplierCompanyId"
          ).$D("供应商"),
          attachmentUuid: this.attachmentUUID || uuid(),
          readOnly: false,
        },
      ];
    },
    // 详情头
    getDetailHeadColumns() {
      const columns = [
        {
          fieldCode: "invoiceNum",
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.supplierCompanyId").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
      ];

      return columns;
    },
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
          fieldType: "EMPTY",
          fieldCode: "taxInvoiceNum",
          render: (val) =>
            <div>
              <span class={this.showWarning ? "" : "code-red"}>
                {this.$T(
                  "sfin.invoiceBill.model.invoiceBill.taxationInvoiceNum"
                ).$D("税务发票号码")}
                  ：
              </span>
              <span>{val}</span>
            </div>
          ,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxationInvoiceCode").$D("税务发票代码"),
          fieldType: "EMPTY",
          fieldCode: "taxInvoiceCode",
          render: (val) =>
            <div>
              <span class={this.showWarning ? "" : "code-red"}>
                {this.$T(
                  "sfin.invoiceBill.model.invoiceBill.taxationInvoiceCode"
                ).$D("税务发票代码")}
                  ：
              </span>
              <span>{val}</span>
            </div>
          ,
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
          precision: (val, record) => {
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
          fieldName: this.$T("sfin.invoiceBill.sfin.invoiceBill").$D("含税单价"),
          fieldCode: "taxIncludedPrice",
          fieldType: "INPUT_NUMBER",
          editor: false,
        },
        {
          fieldName: this.$T("sfin.invoiceBill.sfin.taxAmount").$D("税额"),
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
          formRow:0,
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
          fieldName: this.$T("sfin.common.model.common.debitCreditCodeMeaning").$D("借贷方"),
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
          fieldCode: "orignNetPrice",
          fieldType:"EMPTY",
          editor:false,
          render:(val, record) => {
            const length = this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision");
            return this.basePrice === "NET_PRICE" ?
              <div>
                <div style="color: #afafaf;font-size: 12px;margin-bottom:8px" class={record.netPrice === record.orignNetPrice ? "" : "code-red"}>{this.$T("sfin.invoiceBill.model.invoiceBill.rawNetPrice").$D("原不含税价") }：</div>
                <div>{ this.$options.filters.calcMultipleDelimiter(val, length)}</div>
              </div> : <div>
                <div style="color: #afafaf;font-size: 12px;margin-bottom:8px" class={record.taxIncludedPrice === record.orignTaxIncludedPrice ? "" : "code-red"}>{this.$T("sfin.invoiceBill.model.invoiceBill.rawTaxPrice").$D("原含税价") }：</div>
                <div>{this.$options.filters.calcMultipleDelimiter(record.orignTaxIncludedPrice, length) }</div>
              </div>;
          }
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.unit").$D("单位"),
          fieldCode: "uomName",
        },
        {
          fieldCode: "netPrice",
          fieldType: "EMPTY",
          editor:false,
          render:(val, record) => <div>
            <div style="color: #afafaf;font-size: 12px;margin-bottom:8px" class={record.netPrice === record.orignNetPrice ? "" : "code-red"}>
              {this.$T(
                "sfin.invoiceBill.model.invoiceBill.netPrice"
              ).$D("不含税单价")}
                  ：
            </div>
            <span>{this.$options.filters.calcMultipleDelimiter(val)}</span>
          </div>
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
          fieldCode: "taxIncludedPrice",
          fieldType: "EMPTY",
          editor:false,
          render:(val, record) => <div>
            <div style="color: #afafaf;font-size: 12px;margin-bottom:8px" class={record.taxIncludedPrice === record.orignTaxIncludedPrice ? "" : "code-red"}>
              {this.$T(
                "sfin.invoiceBill.model.invoiceBill.taxIncludedPrice"
              ).$D("含税单价")}
                  ：
            </div>
            <span>{this.$options.filters.calcMultipleDelimiter(val)}</span>
          </div>
        },
        {
          fieldName: this.$T("sfin.invoiceBill.model.invoiceBill.taxIncludedAmount").$D("含税金额"),
          fieldType: "INPUT_NUMBER",
          fieldCode: "taxIncludedAmount",
          editor: false,
          precision: (val, record) => Number(this.$options.filters.calcCurrencyPrecision(record.currencyCode, "financialPrecision")),
        },
        {
          fieldCode: "priceDifferenceMsgMeaning",
          fieldType:"EMPTY",
          editor: false,
          render:(val, record) => <div>
            <span class={record.priceDifferenceMsg === "normal" ? "" : "code-red"}>
              {this.$T(
                "sfin.invoiceBill.model.invoiceBill.priceDifferenceFlag"
              ).$D("比对结果")}
                  ：
            </span>
            <span>{val}</span>
          </div>
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
    // 按钮
    getBtnArr() {
      return [
        {
          type: "danger",
          title: this.$T("sfin.invoiceBill.sfin.invoiceBill.model.invoiceBill.return").$D(
            "退回"
          ),
          // eslint-disable-next-line no-return-assign
          handler: () => this.showAuditRej = true,
        },
        {
          title: this.$T("hipspfm.common.message.pass").$D(
            "通过"
          ),
          // eslint-disable-next-line no-return-assign
          handler: () => this.showAuditAppr = true,
        },
      ];
    },
  },
  async mounted() {
    this.invoiceHeaderId = this.$route.query.invoiceHeaderId;
    await this.getOrderHeader();
    await this.getOrderLedgerAccount();
    await this.getOrderTax();
    await this.getOrderLine();
    await this.getOperationRecords();
    this.getSettings();
  },
  methods: {
    // 获取配置中心单价修改规则
    getSettings() {
      const value = "010505";
      //扣款基准价 010531 NET_PRICE=未税单价 TAX_INCLUDED_PRICE=含税单价
      //对账及开票基准价 010505 NET_PRICE=未税单价 TAX_INCLUDED_PRICE=含税单价
      getSettingsApi().then((res) => {
        this.basePrice = res[value] === "" ? "NET_PRICE" : res[value];
      });
    },
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    // 查看行详情
    showLineDetail(item) {
      this.visible = !this.visible;
      this.currentLineInfo = item;
    },
    // 获取发票头信息
    async getOrderHeader() {
      try {
        this.headInfo = await getOrderHeaderApi(this.invoiceHeaderId);
        if (this.headInfo.attachmentUuid) {
          this.attachmentUUID = this.headInfo.attachmentUuid;
        } else {
          const { content } = await getFileUUIDApi();
          this.attachmentUUID = content;
        }
      } catch (err) {
        console.log(err);
      }
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
    // 获取操作记录
    async getOperationRecords() {
      this.oploading = true;
      await getOpRecordApi(this.invoiceHeaderId).then((res) => {
        this.oploading = false;
        this.operationArr = res.content;
      });
    },
    // 退回
    cancle() {
      this.$notification.open({
        message: this.$T("hipspfm.invoiceBill.view.message..submitting").$D(
          "提交中"
        ),
        description: "",
        key,
        class: "notification"
      });
      let params = {
        invoiceHeaderId: this.headInfo.invoiceHeaderId,
        approvedRemark: this.auditOpinionRej
      };
      let paramsArr = [];
      paramsArr.push(params);
      getApproveRejectApi(paramsArr).then((res) => {
        this.$loading.hide();
        if (res.failed) {
          this.$hips.toast({
            message: res.message,
            duration: 1500
          });
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D(
              "操作成功"
            ),
            description: "",
            key,
            class: "notification"
          });
          // eslint-disable-next-line consistent-this
          const _this = this;
          setTimeout(() => {
            _this.$router.replace({ name: "CheckPayableInvoiceList" });
          }, 1500);
        }
      });
    },
    // 通过
    submit() {
      this.$notification.open({
        message: this.$T("hipspfm.invoiceBill.view.message..submitting").$D(
          "提交中"
        ),
        description: "",
        key,
        class: "notification"
      });
      let params = {
        invoiceHeaderId: this.headInfo.invoiceHeaderId,
        approvedRemark: this.auditOpinionAppr
      };
      let paramsArr = [];
      paramsArr.push(params);
      getApproveConfirmApi(paramsArr).then((res) => {
        this.$loading.hide();
        if (res.failed) {
          this.$hips.toast({
            message: res.message,
            duration: 1500
          });
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D(
              "操作成功"
            ),
            description: "",
            key,
            class: "notification"
          });
          // eslint-disable-next-line consistent-this
          const _this = this;
          setTimeout(() => {
            _this.$router.replace({ name: "CheckPayableInvoiceList" });
          }, 1500);
        }
      });
    }
  },
};
</script>

<style lang="stylus" scoped>
.main-info {
  height: 100%;
  overflow-y: auto;
  background: #f6f6f6;
  padding-bottom: 75px;
  padding-bottom: calc(75px + constant(safe-area-inset-bottom));
  padding-bottom: calc(75px + env(safe-area-inset-bottom));
}
.code-red {
  color: #ff0000 !important;
}

.status {
  text-align: right;
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
.contentText {
  >>> .hips-textarea {
    padding: 10px 20px;
  }

  >>> .hips-textarea__label-value {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color:var(--color-font-default,#1b1e2b);
    line-height: 26px;
    font-weight: bold;
  }

  >>> .hips-textarea__body {
    height: 174px;
  }

  >>> .hips-textarea__input-value textarea {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color:var(--color-font-default,#1b1e2b);
    letter-spacing: 0.7px;
    line-height: 28px;
  }

  >>> .hips-textarea__input-value textarea::-webkit-input-placeholder {
    bg_url(icon_editor)
    background-repeat: no-repeat;
    background-size: 20px 20px;
    color: var(--color-font-default-e);
    background-position-y: 3px;
  }

  >>> .hips-textarea__input-value textarea:-moz-placeholder {
    bg_url(icon_editor)
    background-repeat: no-repeat;
    color: var(--color-font-default-e);
    background-size: 20px 20px;
    background-position-y: 3px;
  }

  >>> .hips-textarea__input-value textarea::-moz-placeholder {
    bg_url(icon_editor)
    background-repeat: no-repeat;
    color: var(--color-font-default-e);
    background-size: 20px 20px;
    background-position-y: 3px;
  }

  >>> .hips-textarea__input-value textarea:-ms-input-placeholder {
    bg_url(icon_editor)
    background-repeat: no-repeat !important;
    color: var(--color-font-default-e);
    background-size: 20px 20px !important;
    background-position-y: 3px !important;
  }

  >>> .hips-textarea__input-value textarea::-ms-input-placeholder {
    bg_url(icon_editor)
    background-repeat: no-repeat;
    color: var(--color-font-default-e);
    background-size: 20px 20px;
    background-position-y: 3px;
  }

  >>> .hips-textarea__input-value textarea::placeholder {
    bg_url(icon_editor)
    background-repeat: no-repeat;
    color: var(--color-font-default-e);
    background-size: 20px 20px;
    background-position-y: 3px;
  }
}
.handlerWrap {
  display: flex;

  span {
    flex: 1;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color:var(--color-font-default-b);
    line-height: 56px;
    text-align: center;
  }

  .submitWrap {
    color:var(--color-font-default-d);
    background: var(--color-other-default-b);
  }

  .cancleWrap {
    color:var(--color-font-default-d);
    background: var(--color-other-default) !important;
  }
}
</style>
