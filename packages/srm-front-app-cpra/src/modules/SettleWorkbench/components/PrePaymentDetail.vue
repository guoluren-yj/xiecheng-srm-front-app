<template>
  <div>
    <srm-scroll-tab>
      <ai-tip-section
        v-if="role === 'purchaser' && aiApproveStatus"
        :ai-approve-status="aiApproveStatus"
        :ai-review-params="aiReviewParams" />
      <srm-scroll-tab-item
        :label="$T('ssta.purchaseSettle.view.title.basicInfo').$D('基本信息')">
        <div @click="openDetailPop('info')">
          <srm-form :data-set="headerDs" :columns="getBasicInfoColumns" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('ssta.purchaseSettle.view.title.paymentInfo').$D('付款信息')">
        <div @click="openDetailPop('pay')">
          <srm-form :data-set="headerDs" :columns="getPayInfoColumns" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :show-title="false"
        :label="
          $T('ssta.purchaseSettle.view.title.settleDetailInfo').$D('结算明细信息')
        ">
        <srm-flex class="srm-scroll-tab-item-title" justify="between">
          {{ $T("ssta.purchaseSettle.view.title.settleDetailInfo").$D("结算明细信息") }}
          <span
            class="srm-icon icon-filter srm-list-icon-search"
            @click="showFilter = true"/>
        </srm-flex>
        <srm-filter v-model="showFilter" :data-set="lineDs" />
        <srm-list
          :scrollable="false"
          :data-set="lineDs"
          :columns="getListColumns"
          @itemClick="() => onItemClick()"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('ssta.purchaseSettle.view.title.otherInfo').$D('其他信息')">
        <srm-form
          show-default-detail
          :data-set="headerDs"
          :columns="getOtherInfoColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('hzero.common.view.title.attachment').$D('附件')">
        <attachment-info :data-set="headerDs" directory="ssta-prepayment"/>
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
      <div :class="type === 'APPROVE' ? 'bottom-button-space-approve': 'bottom-button-space'" />
    </srm-scroll-tab>
    <srm-bottom-handler v-if="type === 'APPROVE'" class="bottom-button-wrapper" :btn-arr="getBtnArr" type="action-sheet"/>
    <srm-popup width="100%" height="70%" show-back :visible="showPopup" :title="$T('ssta.purchaseSettle.view.title.approveInfo').$D('审核信息')" @onClose="closePopup">
      <div class="srm-confirm">
        <srm-form
          :data-set="headerDs"
          :columns="getCheckColumns"
          customize-type="detail"/>
        <srm-flex class="srm-confirm-footer">
          <touch-feedback active-class-name="srm-confirm-footer-button-active">
            <srm-flex-item class="srm-confirm-footer-cancel" flex="1" @click.native.stop="closePopup">{{ $T("smbl.common.button.cancel").$D("取消") }}</srm-flex-item>
          </touch-feedback>
          <touch-feedback active-class-name="srm-confirm-footer-button-active">
            <srm-flex-item class="srm-confirm-footer-ok" :class="{'srm-confirm-footer-return': popupType === 'return' }" flex="1" @click.native.stop="submitCheck">{{ popupType === 'approve' ? $T("hzero.common.button.confirm").$D("确认") : $T("hzero.common.button.return").$D("退回") }}</srm-flex-item>
          </touch-feedback>
        </srm-flex>
      </div>
    </srm-popup>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { $T, SrmUtil } from "srm-mobile-ui";
import { isUndefined, fromPairs } from "lodash";
import { hxDS } from "../datasource/purchasePrePaymentDetailDS";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
import StatusTag from "@/components/StatusTag";
import AttachmentInfo from "./AttachmentInfo";
import AiTipSection from "@/components/AiTipSection/AiTipSection.vue";
import { queryIdpValue, queryHistoryRecords, queryApproveRecords, confirmPrepayment, returnPrepayment, confirmPrepaymentSup, returnPrepaymentSup } from "../api";

