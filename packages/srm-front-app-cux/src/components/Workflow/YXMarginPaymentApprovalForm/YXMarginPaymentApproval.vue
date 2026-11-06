<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.marginPayment.view.title.baseInfo').$D('基本信息')">
        <div v-if="JSON.stringify(headerInfo) === '{}'" class="noContent">
          <span>{{ $T("hipspfm.workFlow.view.message.noBasicInfo").$D("暂无基本信息") }}</span>
        </div>
        <div v-else style="padding-top: 16px;">
          <customize
            :columns="getHeaderColumns()"
            :need-padding="true"
            type="list"
            :data-source="headerInfo"/>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { getBaseInfoApi } from "./api";

export default {
  modules: [ "scux.marginPayment", "hipspfm.workFlow" ],
  name: "YXMarginPaymentApproval",
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      headerInfo: {},
    };
  },
  computed: {
    getHeaderColumns() {
      return () => [
        {
          fieldName: this.$T("scux.marginPayment.model.settleNum").$D("付款申请单号"),
          fieldCode: "settleNum",
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>
        },
        {
          fieldName: this.$T("scux.marginPayment.model.documentTypeMeaning").$D("付款类型"),
          fieldCode: "documentTypeMeaning",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.attachmentUuid").$D("查看附件"),
          fieldCode: "attachmentUuid",
          render: (val) => <srm-upload attachmentUuid={val} show-icon color="var(--color-other-default-b)" desc-title={this.$T("scux.marginPayment.button.viewAttachments").$D("查看附件")}/>
        },
        {
          fieldName: this.$T("scux.marginPayment.model.supplierCompanyName").$D("供应商名称"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.rfxNum").$D("招标书编号"),
          fieldCode: "rfxNum",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.rfxTitle").$D("招标书名称"),
          fieldCode: "rfxTitle",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.depositType").$D("保证金类型"),
          fieldCode: "depositTypeMeaning",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.ouName").$D("业务实体"),
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.purOrganizationName").$D("采购组织"),
          fieldCode: "purOrganizationName",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.depositAmount").$D("保证金金额"),
          fieldCode: "depositAmount",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.applyAmount").$D("申请金额"),
          fieldCode: "applyAmount",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.sourceFromNumber").$D("来源单据编号"),
          fieldCode: "sourceFromNumber",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.paymentType").$D("结算方式"),
          fieldCode: "paymentTypeMeaning",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.bankAccountName").$D("账户名称"),
          fieldCode: "bankAccountName",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.bankAccountNum").$D("银行账号"),
          fieldCode: "bankAccountNum",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.bankLineBranchName").$D("联行行号"),
          fieldCode: "bankLineBranchName",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.currencyName").$D("币种"),
          fieldCode: "currencyName",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.creationDate").$D("创建时间"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.agentName").$D("采买人"),
          fieldCode: "agentName",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.unitName").$D("采买部门"),
          fieldCode: "unitName",
        },
        {
          fieldName: this.$T("scux.marginPayment.model.comments").$D("说明"),
          fieldCode: "comments",
        },
      ];
    },
  },
  async mounted() {
    let paymentHeaderId = this.changeReqId;
    this.headerInfo = await getBaseInfoApi(paymentHeaderId);
    this.$emit(
      "GetApprovalTitle",
      this.$T("scux.marginPayment.view.title.marginPaymentApproval").$D(
        "付款申请审批"
      ),
    );
  },
  methods: {
  },
};
</script>

<style scoped lang="stylus">
.price-execute-approval {
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  >>> .srm-line-tab {
    height: 100%;
  }
  >>> .srm-line-tab-content {
    background-color: var(--color-border-default);
  }

  >>> .srm-tab-pane {
    background-color: var(--color-border-default);
  }
  >>> .srm-tab-pane-title {
    background-color: var(--color-border-default);
  }
}
</style>