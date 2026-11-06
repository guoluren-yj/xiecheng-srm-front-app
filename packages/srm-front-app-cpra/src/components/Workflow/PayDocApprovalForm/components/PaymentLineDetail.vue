<template>
  <srm-tab-bar>
    <srm-tab-item :label="$T('sbsm.paymentPool.view.title.payTransactionDetailInfo').$D('支付事务详情信息')">
      <srm-flex class="sub-title">
        {{ $T("sbsm.paymentPool.view.title.counterpartyInfo").$D("交易方信息") }}
      </srm-flex>
      <srm-form
        :customize-code="mblUnitCodeMap.party"
        :data-set="headerDs"
        :columns="getColumnsFuncMap.party()"/>
      <srm-flex class="sub-title">
        {{ $T("sbsm.paymentPool.view.title.transactionInfo").$D("交易事务信息") }}
      </srm-flex>
      <srm-form
        :customize-code="mblUnitCodeMap.affair"
        :data-set="headerDs"
        :columns="getColumnsFuncMap.affair()"/>
    </srm-tab-item>
    <srm-tab-item :label="$T('sbsm.paymentPool.view.title.payTransactionExecutionInfo').$D('支付事务执行信息')">
      <srm-flex class="sub-title">
        {{ $T("sbsm.paymentPool.view.title.payTransactionAmountInfo").$D("交易事务金额信息") }}
      </srm-flex>
      <srm-form
        :customize-code="mblUnitCodeMap.amount"
        :data-set="headerDs"
        :columns="getColumnsFuncMap.amount()"/>
      <srm-flex class="sub-title" justify="between">
        <span>  {{ $T("sbsm.paymentPool.view.title.payTransactionExecutionInfo").$D("支付事务执行信息") }}</span>
        <div class="sbsm-payment-run-info-tab">
          <srm-button :class="`first-button ${!allFlag ? 'no-active' : ''}`" size="small" type="primary" @click="() => changeDisplayMode('ALL')">
            {{ $T('sbsm.paymentPool.view.option.allShow').$D('全量记录') }}
          </srm-button>
          <srm-button :class="`${allFlag ? 'no-active' : ''}`" size="small" type="primary" @click="() => changeDisplayMode('FINAL')">
            {{ $T('sbsm.paymentPool.view.option.finalShow').$D('最终展示') }}
          </srm-button>
        </div>
      </srm-flex>
      <srm-list
        style="height:auto"
        :scrollable="false"
        :data-set="executionDs"
        :customize-code="mblUnitCodeMap.execution"
        :columns="getColumnsFuncMap.execution()"/>
    </srm-tab-item>
  </srm-tab-bar>
