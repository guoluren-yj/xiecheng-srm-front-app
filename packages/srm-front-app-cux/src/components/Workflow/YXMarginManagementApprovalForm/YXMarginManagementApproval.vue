<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.marginManagement.view.title.baseInfo').$D('基本信息')">
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
  modules: [ "scux.marginManagement", "hipspfm.workFlow" ],
  name: "YXMarginManagementApproval",
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
          fieldName: this.$T("scux.marginManagement.model.depositNumber").$D("保证金单号"),
          fieldCode: "depositNumber",
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>
        },
        {
          fieldName: this.$T("scux.marginManagement.model.depositType").$D("保证金类型"),
          fieldCode: "depositTypeMeaning",
        },
        {
          fieldName: this.$T("scux.marginManagement.model.frozenReason").$D("解冻原因"),
          fieldCode: "frozenReason",
        },
        {
          fieldName: this.$T("scux.marginManagement.model.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("scux.marginManagement.model.ouName").$D("业务实体"),
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("scux.marginManagement.model.supplierCompanyName").$D("供应商名称"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("scux.marginManagement.model.rfxNum").$D("招标书编号"),
          fieldCode: "rfxNum",
        },
        {
          fieldName: this.$T("scux.marginManagement.model.rfxTitle").$D("招标项目名称"),
          fieldCode: "rfxTitle",
        },
        {
          fieldName: this.$T("scux.marginManagement.model.paymentDate").$D("供应商付款时间"),
          fieldCode: "paymentDate",
        },
        {
          fieldName: this.$T("scux.marginManagement.model.depositAmount").$D("保证金金额"),
          fieldCode: "depositAmount",
        },
        {
          fieldName: this.$T("scux.marginManagement.model.sourceFrom").$D("单据来源"),
          fieldCode: "sourceFrom",
        },
        {
          fieldName: this.$T("scux.marginManagement.model.sourceFromNumber").$D("来源单据编号"),
          fieldCode: "sourceFromNumber",
        },
        {
          fieldName: this.$T("scux.marginManagement.model.paymentType").$D("结算方式"),
          fieldCode: "paymentTypeMeaning",
        },
        {
          fieldName: this.$T("scux.marginManagement.model.paymentAccount").$D("账户名称"),
          fieldCode: "paymentAccount",
        },
        {
          fieldName: this.$T("scux.marginManagement.model.paymentBank").$D("银行账号"),
          fieldCode: "paymentBank",
        },
        {
          fieldName: this.$T("scux.marginManagement.model.bankNumber").$D("联行行号"),
          fieldCode: "bankNumber",
        },
      ];
    },
  },
  async mounted() {
    let depositId = this.changeReqId;
    this.headerInfo = await getBaseInfoApi(depositId);
    this.$emit(
      "GetApprovalTitle",
      this.$T("scux.marginManagement.view.title.marginManagementApproval").$D(
        "保证金解冻审批"
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