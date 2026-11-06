<template>
  <div ref="priceExecute" class="price-execute-approval">
    <div slot="right" class="right-button">
      <span>
        <img class="image-black-default" src="@/assets/4.0/Navigation bar_delete_normal@3x.png" alt @click="goBack">&nbsp;&nbsp;
        <span>{{ $T('scux.capitalPlanSummary.created.model.fundTraceability').$D('资金计划明细') }}</span>
      </span>
    </div>
    <srm-list :data-set="lineInfoDataSet" :columns="lineColumns" />
  </div>
</template>

<script>
import { DataSet, SrmList } from "srm-mobile-ui";
import { lineDetailDs, lineReviewDs } from "./dataSource/lineDs";

export default {
  modules: [ "scux.capitalPlanSummary", "scux.capitalPlanSummary.created", "hipspfm.workFlow", "scux.contractorAssessKpi", "scux.lngQualificationList" ],
  name: "YXCapitalPlanSummaryDetailApproval",
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    let { sumDetailId } = this.$route.query;
    const queryFields = [
      {
        fieldCode: "planApplyNum",
        fieldType: "INPUT",
        fieldName: this.$T("scux.contractorAssessKpi.created.model.planApplyNum").$D("资金单号"),
      },
      {
        fieldCode: "capitalMonth",
        fieldType: "DATE_PICKER",
        fieldName: this.$T("scux.contractorAssessKpi.created.model.capitalMonth").$D("月份"),
        yearPicker: true,
        options: {
          monthPicker: true,
        },
      },
      {
        fieldCode: "companyName",
        fieldType: "INPUT",
        fieldName: this.$T("scux.contractorAssessKpi.created.model.companyName").$D("公司"),
      },
      {
        fieldCode: "ouId",
        fieldName: this.$T("scux.contractorAssessKpi.created.model.ouName").$D("业务实体"),
        fieldType: "LOV",
        lovCode: "SCUX.YX_CAPTIAL_PLAN_OU",
      },
      {
        fieldCode: "createDateFrom",
        fieldName: this.$T("scux.contractorAssessKpi.created.model.createDateFrom").$D("创建日期从"),
        fieldType: "DATE_PICKER",
      },
      {
        fieldCode: "createDateTo",
        fieldName: this.$T("scux.contractorAssessKpi.created.model.createDateTo").$D("创建日期至"),
        fieldType: "DATE_PICKER",
      },
      {
        fieldCode: "createPerson",
        fieldType: "INPUT",
        fieldName: this.$T("scux.contractorAssessKpi.created.model.createPerson").$D("创建人"),
      },
      {
        fieldCode: "createUnitId",
        fieldName: this.$T("scux.contractorAssessKpi.created.model.createUnitName").$D("创建部门"),
        fieldType: "LOV",
        lovCode: "SCUX.YX_CAPTIAL_PLAN_UNIT",
      },
    ];
    return {
      lineInfoDataSet: new DataSet(lineDetailDs(sumDetailId, queryFields)),
    };
  },
  computed: {
    lineColumns() {
      return [
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.planApplyNum").$D("资金单号"),
          fieldCode: "planApplyNum",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.serialNumber").$D("行号"),
          fieldCode: "serialNumber",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.capitalMonth").$D("月份"),
          fieldCode: "capitalMonth",
          fieldType: "DATE_PICKER",
          yearPicker: true,
          editor: false,
          options: {
            monthPicker: true,
          },
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.tenDaysPlan").$D("旬计划"),
          fieldCode: "tenDaysPlanMeaning",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.companyName").$D("公司"),
          fieldCode: "companyName",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.purchaseOrganizationName").$D("采购组织"),
          fieldCode: "purchaseOrganizationName",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.createUnitName").$D("创建部门"),
          fieldCode: "createUnitName",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.planAmount").$D("计划金额"),
          fieldCode: "planAmount",
          render: (val) => <a style={{ color: "#276ef1" }} onClick={this.onItemClick}>{this.returnFloat(val)}</a>,
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
          fieldName: this.$T("scux.contractorAssessKpi.created.model.createPerson").$D("创建人"),
          fieldCode: "createPerson",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.sourceMode").$D("来源方式"),
          fieldCode: "sourceModeMeaning",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.creationDate").$D("创建日期"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.remark").$D("说明"),
          fieldCode: "remark",
        },
      ];
    },
    lineReviewColumns() {
      return [
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.settleNum").$D("付款申请单号"),
          fieldCode: "settleNum",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.pcNum").$D("合同编号"),
          fieldCode: "pcNum",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.documentType").$D("付款类型"),
          fieldCode: "documentTypeMeaning",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.paymentTypeName").$D("结算方式"),
          fieldCode: "paymentTypeName",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.initalPaymentAmount").$D("付款金额"),
          fieldCode: "initalPaymentAmount",
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
          fieldName: this.$T("scux.contractorAssessKpi.created.model.supplierCompanyName").$D("供应商名称"),
          fieldCode: "supplierCompanyName",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.unitName").$D("部门"),
          fieldCode: "unitName",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.agentName").$D("采购员"),
          fieldCode: "agentName",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.createName").$D("创建人"),
          fieldCode: "createName",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.creationDate").$D("创建日期"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.comments").$D("说明"),
          fieldCode: "comments",
        },
      ];
    },
  },
  async mounted() {
    this.lineInfoDataSet.refresh();
    this.$emit(
      "GetApprovalTitle",
      this.$T("scux.capitalPlanSummary.view.title.capitalPlanSummaryApproval").$D(
        "资金计划审批流"
      ),
    );
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    onItemClick() {
      const { applyDetailId } = this.lineInfoDataSet.current.data;
      const queryFields = [
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.settleNum").$D("付款申请单号"),
          fieldCode: "settleNum",
          fieldType: "INPUT",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.supplierCompanyName").$D("供应商名称"),
          fieldCode: "supplierCompanyName",
          fieldType: "INPUT",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.agentName").$D("采购员"),
          fieldCode: "agentName",
          fieldType: "INPUT",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.unitName").$D("部门"),
          fieldCode: "unitId",
          fieldType: "LOV",
          lovCode: "SCUX.YX_CAPTIAL_PLAN_OU",
        },
        {
          fieldCode: "createDateFrom",
          fieldName: this.$T("scux.contractorAssessKpi.created.model.createDateFrom").$D("创建日期从"),
          fieldType: "DATE_PICKER",
        },
        {
          fieldCode: "createDateTo",
          fieldName: this.$T("scux.contractorAssessKpi.created.model.createDateTo").$D("创建日期至"),
          fieldType: "DATE_PICKER",
        },
        {
          fieldName: this.$T("scux.contractorAssessKpi.created.model.documentType").$D("付款类型"),
          fieldCode: "documentType",
          fieldType: "SELECT",
          lovCode: "SCUX.YX_PAYMENT_TYPE",
        },
      ];
      const lineReviewDataSet = new DataSet(lineReviewDs(applyDetailId, queryFields));
      lineReviewDataSet.query().then(() => {
        this.detailPopup = this.$popup({
          title: this.$T("scux.contractorAssessKpi.created.model.applyPayment").$D("付款申请查询"),
          showHeader: true,
          showClose: true,
          position: "bottom",
          showBack: false,
          height: "620px",
          rounded: true,
          content: <SrmList
            dataSet={lineReviewDataSet}
            columns={this.lineReviewColumns}
          />,
        });
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

  .right-button {
    margin-right: 15px;
    z-index: 1;
    color: var(--color-font-default-f);

    span {
      display: flex;
      align-items: center;
      height: 32px;
      background: var(--color-bg-default);
      // border: 1px solid var(--color-border-default);
      border-radius: 18px;
      color: #000;
    }

    img {
      height: 18px;
      width: 18px;
    }
  }
  </style>