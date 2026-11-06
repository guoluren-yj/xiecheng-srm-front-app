<template>
  <div class="srm-payment-doc-approval">
    <srm-scroll-tab customize-code="SMBL.WORKFLOW.PAY_DOC_APPROVAL.COLLAPSE">
      <srm-scroll-tab-item code="basic" :label="tlsMap.basic">
        <srm-form
          :customize-code="mblUnitCodeMap.basic"
          :data-set="headerDs"
          :columns="getColumnsFuncMap.basic()"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="paymentLine" :label="tlsMap.paymentLine">
        <srm-list
          :customize-code="mblUnitCodeMap.paymentLine"
          :data-set="paymentLineDs"
          :columns="getColumnsFuncMap.paymentLine()"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="!hiddenStatementFlag" code="statementLine" :label="tlsMap.statementLine">
        <statement-line :data-set="statementLineDs" :pay-form="payForm" />
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="!hiddenStatementFlag" code="matchLine" :label="tlsMap.matchLine">
        <srm-list
          :customize-code="mblUnitCodeMap.matchLine"
          :data-set="matchLineDs"
          :columns="getColumnsFuncMap.matchLine()"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item v-if="payForm === 'BANK_CORPORATE_EXPRESS'" code="bepResult" :label="tlsMap.bepResult">
        <srm-list
          :customize-code="mblUnitCodeMap.bepResult"
          :data-set="bepResultDs"
          :columns="getColumnsFuncMap.bepResult()"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="attachment" :label="tlsMap.attachment">
        <srm-form
          :row-col-to-seq="true"
          class="attachment-form"
          :customize-code="mblUnitCodeMap.attachment"
          :data-set="headerDs"
          :columns="getColumnsFuncMap.attachment()"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item code="operationRecord" :label="tlsMap.operationRecord">
        <history-record-tiled
          :action-data="operationData"
          operation-meaning-field-name="processStatusMeaning"
          process-remark-field-name="processRemark"
          operator-field-name="processUserName"
          process-date-field-name="processDate"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { get, isNil, fromPairs } from "lodash";
