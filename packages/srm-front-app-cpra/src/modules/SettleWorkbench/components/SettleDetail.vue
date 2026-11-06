<template>
  <div>
    <srm-scroll-tab>
      <ai-tip-section
        v-if="role === 'purchaser' && aiApproveStatus"
        :ai-approve-status="aiApproveStatus"
        :ai-review-params="aiReviewParams" />
      <srm-scroll-tab-item
        :label="getRoleLanguage.amountCardTitle">
        <srm-form show-default-detail :data-set="settleHeaderDs" :columns="getAmountSumColumns" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="getRoleLanguage.basicTitle">
        <div @click="onClickItem('basic')">
          <srm-form :data-set="settleHeaderDs" :columns="getBasicColumns()" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="getRoleLanguage.lineTitle">
        <srm-list
          :scrollable="false"
          :data-set="settleLineDs"
          :columns="getLineColumns()"
          class="ssta-settle-detail-line-wrapper"
          @itemClick="() => onClickItem('line')"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="settleType !== 'PAYMENT'"
        :label="getRoleLanguage.taxTitle">
        <dynamic-alert
          type="danger"
          :request-url="`/ssta/v1/${tenantId}/settle-headers/invoice-check-announcement`" />
        <srm-list
          :scrollable="false"
          :data-set="taxInvoiceDs"
          :columns="getTaxColumns()"
          @itemClick="() => onClickItem('tax')"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="payAreaShow"
        :show-title="false"
        :label="getRoleLanguage.payTitle">
        <srm-flex class="srm-scroll-tab-item-title" justify="between">
          {{ getRoleLanguage.payTitle }}
          <span
            class="srm-icon icon-dots"
            @click="showPayActions"/>
        </srm-flex>
        <dynamic-alert
          type="primary"
          :request-url="`/ssta/v1/${tenantId}/settle-headers/bank-prompt-default`" />
        <div @click="onClickItem('pay')">
          <srm-form :data-set="settleHeaderDs" :columns="getPaymentColumns()"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="headerInfo.invoiceMatchRuleCode === 'DIRECT_INVOICING'"
        :label="getRoleLanguage.directInvTitle">
        <div @click="onClickItem('directInv')">
          <srm-form :data-set="settleHeaderDs" :columns="getDirectInvColumns()"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="getRoleLanguage.otherTitle">
        <div @click="onClickItem('other')">
          <srm-form :data-set="settleHeaderDs" :columns="getOtherColumns()"/>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('hzero.common.view.title.attachment').$D('附件')">
        <attachment-info :data-set="settleHeaderDs" directory="ssta-settle-header" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('hzero.common.view.button.operationRecord').$D('操作记录')">
        <history-record-tiled
          :action-data="historyData"
          operation-meaning-field-name="processStatusMeaning"
          process-remark-field-name="processRemark"
          operator-field-name="processUser"
          process-date-field-name="processDate"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="approveData.length > 0"
        :label="$T('smbl.common.button.taskDetail.record').$D('审批记录')">
        <history-record-tiled
          :action-data="approveData"
          operator-field-name="assigneeName"
          operation-meaning-field-name="action"
          process-date-field-name="startTime"
          process-remark-field-name="comment" />
      </srm-scroll-tab-item>
      <div class="bottom-button-space" />
    </srm-scroll-tab>
    <srm-bottom-handler class="bottom-button-wrapper" :btn-arr="getBottomButtons" type="action-sheet">
      <em
        v-if="approveFlag"
        slot="left"
        class="srm-icon icon-license" style="font-size:24px;margin-right:12px"
        @click="viewStrategy"/>
    </srm-bottom-handler>
  </div>
</template>

<script>
import { DataSet, SrmButton, SrmUtil } from "srm-mobile-ui";
import { isObject, isArray, isString, isEmpty, take, fromPairs } from "lodash";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import StatusTag from "@/components/StatusTag";
import DynamicAlert from "./DynamicAlert";
import PrePayWriteOff from "./PrePayWriteOff";
import MultiDimenAssign from "./MultiDimenAssign";
import SettleLineDetail from "./SettleLineDetail";
import AttachmentInfo from "./AttachmentInfo";
import AiTipSection from "@/components/AiTipSection/AiTipSection";
import { invoiceCheck, queryHistoryRecords, queryApproveRecords, queryMapIdpValue, batchReturnSettle, confirmValidate, batchConfirmSettle } from "../api";
import { getTaxInvoiceOperationRecord } from "../../../components/Workflow/SettleApproval/api";
import { previewPdf } from "../../../utils";

