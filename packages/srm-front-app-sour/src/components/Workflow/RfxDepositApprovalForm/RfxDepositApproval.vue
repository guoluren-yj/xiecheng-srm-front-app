<template>
  <div>
    <srm-scroll-tab>
      <!-- 基础信息 -->
      <srm-scroll-tab-item
        :label="
          $T('ssrc.inquiryHall.view.message.tab.baseInfos').$D('基础信息')
        ">
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          :data-set="basisDs"
          :columns="getBasisColumns"
          :customize-code="getCustomizeCode('basic')"/>
      </srm-scroll-tab-item>
      <!-- 保证金信息 -->
      <srm-scroll-tab-item
        class="deposit-tab"
        :label="
          $T('ssta.sourcingCost.view.message.tab.depositInfo').$D('保证金信息')
        ">
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          class="deposit-list"
          :data-set="depositDs"
          :columns="getDeposit1Columns"/>
        <div class="deposit-list-divider"/>
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          class="deposit-list"
          :data-set="depositDs"
          :columns="getDeposit2Columns"/>
        <div class="deposit-list-divider full"/>
        <div class="deposit3-list-wrapper">
          <srm-list
            :scrollable="false"
            height="auto"
            style="height: auto"
            class="deposit-list"
            :data-set="depositDs"
            :columns="getDeposit3Columns"/>
          <!-- <span class="pay-record-alert">
            <srm-tooltip :title="$T(
              &quot;ssta.sourcingCost.view.help.depositTransferredOtherDepositsAmount&quot;
            ).$D(&quot;保证金转其他保证金金额&quot;)" placement="top">
              <em class="srm-icon icon-alert-circle"/>
            </srm-tooltip>
          </span> -->
        </div>

        <div class="deposit-list-divider"/>
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          class="deposit-list"
          :data-set="depositDs"
          :columns="getDeposit4Columns"/>
      </srm-scroll-tab-item>
      <!-- 缴费记录 -->
      <srm-scroll-tab-item
        :label="
          $T('ssrc.inquiryHall.view.message.tab.payRecord').$D('缴费记录')
        ">
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          :data-set="payRecordDs"
          :columns="getPayRecordColumns"
          :customize-code="getCustomizeCode('payRecord')"/>
      </srm-scroll-tab-item>
      <!-- 转出记录 -->
      <srm-scroll-tab-item
        :label="
          $T('ssta.sourcingCost.view.title.transferOutRecord').$D('转出记录')
        ">
        <srm-list
          :scrollable="false"
          height="auto"
          style="height: auto"
          :data-set="transferOutRecordDs"
          :columns="getTransferOutRecordColumns"
          :customize-code="getCustomizeCode('transferOutRecord')"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>
<script>
import { isNil } from "lodash";
import { SrmMath } from "srm-mobile-ui";
import { getBasisInfoApi } from "./api";
import { queryDoubleUnit } from "@/utils/utils";
import {
  commonDs,
  depositDs,
  payRecordDs,
  getCustomizeCode,
  transferOutRecordDs,
} from "./datasource/ds";

