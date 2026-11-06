<!-- 查看评估策略组件 -->
<template>
  <div>
    <srm-scroll-tab>
      <srm-scroll-tab-item :label="$T('sslm.purchaserEvaluationDetail.view.content.basicInfo').$D('基础信息')" >
        <srm-list :scrollable="false" :data-set="evaluationPolicyDs" :columns="getBasicColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('sslm.evaluationStrategyDetail.tabs.TabPane.supEvaProRules').$D('供应商评估计划规则')" >
        <srm-list :scrollable="false" :data-set="evaluationPolicyDs" :columns="getEvaProRulesColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('sslm.evaluationStrategyDetail.tabs.TabPane.supEvaRules').$D('供应商评估规则')" >
        <srm-list :scrollable="false" :data-set="evaluationPolicyDs" :columns="getEvaRulesColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item :label="$T('sslm.evaluationStrategyDetail.tabs.TabPane.purSupIntRules').$D('采供方交互规则')" >
        <srm-list :scrollable="false" :data-set="evaluationPolicyDs" :columns="getPurSupIntRulesColumns"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { getEvaluationPolicyDS } from "./datasource/evaluationPolicyDs";
import { yesOrNoRenderer } from "@/utils/renderer.js";
import { isNil } from "lodash";

export default {
  modules: [ "sslm.evaluationStrategyDetail", "sslm.purchaserEvaluationDetail", "sslm.common" ],
  name: "EvaluationPolicy",
  props: {
    strategyId: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
      evaluationPolicyDs: new DataSet(getEvaluationPolicyDS(this.strategyId)),
    };
  },
  computed: {
    // 基本信息
    getBasicColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "strategyCode",
          fieldType: "EMPTY",
          render: (val, record) => <SrmListHeader showOpenTag={false}>
            <span>{val}</span>
            <span slot="right">{this.$T("sslm.common.version.number").$D("版本")}：{record.versionNumber}</span>
          </SrmListHeader>,
        },
        {
          fieldName: this.$T("sslm.evaluationStrategyDetail.form.label.policyName").$D("策略名称"),
          fieldCode: "strategyName",
        },
        {
          fieldName: this.$T("sslm.evaluationStrategyDetail.form.label.assessType").$D("评估类型"),
          fieldCode: "assessTypeMeaning",
        },
        {
          fieldName: this.$T("sslm.evaluationStrategyDetail.form.label.realName").$D("创建人"),
          fieldCode: "realName",
        },
        {
          fieldName: this.$T("sslm.evaluationStrategyDetail.form.label.creationDate").$D("创建时间"),
          fieldCode: "creationDate",
        },
      ];
    },
    // 供应商评估计划规则信息
    getEvaProRulesColumns() {
      return [
        {
          fieldName: this.$T("sslm.evaluationStrategyDetail.form.label.needPlanFlag").$D("需要评估计划"),
          fieldCode: "needFlag",
          formRow: 10,
          formCol: 10,
          render: (val) => isNil(val) ? "-" : yesOrNoRenderer(val),
        },
        {
          fieldName: this.$T("sslm.evaluationStrategyDetail.form.label.isPreciseFlag").$D("精确评估计划日期"),
          fieldCode: "preciseFlag",
          formRow: 10,
          formCol: 20,
          render: (val) => isNil(val) ? "-" : yesOrNoRenderer(val),
        },
      ];
    },
    // 供应商评估规则信息
    getEvaRulesColumns() {
      return [
        {
          fieldName: this.$T("sslm.evaluationStrategyDetail.form.label.evalType").$D("评分方式"),
          fieldCode: "evalTypeMeaning",
          formRow: 10,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.evaluationStrategyDetail.form.label.evalTemplate").$D("评分模板"),
          fieldCode: "evalTplName",
          formRow: 10,
          formCol: 20,
        },
      ];
    },
    // 采供方交互规则信息
    getPurSupIntRulesColumns() {
      return [
        {
          fieldName: this.$T("sslm.evaluationStrategyDetail.form.label.isSupplierSelfAssessment").$D("需要供应商自评"),
          fieldCode: "supplierSelfAssessmentFlag",
          formRow: 10,
          formCol: 10,
          render: (val) => isNil(val) ? "-" : yesOrNoRenderer(val),
        },
        {
          fieldName: this.$T("sslm.evaluationStrategyDetail.form.label.selfratedByIndicatorYype").$D("按照指标类型自评"),
          fieldCode: "selfIndicatorType",
          formRow: 10,
          formCol: 20,
          render: (val) => isNil(val) ? "-" : yesOrNoRenderer(val),
        },
        {
          fieldName: this.$T("sslm.evaluationStrategyDetail.form.label.evalScope").$D("自评范围"),
          fieldCode: "evalScopeMeaning",
          formRow: 20,
          formCol: 10,
        },
        {
          fieldName: this.$T("sslm.evaluationStrategyDetail.form.label.isAutoPublish").$D("自动发布评估结果"),
          fieldCode: "supplierAutoPublishFlag",
          formRow: 20,
          formCol: 20,
          render: (val) => isNil(val) ? "-" : yesOrNoRenderer(val),
        },
        {
          fieldName: this.$T("sslm.evaluationStrategyDetail.form.label.viewParentFlag").$D("允许查看上级指标"),
          fieldCode: "viewParentFlag",
          formRow: 30,
          formCol: 10,
          render: (val) => isNil(val) ? "-" : yesOrNoRenderer(val),
        },
        {
          fieldName: this.$T("sslm.evaluationStrategyDetail.form.label.autoExecuteFlag").$D("供应商自评后自动执行评分"),
          fieldCode: "autoExecuteFlag",
          formRow: 40,
          formCol: 10,
          render: (val) => isNil(val) ? "-" : yesOrNoRenderer(val),
        },
      ];
    },
  },
};
</script>
