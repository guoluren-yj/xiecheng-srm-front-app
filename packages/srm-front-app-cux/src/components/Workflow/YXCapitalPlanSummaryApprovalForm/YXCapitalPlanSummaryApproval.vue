<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('scux.capitalPlanSummary.created.view.created.baseInfo').$D('基本信息')">
        <srm-button size="small" icon="icon-paperclip">
          <srm-attachment-button :attachments="fileArr" show-total
                                 :title="$T('scux.capitalPlanSummary.created.view.button.upload').$D('上传附件')" />
        </srm-button>
        &nbsp;
        <srm-button size="small" @click="onActionClick">
          <span style="font-size: 10px">{{ $T('scux.capitalPlanSummary.created.view.action.btn').$D('操作记录') }}</span>
        </srm-button>
        <div v-if="JSON.stringify(headerInfo) === '{}'" class="noContent">
          <span>{{ $T("hipspfm.workFlow.view.message.noBasicInfo").$D("暂无基本信息") }}</span>
        </div>
        <div v-else style="padding-top: 16px;">
          <customize :columns="getHeaderColumns()" :need-padding="true" type="list" :data-source="headerInfo" />
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('scux.capitalPlanSummary.created.view.created.detailInfo').$D('明细信息')">
        <srm-list :data-set="lineInfoDataSet" :columns="lineColumns" />
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { SrmUtil, DataSet, SrmList } from "srm-mobile-ui";
import { lineInfoDs } from "./dataSource/lineDs";
import { getBaseInfoApi } from "./api";

