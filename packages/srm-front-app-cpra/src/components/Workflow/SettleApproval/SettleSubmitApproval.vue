<template>
  <div class="srm-settle-submit-approval">
    <srm-scroll-tab customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.COLLAPSES">
      <ai-tip-section
        v-if="aiApproveStatus"
        :ai-approve-status="aiApproveStatus"
        :ai-review-params="aiReviewParams" />
      <srm-scroll-tab-item code="basic" :label="$T('ssta.purchaseSettle.message.panel.baseInfos').$D('基本信息')">
        <srm-form
          customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.BASIC"
          :data-set="settleHeaderDataSet"
          :columns="getBasicColumns()"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="transaction" :label="$T('ssta.purchaseSettle.message.panel.transactionParty').$D('交易方信息')">
        <srm-form
          customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.TRANSACTION_PARTY"
          :data-set="settleHeaderDataSet"
          :columns="getTransactionColumns()"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="summary" :label="$T('ssta.purchaseSettle.view.title.summaryInfo').$D('汇总信息')">
        <srm-form
          customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.SUMMARY_INFO"
          :data-set="settleHeaderDataSet"
          :columns="getSummaryColumns()"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="isInvoice" code="invoice"
                           :label="$T('ssta.purchaseSettle.view.title.systemInvoiceInfo').$D('开票信息（系统）')">
        <srm-form
          customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.SYSTEM_INVOICE_INFO"
          :data-set="settleHeaderDataSet"
          :columns="getSystemInvoiceColumns()"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="isInvoice"
        ref="invoicematchRef"
        code="invoicematch"
        :label="$T('ssta.purchaseSettle.view.title.invoiceMatchInfo').$D('发票匹配信息')">
        <srm-form
          customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.INVOICE_MATCH_INFO"
          :data-set="settleHeaderDataSet"
          :columns="getInvoiceMatchColumns()"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="optPermissionMap.HEAD_PREPAYMENT_VERIFICATION"
        ref="prepaymentRef"
        code="prepayment"
        :label="$T('ssta.purchaseSettle.view.title.prePaymentWriteOffInfo').$D('预付款核销信息')">
        <srm-form
          customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.PRE_PAYMENT_WRITE_OFF_INFO"
          :data-set="settleHeaderDataSet"
          :columns="getPrePayColumns()"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        v-if="optPermissionMap.HEAD_PAYMENT"
        ref="paymentRef"
        code="payment"
        :label="$T('ssta.purchaseSettle.view.title.paymentInfo').$D('付款信息')">
        <srm-form
          customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.PAYMENT_INFO"
          :data-set="settleHeaderDataSet"
          :columns="getPaymentColumns()"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        ref="lineRef"
        code="line"
        :show-title="false"
        :label="$T('ssta.purchaseSettle.view.message.panel.transactionDetails').$D('交易明细信息')">
        <srm-flex class="srm-scroll-tab-item-title" justify="between">
          <div class="collapse-title collapse-title-flex">{{ $refs.lineRef?.mLabel }}</div>
          <div class="tab-item-button">
            <em
              v-show="!settleLineDataSet.editFlag"
              class="srm-icon icon-edit"
              @click="Object.assign(settleLineDataSet, { editFlag: true })"/>
            <srm-button
              v-show="settleLineDataSet.editFlag"
              plain
              @click="Object.assign(settleLineDataSet, { editFlag: false })">
              {{ $T("hzero.common.button.cancel").$D("取消") }}
            </srm-button>
            <span class="srm-icon icon-filter" @click.stop="showLineFilter = true"/>
          </div>
        </srm-flex>
        <srm-list
          :customize-code="isInvoice ? 'SMBL.WORKFLOW.SETTLE_APPROVAL.LINE_INFO' : 'SMBL.WORKFLOW.SETTLE_APPROVAL.LINE_INFO_PAY'"
          :data-set="settleLineDataSet"
          :scrollable="false"
          :columns="getTransactionDetailColumns()"
          @itemClick="showSettleLineDetail"/>
        <srm-filter v-model="showLineFilter" :data-set="settleLineDataSet"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="cuszLine" :label="$T('ssta.purchaseSettle.view.message.panel.transactionDetails').$D('交易明细信息')">
        <srm-list
          :customize-code="isInvoice ? 'SMBL.WORKFLOW.SETTLE_APPROVAL.INV_CUSZ_LINES' : 'SMBL.WORKFLOW.SETTLE_APPROVAL.PAY_CUSZ_LINES'"
          :data-set="cuszLineDataSet"
          :scrollable="false"
          @itemClick="showCuszLineDetail"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="mainStrategyInfo" :label="$T('ssta.purchaseSettle.view.title.mainStrategyInfo').$D('主策略信息')">
        <srm-form
          customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.MAIN_STRATEGY_INFO"
          :data-set="settleHeaderDataSet"
          :columns="getMainStrategyColumns()"
          @click.native="showMainStrategyDetail"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="otherInfo" :label="$T('ssta.purchaseSettle.view.title.otherInfo').$D('其他信息')">
        <srm-form
          customize-code="SMBL.WORKFLOW.SETTLE_APPROVAL.OTHER_INFO"
          :data-set="settleHeaderDataSet"
          :columns="getOtherColumns()"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="operation" :label="$T('ssta.purchaseSettle.view.title.operationHistory').$D('操作记录')">
        <history-record-tiled
          :action-data="operationRecord"
          :remark-label="$T('smbl.common.view.title.operationRemark').$D('操作说明')"
          operator-field-name="processUser"
          operation-meaning-field-name="processStatusMeaning"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="attachment" :label="$T('ssta.purchaseSettle.view.title.attachment').$D('附件')">
        <attachment-info :data-set="settleHeaderDataSet" directory="ssta-settle-header" :is-invoice="isInvoice" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
    <srm-list-bottom-bar
      v-if="isInvoice ? permissionMap.get('lineBatchModifyPub') : permissionMap.get('paymentLineBatchModifyPub')"
      :buttons="getLineButtons"
      :data-set="settleLineDataSet"/>
  </div>