import {
  DataSet,
  // SrmTooltip
} from "srm-mobile-ui";
export default {
  modules: [
    "ssta.common",
    "ssta.sourcingCost",
    "ssrc.projectSetup",
    "ssrc.bidHall",
    "ssrc.inquiryHall",
    "ssrc.common",
    "smbl.common",
  ],
  name: "RfxSourceProjectApproval",
  props: {
    parameters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      depositId: "", // 单据头id
      headerInfo: {}, // 单据头信息
      approvePoint: "",
      currencyCode: "",
      //   payOutAmount: this.headerInfo.paymentAmount,
      sectionItemPop: false,
      basisDs: new DataSet(commonDs()),
      depositDs: new DataSet(commonDs()),
      payRecordDs: new DataSet(commonDs()),
      syncRecordDs: new DataSet(commonDs()),
      transferOutRecordDs: new DataSet(commonDs()),
      doubleUnitFlag: false, // 判断是否开启双单位
      operationType: "DEPOSIT.DEPOSIT_OFFLINE_CONFIRM",
    };
  },
  computed: {
    // 基础信息
    getBasisColumns() {
      return [
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.depositNum"
          ).$D("保证金编号"),
          fieldType: "TEXT",
          fieldCode: "depositNum",
        },
        this.operationType === "DEPOSIT.DEPOSIT_RETURN_SUPPLIER" && {
          fieldName: this.$T(
            "ssta.sourcingCost.view.message.return.deposit-amount"
          ).$D("本次退回保证金金额"),
          fieldCode: "operationAmount",
          //   style="fontSize: 16px; fontWeight: bold"
          render: (val, record) => !isNil(val) ? <span>- {this.formatNumber(Number(val).toFixed(record.amountPrecision || 2))}  {this.currencyCode}</span> : "-",
        },
        this.operationType === "DEPOSIT.DEPOSIT_OFFLINE_CONFIRM" && {
          fieldName: this.$T(
            "ssta.sourcingCost.view.message.paid.deposit-amount"
          ).$D("本次缴纳保证金金额"),
          fieldType: "TEXT",
          fieldCode: "operationAmount",
          render: (val, record) => val ? <span> {this.formatNumber(Number(val).toFixed(record.amountPrecision || 2))}  {this.currencyCode}</span> : "-",
        },
        this.operationType === "DEPOSIT.DEPOSIT_TRANSFER_DEPOSIT" && {
          fieldName: this.$T(
            "ssta.sourcingCost.view.message.transfer.deposit-amount"
          ).$D("本次转入保证金金额"),
          fieldType: "TEXT",
          fieldCode: "operationAmount",
          render: (val, record) => val ? <span> {this.formatNumber(Number(val).toFixed(record.amountPrecision || 2))}  {this.currencyCode}</span> : "-",
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.purchaser-company"
          ).$D("采购方公司"),
          fieldType: "TEXT",
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T(
            "ssta.common.model.common.supplierName"
          ).$D("供应商"),
          fieldType: "TEXT",
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("ssta.sourcingCost.model.sourcingCost.sourceDocumentInfo").$D(
            "关联寻源单信息"
          ),
          fieldType: "TEXT",
          fieldCode: "sourceDocumentTitle",
          render: (val, record) => `${val}- ${record.sourceDocumentNum}`,
        },
        {
          fieldName: this.$T("ssta.sourcingCost.model.sourcingCost.remark").$D(
            "备注"
          ),
          fieldType: "TEXT",
          fieldCode: "operationRemark",
        },
      ];
    },
    // 保证金信息
    getDeposit1Columns() {
      return [
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.depositAmount"
          ).$D("保证金金额"),
          fieldType: "TEXT",
          fieldCode: "amount",
          render: this.amountRender,
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.depositPaidAmount"
          ).$D("保证金已缴纳金额"),
          fieldType: "TEXT",
          fieldCode: "paidAmount",
          render: (val, item) => this.amountRender(val, item, { prefix: "-" }),
        },
      ];
    },
    getDeposit2Columns() {
      return [
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.depositRemainingPayAmount"
          ).$D("保证金剩余缴纳金额"),
          fieldType: "TEXT",
          fieldCode: "remainingPaymentAmount",
          render: (val, item) => <span style={{ fontSize:"18px", fontWight:500 }}>{this.amountRender(val, item)}</span>,
        },
      ];
    },
    getDeposit3Columns() {
      return [
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.depositPaidAmount"
          ).$D("保证金已缴纳金额"),
          fieldType: "TEXT",
          fieldCode: "paidAmount",
          render: this.amountRender,
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.depositPayForServerAmount"
          ).$D("保证金缴纳服务费金额"),
          fieldType: "TEXT",
          fieldCode: "payForServerAmount",
          render: (val, item) => this.amountRender(val, item, { prefix: "-" }),
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.depositReturnedAmountAmount"
          ).$D("保证金已退回金额"),
          fieldType: "TEXT",
          fieldCode: "returnAmount",
          render: (val, item) => this.amountRender(val, item, { prefix: "-" }),
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.depositTransferOutAmount"
          ).$D("保证金转出金额"),
          fieldType: "TEXT",
          fieldCode: "payOutAmount",
          render: (val, item) => this.amountRender(val, item, { prefix: "-" })
        },
      ];
    },
    getDeposit4Columns() {
      return [
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.depositRemainingReturnableAmount"
          ).$D("保证金剩余可退回金额"),
          fieldType: "TEXT",
          fieldCode: "remainingRefundableAmount",
          render: (val, item) => <span style={{ fontSize:"18px", fontWight:500 }}>{this.amountRender(val, item)}</span>,
        },
      ];
    },
    // 缴费记录
    getPayRecordColumns() {
      return [
        {
          fieldType: "EMPTY",
          formRow: 10,
          formCol: 10,
          fieldCode: "paymentAmount",
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              <span style={{ fontWeight: 600 }}>{ this.amountRender(val, record) }</span>
              <span slot="right" style={{ maxWidth:"150px" }}>
                {this.renderPayStatusTag(val, record)}
              </span>
            </SrmListHeader>
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.lineNum"
          ).$D("行号"),
          fieldType: "TEXT",
          fieldCode: "lineNum",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.depositNum"
          ).$D("保证金编号"),
          fieldType: "TEXT",
          fieldCode: "depositNum",
          formRow: 30,
          formCol: 10,
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.paymentType"
          ).$D("支付类型"),
          fieldType: "TEXT",
          fieldCode: "paymentCategory",
          //   render: this.renderPayTypeTag,
          render:  (_, item) => item.paymentCategoryMeaning || "-",
          formRow: 40,
          formCol: 10,
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.paymentMethod"
          ).$D("支付方式"),
          fieldType: "TEXT",
          fieldCode: "paymentModeMeaning",
          formRow: 40,
          formCol: 20,
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.paymentTime"
          ).$D("支付时间"),
          fieldType: "TEXT",
          fieldCode: "paymentDate",
          formRow: 50,
          formCol: 10,
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.purchaserConfirmByName"
          ).$D("采购方确认人"),
          fieldType: "TEXT",
          fieldCode: "purchaserConfirmByName",
          formRow: 60,
          formCol: 10,
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.sourceDepositNumAndLineNum"
          ).$D("来源保证金编号-行号"),
          fieldType: "TEXT",
          fieldCode: "transferDepositNumAndLineNum",
          formRow: 70,
          formCol: 10,
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.initiatorCamp"
          ).$D("发起方阵营"),
          fieldType: "TEXT",
          fieldCode: "initiateCamp",
          formRow: 80,
          formCol: 10,
          render:  (_, item) => item.initiateCampMeaning || "-",
        },
      ];
    },
    // 转出记录
    getTransferOutRecordColumns() {
      return [
        {
          fieldType: "EMPTY",
          formRow: 0,
          render: (val, record) =>
            <SrmListHeader showOpenTag={false}>
              <span style={{ fontWeight: 600 }}>{ record.transferAmount }</span>
              <span slot="right" style={{ maxWidth:"150px" }}>
                {this.renderTransferOutTag(val, record)}
              </span>
            </SrmListHeader>
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.lineNum"
          ).$D("行号"),
          fieldType: "TEXT",
          fieldCode: "lineNum",
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.depositNum"
          ).$D("保证金编号"),
          fieldType: "TEXT",
          fieldCode: "depositNum",
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.transferOutDocumentType"
          ).$D("转出单据类型"),
          fieldType: "TEXT",
          fieldCode: "transferTypeMeaning",
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.transferOutType"
          ).$D("转出类型"),
          fieldType: "TEXT",
          fieldCode: "type",
          render: (_, item) => item.typeMeaning || "-",
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.transferOutTime"
          ).$D("转出时间"),
          fieldType: "TEXT",
          fieldCode: "transferDate",
        },
        {
          fieldName: this.$T(
            "ssta.sourcingCost.model.sourcingCost.associateDocumentNumAndLineNum"
          ).$D("关联单据编号-行号"),
          fieldType: "TEXT",
          fieldCode: "associateNumAndLineNum",
        },
      ];
    },
  },
  async mounted() {
    this.doubleUnitFlag = await queryDoubleUnit({
      businessModule: "RFX",
    });
    this.depositId = this.parameters.depositId;
    this.getBasisInfo(this.depositId);
    this.payRecordDs = new DataSet(payRecordDs(this.depositId));
    this.payRecordDs.refresh().finally(() => {
      setTimeout(() => {
        this.removeChineseColon();
      }, 1);
    });
    this.transferOutRecordDs = new DataSet(transferOutRecordDs(this.depositId));
    this.transferOutRecordDs.refresh();
    // this.depositDs.totalCount = 17;
  },
  methods: {
    // 获取基础信息
    getBasisInfo(depositId) {
      // console.log("this.param", this.parameters);
      getBasisInfoApi({
        depositId,
        approvePoint: this.parameters.approvePoint,
        workflowBatch: this.parameters.workflowBatch,
        // customizeUnitCode: "SMBL.WORKFLOW.RFX_DEPOSIT.BASIC_INFO",
      }).then((res = {}) => {
        this.header = res || {};
        this.currencyCode = res.currencyCode;
        this.operationType = res.operationType || "DEPOSIT.DEPOSIT_OFFLINE_CONFIRM";
        this.basisDs.setData([ { ...res } ] || []);
        this.depositDs = new DataSet(depositDs());
        this.depositDs.setData([ { ...res } ] || []);
        this.depositDs.totalCount = 0;
      });
    },
    getCustomizeCode,
    // 千分位处理
    formatNumber(value) {
      if (SrmMath.isZero(value)) {
        return 0;
      }
      if (typeof value !== "undefined" && typeof value !== "object") {
        const strValue = String(value);
        const parts = strValue.split(".");
        // 处理整数部分，添加千位分隔符
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // 如果有小数部分，拼接小数部分；否则只返回整数部分
        return parts.length > 1 ? parts.join(".") : parts[0];
      }
      return value;
    },
    // 金额字段渲染
    amountRender(val, item, options) {
      const { prefix } = options || {};
      const str = !isNil(val) ? <span> {this.formatNumber(Number(val).toFixed(item.amountPrecision || 2))} </span> : "-";
      if (prefix) {
        return <span>{prefix} {str}</span>;
      }
      return str;
    },
    // 支付记录状态标签
    renderPayStatusTag(val, item) {
      const statusMap = {
        "EFFECTIVE":"success",
        "APPROVING":"warn",
        "EXTERNAL_SYSTEM_REFUNDING":"warn",
        "APPROVE_INVALID":"info",
        "EXTERNAL_SYSTEM_INVALID":"info",
      };
      return <srm-tooltip title={item.depositPayRecordStatusMeaning} placement="top">
        <SrmTag size="mid" type={statusMap[item.depositPayRecordStatus] || "primary"}>{item.depositPayRecordStatusMeaning}</SrmTag>
      </srm-tooltip>;
    },
    // 支付记录状态标签
    renderPayTypeTag(val, item) {
      const statusMap = {
        "PAY": "success",
        "REFUND": "warn",
      };
      return <SrmTag size="mid" type={statusMap[item.paymentCategory] || "primary"}>{item.paymentCategoryMeaning}</SrmTag>;
    },
    // 支付记录状态标签
    renderTransferOutTag(val, item) {
      const statusMap = {
        "EFFECTIVE":"success",
        "APPROVING":"warn",
        "EXTERNAL_SYSTEM_REFUNDING":"warn",
        "APPROVE_INVALID":"info",
        "EXTERNAL_SYSTEM_INVALID":"info",
      };
      return <srm-tooltip title={item.depositTransferRecordStatusMeaning} placement="top">
        <SrmTag size="mid" type={statusMap[item.depositTransferRecordStatus] || "primary"}>{item.depositTransferRecordStatusMeaning}</SrmTag>
      </srm-tooltip>;
    },
    // 移除多余分号
    removeChineseColon() {
      this.$nextTick(() => {
        const nodeList = document.querySelectorAll(".deposit-tab .srm-text-prefix > span") || [];
        // console.log("dom", nodeList);
        if (nodeList.length > 0) {
          nodeList.forEach(function(el) {
            el.innerHTML = el.innerHTML.replace(":", " ");
          });
        } else {
          console.log("No matching elements found");
        }

      });
    }
  },
};
</script>

<style lang="stylus" scoped>
.deposit-list {
    >>> .srm-list-item-card {
        border-bottom: none !important;
        .srm-field-wrapper {
            justify-content: space-between !important;
                .srm-text {
                    flex: initial;
            }
        }
    }
}
.deposit-list-divider {
    margin: 0 4vw;
    border-bottom: 1px solid var(--background-color-empty-second);
    &.full {
        margin: 0vw;
        border-bottom-width: 1vw;
    }
}
.deposit3-list-wrapper {
    position: relative;
    .pay-record-alert {
        position: absolute;
        left: 31.4vw;
        bottom: 4.667vw;
    }
}

</style>