const baseCode = {
  "purchaser": "SMBL.PURCHASE_SETTLE.PRE_BASIC",
  "supplier": "SMBL.SUPPLY_SETTLE.PRE_BASIC_INFO",
};
const payCode = {
  "purchaser": "SMBL.PURCHASE_SETTLE.PRE_PAYMENT_INFO",
  "supplier": "SMBL.SUPPLY_SETTLE.PRE_PAYMENT_INFO",
};
const lineCode = {
  "purchaser": "SMBL.PURCHASE_SETTLE.PRE_TRANSACTIONDETAIL",
  "supplier": "SMBL.SUPPLY_SETTLE.PRE_TRANSACTIONDETAIL",
};
const otherCode = {
  "purchaser": "SMBL.PURCHASE_SETTLE.OTHER_INFO_PRE",
  "supplier": "SMBL.SUPPLY_SETTLE.PRE_PAYMENT_OTHER_INFO",
};
const checkCode = {
  "purchaser": {
    "approve": "SMBL.PURCHASE_SETTLE.PRE_CONFIRM",
    "return": "SMBL.PURCHASE_SETTLE.PRE_RETURN"
  },
  "supplier": {
    "approve": "SMBL.SUPPLY_SETTLE.PRE_CONFIRM",
    "return": "SMBL.SUPPLY_SETTLE.PRE_RETURN"
  },
};