</template>

<script>
import { isNil } from "lodash";
import { DataSet, SrmUtil } from "srm-mobile-ui";
import settleHeaderDS from "./datasource/settleHeaderDS";
import settleLineDS from "./datasource/settleLineDS";
import taxInvoiceDS from "./datasource/taxInvoiceDS";
import settleApplyLineDS from "./datasource/settleApplyLineDS";
import multiplePaymentInfoDS from "./datasource/multiplePaymentInfoDS";
import cuszLineDS from "./datasource/cuszLineDS";
import { getOperationRecord, getTaxInvoiceOperationRecord, batchUpdateLine, workflowValidate } from "./api";
import StatusTag from "@/components/StatusTag";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import SettleLineDetail from "./components/SettleLineDetail";
import AttachmentInfo from "./components/AttachmentInfo";
import AiTipSection from "@/components/AiTipSection/AiTipSection";
import { PermissionCaller, formatColumns } from "./utils";
import CuxMethods from "@/modules/CUX_PART/Method/SettleSubmitApprovalMethod";
import { previewPdf } from "../../../utils";
const buttonPermPrefix = "srm.settle-account.jsd.ux-purchase.button";
export const permissionCodeMap = {
  lineBatchModifyPub: `${buttonPermPrefix}.line-batch-modify-pub`,
  paymentLineBatchModifyPub: `${buttonPermPrefix}.payment-line-batch-modify-pub`,
};
export default {
  name: "SettleSubmitApproval",
  components: { HistoryRecordTiled, AttachmentInfo, AiTipSection },
  modules: [ "ssta.purchaseSettle", "smbl.common", "ssta.purchaseInvoicePool", "ssta.purchaseSettlePool", "ssta.invoiceSheet", "sfin.purchaseBillConfirm", "ssta.common", "hzero.common", "hipspfm.common", "sodr.common", "sprm.common", "sinv.receiptWorkbench", "sinv.receiptExecution", "sinv.receipWorkbench", "slod.common", "slod.deliveryWorkbench" ],
  extends: CuxMethods,
  props: {
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      settleHeaderDataSet: new DataSet(settleHeaderDS(this.parameters.documentType)),
      settleLineDataSet: new DataSet(settleLineDS(this.parameters.documentType)),
      taxInvoiceDataSet: new DataSet(taxInvoiceDS()),
      settleApplyLineDataSet: new DataSet(settleApplyLineDS()),
      settleApplyLineDataSetPurchaser: new DataSet(settleApplyLineDS(true)),
      cuszLineDataSet: new DataSet(cuszLineDS(this.parameters.documentType, this.parameters.settleHeaderId)),
      batchModifyLineDs: new DataSet({}),
      multiplePaymentInfoDataSet: null,
      operationRecord: [],
      taxInvoiceOperationRecord: [],
      showLineFilter: false,
      /**
       * HEAD_MULDIMENSION_PAYMENT  头-多维度付款
       * HEAD_PREPAYMENT_VERIFICATION  头-预付款核销信息
       * HEAD_PAYMENT  头-付款信息
       * LINE_PREPAYMENT_VERIFICATION  行-预付款核销
       * LINE_PAYMENT  行-付款信息
       */
      optPermissionMap: {
        HEAD_MULDIMENSION_PAYMENT: true,
        HEAD_PREPAYMENT_VERIFICATION: true,
        HEAD_PAYMENT: true,
        LINE_PREPAYMENT_VERIFICATION: true,
        LINE_PAYMENT: true,
      },
      prePaymentCheckLevel: {},
      prePaymentCheckPoint: {},
      basicCollapse: true,
      transactionCollapse: true,
      summaryCollapse: true,
      invoiceCollapse: true,
      invoicematchCollapse: true,
      prepaymentCollapse: true,
      paymentCollapse: true,
      lineCollapse: true,
      cuszLineCollapse: true,
      mainStrategyInfoCollapse: true,
      otherInfoCollapse: true,
      operationCollapse: true,
      attachmentCollapse: true,
      permissionMap: new PermissionCaller(permissionCodeMap),
      readonlyFlag: false,
      aiApproveStatus: "",
      aiReviewParams: null,
    };
  },
  computed: {
    isInvoice() {
      return this.parameters.documentType === "INVOICE";
    },
    getLineButtons() {
      return [
        {
          fill: true,
          type: "primary",
          text: this.$T("ssta.common.button.bathModify").$D("批量修改"),
          callback: this.batchModifyLine,
        },
      ];
    }
  },
  beforeMount() {
    this.readonlyFlag = String(this.parameters.readonly) === "1";
    this.settleHeaderDataSet.addQueryParameter("settleHeaderId", this.parameters.settleHeaderId);
    const afterQuery = this.settleHeaderDataSet.events.afterQuery;
    this.settleHeaderDataSet.events.afterQuery = (ds, data) => {
      this.syncAiPreReviewResult(data?.[0]);
      this.optPermissionList = data && data[0] && data[0].optPermissionList || [];
      this.optPermissionList = this.optPermissionList.filter((e) => e.permissionType === "HIDE");
      const hidePermission = this.optPermissionList[0] || {};
      const operationType = hidePermission.operationType;
      if (operationType) {
        const operationTypes = operationType.split(",");
        Object.keys(this.optPermissionMap).forEach((key) => {
          if (operationTypes.includes(key)) {
            this.$set(this.optPermissionMap, key, false);
          }
        });
      }
      this.multiplePaymentInfoDataSet = new DataSet(multiplePaymentInfoDS({
        value: data[0].paymentDimension,
        meaning: data[0].paymentDimensionMeaning
      }));
      this.multiplePaymentInfoDataSet.addPathParameter("settleHeaderId", this.parameters.settleHeaderId);
      this.multiplePaymentInfoDataSet.addQueryParameter("settleHeaderId", this.parameters.settleHeaderId);
      if (this.readonlyFlag) {
        Object.assign(data[0], { isReadonlyPub: 1 });
      }
      afterQuery(ds, data);
    };
    this.settleHeaderDataSet.refresh();
    this.settleLineDataSet.addPathParameter("settleHeaderId", this.parameters.settleHeaderId);
    this.taxInvoiceDataSet.addPathParameter("settleHeaderId", this.parameters.settleHeaderId);
    this.fetchOperationRecord();
    SrmUtil.getValueSetBatch({
      prePaymentCheckLevel: "SSTA.PREPAYMENT_CHECK_LEVEL",
      prePaymentCheckPoint: "SSTA.PREPAYMENT_CHECK_PIONT"
    }, this);
  },
  methods: {
    syncAiPreReviewResult(headerInfo = {}) {
      const { aiApproveStatus = "", searchDetailParams = null } = headerInfo?.sstaAiApproveResult || {};
      this.aiApproveStatus = aiApproveStatus;
      this.aiReviewParams = searchDetailParams;
    },
    async bindLineDataAndValidate() {
      const validteResult = await Promise.all([
        this.settleHeaderDataSet.validate(),
        this.settleLineDataSet.validate(),
      ]);
      if (validteResult.some((item) => !item)) {
        return false;
      }
      const lineData = this.settleLineDataSet.toData() || [];
      this.settleHeaderDataSet.current.set("settleLineList", lineData);
      return true;
    },
    async beforeApprove(approveResult) {
      if (this.readonlyFlag || approveResult !== "Approved") {
        return Promise.resolve();
      }
      const res = await this.bindLineDataAndValidate();
      if (!res) {
        return Promise.reject();
      }
      const bussinessKey = this.settleHeaderDataSet.current.get("bussinessKey") || "";
      // 结算单取消审批不校验
      if (bussinessKey.startsWith("SSTA.SETTLE_HEADER_CANCEL")) {
        return Promise.resolve();
      }
      const headerData = this.settleHeaderDataSet.current.toData();
      const validRes = await workflowValidate(headerData);
      if (isNil(validRes)) {
        return Promise.reject();
      }
      if (validRes.failed) {
        return Promise.reject(validRes.message);
      }
      const { validatedCode, msg } = validRes || {};
      if (validatedCode === "WARNING") {
        return new Promise((resolve, reject) => {
          this.$dialog({
            content: msg,
            onOk: async () => {
              const updateRes = await this.settleHeaderDataSet.updateRecords([ this.settleHeaderDataSet.current ]);
              if (isNil(updateRes)) {
                return reject();
              }
              if (updateRes.failed) {
                return reject(updateRes.message);
              }
              return resolve();
            },
            onCancel: () => reject(),
          });
        });
      } else if (validatedCode === "ERROR") {
        return Promise.reject(msg);
      }
      return this.settleHeaderDataSet.updateRecords([ this.settleHeaderDataSet.current ]);

    },
    fetchOperationRecord() {
      getOperationRecord(this.parameters.settleHeaderId).then((res) => {
        this.operationRecord = res && res.content || [];
      });
    },
    showMultiPaymentInfo() {
      const columns = [
        { fieldCode: "documentNum" },
        { fieldCode: "invoicedTaxIncludedAmount", },
        { fieldCode: "remainingPaymentAmount", },
        { fieldCode: "paymentAmount", },
        { fieldCode: "applyAmount", },
        {
          fieldCode: "bottom",
          fieldName: this.$T("ssta.purchaseSettle.button.prePayWriteOffRecord").$D("预付款核销记录"),
          render: (_, item) => <SrmButton
            plain
            onClick={() => this.showPrePayWriteOffRecord({ purchaserFlag: true, documentNum: item.documentNum })}>
            {this.$T("hipspfm.common.button.view").$D("查看")}
          </SrmButton>,
        },
      ];
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content: <div style="height: 100%">
          <SrmList
            customizeCode="SMBL.WORKFLOW.SETTLE_APPROVAL.MULTI_PAYMENT_INFO"
            dataSet={this.multiplePaymentInfoDataSet}
            columns={columns}
          />
        </div>
      });
    },
    showPaymentDetail() {
      const columns = [
        { fieldCode: "bankName", },
        { fieldCode: "bankBranchName", },
        { fieldCode: "bankAccountName", },
        { fieldCode: "paymentTypeName", },
        { fieldCode: "paymentTermName", },
        { fieldCode: "bankAccountNum", },
        { fieldCode: "expectPaymentDate", },
        { fieldCode: "paymentDiscountAmount", }
      ];
      this.$popup({
        title: this.$T("ssta.purchaseSettle.button.paymentInfo").$D("付款信息"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        showBack: false,
        height: "70vh",
        rounded: true,
        content: <SrmForm
          customizeCode="SMBL.WORKFLOW.SETTLE_APPROVAL.PAYMENT_INFO_DETAIL"
          style={{ padding: "0 15px" }}
          customizeType="detail"
          dataSet={this.settleHeaderDataSet}
          columns={columns}
        />
      });
    },
    showPrePayWriteOffRecord(opts = {}) {
      const { settleLineId, purchaserFlag, documentNum } = opts;
      const columns = [
        { fieldCode: "prepaymentTitle" },
        { fieldCode: "prepaymentRemainingAmount", },
        { fieldCode: "applyAmount", },
        { fieldCode: "prepaymentAmount", },
        { fieldCode: "prepaymentTypeMeaning", },
        { fieldCode: "associateNum", },
        { fieldCode: "prepaymentCreatedBy", },
        { fieldCode: "prepaymentCreationDate", },
      ];
      if (settleLineId) {
        this.settleApplyLineDataSet.addPathParameter("settleHeaderLineId", `${this.parameters.settleHeaderId}/${settleLineId}`);
      } else {
        this.settleApplyLineDataSet.addPathParameter("settleHeaderLineId", this.parameters.settleHeaderId);
      }
      if (purchaserFlag) {
        this.settleApplyLineDataSetPurchaser.addQueryParameter("settleHeaderId", this.parameters.settleHeaderId);
        this.settleApplyLineDataSetPurchaser.addQueryParameter("paymentDimension", this.multiplePaymentInfoDataSet.queryParameter.paymentDimension);
        this.settleApplyLineDataSetPurchaser.addQueryParameter("documentNum", documentNum);
      }
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content: <SrmList
          customizeCode="SMBL.WORKFLOW.SETTLE_APPROVAL.PRE_PAY_WRITE_OFF_RECORD"
          dataSet={purchaserFlag ? this.settleApplyLineDataSetPurchaser : this.settleApplyLineDataSet}
          columns={columns}
        />
      });
    },
    showSettleLineDetail() {
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content: <SrmForm
          customizeCode="SMBL.WORKFLOW.SETTLE_APPROVAL.LINE_INFO_DETAIL"
          style={{ padding: "0 15px" }}
          customizeType="detail"
          dataSet={this.settleLineDataSet}
          columns={this.getTransactionDetailColumns(true)}
        />
      });
    },
    showCuszLineDetail() {
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content: <SrmForm
          customizeCode={this.isInvoice ? "SMBL.WORKFLOW.SETTLE_APPROVAL.INV_CUSZ_LINES" : "SMBL.WORKFLOW.SETTLE_APPROVAL.PAY_CUSZ_LINES"}
          style={{ padding: "0 15px" }}
          customizeType="detail"
          dataSet={this.cuszLineDataSet}
        />
      });
    },
    showTaxInvoice() {
      this.$popup({
        title: this.$T("ssta.purchaseSettle.view.title.taxInvoice").$D("税务发票"),
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content: <SrmList
          customizeCode="SMBL.WORKFLOW.SETTLE_APPROVAL.TAX_INVOICE"
          dataSet={this.taxInvoiceDataSet}
          columns={this.getTaxInvoiceColumns()}
          onItemClick={() => {
            this.$popup({
              showHeader: false,
              showClose: true,
              position: "right",
              showBack: false,
              content: <SrmForm
                customizeCode="SMBL.WORKFLOW.SETTLE_APPROVAL.TAX_INVOICE_DETAIL"
                style={{ padding: "0 15px" }}
                customizeType="detail"
                dataSet={this.taxInvoiceDataSet}
                columns={this.getTaxInvoiceColumns(true)}
              />
            });
          }}
        />
      });
    },
    batchModifyLine() {
      this.batchModifyLineDs.reset();
      this.batchModifyLineDs.create({});
      const modifyPopup = this.$popup({
        rounded: true,
        height: "80%",
        showClose: true,
        showHeader: true,
        title: this.$T("ssta.common.button.bathModify").$D("批量修改"),
        content:
          <SrmForm
            dataSet={this.batchModifyLineDs}
            columns={[]}
            customizeCode={this.isInvoice ? "SMBL.WORKFLOW.SETTLE_APPROVAL.INV_BATCH_MODIFY_LINE" : "SMBL.WORKFLOW.SETTLE_APPROVAL.PAY_BATCH_MODIFY_LINE"}
            buttons={[
              {
                fill: true,
                type: "primary",
                text: this.$T("hzero.common.button.save").$D("保存"),
                handler: async () => {
                  const headerData = this.settleHeaderDataSet.current?.toData() || {};
                  const { selected, queryFilter, queryParameter } = this.settleLineDataSet;
                  let searchBarData = {};
                  if (selected.length > 0) {
                    headerData.settleLineIdList = selected.map((item) => item.get("settleLineId"));
                  } else {
                    searchBarData = queryFilter?.mQuery || {};
                  }
                  const res = await batchUpdateLine({
                    data: { ...headerData, settleLine: this.batchModifyLineDs.current?.toData() || {} },
                    params: {
                      ...searchBarData,
                      customizeUnitCode: queryParameter.customizeUnitCode,
                    },
                  });
                  if (isNil(res)) {
                    return;
                  }
                  if (!res.failed) {
                    this.settleHeaderDataSet.refresh();
                    this.settleLineDataSet.refresh();
                    modifyPopup.onClose();
                  } else {
                    this.$notification.open({ message: res.message });
                  }
                }
              }
            ]}
          />
        ,
      });
    },
    getTaxInvoiceColumns(detailFlag) {
      const fieldCodeList = [
        "invoiceCode",
        "invoiceNumber",
        [ "taxAmount", "invoicingDate" ],
        [ "taxIncludedAmount", "netAmount" ],
        "invoiceSpeciesMeaning",
        [
          {
            fieldCode: "deductFlag",
            render: (val) => val ? this.$T("smbl.common.view.yes").$D("是") : this.$T("smbl.common.view.no").$D("否")
          },
          "checkCode",
        ],
        "supplierCompanyName",
        "companyName",
        [
          {
            fieldCode: "ocrFileUrl",
            fieldName: this.$T("ssta.purchaseSettle.view.message.model.purchaseSettle.ocrFile").$D("OCR文件"),
            render: (val) => val &&
              <SrmButton plain onClick={() => this.previewFile(val)}>
                {this.$T("ssta.purchaseSettle.view.title.seeOcrFile").$D("查看文件")}
              </SrmButton>
          },
          {
            fieldCode: "invoiceUrl",
            fieldName: this.$T("ssta.purchaseSettle.view.message.model.purchaseSettle.invoiceUrl").$D("电子发票地址"),
          },
        ],
        {
          fieldName: this.$T("ssta.purchaseSettle.view.title.operationHistory").$D("操作记录"),
          fieldCode: "taxInvoiceHeaderId",
          render: (val) => <SrmButton plain onClick={() => this.showTaxInvoiceOperationRecord(val)}>
            {this.$T("hzero.common.button.view").$D("查看")}
          </SrmButton>
        },
        "supUnifiedSocialCode",
        "purUnifiedSocialCode",
        "validateMessage",
        "validateStatusMeaning",
        "taxInvoiceStatusMeaning",
      ];
      const statusColorMap = {
        UNCHECK: "info",
        FAILED: "danger",
        SUCCESS: "success"
      };
      const columns = formatColumns(fieldCodeList, {
        takeFlag: !detailFlag,
        rightTagRender: (_, item) => <StatusTag color={statusColorMap[item.validateStatus]} text={item?.validateStatusMeaning} />,
      });
      return columns;
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
    showTaxInvoiceOperationRecord(val) {
      getTaxInvoiceOperationRecord(val).then((res) => {
        res && res.content && res.content.forEach((e) => {
          this.taxInvoiceOperationRecord.push(e);
        });
      });
      this.$popup({
        title: this.$T("ssta.purchaseSettle.view.title.operationHistory").$D("操作记录"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        showBack: false,
        height: "70vh",
        rounded: true,
        content: <HistoryRecordTiled
          remarkLabel={this.$T("smbl.common.view.title.operationRemark").$D("操作说明")}
          operatorFieldName="processUser"
          actionData={this.taxInvoiceOperationRecord} />,
      });
    },
    //基本信息
    getBasicColumns() {
      const fieldCodeList = [
        "settleNum",
        [
          "documentTypeMeaning",
          { fieldCode: "taxRate", visible: this.isInvoice },
        ],
        { fieldCode: "paymentTermName", visible: this.isInvoice },
        "createdUserName",
        "creationDate",
        "campMeaning",
      ];
      const columns = formatColumns(fieldCodeList, {
        takeFlag: true,
        rightTagRender: (_, item) => <StatusTag color="warn" text={item?.settleStatusMeaning} />,
      });
      return columns;
    },
    //交易方信息
    getTransactionColumns() {
      const fieldCodeList = [
        "currencyCode",
        "companyNum",
        "companyName",
        "supplierCompanyNum",
        "supplierCompanyName",
        "sourceSupplierCompanyName",
        "ouName",
      ];
      const columns = formatColumns(fieldCodeList, { takeFlag: true });
      return columns;
    },
    //汇总信息
    getSummaryColumns() {
      const fieldCodeList = [
        "settleNetAmount",
        [ "settleTaxAmount", "settleTaxIncludedAmount" ],
        "invoicedNetAmount",
        [ "invoicedTaxAmount", "invoicedTaxIncludedAmount" ],
        [ "paidAmount", "remainingPaymentAmount" ],
      ];
      const columns = formatColumns(fieldCodeList, { takeFlag: true });
      return columns;
    },
    getPrePayColumns() {
      const fieldCodeList = [
        "applyAmount",
        "prepaymentSpliteRuleMeaning",
        {
          fieldCode: "prepayWriteOff",
          fieldName: this.$T("ssta.purchaseSettle.button.prePayWriteOffRecord").$D("预付款核销记录"),
          render: () => <SrmButton
            plain
            onClick={() => this.showPrePayWriteOffRecord()}>
            {this.$T("hipspfm.common.button.view").$D("查看")}
          </SrmButton>,
        }
      ];
      const columns = formatColumns(fieldCodeList, { takeFlag: true });
      return columns;
    },
    getPaymentColumns() {
      const fieldCodeList = [
        "paymentAmount",
        "paymentSpliteRuleMeaning",
        {
          fieldCode: "paymentInfo",
          fieldName: this.$T("ssta.purchaseSettle.button.paymentInfo").$D("付款信息"),
          render: () => <SrmButton
            plain
            onClick={this.showPaymentDetail}>
            {this.$T("hipspfm.common.button.view").$D("查看")}
          </SrmButton>,
        },
        {
          fieldCode: "multiPaymentInfo",
          fieldName: this.$T("ssta.purchaseSettle.button.multiPaymentInfo").$D("多维度付款信息"),
          render: () => <SrmButton
            plain
            onClick={this.showMultiPaymentInfo}>
            {this.$T("hipspfm.common.button.view").$D("查看")}
          </SrmButton>,
        },
      ];
      const columns = formatColumns(fieldCodeList, { takeFlag: true });
      return columns;
    },
    //开票信息(系统)
    getSystemInvoiceColumns() {
      const fieldCodeList = [
        "netAmount",
        "taxAmount",
        "taxIncludedAmount",
      ];
      const columns = formatColumns(fieldCodeList, { takeFlag: true });
      return columns;
    },
    //发票匹配信息
    getInvoiceMatchColumns() {
      const fieldCodeList = [
        "invoiceNetAmount",
        [ "invoiceTaxAmount", "invoiceTaxIncludedAmount" ],
        "invoiceDifferenceAmount",
        "invoiceSpliteRule",
        {
          fieldCode: "taxInvoice",
          fieldName: this.$T("ssta.purchaseSettle.view.title.taxInvoice").$D("税务发票"),
          render: () => <SrmButton
            plain
            onClick={this.showTaxInvoice}>
            {this.$T("hipspfm.common.button.view").$D("查看")}
          </SrmButton>
        }
      ];
      const columns = formatColumns(fieldCodeList, { takeFlag: true });
      return columns;
    },
    //交易明细信息
    getTransactionDetailColumns(detailFlag) {
      const fieldCodeList = [
        "settleNum",
        "sourceSettleNumAndLineNum",
        [ "itemCode", "itemName" ],
        [
          { fieldCode: "quantity", visible: this.isInvoice },
          { fieldCode: "unitPriceBatch", visible: this.isInvoice },
        ],
        [
          { fieldCode: "netPrice", visible: this.isInvoice },
          { fieldCode: "netAmount", visible: this.isInvoice }
        ],
        [
          { fieldCode: "taxCode", visible: this.isInvoice },
          { fieldCode: "taxRate", visible: this.isInvoice }
        ],
        { fieldCode: "taxAmount", visible: this.isInvoice },
        { fieldCode: "taxIncludedPrice", visible: this.isInvoice },
        { fieldCode: "taxIncludedAmount", visible: this.isInvoice },
        { fieldCode: "settleMatchDimensionMeaning", visible: this.isInvoice },
        { fieldCode: "settleBasePriceMeaning", visible: this.isInvoice },
        { fieldCode: "enableQuantity", visible: this.isInvoice },
        { fieldCode: "orignPrice", visible: this.isInvoice },
        { fieldCode: "enableAmount", visible: this.isInvoice },
        { fieldCode: "invoicedAmount", },
        { fieldCode: "paidAmount", },
        { fieldCode: "remainingPaymentAmount", visible: this.isInvoice },
        { fieldCode: "adjustNetAmount", visible: this.isInvoice },
        { fieldCode: "adjustTaxAmount", visible: this.isInvoice },
        { fieldCode: "sourceSettleHeaderNum", visible: !this.isInvoice },
        { fieldCode: "paymentAmount", },
        { fieldCode: "applyAmount", },
        { fieldCode: "uom", visible: !this.isInvoice },
      ];
      const columns = formatColumns(fieldCodeList, { takeFlag: !detailFlag, endRow: 9, showTitle: true, dataSet: this.settleLineDataSet });
      const operationRow = [
        this.optPermissionMap.LINE_PREPAYMENT_VERIFICATION && {
          fieldCode: "prepayWriteOff",
          fieldName: this.$T("ssta.purchaseSettle.button.prePayWriteOffRecord").$D("预付款核销记录"),
          formRow: columns.length,
          formCol: 0,
          render: (_, item) => <SrmButton
            plain
            onClick={() => this.showPrePayWriteOffRecord({ settleLineId: item.settleLineId })}>
            {this.$T("hipspfm.common.button.view").$D("查看")}
          </SrmButton>,
        },
        {
          fieldCode: "viewDetail",
          fieldName: this.$T("smbl.common.view.seeDetail").$D("查看详情"),
          formRow: columns.length,
          formCol: 1,
          render: (_, item) => <SrmButton
            plain
            onClick={() => {
              this.$popup({
                showHeader: false,
                showClose: true,
                position: "right",
                showBack: false,
                content: <SettleLineDetail
                  settleId={item.settleId}
                  settleConfigNum={item.settleConfigNum}
                  showLinePayment={this.optPermissionMap.LINE_PAYMENT} />
              });
            }}>
            {this.$T("hipspfm.common.button.view").$D("查看")}
          </SrmButton>,
        },
      ];
      columns.push(...operationRow);
      return columns;
    },
    //主策略信息
    getMainStrategyColumns(detailFlag) {
      const fieldCodeList = [
        "settleConfigName",
        "settleConfigNum",
        "configVersionNumber",
        "confirmCollaborativeModeMeaning",
        "cancelCollaborativeModeMeaning",
        "confirmApproveMethodMeaning",
        "cancelApproveMethodMeaning",
        "invoiceMatchMeaning",
        { fieldCode: "invoiceToleranceRangeLower", visible: this.isInvoice },
        { fieldCode: "taxAmountTolLower", visible: this.isInvoice },
        { fieldCode: "taxAmountAdjustTolLower", visible: this.isInvoice },
        { fieldCode: "amountAdjustTolLower", visible: this.isInvoice },
        { fieldCode: "amountValidateLevelMeaning", visible: this.isInvoice },
        {
          fieldCode: "amountValidateAction",
          visible: this.isInvoice,
        },
        { fieldCode: "amountAdjustFlag", visible: this.isInvoice },
        { fieldCode: "amountAdjustTolLower", visible: this.isInvoice },
        { fieldCode: "taxAmountAdjustTolLower", visible: this.isInvoice },
        { fieldCode: "amountAdjustModeMeaning", visible: this.isInvoice },
        { fieldCode: "amountAdjustRuleMeaning", visible: this.isInvoice },
        { fieldCode: "defaultPaymentDimensionMeaning", },
        { fieldCode: "defaultPaymentSpliteRuleMeaning", },
        { fieldCode: "defaultPrepaymentSpliteRuleMeaning", },
        { fieldCode: "lineLimitQuantity", },
        { fieldCode: "prepaymentDimensionMeaning", },
        { fieldCode: "prepaymentCheckLevel", render: (val) => val && this.prePaymentCheckLevel[val] },
        {
          fieldCode: "prepaymentCheckPoint",
          render: (val) => val &&
            <SrmTagGroup tags={val.split(",").map((e) => this.prePaymentCheckPoint[e])} type="info" />
        },
        { fieldCode: "initSettleConfigNum", },
        { fieldCode: "initConfigVersionNumber", },
      ];
      const columns = formatColumns(fieldCodeList, { takeFlag: !detailFlag, showTitle: true });
      return columns;
    },
    //主策略信息详情
    showMainStrategyDetail() {
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content: <SrmForm
          customizeCode="SMBL.WORKFLOW.SETTLE_APPROVAL.MAIN_STRATEGY_INFO_DETAIL"
          style={{ padding: "0 15px" }}
          customizeType="detail"
          dataSet={this.settleHeaderDataSet}
          columns={this.getMainStrategyColumns(true)}
        />
      });
    },
    //其他信息
    getOtherColumns() {
      let cuxBasicInfoDetail = [];
      // 标准二开埋点
      if (this.over$getColumns && typeof this.over$getColumns === "function") {
        cuxBasicInfoDetail = this.over$getColumns();
      }
      const fieldCodeList = [
        "sourceSettleNum",
        "purOrganizationName",
        "termCode",
        "remark",
        "canceledReason",
        "approvedRemark",
        { fieldCode: "accountingDate", editor: !this.parameters.readonly }
      ];
      const columns = formatColumns(fieldCodeList, { takeFlag: true }).concat(cuxBasicInfoDetail);
      return columns;
    },
  }
};
</script>

