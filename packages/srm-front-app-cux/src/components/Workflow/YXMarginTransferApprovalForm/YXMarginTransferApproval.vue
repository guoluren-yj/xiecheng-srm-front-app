<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.marginTransfer.view.title.baseInfo').$D('基本信息')">
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
      <srm-scroll-tab-item
        :label="$T('scux.marginTransfer.view.title.lineInfos').$D('转出行信息')">
        <srm-list
          :data-set="lineInfoDataSet"
          :columns="lineColumns"
          @itemClick="onItemClick"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { lineInfoDs } from "./dataSource/lineDs";
import { getBaseInfoApi } from "./api";

export default {
  modules: [ "scux.marginTransfer", "hipspfm.workFlow" ],
  name: "YXMarginTransferApproval",
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      headerInfo: {},
      lineInfo: {},
      lineInfoDataSet: new DataSet(lineInfoDs()),
    };
  },
  computed: {
    getHeaderColumns() {
      return () => [
        {
          fieldName: this.$T("scux.marginTransfer.model.shiftNumber").$D("保证金转移单号"),
          fieldCode: "shiftNumber",
          formRow: 1,
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.companyName").$D("公司"),
          fieldCode: "companyName",
          formRow: 2,
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.depositTypeMeaning").$D("保证金类型"),
          fieldCode: "depositTypeMeaning",
          formRow: 3,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.shiftDepositAmount").$D("保证金金额"),
          fieldCode: "shiftDepositAmount",
          formRow: 3,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.supplierCompanyName").$D("供应商名称"),
          fieldCode: "supplierCompanyName",
          formRow: 4,
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.supplierCompanyCode").$D("供应商编码"),
          fieldCode: "supplierCompanyCode",
          formRow: 5,
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.ouName").$D("业务实体"),
          fieldCode: "ouName",
          formRow: 6,
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.rfxNum").$D("招标书编号"),
          fieldCode: "rfxNum",
          formRow: 7,
          // formCol: 1,
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.rfxTitle").$D("招标项目名称"),
          fieldCode: "rfxTitle",
          formRow: 8,
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.pcNum").$D("合同编号"),
          fieldCode: "pcNum",
          formRow: 9,
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.pcName").$D("合同名称"),
          fieldCode: "pcName",
          formRow: 10,
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.typeName").$D("结算方式"),
          fieldCode: "typeCodeMeaning",
          formRow: 11,
          formCol: 1,
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.applyUserName").$D("申请人"),
          fieldCode: "applyUserName",
          formRow: 11,
          formCol: 2,
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.shiftComments").$D("备注"),
          fieldCode: "shiftComments",
          formRow: 12,
        },
      ];
    },
    lineColumns() {
      return [
        {
          fieldName: this.$T("scux.marginTransfer.model.depositNumber").$D("保证金单号"),
          fieldCode: "depositNumber",
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.depositStatusMeaning").$D("状态"),
          fieldCode: "depositStatusMeaning",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.supplierCompanyName").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.depositType").$D("保证金类型"),
          fieldCode: "depositTypeMeaning",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.rfxTitle").$D("招标项目名称"),
          fieldCode: "rfxTitle",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.pcName").$D("合同名称"),
          fieldCode: "pcName",
        },
      ];
    },
    lineDetailColumns() {
      return [
        {
          fieldName: this.$T("scux.marginTransfer.model.depositStatusMeaning").$D("状态"),
          fieldCode: "depositStatusMeaning",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.shiftNumber").$D("保证金转移单号"),
          fieldCode: "shiftNumber",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.ouName").$D("业务实体"),
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.supplierCompanyName").$D("供应商"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.depositType").$D("保证金类型"),
          fieldCode: "depositType",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.depositAmount").$D("保证金金额"),
          fieldCode: "depositAmount",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.outAmount").$D("本次转出金额"),
          fieldCode: "outAmount",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.returnedAmount").$D("已退还金额"),
          fieldCode: "returnedAmount",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.canReturnAmount").$D("可退还金额"),
          fieldCode: "canReturnAmount",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.rfxNum").$D("招标书编号"),
          fieldCode: "rfxNum",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.rfxTitle").$D("招标项目名称"),
          fieldCode: "rfxTitle",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.pcNum").$D("合同编号"),
          fieldCode: "pcNum",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.pcName").$D("合同名称"),
          fieldCode: "pcName",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.sourceFrom").$D("单据来源"),
          fieldCode: "sourceFrom",
        },
        {
          fieldName: this.$T("scux.marginTransfer.model.sourceFromNumber").$D("来源单据编号"),
          fieldCode: "sourceFromNumber",
        },
      ];
    },
  },
  async mounted() {
    let shiftId = this.changeReqId;
    this.headerInfo = await getBaseInfoApi(shiftId);
    this.lineInfoDataSet.addPathParameter("shiftId", shiftId);
    this.lineInfoDataSet.refresh();
    this.$emit(
      "GetApprovalTitle",
      this.$T("scux.marginTransfer.view.title.marginTransferApproval").$D(
        "保证金转移申请审批"
      ),
    );
  },
  methods: {
    onItemClick() {
      this.detailPopup = this.$popup({
        title: this.$T("scux.marginTransfer.view.title.detail.lineInfo").$D("转出行明细"),
        showHeader: true,
        showClose: true,
        position: "bottom",
        showBack: false,
        height: "620px",
        rounded:true,
        content: <SrmForm
          style={{ padding: "0 15px" }}
          customizeType="detail"
          dataSet={this.lineInfoDataSet}
          columns={this.lineDetailColumns}
          onDelete={() => this.detailPopup.closePopup()}
          onUpdate={() => this.detailPopup.closePopup()}
          // onSubmit={() => this.detailPopup.closePopup()}
        />,
      });
    },
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