import { DataSet } from "srm-mobile-ui";
import { formatColumns } from "./utils";
import StatusTag from "../../StatusTag";
import { queryMapIdpValue, queryOperationRecords } from "./api";
import headerDS from "./datasource/headerDS";
import paymentLineDS from "./datasource/paymentLineDS";
import statementLineDS from "./datasource/statementLineDS";
import matchLineDS from "./datasource/matchLineDS";
import bepResultDS from "./datasource/bepResultDS";
import StatementLine from "./components/StatementLine";
import PaymentLineDetail from "./components/PaymentLineDetail";
import HistoryRecordTiled from "@/components/HistoryRecordTiled";
export default {
  name: "PayDocApproval",
  modules: [ "hzero.common", "sbsm.common", "sbsm.paymentWorkbench", "sbsm.paymentPool", "smbl.common" ],
  components: {
    StatementLine,
    HistoryRecordTiled,
  },
  props: {
    parameters: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const { payHeaderId } = this.parameters;
    return {
      lookupDataMap: {},
      payForm: "",
      hiddenStatementFlag: true,
      headerDs: new DataSet({
        ...headerDS(payHeaderId),
        events: {
          afterQuery: this.afterHeaderQuery
        },
      }),
      paymentLineDs: new DataSet(paymentLineDS(payHeaderId)),
      statementLineDs: new DataSet(statementLineDS(payHeaderId)),
      matchLineDs: new DataSet(matchLineDS(payHeaderId)),
      bepResultDs: new DataSet(bepResultDS(payHeaderId)),
      operationData: [],
      mblUnitCodeMap: {
        basic: "SMBL.WORKFLOW.PAY_DOC_APPROVAL.BASIC",
        paymentLine: "SMBL.WORKFLOW.PAY_DOC_APPROVAL.PAYMENT_LINE",
        matchLine: "SMBL.WORKFLOW.PAY_DOC_APPROVAL.MATCH_LINE",
        bepResult: "SMBL.WORKFLOW.PAY_DOC_APPROVAL.BEP_RESULT",
        attachment: "SMBL.WORKFLOW.PAY_DOC_APPROVAL.ATTACHMENT",
      },
    };
  },
  computed: {
    tlsMap() {
      return {
        basic: this.$T("sbsm.common.view.title.basicInfo").$D("基础信息"),
        paymentLine: this.$T("sbsm.common.view.title.paymentLineInfo").$D("支付行信息"),
        matchLine: this.$T("sbsm.common.view.title.statementLineMatchPaymentLine").$D("流水行匹配支付行"),
        statementLine: this.$T("sbsm.common.view.title.statementLineInfo").$D("流水行信息"),
        bepResult: this.$T("sbsm.common.view.title.bepResult").$D("银企支付结果"),
        attachment: this.$T("sbsm.common.view.title.attachment").$D("附件"),
        operationRecord: this.$T("hzero.common.status.operation").$D("操作记录"),
        approvalRecord: this.$T("hzero.common.status.approval").$D("审批记录"),
      };
    },
    dataSetMap() {
      return {
        basic: this.headerDs,
        paymentLine: this.paymentLineDs,
        matchLine: this.matchLineDs,
        bepResult: this.bepResultDs,
        attachment: this.headerDs,
      };
    },
    getColumnsFuncMap() {
      return {
        basic: this.getBasicColumns,
        paymentLine: this.getPaymentLineColumns,
        matchLine: this.getMatchLineColumns,
        bepResult: this.getBepResultColumns,
        attachment: this.getAttachmentColumns,
      };
    },
    getBasicColumns() {
      return (detailFlag) => {
        const payStatus = this.headerDs.current?.get("payStatus");
        const fieldsList = [
          {
            fieldCode: "payNum",
            fieldType: "EMPTY",
            render: (value, record) => {
              const { payStatusMeaning } = record;
              return (
                <SrmListHeader>
                  <span>{value || "-"}</span>
                  <StatusTag
                    slot="right"
                    color={get(this.lookupDataMap, `payStatus.${payStatus}.tag`)}
                    text={payStatusMeaning}
                  />
                </SrmListHeader>
              );
            },
          },
          "companyNum",
          "companyName",
          "ouName",
          "displaySupplierNum",
          "displaySupplierName",
          "supplierSiteName",
          "currencyCode",
          "payTypeName",
          "payForm",
          "payAmount",
          "createdByName",
          "creationDate",
          "approveBatchNum",
          "remark",
          { fieldCode: "cancelReason", visible: [ "CANCEL", "PAY_CANCEL" ].includes(payStatus) },
          { fieldCode: "reverseReason", visible: [ "REVERSED", "REVERSING" ].includes(payStatus) },
        ];
        if (detailFlag) {
          fieldsList.splice(0, 1, "payNum", "payStatus");
        }
        return formatColumns(fieldsList, {
          takeFlag: !detailFlag,
          onItemClick: () => this.onClickItem("basic"),
        });
      };
    },
    getPaymentLineColumns() {
      return (detailFlag) => {
        const fieldsList = [
          "lineNum",
          "payNum",
          "documentNumAndLineNum",
          "itemCode",
          "itemName",
          "payAmount",
          "remark",
          "srmPoNum",
          {
            fieldCode: "operation",
            fieldName: this.$T("hzero.common.button.action").$D("操作"),
            render: (_, record) =>
              <SrmButton plain onClick={() => this.showPaymentLineDetail(record)}>
                {this.$T("hzero.common.button.viewDetail").$D("查看详情")}
              </SrmButton>
          },
        ];
        return formatColumns(fieldsList, {
          takeFlag: !detailFlag,
          showLabelTop: true,
          onItemClick: () => this.onClickItem("paymentLine"),
        });
      };
    },
    getMatchLineColumns() {
      return (detailFlag) => {
        const fieldsList = [
          "statementLineNum",
          "matchAmount",
          "payLineNum",
          "payNum",
          "itemCode",
          "itemName",
          "matchRuleMeaning",
        ];
        return formatColumns(fieldsList, {
          takeFlag: !detailFlag,
          showLabelTop: true,
          onItemClick: () => this.onClickItem("matchLine"),
        });
      };
    },
    getBepResultColumns() {
      return (detailFlag) => {
        const fieldsList = [
          {
            fieldCode: "bepRecordNum",
            fieldType: "EMPTY",
            render: (value, record) => {
              const { payStatus, payStatusMeaning } = record;
              return (
                <SrmListHeader>
                  <span>{value || "-"}</span>
                  <StatusTag
                    slot="right"
                    color={get(this.lookupDataMap, `payStatus.${payStatus}.tag`)}
                    text={payStatusMeaning}
                  />
                </SrmListHeader>
              );
            },
          },
          "payCommandNum",
          "statementLineNum",
          "verificationCode",
          "payInitiationDate",
          "payAmount",
          "bepRequestStatus",
          "payFailedReason",
          "createByName",
          "sdatPayNum",
          "bankSerialNum",
        ];
        if (detailFlag) {
          fieldsList.splice(0, 1, "bepRecordNum", "payStatus");
        }
        return formatColumns(fieldsList, {
          takeFlag: !detailFlag,
          onItemClick: () => this.onClickItem("bepResult"),
        });
      };
    },
    getAttachmentColumns() {
      return () => [
        {
          fieldCode: "attachmentUuid",
          showCount: true,
        },
      ];
    },
  },
  beforeMount() {
    this.fetchLookupData();
    this.fetchOperationRecords();
  },
  methods: {
    async fetchLookupData() {
      const res = await queryMapIdpValue({
        payStatus: "SBSM.PAY_HEADER_STATUS",
      });
      if (isNil(res)) {
        return;
      }
      if (!res.failed) {
        Object.entries(res).forEach(([ key, data ]) => {
          this.lookupDataMap[key] = fromPairs(
            data.map(({ value, ...others } = {}) => [ value, others ])
          );
        });
      } else {
        this.$notification.open({ message: res.message });
      }
    },
    async fetchOperationRecords() {
      const { payHeaderId } = this.parameters;
      const res = await queryOperationRecords(payHeaderId).catch(
        (err) => {
          throw err;
        }
      );
      if (res && !res.failed) {
        this.operationData = res.content;
      }
    },
    afterHeaderQuery(_, data) {
      const { payForm, payStatus, statementLineEditPoint } = data[0] || {};
      this.payForm = payForm;
      this.hiddenStatementFlag = statementLineEditPoint === "APPROVE" && [ "NEW", "RETURN", "SUBMITTED" ].includes(payStatus);
      this.statementLineDs.addPathParameter("payForm", payForm);
      this.statementLineDs.refresh();
    },
    showPaymentLineDetail(record) {
      this.$popup({
        showHeader: false,
        showClose: true,
        position: "right",
        showBack: false,
        content:
          <PaymentLineDetail props={{ "v-bind": "$attrs" }} topRecord={record} lookupDataMap={this.lookupDataMap} />
      });
    },
    onClickItem(type) {
      this.$popup({
        position: "right",
        content:
          <SrmForm
            customizeType="detail"
            dataSet={this.dataSetMap[type]}
            columns={this.getColumnsFuncMap[type](true)}
            customizeCode={this.mblUnitCodeMap[type]}
          />
        ,
      });
    },
  },
};
</script>

<style scoped lang="stylus">
@import "~srm-mobile-ui/src/style/var.styl";
.srm-payment-doc-approval {
  >>> .srm-form {
    padding: 15px 15px;
    min-height: 60px;
    margin: 0;
  }
  .attachment-form {
    min-height: 58px;
    padding: 0;
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
