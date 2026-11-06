<template>
  <div style="height: 100vh">
    <!-- <nav-head :title="$T('sslm.investigCorrelat.view.message.approval.title').$D('调查表审批')" @goBack="goBack"/> -->
    <srm-list
      :data-set="dataSet"
      :columns="getColumns"
      customize-code="SMBL.INVESTION_APPROVAL.LIST"
      @itemClick="goToDetail"/>
  </div>
</template>

<script>
import indexDs from "../datasource/indexDS";
import { DataSet } from "srm-mobile-ui";
export default {
  modules: [ "sslm.common", "ssrc.inquiryHall", "ssrc.bidHall", "sslm.investigCorrelat", "sslm.supplierReview", "sslm.supplierDetail", "smbl.common" ],
  name: "InvestigationApprovalList",
  components: {},
  data() {
    return {
      dataSet: new DataSet(indexDs()),
    };
  },
  computed: {
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "investgNumber",
          fieldType: "EMPTY",
          render: (val, record) =>
            <SrmListHeader>
              <span>
                {this.$T("sslm.common.model.investigate.code").$D("调查表编号")}：{record.investgNumber}
              </span>
              <span slot="right">
                {record.processStatusMeaning}
              </span>
            </SrmListHeader>
          ,
        },
        {
          formRow: 20,
          formCol: 10,
          fieldCode: "partnerCompanyName",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.common.model.supplierName").$D("供应商名称"),
        },
        {
          formRow: 30,
          formCol: 10,
          fieldCode: "companyName",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.common.view.company.companyName").$D("公司名称"),
        },
        {
          formRow: 40,
          formCol: 10,
          fieldCode: "investigateTypeMeaning",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.investigCorrelat.view.message.investigateType").$D("调查表类型"),
        },
        {
          formRow: 50,
          formCol: 10,
          fieldCode: "investigateLevelMeaning",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.common.model.investigate.level").$D("调查表管控维度"),
        },
        {
          formRow: 60,
          formCol: 10,
          fieldCode: "templateName",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.common.model.investigate.template.name").$D("调查表模板名称"),
        },
        {
          formRow: 70,
          formCol: 10,
          fieldCode: "createUserName",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.common.view.creator.name").$D("创建人"),
        },
        {
          formRow: 70,
          formCol: 20,
          fieldCode: "submitDate",
          fieldType: "TEXT",
          fieldName: this.$T("sslm.investigCorrelat.view.message.submitDate").$D("提交日期"),
        },
      ];
    },
  },
  methods: {
    goToDetail(item) {
      const { investgHeaderId, investigateTemplateId } = item.data;
      this.$router.push({
        name: "InvestigationApprovalDetail",
        query: { investgHeaderId, investigateTemplateId }
      });
    },
    // 退出子应用
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style lang="stylus" scoped>
.status {
  display: inline-block;
  height: 22px;
  line-height: 22px;
  text-align: center;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: var(--color-font-default-b);
}
</style>
