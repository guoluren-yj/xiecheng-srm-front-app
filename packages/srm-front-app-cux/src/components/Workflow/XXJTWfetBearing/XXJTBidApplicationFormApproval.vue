<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.xxjtWfetBearing.view.title.baseInfo').$D('基础信息')">
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
        :label="$T('scux.xxjtWfetBearing.view.title.bidEdit').$D('标的信息')">
        <srm-list
          :data-set="bidLineDataSet"
          :columns="bidLineColumns"/>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.xxjtWfetBearing.view.title.lineInfo').$D('分级详情')">
        <srm-list
          :data-set="formLineDataSet"
          :columns="formLineColumns"/>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { getApplicationFormData } from "./api";
import { DataSet } from "srm-mobile-ui";
import { bidLineDs, formLineDs } from "./dataSource/lineDs";
// ceshi
export default {
  modules: [ "scux.xxjtWfetBearing", "hipspfm.workFlow" ],
  name: "XXJTWfetBearing",
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      headerInfo: {},
      bidLineDataSet: new DataSet(bidLineDs()),
      formLineDataSet: new DataSet(formLineDs()),
    };
  },
  computed: {
    getHeaderColumns() {
      return () => [
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.applyCode").$D("申请单号"),
          fieldCode: "applyCode",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.modifyType").$D("申请类型"),
          fieldCode: "modifyTypeMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.approveStatus").$D("申请状态"),
          fieldCode: "approveStatusMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.lastUpdateUser").$D("发起人"),
          fieldCode: "lastUpdateUserMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.actionDate").$D("操作时间"),
          fieldCode: "creationDate",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.approvelComment").$D("审批意见"),
          fieldCode: "approvelComment",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.reason").$D("原因"),
          fieldCode: "reason",
        },
      ];
    },
    bidLineColumns() {
      return [
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.targetCode").$D("标的编码"),
          fieldCode: "targetCode",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.targetName").$D("标的名称"),
          fieldCode: "targetName",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.lastFlag").$D("是否为末级"),
          fieldCode: "lastFlagMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.lastUpdateUserMeaning").$D("发起人"),
          fieldCode: "lastUpdateUserMeaning",
          render: (val, record) => val || record.createdByMeaning,
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.enableFlag").$D("启用/禁用"),
          fieldCode: "enableFlagMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.status").$D("状态"),
          fieldCode: "targetStatusMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.approveStatus").$D("审批状态"),
          fieldCode: "approveStatusMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.last.approvelComment").$D("最新审批意见"),
          fieldCode: "approvelComment",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.remark").$D("备注"),
          fieldCode: "modifyReason",
        },
      ];
    },
    formLineColumns() {
      return [
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.targetClass").$D("标的分级"),
          fieldCode: "targetClassMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.targetClassScope").$D("分级适用范围"),
          fieldCode: "targetClassScope",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.professQualification").$D("专业资质"),
          fieldCode: "professQualification",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.lastYearRevenue").$D("上年营业收入大于等于(万元)"),
          fieldCode: "lastYearRevenue",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.achievement").$D("近三年业绩数量"),
          fieldCode: "achievement",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.registeredCapital").$D("注册资金(万元)"),
          fieldCode: "registeredCapital",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.industryRanking").$D("行业排名"),
          fieldCode: "industryRanking",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.last.enterpriseNature").$D("企业性质"),
          fieldCode: "enterpriseNatureMeaning",
        },
        {
          fieldName: this.$T("scux.xxjtWfetBearing.model.bidApplication.enterpriseCertification").$D("体系认证"),
          fieldCode: "enterpriseCertificationMeaning",
        },
      ];
    },
  },
  async mounted() {
    this.headerInfo = await getApplicationFormData({ applyCode: this.changeReqId });
    this.bidLineDataSet.setData(this.headerInfo.targetInfoList || []);
    this.formLineDataSet.setData(this.headerInfo.targetLineList || []);
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