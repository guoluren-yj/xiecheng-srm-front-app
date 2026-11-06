
<template>
  <div>
    <srm-form
      v-if="payForm === 'BANK_CORPORATE_EXPRESS'"
      :customize-code="mblUnitCodeMap[payForm]"
      :data-set="dataSet"
      :columns="getBepColumns()"/>
    <srm-list
      v-if="payForm === 'BANK_PAPER'"
      :customize-code="mblUnitCodeMap[payForm]"
      :data-set="dataSet"
      :columns="getPaperColumns()"/>
    <srm-list
      v-if="payForm === 'OFFLINE_PAY'"
      :customize-code="mblUnitCodeMap[payForm]"
      :data-set="dataSet"
      :columns="getOfflineColumns()"/>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { formatColumns } from "../utils";
export default {
  modules: [ "smbl.common" ],
  props: {
    payForm: {
      type: String,
      required: true,
      default: ""
    },
    dataSet: {
      type: DataSet,
      required: true,
      default: () => new DataSet()
    }
  },
  data() {
    return {
      mblUnitCodeMap: {
        BANK_CORPORATE_EXPRESS: "SMBL.WORKFLOW.PAY_DOC_APPROVAL.STATEMENT_LINE_BEP",
        BANK_PAPER: "SMBL.WORKFLOW.PAY_DOC_APPROVAL.STATEMENT_LINE_PAPER",
        OFFLINE_PAY: "SMBL.WORKFLOW.PAY_DOC_APPROVAL.STATEMENT_LINE_OFFLINE",
      },
    };
  },
  computed: {
    getColumnsFuncMap() {
      return {
        "BANK_CORPORATE_EXPRESS": this.getBepColumns,
        "BANK_PAPER": this.getPaperColumns,
        "OFFLINE_PAY": this.getOfflineColumns,
      };
    },
    getBepColumns() {
      return (detailFlag) => {
        const fieldList = [
          "lineNum",
          "payTypeName",
          "payFormMeaning",
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
          "payAmount",
          "payStatus",
          "payCommandNum",
          "bankDirectLinkOrgInfoCode",
        ];
        return formatColumns(fieldList, {
          takeFlag: !detailFlag,
          showLabelTop: true,
          onItemClick: this.onClickItem,
        });
      };
    },
    getPaperColumns() {
      return (detailFlag) => {
        const fieldList = [
          "lineNum",
          "payTypeName",
          "payFormMeaning",
          "paperNum",
          "dataSourceMeaning",
          "paperTypeMeaning",
          "paperStatus",
          "payAmount",
          "receiveBankName",
          "drawer",
          "acceptor",
          "payer",
          "invoiceDate",
          "issueDate",
          "draftsDeadLine",
          "payStatus",
        ];
        return formatColumns(fieldList, {
          takeFlag: !detailFlag,
          showLabelTop: true,
          onItemClick: this.onClickItem,
        });
      };
    },
    getOfflineColumns() {
      return (detailFlag) => {
        const fieldList = [
          "lineNum",
          "payTypeName",
          "payFormMeaning",
          "payStatus",
          "payAmount",
        ];
        return formatColumns(fieldList, {
          takeFlag: !detailFlag,
          showLabelTop: true,
          onItemClick: this.onClickItem,
        });
      };
    },
  },
  methods: {
    onClickItem() {
      this.$popup({
        position: "right",
        content:
          <SrmForm
            customizeType="detail"
            dataSet={this.dataSet}
            columns={this.getColumnsFuncMap[this.payForm](true)}
            customizeCode={this.mblUnitCodeMap[this.payForm]}
          />
        ,
      });
    },
  }
};
</script>