const tenantId = SrmUtil.getTenantId();
const actionColorMap = {
  Approved: "success",
  Rejected: "danger",
  Delegate: "info",
  AddSign: "info",
  ApproveAndAddSign: "info",
};
export default {
  modules: [ "hzero.common", "ssta.common", "ssta.purchaseSettle", "ssta.supplySettle", "smbl.common", "hwfp.common", "ssta.purchaseSettlePool", "ssta.purchaseInvoicePool", "ssta.directPoolSupply", "ssta.costSheet", "ssta.supplySettlePool", "ssta.supplyInvoicePool", "sodr.common", "sprm.common", "sinv.receiptWorkbench", "sinv.receiptExecution", "sinv.receipWorkbench", "slod.deliveryWorkbench", "slod.common" ],
  components: { HistoryRecordTiled, DynamicAlert, AttachmentInfo, AiTipSection },
  props: {
    role: {
      type: String,
      default: "purchaser",
    },
    dsFuncsMap: {
      type: Object,
      default: () => ({
        settleHeaderDS: {},
        settleLineDS: {},
        taxInvoiceDS: {}
      }),
    },
  },
  data() {
    const { type, settleType, settleHeaderId } = this.$route.query;
    return {
      type,
      tenantId,
      settleType,
      settleHeaderId,
      headerInfo: {},
      historyData: [],
      approveData: [],
      payAreaShow: false,
      checkLevelMap: {},
      checkPointMap: {},
      actionMeaningMap: {},
      settleStatusTypeMap: {},
      showLineFilter: false,
      readOnlyFlag: type === "ALL",
      approveFlag: type === "APPROVE",
      supplierFlag: this.role === "supplier",
      documentType: settleType === "INVOICE_PAYMENT" ? "INVOICE" : settleType,
      settleHeaderDs: {},
      settleLineDs: {},
      taxInvoiceDs: {},
      aiApproveStatus: "",
      aiReviewParams: null,
    };
  },
  computed: {
    getAmountSumColumns() {
      const { settleType } = this;
      const fieldsList = settleType === "PAYMENT" ? [
        {
          fieldCode: "amountToBePaid",
          fieldType: "EMPTY",
          fieldName: this.$T("ssta.common.view.title.amountToBePaid").$D("待付款金额"),
          render: (_, record) =>
            <SrmListHeader>
              {`${this.$T("ssta.common.view.title.amountToBePaid").$D("待付款金额")}:  ${record.remainingPaymentAmount || ""}`}
            </SrmListHeader>
        },
        "paymentAmount",
        "applyAmount",
      ] : [
        "taxIncludedAmount",
        "netAmount",
        "taxAmount",
        "invoiceTaxIncludedAmount",
        "invoiceNetAmount",
        "invoiceTaxAmount",
      ];
      return this.formatListColumns(fieldsList);
    },
    getBasicColumns() {
      const { readOnlyFlag, headerInfo } = this;
      const { settleStatus } = headerInfo;
      const fieldsList = [
        {
          fieldCode: "settleNum",
          fieldType: "EMPTY",
          render: (value, record) => {
            const { settleStatusMeaning } = record;
            return (
              <SrmListHeader>
                <span>{value}</span>
                <StatusTag
                  slot="right"
                  text={settleStatusMeaning}
                  color={this.settleStatusTypeMap[record.settleStatus]}
                />
              </SrmListHeader>
            );
          },
        },
        [ "settleTypeMeaning", "currencyCode" ],
        "companyNum",
        "companyName",
        "supplierCompanyNum",
        "supplierCompanyName",
        [ "campMeaning", "createdUserName" ],
        "creationDate",
        "sourceSupplierCompanyNum",
        "sourceSupplierCompanyName",
        "ouName",
        "supplierSiteCode",
        "unitName",
        "remark",
        ![ "NEW", "SUBMITED" ].includes(settleStatus) && "canceledReason",
        settleStatus !== "NEW" &&
        (![ "SUBMITED", "SUBMITED_APPROVING" ].includes(settleStatus) || readOnlyFlag) && "approvedRemark",
        ![ "NEW", "SUBMITED", "SUBMITED_APPROVING" ].includes(settleStatus) &&
        (![ "CANCELING", "CANCEL_APPROVING", "INVOICE_EXCEPTION", "INVOICE_FAILED" ].includes(settleStatus) ||
        readOnlyFlag) && "canceledRemark",
      ];
      return (detailFlag) => {
        if (detailFlag) {
          delete fieldsList[0];
          fieldsList.unshift("settleNum", "settleStatusMeaning");
          return this.formatDetailColumns(fieldsList);
        }
        return this.formatListColumns(fieldsList);
      };
    },
    getLineColumns() {
      const { linePayment, linePrePaymentVer, settleType, supplierFlag } = this;
      const fieldsList = [
        "lineNum",
        "settleNum",
        "sourceSettleNumAndLineNum",
        "itemCode",
        "itemName",
        settleType === "PAYMENT" && "sourceSettleHeaderNum",
        settleType !== "PAYMENT" && "quantity",
        settleType !== "PAYMENT" && "netPrice",
        settleType !== "PAYMENT" && "unitPriceBatch",
        settleType !== "PAYMENT" && "netAmount",
        settleType !== "PAYMENT" && "taxCode",
        settleType !== "PAYMENT" && "taxRate",
        settleType !== "PAYMENT" && "taxAmount",
        settleType !== "PAYMENT" && "taxIncludedPrice",
        settleType !== "PAYMENT" && "taxIncludedAmount",
        settleType !== "PAYMENT" && "settleMatchDimensionMeaning",
        settleType !== "PAYMENT" && "settleBasePriceMeaning",
        settleType !== "PAYMENT" && "enableQuantity",
        settleType !== "PAYMENT" && "orignPrice",
        settleType !== "PAYMENT" && "enableAmount",
        "invOrganizationName",
        settleType !== "INVOICE" && linePayment !== "HIDE" && "paymentAmount",
        settleType !== "INVOICE" &&
          linePrePaymentVer !== "HIDE" &&
          "applyAmount",
        settleType !== "INVOICE" &&
          (linePayment !== "HIDE" || linePrePaymentVer !== "HIDE") &&
          "invoicedAmount",
        settleType !== "INVOICE" &&
          (linePayment !== "HIDE" || linePrePaymentVer !== "HIDE") &&
          "paidAmount",
        settleType !== "INVOICE" &&
          (linePayment !== "HIDE" || linePrePaymentVer !== "HIDE") &&
          "remainingPaymentAmount",
        settleType !== "PAYMENT" && "adjustNetAmount",
        settleType !== "PAYMENT" && "adjustTaxAmount",
        settleType === "INVOICE" && "thirdSkuCode",
        settleType === "INVOICE" && "thirdSkuName",
        settleType === "INVOICE" && "orderTypeName",
        settleType === "INVOICE" && "poCreateName",
        settleType === "INVOICE" && "unitName",
        settleType !== "INVOICE" && {
          fieldCode: "prePaymentWriteOff",
          render: (_, record) =>
            <SrmButton plain onClick={() => this.showPrePayWriteOffRecord(record)}>
              {supplierFlag ?
                this.$T("ssta.supplySettle.button.preColWriteOffRecord").$D("预收款核销记录") :
                this.$T("ssta.purchaseSettle.button.prePayWriteOffRecord").$D("预付款核销记录")}
            </SrmButton>
        },
        {
          fieldCode: "operation",
          render: (_, record) =>
            <SrmButton plain onClick={() => this.showSettleLineDetail(record)}>
              {this.$T("hzero.common.button.viewDetail").$D("查看详情")}
            </SrmButton> }
      ];
      return (detailFlag) => detailFlag ?
        this.formatDetailColumns(fieldsList) :
        this.formatListColumns(fieldsList);
    },
    getTaxColumns() {
      const fieldsList = [
        "lineNum",
        "invoiceCode",
        "invoiceNumber",
        "invoicingDate",
        "netAmount",
        "taxAmount",
        "taxIncludedAmount",
        "invoiceSpeciesMeaning",
        "deductFlag",
        "checkCode",
        "supplierCompanyName",
        "companyName",
        "supUnifiedSocialCode",
        "validateStatusMeaning",
        "validateMessage",
        "taxInvoiceStatusMeaning",
        "purUnifiedSocialCode",
        "invoiceUrl",
        {
          fieldCode: "operation",
          render: (_, record) => <SrmButton plain onClick={() => this.showTaxInvoiceOperationRecord(record)}>
            {this.$T("ssta.purchaseSettle.view.title.seeOperationHistory").$D("查看记录")}
          </SrmButton>
        },
        {
          fieldCode: "ocrFileUrl",
          render: (val) => val &&
            <SrmButton plain onClick={() => this.previewFile(val)}>
              {this.$T("ssta.purchaseSettle.view.title.seeOcrFile").$D("查看文件")}
            </SrmButton>
        },
      ];
      return (detailFlag) => detailFlag ?
        this.formatDetailColumns(fieldsList) :
        this.formatListColumns(fieldsList);
    },
    getPaymentColumns() {
      const { settleType } = this;
      const { headPayment } = this.headerInfo;
      const fieldsList = [
        settleType !== "INVOICE" && "paymentAmount",
        settleType !== "INVOICE" && "applyAmount",
        settleType !== "INVOICE" & headPayment !== "HIDE" && "paymentSpliteRuleMeaning",
        "bankName",
        "bankBranchName",
        "bankAccountNum",
        "bankAccountName",
        "paymentTypeName",
        "paymentTermName",
        "paymentDiscountAmount",
        "expectPaymentDate",
      ];
      return (detailFlag) => detailFlag ?
        this.formatDetailColumns(fieldsList) :
        this.formatListColumns(fieldsList);
    },
    getDirectInvColumns() {
      const fieldsList = [
        "invoiceTypeMeaning",
        "invoiceMethodMeaning",
        "contactName",
        "taxRegistrationNumber",
        "supplierTaxRegistrationNumber",
        "mobile",
        "regionName",
        "regionLov",
        "address",
        "invoiceContentDetail",
        "invoiceFailMsg",
      ];
      return (detailFlag) => detailFlag ?
        this.formatDetailColumns(fieldsList) :
        this.formatListColumns(fieldsList);
    },
    getOtherColumns() {
      const { readOnlyFlag, documentType } = this;
      const fieldsList = [
        readOnlyFlag && documentType === "INVOICE" && "accountingDate",
        "termCode",
        "invOrganizationName",
        "sourceSettleNum",
        "purOrganizationName",
      ];
      return (detailFlag) => detailFlag ?
        this.formatDetailColumns(fieldsList) :
        this.formatListColumns(fieldsList);
    },
    getStrategyColumns() {
      const { settleType, payAreaShow } = this;
      const fieldsList = [
        "settleConfigNum",
        "settleConfigName",
        "configVersionNumber",
        "confirmCollaborativeModeMeaning",
        "confirmApproveMethodMeaning",
        "invoiceMatchMeaning",
        "cancelCollaborativeModeMeaning",
        "cancelApproveMethodMeaning",
        settleType !== "PAYMENT" && "invoiceToleranceRangeLimit",
        settleType !== "PAYMENT" && "taxAmountTolLimit",
        settleType !== "PAYMENT" && "amountAdjustTolLimit",
        settleType !== "PAYMENT" && "amountValidateLevelMeaning",
        settleType !== "PAYMENT" && "amountValidateActionMeaning",
        settleType !== "PAYMENT" && "amountAdjustFlag",
        settleType !== "PAYMENT" && "amountAdjustTolLimit",
        settleType !== "PAYMENT" && "taxAmountAdjustTolLimit",
        settleType !== "PAYMENT" && "amountAdjustModeMeaning",
        settleType !== "PAYMENT" && "amountAdjustRuleMeaning",
        "defaultPaymentDimensionMeaning",
        "defaultPaymentSpliteRuleMeaning",
        "defaultPrepaymentSpliteRuleMeaning",
        "lineLimitQuantity",
        payAreaShow && "prepaymentDimensionMeaning",
        payAreaShow && "prepaymentCheckLevelMeaning",
        payAreaShow && "prepaymentCheckPointMeaning",
        "initSettleConfigNum",
        "initConfigVersionNumber",
        settleType !== "PAYMENT" && "invoiceUxFlag",
        settleType === "PAYMENT" && "paymentUxFlag",
        settleType === "INVOICE_PAYMENT" && "invoicePaymentUxFlag"

      ];
      return this.formatDetailColumns(fieldsList);
    },
    getBottomButtons() {
      return this.approveFlag ? [
        {
          fill: true,
          type: "danger",
          title: this.$T("hzero.common.button.return").$D("退回"),
          handler: () => this.openApprovePopup("return"),
        },
        {
          fill: true,
          type: "primary",
          title: this.$T("hzero.common.button.confirm").$D("确认"),
          handler: () => this.openApprovePopup("confirm"),
        },
      ] : [
        {
          fill: true,
          type: "primary",
          title: this.$T("ssta.common.button.mainStrategyInfo").$D("主策略信息"),
          handler: this.viewStrategy,
        },
      ];
    },
    getConfirmColumns() {
      const { settleType, supplierFlag } = this;
      const { settleStatus } = this.headerInfo;
      return supplierFlag ? [
        { fieldCode: "approvedRemark", fieldType: "INPUT", visible: [ "SUBMITED", "SUBMITED_APPROVING" ].includes(settleStatus) },
        { fieldCode: "canceledRemark", fieldType: "INPUT", visible: [ "CANCELING", "CANCEL_APPROVING" ].includes(settleStatus) },
        { fieldCode: "supplierApprovedRemark", fieldType: "INPUT", visible: [ "WAIT_SUPPLIER_CONFIRM" ].includes(settleStatus) },
        { fieldCode: "supplierCanceledRemark", fieldType: "INPUT", visible: [ "WAIT_SUPPLIER_CANCEL" ].includes(settleStatus) }
      ] : [
        { fieldCode: "accountingDate", editor: true, visible: settleType !== "PAYMENT" && settleStatus !== "CANCELING" },
        { fieldCode: "approvedRemark", fieldType: "INPUT", visible: [ "SUBMITED", "SUBMITED_APPROVING" ].includes(settleStatus) },
        { fieldCode: "canceledRemark", fieldType: "INPUT", visible: [ "CANCELING", "CANCEL_APPROVING" ].includes(settleStatus) }
      ];
    },
    getReturnColumns() {
      const { supplierFlag } = this;
      const { settleStatus } = this.headerInfo;
      return supplierFlag ? [
        { fieldCode: "approvedRemark", fieldType: "INPUT", visible: [ "SUBMITED", "SUBMITED_APPROVING" ].includes(settleStatus) },
        { fieldCode: "canceledRemark", fieldType: "INPUT", visible: [ "CANCELING", "CANCEL_APPROVING" ].includes(settleStatus) },
        { fieldCode: "supplierApprovedRemark", fieldType: "INPUT", visible: [ "WAIT_SUPPLIER_CONFIRM" ].includes(settleStatus) },
        { fieldCode: "supplierCanceledRemark", fieldType: "INPUT", visible: [ "WAIT_SUPPLIER_CANCEL" ].includes(settleStatus) }
      ] : [
        { fieldCode: "approvedRemark", fieldType: "INPUT", visible: [ "SUBMITED", "SUBMITED_APPROVING" ].includes(settleStatus) },
        { fieldCode: "canceledRemark", fieldType: "INPUT", visible: [ "CANCELING", "CANCEL_APPROVING" ].includes(settleStatus) }
      ];
    },
    getRoleLanguage() {
      const { supplierFlag, settleType } = this;
      const amountCardTitleObj = {
        INVOICE: this.$T("ssta.common.view.title.invoiceApplyInfo").$D("发票申请信息"),
        PAYMENT: this.$T("ssta.common.view.title.paymentApplyInfo").$D("付款申请信息"),
        INVOICE_PAYMENT: this.$T("ssta.common.view.title.payIncludeInvApplyInfo").$D("付款申请（含发票）信息"),
      };
      if (supplierFlag) {
        return {
          amountCardTitle: amountCardTitleObj[settleType],
          basicTitle: this.$T("ssta.supplySettle.view.title.basicInfo").$D("基本信息"),
          lineTitle: this.$T("ssta.supplySettle.view.title.settleDetailInfo").$D("结算明细信息"),
          taxTitle: this.$T("ssta.supplySettle.view.title.taxInvoiceDetail").$D("税务发票明细"),
          payTitle: this.$T("ssta.supplySettle.view.title.paymentInfo").$D("付款信息"),
          directInvTitle: this.$T("ssta.supplySettle.view.title.directBillInfo").$D("直连开票信息"),
          otherTitle: this.$T("ssta.supplySettle.view.title.otherInfo").$D("其他信息")
        };
      }
      return {
        amountCardTitle: amountCardTitleObj[settleType],
        basicTitle: this.$T("ssta.purchaseSettle.view.title.basicInfo").$D("基本信息"),
        lineTitle: this.$T("ssta.purchaseSettle.view.title.settleDetailInfo").$D("结算明细信息"),
        taxTitle: this.$T("ssta.purchaseSettle.view.title.taxInvoiceDetail").$D("税务发票明细"),
        payTitle: this.$T("ssta.purchaseSettle.view.title.paymentInfo").$D("付款信息"),
        directInvTitle: this.$T("ssta.purchaseSettle.view.title.directBillInfo").$D("直连开票信息"),
        otherTitle: this.$T("ssta.purchaseSettle.view.title.otherInfo").$D("其他信息")
      };
    },
  },
  created() {
    this.initDataSet();
    this.fetchLookupData();
    this.fetchHistoryRecords();
    this.fetchApproveRecords();
  },
  methods: {
    async fetchLookupData() {
      const res = await queryMapIdpValue({
        settleStatusTypeMap: "SSTA.SETTLE_STATUS",
        actionMeaningMap: "SSTA.PROCESS_DEFINITION",
        checkLevelMap: "SSTA.PREPAYMENT_CHECK_LEVEL",
        checkPointMap:"SSTA.PREPAYMENT_CHECK_PIONT",
      }).catch((err) => {
        throw err;
      });
      if (res && !res.failed) {
        Object.entries(res).forEach(([ key, data ]) => {
          this[key] = fromPairs(
            data.map(({ value, tag, meaning } = {}) => [ value, key === "settleStatusTypeMap" ? tag : meaning ])
          );
        });
      }
    },
    async fetchHistoryRecords() {
      const res = await queryHistoryRecords(this.settleHeaderId).catch(
        (err) => {
          throw err;
        }
      );
      if (res && res.content) {
        this.historyData = res.content;
      }
    },
    async fetchApproveRecords() {
      const res = await queryApproveRecords({
        primaryId: this.settleHeaderId,
        documentType: "SSTA.SETTLE_HEADER"
      }).catch(
        (err) => {
          throw err;
        }
      );
      if (res && !res.failed) {
        const eventNameMap = {
          startEvent: this.$T("hwfp.common.status.start").$D("开始"),
          endEvent: this.$T("hwfp.common.status.end").$D("结束"),
        };
        this.approveData = Object.values(res).reduce((total, item = []) =>
          item.reduce((_, childItem = {}) =>
            total.concat(
              childItem.historicTaskExtList.map((grandItem) => {
                const { name, action, actType } = grandItem;
                const nodeName = name || eventNameMap[actType] || this.$T("hwfp.common.view.message.approvaling").$D("审批中");
                return {
                  nodeName,
                  type:  actionColorMap[action] || "info",
                  text: this.actionMeaningMap[action] || this.$T("hwfp.common.view.message.approvaling").$D("审批中"),
                };
              }) || []
            ),
          []),
        []);
      }
    },
    async invoiceAutoCheck() {
      const { settleHeaderId } = this;
      const checkRes = await invoiceCheck(settleHeaderId, "AUTO");
      if (!checkRes) {
        return;
      }
      const { errorMessageMap = {} } = checkRes;
      if (!isEmpty(errorMessageMap)) {
        const errorMsg = Object.values(errorMessageMap)
          .map((item) => item?.desc)
          .join();
        this.$notification.open({ message: errorMsg });
      }
      this.taxInvoiceDs.refresh();
    },
    async initDataSet() {
      const { settleType, settleHeaderId } = this.$route.query;
      const documentType = this.settleType === "INVOICE_PAYMENT" ? "INVOICE" : settleType;
      const { settleHeaderDS, settleLineDS, taxInvoiceDS } = this.dsFuncsMap;
      this.settleHeaderDs = new DataSet(settleHeaderDS(settleHeaderId, documentType));
      this.settleLineDs = new DataSet(settleLineDS(settleHeaderId, documentType));
      if (settleType !== "PAYMENT") {
        this.taxInvoiceDs = new DataSet(taxInvoiceDS(settleHeaderId));
      }
      await this.settleHeaderDs.refresh();
      this.initHeaderInfo();
    },
    async initHeaderInfo() {
      const headerInfo = this.settleHeaderDs.current.toData() || {};
      this.syncAiPreReviewResult(headerInfo);
      const { documentType } = this;
      const {
        settleStatus,
        enableCheckFlag,
        autoCheckFlag,
        checkPointCode,
        optPermissionList = [],
      } = headerInfo;
      const optPermissionObj = fromPairs(
        optPermissionList.map(({ permissionType, operationType = "" }) =>
          operationType.split(",").map((i) => [ i, permissionType ])
        ).flat()
      );
      const {
        HEAD_PAYMENT: headPayment, // 头-付款
        LINE_PAYMENT: linePayment, // 行-付款
        HEAD_PREPAYMENT_VERIFICATION: headPrePaymentVer, // 头-预付款核销
        LINE_PREPAYMENT_VERIFICATION: linePrePaymentVer, // 行-预付款核销
        HEAD_MULDIMENSION_PAYMENT: headMultiDimensionPayment, // 头-多维度付款
      } = optPermissionObj;
      const payAreaShow = !(
        documentType === "INVOICE" && optPermissionList.every((item) => item.permissionType === "HIDE")
      );
      if (
        this.approveFlag && // 功能审批
        this.documentType === "INVOICE" && // 发票申请
        settleStatus !== "CANCELING" &&
        enableCheckFlag === 1 &&
        autoCheckFlag === 1 &&
        [ "CONFIRM", "BOTH" ].includes(checkPointCode)
      ) {
        this.invoiceAutoCheck();
      }
      Object.assign(this, {
        headerInfo,
        headPayment,
        linePayment,
        headPrePaymentVer,
        linePrePaymentVer,
        headMultiDimensionPayment,
        payAreaShow,
      });
    },
    syncAiPreReviewResult(headerInfo = {}) {
      const { aiApproveStatus = "", searchDetailParams = null } = headerInfo.sstaAiApproveResult || {};
      this.aiApproveStatus = aiApproveStatus;
      this.aiReviewParams = searchDetailParams;
    },
    onClickItem(key) {
      let dataSet, getColumnsFunc;
      switch (key) {
      case "basic":
        dataSet = this.settleHeaderDs;
        getColumnsFunc = this.getBasicColumns;
        break;
      case "line":
        dataSet = this.settleLineDs;
        getColumnsFunc = this.getLineColumns;
        break;
      case "tax":
        dataSet = this.taxInvoiceDs;
        getColumnsFunc = this.getTaxColumns;
        break;
      case "pay":
        dataSet = this.settleHeaderDs;
        getColumnsFunc = this.getPaymentColumns;
        break;
      case "directInv":
        dataSet = this.settleHeaderDs;
        getColumnsFunc = this.getDirectInvColumns;
        break;
      case "other":
        dataSet = this.settleHeaderDs;
        getColumnsFunc = this.getOtherColumns;
        break;
      default:
        break;
      }
      this.$popup({
        position:"right",
        content:
          <SrmForm
            customizeType="detail"
            dataSet={dataSet}
            columns={getColumnsFunc(true)}
          />
        ,
      });
    },
    viewStrategy() {
      this.$popup({
        position:"right",
        content: <SrmForm dataSet={this.settleHeaderDs} columns={this.getStrategyColumns} />
      });
    },
    async handleConfirm(approvePopup) {
      const { role } = this;
      const { settleStatus } = this.headerInfo;
      approvePopup.onClose();
      const validateOk = async () => {
        this.$loading.show();
        const res = await batchConfirmSettle({
          role,
          body: this.settleHeaderDs.toData(),
        }).catch((err) => {
          throw err;
        });
        this.$loading.hide();
        if (res && res.failed) {
          this.$notification.open({ message: res.message });
        } else {
          this.$notification.open({
            message: this.$T("smbl.common.message.acction.success").$D("操作成功")
          });
          this.$router.back();
        }
      };
      if (![ "SUBMITED", "WAIT_SUPPLIER_CONFIRM" ].includes(settleStatus)) {
        validateOk();
        return;
      }
      this.$loading.show();
      const bankValidateRes = await confirmValidate({
        role,
        body: this.settleHeaderDs.current.toData(),
      }).catch((err) => {
        throw err;
      });
      this.$loading.hide();
      if (!bankValidateRes || bankValidateRes.failed) {
        return;
      }
      const { validatedCode, msg } = bankValidateRes || {};
      if (validatedCode === "WARNING") {
        const checkWarnPopup = this.$popup({
          showHeader: true,
          height: "auto",
          title: this.$T("ssta.common.view.message.tip").$D("提示"),
          content:
              <div style={{ padding: "12px 15px" }}>
                <div style={{ paddingBottom: "68px" }}>{msg}</div>
                <SrmButton
                  bordered
                  size="x-large"
                  type="danger"
                  style={{ width: "calc(50% - 6px)", marginRight: "12px" }}
                  onClick={() => {
                    checkWarnPopup.onClose();
                  }}
                >
                  {this.$T("hzero.common.button.cancel").$D("取消")}
                </SrmButton>
                <SrmButton
                  fill
                  size="x-large"
                  type="primary"
                  style={{ width: "calc(50% - 6px)" }}
                  onClick={() => {
                    checkWarnPopup.onClose();
                    return validateOk();
                  }}
                >
                  {this.$T("hzero.common.button.confirm").$D("确认")}
                </SrmButton>
              </div>
        });
      } else if (validatedCode === "ERROR") {
        this.$notification.open({
          message: msg
        });
      } else {
        return validateOk();
      }
    },
    async handleReturn(approvePopup) {
      const { role } = this;
      this.$loading.show();
      const res = await batchReturnSettle({
        role,
        body: this.settleHeaderDs.toData(),
      }).catch((err) => {
        throw err;
      });
      this.$loading.hide();
      if (res && res.failed) {
        this.$notification.open({
          message: res.message
        });
      } else {
        this.$notification.open({
          message: this.$T("smbl.common.message.acction.success").$D("操作成功")
        });
        approvePopup.onClose();
        this.$router.back();
      }
    },
    openApprovePopup(action) {
      const approveColumns = action === "confirm" ? this.getConfirmColumns : this.getReturnColumns;
      const okFunc = action === "confirm" ? this.handleConfirm : this.handleReturn;
      const okType = action === "confirm" ? "primary" : "danger";
      const okText = action === "confirm" ? this.$T("hzero.common.button.confirm").$D("确认") : this.$T("hzero.common.button.return").$D("退回");
      const approvePopup = this.$popup({
        rounded: true,
        height: "70%",
        showClose: true,
        showHeader: true,
        title: this.supplierFlag ?
          this.$T("ssta.supplySettle.view.title.approveInfo").$D("审核信息") :
          this.$T("ssta.purchaseSettle.view.title.approveInfo").$D("审核信息"),
        content:
          <div style={{ height: "100%", display:"flex", flexDirection: "column", justifyContent: "space-between" }}>
            <SrmForm customizeType="detail" dataSet={this.settleHeaderDs} columns={approveColumns} />
            <div style={{ padding: "12px 15px" }}>
              <SrmButton
                bordered
                size="x-large"
                type="danger"
                style={{ width: "calc(50% - 6px)", marginRight: "12px" }}
                onClick={() => approvePopup.onClose()}
              >
                {this.$T("hzero.common.button.cancel").$D("取消")}
              </SrmButton>
              <SrmButton
                fill
                size="x-large"
                type={okType}
                style={{ width: "calc(50% - 6px)" }}
                onClick={() => okFunc(approvePopup)}
              >
                {okText}
              </SrmButton>
            </div>
          </div>
        ,
      });
    },
    showPrePayWriteOffRecord(record = {}) {
      const { supplierFlag } = this;
      const { settleLineId } = record;
      const { settleHeaderId } = this.headerInfo;
      this.$popup({
        rounded: true,
        showClose: true,
        showHeader: true,
        title: this.supplierFlag ?
          this.$T("ssta.supplySettle.button.preColWriteOffRecord").$D("预收款核销记录") :
          this.$T("ssta.purchaseSettle.button.prePayWriteOffRecord").$D("预付款核销记录"),
        content: <PrePayWriteOff settleHeaderId={settleHeaderId} settleLineId={settleLineId} supplierFlag={supplierFlag} />
      });
    },
    showMultiDimenAssignRecord() {
      const { supplierFlag } = this;
      const { settleHeaderId, paymentDimension, paymentSpliteRuleMeaning, paymentDimensionMeaning } = this.headerInfo;
      this.$popup({
        rounded: true,
        showClose: true,
        showHeader: true,
        title: this.supplierFlag ?
          this.$T("ssta.supplySettle.button.multiDemensionAssignRecord").$D("多维度分配记录") :
          this.$T("ssta.purchaseSettle.button.multiDemensionAssignRecord").$D("多维度分配记录"),
        content:
          <MultiDimenAssign
            supplierFlag={supplierFlag}
            settleHeaderId={settleHeaderId}
            paymentSpliteRuleMeaning={paymentSpliteRuleMeaning}
            paymentDimensionData={{ value: paymentDimension, meaning: paymentDimensionMeaning }}
          />
      });
    },
    showPayActions() {
      const commonBtnProps = {
        rect: true,
        type: "info",
        size: "x-large",
      };
      const commonBtnStyle = { background: "#fff" };
      const payActionPupup = this.$popup({
        height: "auto",
        showHeader: true,
        title: this.$T("ssta.common.view.title.pleaseSelectRelatedOpr").$D("请选择相关操作"),
        content:
        <div>
          <SrmButton
            props={{ ...commonBtnProps }}
            style={commonBtnStyle}
            onClick={this.showPrePayWriteOffRecord}
          >
            {this.supplierFlag ?
              this.$T("ssta.supplySettle.button.preColWriteOffRecord").$D("预收款核销记录") :
              this.$T("ssta.purchaseSettle.button.prePayWriteOffRecord").$D("预付款核销记录")}
          </SrmButton>
          <SrmButton
            props={{ ...commonBtnProps }}
            style={commonBtnStyle}
            onClick={this.showMultiDimenAssignRecord}
          >
            {this.supplierFlag ?
              this.$T("ssta.supplySettle.button.multiDemensionAssignRecord").$D("多维度分配记录") :
              this.$T("ssta.purchaseSettle.button.multiDemensionAssignRecord").$D("多维度分配记录")}
          </SrmButton>
          <div style={{ height: "12px", background: "#F6F6F6" }} />
          <SrmButton props={{ ...commonBtnProps }} style={commonBtnStyle} onClick={() => payActionPupup.onClose()}>
            {this.$T("hzero.common.button.cancel").$D("取消")}
          </SrmButton>
        </div>
      });
    },
    showTaxInvoiceOperationRecord(record) {
      if (!record || !record.taxInvoiceHeaderId) {
        return;
      }
      getTaxInvoiceOperationRecord(record.taxInvoiceHeaderId).then((res) => {
        if (res && res.content) {
          this.$popup({
            title: this.$T("hzero.common.view.button.operationRecord").$D("操作记录"),
            showHeader: true,
            showClose: true,
            position: "bottom",
            showBack: false,
            height: "70vh",
            rounded: true,
            content: <HistoryRecordTiled
              remarkLabel={this.$T("smbl.common.view.title.operationRemark").$D("操作说明")}
              operatorFieldName="processUser"
              actionData={res.content}/>,
          });
        }
      });
    },
    showSettleLineDetail(record) {
      const { supplierFlag } = this;
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content:
          <SettleLineDetail props={{ "v-bind": "$attrs" }} supplierFlag={supplierFlag} topRecord={record} redirectPage={this.redirectPage} />
      });
    },
    previewFile(fileUrl) {
      const fA = fileUrl.split(".");
      const fileExt = fA && fA[fA.length - 1];
      if (fileExt.toLowerCase() === "pdf") {
        previewPdf.call(this, fileUrl);
      } else {
        this.$previewImage([ SrmUtil.buildImgUrl(fileUrl, SrmUtil.getDefaultBucketName()) ]);
      }
    },
    redirectPage(params) {
      this.$router.push(params);
    },
    formatListColumns(fieldsList, options = {}) {
      const { endRow = 7, showLabelTop = true } = options;
      const filterList = fieldsList.filter((item) => item);
      return take(filterList, endRow).reduce((total, item, formRow) => {
        const currentList = [];
        if (isArray(item)) {
          item.forEach((childItem, formCol) => {
            if (isObject(childItem)) {
              currentList.push({ formRow, formCol, ...childItem });
            } else if (isString(childItem)) {
              currentList.push({ formRow, formCol, fieldCode: childItem });
            }
          });
        } else if (isObject(item)) {
          currentList.push({ formRow, ...item });
        } else if (isString(item)) {
          if (formRow === 0) {
            currentList.push({
              formRow,
              fieldCode: item,
              fieldType: "EMPTY",
              render: (value, _, field) => {
                const content = showLabelTop ?
                  `${field.fieldName}：${value}` :
                  value;
                return <SrmListHeader>{content}</SrmListHeader>;
              },
            });
          } else {
            currentList.push({ formRow, fieldCode: item });
          }
        }
        return total.concat(currentList);
      }, []);
    },
    formatDetailColumns(fieldsList) {
      const filterList = fieldsList.filter((item) => item);
      return filterList.reduce((total, item) => {
        const currentList = [];
        if (isArray(item)) {
          item.forEach((childItem) => {
            if (isObject(childItem)) {
              currentList.push(item);
            } else if (isString(childItem)) {
              currentList.push({ fieldCode: childItem });
            }
          });
        } else if (isObject(item)) {
          currentList.push(item);
        } else if (isString(item)) {
          currentList.push({ fieldCode: item });
        }
        return total.concat(currentList);
      }, []);
    },
  },
};
</script>
<style lang="stylus" scoped>
@import '~srm-mobile-ui/src/style/var.styl';

.srm-list-icon-search {
  font-weight: normal;
  font-size: 20px;
  color: $srm-theme-color-primary;
}

.detail-popup-content {
  .detail-popup-top {
    min-height: 0;
    border-bottom: 8px solid var(--background-color-empty-second);

    /deep/ .customize {
      font-weight: 600 !important;
    }
  }
}

.bottom-button-space {
  height: calc(74px + 44px + env(safe-area-inset-bottom));
  background: var(--background-color-empty-second);
}
.bottom-button-wrapper {
  height: calc(74px + env(safe-area-inset-bottom));
}

.ssta-settle-detail-line-wrapper {
  /deep/  .srm-list-search-line {
    position: absolute;
    top: -45px;
    z-index: 1;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