export default {
  modules: [ "ssta.purchaseSettle", "ssta.purchaseInvoicePool", "smbl.common", "hzero.common", "ssta.common", "ssta.purchaseSettlePool", "hipspfm.common", "hipspfm.workFlow" ],
  components: { HistoryRecordTiled, AttachmentInfo, AiTipSection },
  props: {
    headerDs: DataSet,
    lineDs: DataSet,
    approveDs: DataSet,
    role: {
      type: String,
      default: "purchaser",
    },
  },
  data() {
    return {
      showPopup: false,
      showFilter: false,
      popupType: "approve", // approve通过，return退回
      historyData: [],
      approveData: [],
      settleStatusTypeObj: {},
      headerInfo: {},
      hxDs: null,
      settleStatus: "",
      aiApproveStatus: "",
      aiReviewParams: null,
      ...this.$route.query,
    };
  },
  computed: {
    getBasicInfoColumns() {
      return [
        {
          fieldCode: "settleNum",
          fieldType: "EMPTY",
          formRow: 1,
          render: (value, record) => {
            const { settleStatus, settleStatusMeaning } = record;
            return (
              <SrmListHeader>
                <span>{value}</span>
                <StatusTag
                  slot="right"
                  text={settleStatusMeaning}
                  color={this.settleStatusTypeObj[settleStatus]}
                />
              </SrmListHeader>
            );
          },
        },
        { formRow: 10, formCol: 10, fieldCode: "settleTypeMeaning", },
        { formRow: 10, formCol: 20, fieldCode: "currencyCode", },
        { formRow: 20, fieldCode: "companyNum", },
        { formRow: 30, fieldCode: "companyName" },
        { formRow: 40, fieldCode: "supplierCompanyNum" },
        { formRow: 50, fieldCode: "supplierCompanyName" },
        { formRow: 60, formCol: 10, fieldCode: "createdUserName" },
        { formRow: 60, formCol: 20, fieldCode: "creationDate" },
      ];
    },
    getPayInfoColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "prepaymentAmount",
          fieldType: "EMPTY",
          render: (val, record) =>
            <SrmListHeader>
              {$T(
                "ssta.purchaseSettle.model.purchaseSettle.prepaymentAmount"
              ).$D("预付款总金额")}
              ：{SrmUtil.getNumberLocalized(val, record.amountPrecision)}
            </SrmListHeader>
          ,
        },
        { formRow: 20, fieldCode: "bankName" },
        { formRow: 30, fieldCode: "bankBranchName" },
        { formRow: 40, fieldCode: "bankAccountNum" },
        { formRow: 50, fieldCode: "expectPaymentDate" },
      ];
    },
    getOtherInfoColumns() {
      return [
        {
          formRow: 10,
          fieldCode: "settleNum",
          fieldType: "EMPTY",
          render: (val) => <SrmListHeader>{val}</SrmListHeader>,
        },
        { formRow: 20, fieldCode: "confirmCollaborativeModeMeaning" },
        { formRow: 30, fieldCode: "confirmApproveMethodMeaning" },
        { formRow: 40, fieldCode: "cancelCollaborativeModeMeaning" },
        { formRow: 50, fieldCode: "cancelApproveMethodMeaning" },
      ];
    },
    getListColumns() {
      const settleStatus = this.headerDs.current?.get("settleStatus");
      return [
        { fieldCode: "lineNum", fieldType: "EMPTY", render: (val) =>
          <SrmListHeader>
            {$T(
              "ssta.purchaseSettle.model.purchaseSettle.lineNum"
            ).$D("结算单行号")}
              ：{val}
          </SrmListHeader>
          , },
        { fieldCode: "prepaymentAmount", },
        { fieldCode: "associateAmount", },
        { fieldCode: "prepaymentApplyAmount", },
        settleStatus !== "NEW" && { fieldCode: "operate", render: (_, item) =>
          <div style="color: var(--font-color-primary)" onClick={(e) => {
            e.stopPropagation();
            this.showWriteOffRecord(item);
          }}>
            {this.$T("ssta.common.view.title.writeOffRecord").$D("核销记录")}
          </div>
          , },
      ].filter((v) => v);
    },
    getBtnArr() {
      if (this.type !== "APPROVE") {
        return [];
      }
      return [
        {
          fill: true,
          type: "danger",
          title: this.$T("hzero.common.button.return").$D("退回"),
          handler: this.handleReturn,
        },
        {
          fill: true,
          type: "primary",
          title: this.$T("hzero.common.button.confirm").$D("确认"),
          handler: this.handleConfirm,
        },
      ];
    },
    getCheckColumns() {
      const settleStatus = this.headerDs.current?.get("settleStatus");
      return this.role === "supplier" ? [
        { fieldCode: "approvedRemark", fieldType: "INPUT", editor: true, visible: [ "SUBMITED", "SUBMITED_APPROVING" ].includes(settleStatus) },
        { fieldCode: "canceledRemark", fieldType: "INPUT", editor: true, visible: [ "CANCELING", "CANCEL_APPROVING" ].includes(settleStatus) },
        { fieldCode: "supplierApprovedRemark", fieldType: "INPUT", editor: true, visible: [ "WAIT_SUPPLIER_CONFIRM" ].includes(settleStatus) },
        { fieldCode: "supplierCanceledRemark", fieldType: "INPUT", editor: true, visible: [ "WAIT_SUPPLIER_CANCEL" ].includes(settleStatus) }
      ] : [
        { fieldCode: "approvedRemark", fieldType: "INPUT", editor: true, visible: [ "SUBMITED", "SUBMITED_APPROVING" ].includes(settleStatus) },
        { fieldCode: "canceledRemark", fieldType: "INPUT", editor: true, visible: [ "CANCELING", "CANCEL_APPROVING" ].includes(settleStatus) },
      ];
    },
    // 核销金额columns
    getHxColumns() {
      return [ { fieldCode: "settleTransactionNum", fieldType: "EMPTY", render: (val) =>
        <SrmListHeader>
          {$T("hzero.common.components.operationAudit.settleTransactionNum").$D("结算事务编号")}
              ：{val}
        </SrmListHeader>
        , },
      { fieldCode: "settleNum", },
      { fieldCode: "lineNum", },
      { fieldCode: "applyAmount", },
      { fieldCode: "settleStatusMeaning", }, ];
    },
  },
  created() {
    this.initDataSet();
    this.fetchLookupData();
    this.fetchHistoryRecords();
    this.fetchApproveRecords();
  },
  methods: {
    async initDataSet() {
      await this.headerDs.refresh();
      const { aiApproveStatus = "", searchDetailParams = null } = this.headerDs.current?.get("sstaAiApproveResult") || {};
      this.aiApproveStatus = aiApproveStatus;
      this.aiReviewParams = searchDetailParams;
    },
    handleConfirm() {
      this.popupType = "approve";
      this.showPopup = true;
    },
    handleReturn() {
      this.popupType = "return";
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
    },
    // 审核退回或确认点击提交
    async submitCheck() {
      const data = this.headerDs.current?.toData();
      let res = null;
      const { popupType } = this;
      this.$loading.show();
      if (popupType === "approve") {
        const requestFun = this.role === "supplier" ? confirmPrepaymentSup : confirmPrepayment;
        res = await requestFun([ data ]);
      } else {
        const requestFun = this.role === "supplier" ? returnPrepaymentSup : returnPrepayment;
        await requestFun([ data ]);
      }
      this.$loading.hide();
      if (res && res.failed) {
        this.$notification.open({
          message: res.message,
          duration: 3000,
        });
      } else {
        this.$notification.open({
          message: this.$T("hzero.common.notification.success").$D("操作成功"),
          duration: 1000,
        });
        this.closePopup();
        this.$router.back();
      }
    },
    async fetchLookupData() {
      const res = await queryIdpValue("SSTA.SETTLE_STATUS").catch((err) => {
        throw err;
      });
      if (res && !res.failed) {
        this.settleStatusTypeObj = fromPairs(
          res.map(({ value, tag } = {}) => [ value, tag ])
        );
      }
    },
    async openDetailPop(type) {
      const { fields = [] } = this.headerDs || {};
      const detailColumns = fields.filter((v) => v.type === type);
      this.$popup({
        position:"right",
        content:
          <SrmForm
            customizeType="detail"
            dataSet={this.headerDs}
            columns={detailColumns}
          />
        ,
      });
    },
    // 点击核销记录
    showWriteOffRecord(item) {
      this.hxDs = new DataSet(hxDS(item.prepaymentLineId));
      this.$popup({
        title: this.$T("ssta.common.view.title.writeOffRecord").$D("核销记录"),
        showHeader: true,
        showClose: true,
        rounded: true,
        height: "80vh",
        content: <srm-list data-set={this.hxDs} columns={this.getHxColumns} onItemClick={this.detailWriteOffRecord} />,
      });
      this.hxDs.query();
    },
    detailWriteOffRecord() {
      this.$popup({
        showHeader: false,
        showClose: true,
        rounded: true,
        height: "80vh",
        content: <SrmForm data-set={this.hxDs} columns={this.getHxColumns} />,
      });
    },
    linkAssociateDoc(item) {
      const { associateId } = item || {};
      const { jumpPoFlag, prepaymentType } = this.headerDs.current?.toData() || {};
      if ([ "PO_LINE", "ORDER" ].includes(prepaymentType)) {
        // jumpPoFlag === 1 我发出的订单 === 2 订单工作台
        if (jumpPoFlag === 1) {
          if (this.role === "purchaser") {
            this.$router.push({
              path: "/MyOrderDetail",
              query: { poHeaderId: associateId },
            });
          } else if (this.role === "supplier") {
            this.$router.push({
              path: "/MyReceiveOrderDetail",
              query: { poHeaderId: associateId },
            });
          }
        } else if (this.role === "purchaser") {
          this.$router.push({
            path: "/OrderWorkbenchDetail/All",
            query: { poHeaderId: associateId },
          });
        } else if (this.role === "supplier") {
          this.$router.push({
            path: "/SellerOrderWorkbenchDetail",
            query: { poHeaderId: associateId, type: "all" },
          });
        }
      } else if ([ "CONTRACT", "CONTRACT_STAGE", "CONTRACT_SUBJECT" ].includes(prepaymentType)) {
        this.$router.push({
          path: "/appSour/ContractDetail",
          query: { pcHeaderId: associateId },
        });
      }
    },
    onItemClick() {
      const { jumpPoFlag, jumpPcFlag, prepaymentType } = this.headerDs.current?.toData() || {};
      const filterField = {
        associateNum: ![ "PO_LINE", "CONTRACT_STAGE", "CONTRACT_SUBJECT" ].includes(prepaymentType),
        associateNumAndLineNum: [ "PO_LINE", "CONTRACT_STAGE", "CONTRACT_SUBJECT" ].includes(prepaymentType),
        itemName: [ "PO_LINE" ].includes(prepaymentType),
        quantity: [ "PO_LINE" ].includes(prepaymentType),
        taxIncludedLineAmount: [ "PO_LINE" ].includes(prepaymentType),
        lineAmount: [ "PO_LINE" ].includes(prepaymentType),
        categoryName: [ "PO_LINE" ].includes(prepaymentType),
        poCreatedName: [ "PO_LINE" ].includes(prepaymentType),
        poCreationDate: [ "PO_LINE" ].includes(prepaymentType),
        operate: false,
      };
      const { fields = [] } = this.lineDs || {};
      const jumpFlag =
        [ "PO_LINE", "ORDER" ].includes(prepaymentType) && jumpPoFlag ||
        [ "CONTRACT", "CONTRACT_STAGE", "CONTRACT_SUBJECT" ].includes(prepaymentType) && jumpPcFlag;
      const detailColumns = fields
        .filter((v) => isUndefined(filterField[v.fieldCode]) || filterField[v.fieldCode])
        .map((v) => {
          if ([ "associateNum", "associateNumAndLineNum" ].includes(v.fieldCode)) {
            v.render = (val, item) => {
              const text = v.fieldCode === "associateNum" ? val : `${item.associateNum}-${item.associateLineNum}`;
              return jumpFlag ?
                <SrmButton
                  plain
                  onClick={() => {
                    this.linkAssociateDoc(item);
                  }}
                >
                  {text}
                </SrmButton> :
                text;
            };
          }
          return v;
        });
      this.$popup({
        position:"right",
        content:
          <SrmForm
            customizeType="detail"
            dataSet={this.lineDs}
            columns={detailColumns}
          />
        ,
      });
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
      if (res) {
        this.approveData = Object.values(res).reduce((total, item = []) => item.reduce((_, childItem = {}) => total.concat(childItem.historicTaskExtList || []), []), []);
      }
    },
    getCode(type) {
      let code = "";
      switch (type) {
      case "info":
        code = baseCode[this.role];
        break;
      case "pay":
        code = payCode[this.role];
        break;
      case "line":
        code = lineCode[this.role];
        break;
      case "other":
        code = otherCode[this.role];
        break;
      case "check":
        code = checkCode[this.role][this.popupType];
        break;
      default:
        break;
      }
      return code;
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

.srm-confirm {
  position: relative;
  width: 100%;
  height: 100%;
}

.srm-confirm-footer {
  position: absolute;
  bottom: 0;
  border-top: 1px solid var(--color-border-default);
  .srm-flex-item {
    height: 56px;
    line-height: 56px;
    text-align: center;
  }
}

.srm-confirm-footer-cancel {
  color: var(--color-font-default-b);
}

.srm-confirm-footer-ok {
  background: var(--color-other-default-b);
  color: #ffffff;
}

.srm-confirm-footer-return {
  background: var(--color-other-default);
}

.srm-confirm-footer-button-active {
  background #eee;
}
.bottom-button-space-approve {
  height: calc(105px + env(safe-area-inset-bottom));
  background: var(--background-color-empty-second);
}
.bottom-button-space {
  height: calc(32px + env(safe-area-inset-bottom));
  background: var(--background-color-empty-second);
}
.bottom-button-wrapper {
  height: calc(74px + env(safe-area-inset-bottom));
}
</style>