export default {
  modules: [ "scux.capitalPlanSummary", "scux.capitalPlanSummary.created", "hipspfm.workFlow", "scux.contractorAssessKpi" ],
  name: "YXCapitalPlanSummaryApproval",
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    let planSummaryId = this.changeReqId;
    return {
      headerInfo: {},
      lineInfo: {},
      lineInfoDataSet: new DataSet(lineInfoDs(planSummaryId)),
    };
  },
  computed: {
    fileArr() {
      return [
        {
          attachmentUuid: this.headerInfo ? this.headerInfo.attachmentUuid : null,
          readonly: true,
          uploadButton: "none",
          bucketName: "private-bucket",
        },
      ];
    },
    getHeaderColumns() {
      return () => [
        {
          fieldName: this.$T("scux.capitalPlanSummary.created.model.planSummaryNum").$D("资金单号"),
          fieldCode: "planSummaryNum",
        },
        {
          fieldName: this.$T("scux.capitalPlanSummary.created.model.capitalMonth").$D("月份"),
          fieldCode: "capitalMonth",
          fieldType: "DATE_PICKER",
          yearPicker: true,
          editor: false,
          options: {
            monthPicker: true,
          },
        },
        {
          fieldName: this.$T("scux.capitalPlanSummary.created.model.title").$D("标题"),
          fieldCode: "title",
        },
        {
          fieldName: this.$T("scux.capitalPlanSummary.created.model.planTotalAmount").$D("资金计划总额"),
          fieldCode: "planTotalAmount",
          render: (val) => this.returnFloat(val),
        },
        {
          fieldName: this.$T("scux.capitalPlanSummary.created.model.electricTotalAmount").$D("电汇总额"),
          fieldCode: "electricTotalAmount",
          render: (val) => this.returnFloat(val),
        },
        {
          fieldName: this.$T("scux.capitalPlanSummary.created.model.acceptTotalAmount").$D("承兑总额"),
          fieldCode: "acceptTotalAmount",
          render: (val) => this.returnFloat(val),
        },
        {
          fieldName: this.$T("scux.capitalPlanSummary.created.model.companyName").$D("公司"),
          fieldCode: "lineCompanyStr",
        },
        {
          fieldName: this.$T("scux.capitalPlanSummary.created.model.createUnitName").$D("创建部门"),
          fieldCode: "createUnitName",
        },
        {
          fieldName: this.$T("scux.capitalPlanSummary.created.model.createPerson").$D("创建人"),
          fieldCode: "createPerson",
        },
        {
          fieldName: this.$T("scux.capitalPlanSummary.created.model.remark").$D("说明"),
          fieldCode: "remark",
        },
      ];
    },
    lineColumns() {
      return [
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.serialNumber").$D("序号"),
          fieldCode: "serialNumber",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.ouName").$D("业务实体"),
          fieldCode: "ouName",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.unitName").$D("部门"),
          fieldCode: "unitName",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.tenDaysPlan").$D("旬计划"),
          fieldCode: "tenDaysPlanMeaning",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.settlementMode").$D("结算方式"),
          fieldCode: "settlementModeMeaning",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.categoryName").$D("类别名称"),
          fieldCode: "categoryNameMeaning",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.planAmount").$D("计划金额"),
          fieldCode: "planAmount",
          render: (val) => <a style={{ color: "#276ef1" }} onClick={this.onItemClick}>{this.returnFloat(val)}</a>,
        },
      ];
    },
    actionColumns() {
      return [
        {
          fieldCode: "operationPerson",
        },
        {
          fieldCode: "operationDate",
        },
        {
          fieldCode: "operationTypeMeaning",
        },
      ];
    },
  },
  async mounted() {
    let planSummaryId = this.changeReqId;
    const header = await getBaseInfoApi(planSummaryId);
    const lineCompanyStr = Array.from(new Set(header.lineCompanyStr?.split(","))).join(",");
    this.headerInfo = { ...header, lineCompanyStr };
    this.lineInfoDataSet.refresh();
    this.$emit(
      "GetApprovalTitle",
      this.$T("scux.capitalPlanSummary.view.title.capitalPlanSummaryApproval").$D(
        "资金计划审批流"
      ),
    );
  },
  methods: {
    onItemClick() {
      const { sumDetailId } = this.lineInfoDataSet.current.data;
      this.$router.push({
        path: "/appCux/YXCapitalPlanSummaryDetailApproval",
        query: { sumDetailId },
      });
    },
    // 保留两位小数
    returnFloat(value) {
      const num = value.toString().split(".");
      if (value === 0) {
        return `${value.toString()}.00`;
      } else if (value) {
        if (num.length === 1) {
          const values = `${value.toString()}.00`;
          return values;
        }
        if (num.length > 1) {
          if (num[1].length < 2) {
            const values = `${value.toString()}0`;
            return values;
          }
          const values = Math.floor(value * 100) / 100;
          return values;
        }
      } else {
        return "-";
      }
    },
    // 操作记录
    onActionClick() {
      const actionDataSet = new DataSet({
        autoQuery: false,
        pageSize: 10,
        editable: false,
        editFlag: false,
        enableQuery: true,
        pathParameter: {
          tenantId: SrmUtil.getTenantId(),
        },
        fields: [
          {
            fieldCode: "operationPerson",
            fieldName: this.$T("scux.contractorAssessKpi.created.model.operationPerson").$D("操作人"),
          },
          {
            fieldCode: "operationDate",
            fieldName: this.$T("scux.contractorAssessKpi.created.model.operationDate").$D("操作时间"),
          },
          {
            fieldCode: "operationTypeMeaning",
            fieldName: this.$T("scux.contractorAssessKpi.created.model.operationType").$D("操作类型"),
          },
        ],
        transport: {
          read: {
            url: `/scux2/v1/${SrmUtil.getTenantId()}/yx-capital-plan-sum/${this.changeReqId}/actions`,
            method: "get",
          },
        },
      });
      actionDataSet.query().then(() => {
        this.detailPopup = this.$popup({
          title: this.$T("scux.capitalPlanSummary.created.view.action.btn").$D("操作记录"),
          showHeader: true,
          showClose: true,
          position: "bottom",
          showBack: false,
          height: "620px",
          rounded: true,
          content: <SrmList
            dataSet={actionDataSet}
            columns={this.actionColumns}
          />,
        });
      });
    }
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