<style scoped lang="stylus">
@import "~srm-mobile-ui/src/style/var.styl";
.srm-settle-submit-approval {
  >>> .srm-form {
    padding: 15px 15px;
    min-height: 60px;
    margin: 0;
  }
}

>>> .customize-item {
  .srm-button-plain {
    font-size: inherit;
    font-weight: inherit;
  }
}

>>> .customize-detail {
  .form-item {
    .srm-field-value {
      font-size: 14px;
    }
  }
}

>>> .srm-list-item-card-head-left {
  max-width 100% !important;
}

>>> .srm-history-record-content {
  min-height: auto;
}

.tab-item-button {
  display: flex;
  gap: 8px;
  font-weight: 500;

  .srm-icon {
    font-size: 20px;
    color: var(--font-color-disable);
  }
}

.srm-list-icon-search {
  font-weight normal;
  font-size: 20px;
  color: $srm-theme-color-primary;
}
.collapse-item {
  >>> .srm-collapse-title {
    background: var(--background-color-empty-tab-title);
  }
  .collapse-title {
    height: 54px;
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    color: var(--font-color-default);
    background: var(--background-color-empty-tab-title);
    width: 100%;
  }
  .collapse-title-flex {
    width: auto;
  }
  >>> .srm-collapse-content-active {
    max-height: 100%;
  }
}
.collapse-item-operation {
  >>> .srm-collapse-content-active {
    max-height: 100%;
  }
}
.slot-content {
  width: 100%;
}
.bottom-button-wrapper {
  height: calc(74px + env(safe-area-inset-bottom));
}
</style>