</template>
<script>
import { get, isNil } from "lodash";
import { DataSet } from "srm-mobile-ui";
import StatusTag from "../../../StatusTag";
import { formatColumns, formatNumber } from "../utils";
import { headerDS, executionDS } from "../datasource/paymentAffairDS";
export default {
  modules: [ "smbl.common", "sbsm.paymentPool" ],
  props: {
    topRecord: {
      type: Object,
      required: true,
      default: () => ({})
    },
    lookupDataMap: {
      type: Object,
      required: true,
      default: () => ({})
    },
  },
  data() {
    const { payId } = this.topRecord;
    return {
      allFlag: true,
      headerDs: new DataSet(headerDS(payId)),
      executionDs: new DataSet(executionDS(payId)),
      mblUnitCodeMap: {
        party: "SMBL.WORKFLOW.PAY_DOC_APPROVAL.PAYMENT_LINE_PARTY",
        affair: "SMBL.WORKFLOW.PAY_DOC_APPROVAL.PAYMENT_LINE_AFFAIR",
        amount: "SMBL.WORKFLOW.PAY_DOC_APPROVAL.PAYMENT_LINE_AMOUNT",
        execution: "SMBL.WORKFLOW.PAY_DOC_APPROVAL.PAYMENT_LINE_EXECUTION",
      },
    };
  },
  computed: {
    getColumnsFuncMap() {
      return {
        party: this.getPartyColumns,
        affair: this.getAffairColumns,
        amount: this.getAmountColumns,
        execution: this.getExecuteColumns,
      };
    },
    getPartyColumns() {
      return (detailFlag) => {
        const fieldsList = [
          "companyNum",
          "companyName",
          "displaySupplierNum",
          "displaySupplierName",
          "payBankName",
          "payBankBranchName",
          "payBankFirm",
          "payBankAccountNum",
          "payBankAccountName",
          "bankName",
          "bankBranchName",
          "bankFirm",
          "bankAccountNum",
          "bankAccountName",
          "ouName",
          "supplierSiteName",
        ];
        return formatColumns(fieldsList, {
          takeFlag: !detailFlag,
          showLabelTop: { header: false },
          onItemClick: () => this.onClickItem("party"),
        });
      };
    },
    getAffairColumns() {
      return (detailFlag) => {
        const fieldsList = [
          "payNum",
          "documentSystemMeaning",
          "documentTypeMeaning",
          "payAmount",
          "currencyCode",
          "payTypeName",
          "payFormMeaning",
          "exPaymentDate",
          {
            fieldCode: "payStatus",
            render: (value, record) => {
              const { payStatus, payStatusMeaning } = record;
              return (
                <StatusTag
                  slot="right"
                  color={get(this.lookupDataMap, `payStatus.${payStatus}.tag`)}
                  text={payStatusMeaning}
                />
              );
            },
          },
          "documentNum",
          "documentLineNum",
          "itemCode",
          "itemName",
          "srmPoNum",
          "srmPoLineNum",
          "pcNum",
          "pcSubjectLineNum",
          "agentName",
          "createdByName",
          "creationDate",
        ];
        return formatColumns(fieldsList, {
          takeFlag: !detailFlag,
          showLabelTop: { header: false },
          onItemClick: () => this.onClickItem("affair"),
        });
      };
    },
    getAmountColumns() {
      return (detailFlag) => {
        const currencyCode = this.headerDs.current?.get("currencyCode");
        const fieldsList = [
          "payAmount",
          "paySavedAmount",
          "payOccupyAmount",
          "payCompleteAmount",
          "payingAmount",
          "paidAmount",
        ].map((fieldCode) => ({
          fieldCode,
          fieldType: "TEXT",
          render: (value, item) => isNil(value) ? value : `${formatNumber(value, item.amountPrecision)} ${currencyCode || ""}`,
        }));
        return formatColumns(fieldsList, {
          takeFlag: !detailFlag,
          showLabelTop: { header: false },
          onItemClick: () => this.onClickItem("amount"),
        });
      };
    },
    getExecuteColumns() {
      return (detailFlag) => {
        const fieldsList = [
          "payHeaderNum",
          "payLineNum",
          "payAmount",
          "recordTypeMeaning",
          "recordStatusMeaning",
          "creationDate",
          "operationSourceMeaning",
          "companyNum",
          "companyName",
          "displaySupplierNum",
          "displaySupplierName",
          "currencyCode",
          "payTypeName",
          "payFormMeaning"
        ];
        return formatColumns(fieldsList, {
          takeFlag: !detailFlag,
          onItemClick: () => this.onClickItem("execution"),
        });
      };
    },
  },
  methods: {
    changeDisplayMode(mode) {
      this.allFlag = mode === "ALL";
      this.executionDs.addQueryParameter("displayType", mode);
      this.executionDs.refresh();
    },
    onClickItem(type) {
      this.$popup({
        position: "right",
        content:
          <SrmForm
            customizeType="detail"
            dataSet={type === "execution" ? this.executionDs : this.headerDs}
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
>>> .srm-form {
  padding: 16px 15px;
  min-height: 60px;
  margin: 0;
  border-bottom #F6F6F6 solid 1px;
}
.sub-title {
  font-size: 12px;
  color: #333333;
  line-height: 16px;
  border-bottom #F6F6F6 solid 1px;
  height 36px;
  padding-left 15px;
}
.sbsm-payment-run-info-tab {
  height 40px;

  .first-button {
    margin-top 8px;
    margin-left 15px;
    margin-right 8px;
  }

  .second-button {
    margin-top 8px;

  }

  .no-active {
    background white;
    color #333333;
  }
}
</style>