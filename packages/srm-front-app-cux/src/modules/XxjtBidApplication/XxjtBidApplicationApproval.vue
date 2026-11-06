<template>
  <div ref="priceExecute" class="price-execute-approval">
    <srm-scroll-tab>
      <srm-scroll-tab-item
        :label="$T('scux.bidApplication.view.title.bidEdit').$D('标的信息')">
        <div v-if="bidInfo && bidInfo.length > 0" style="padding-top: 16px;">
          <srm-list
            :data-set="bidInfoDataSet"
            :columns="getBidColumns"/>
        </div>
        <div v-else class="noContent">
          <span>{{ $T("hipspfm.workFlow.view.message.noBasicInfo").$D("暂无基本信息") }}</span>
        </div>
      </srm-scroll-tab-item>
      <srm-scroll-tab-item
        :label="$T('scux.bidApplication.view.title.lineInfo').$D('分级详情')">
        <div v-if="lineInfo && lineInfo.length > 0" style="padding-top: 16px;">
          <srm-list
            :data-set="lineInfoDataSet"
            :columns="getLineColumns"/>
        </div>
        <div v-else class="noContent">
          <span>{{ $T("hipspfm.workFlow.view.message.noBasicInfo").$D("暂无基本信息") }}</span>
        </div>
      </srm-scroll-tab-item>
    </srm-scroll-tab>
  </div>
</template>

<script>
import { DataSet } from "srm-mobile-ui";
import { bidInfoDs } from "./dataSource/bidDs";
import { lineInfoDs } from "./dataSource/lineDs";
import { getBaseInfoApi } from "./api";

export default {
  modules: [ "scux.bidApplication", "hipspfm.workFlow" ],
  name: "XxjtBidApplication",
  props: {
    changeReqId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      targetInfoId: null,
      targetCode: null,
      bidInfo: [],
      lineInfo: [],
      bidInfoDataSet: new DataSet(bidInfoDs()),
      lineInfoDataSet: new DataSet(lineInfoDs()),
    };
  },
  computed: {
    getBidColumns() {
      return [
        {
          fieldName: this.$T("scux.bidApplication.model.bidApplication.targetCode").$D("标的编码"),
          fieldCode: "targetCode",
          render: (val) => <srm-list-header show-open-tag={true}>
            <span>{ val }</span>
          </srm-list-header>
        },
        {
          fieldName: this.$T("scux.bidApplication.model.bidApplication.targetName").$D("标的名称"),
          fieldCode: "targetName",
        },
        {
          fieldName: this.$T("scux.bidApplication.model.bidApplication.lastFlag").$D("是否为末级"),
          fieldCode: "lastFlagMeaning",
        },
        {
          fieldName: this.$T("scux.bidApplication.model.bidApplication.lastUpdateUserMeaning").$D("发起人"),
          fieldCode: "lastUpdateUserMeaning",
          render: (val, record) => <span>{val ? val : record.createdByMeaning}</span>
        },
        {
          fieldName: this.$T("scux.bidApplication.model.bidApplication.enableFlag").$D("启用/禁用"),
          fieldCode: "enableFlagMeaning",
        },
        {
          fieldName: this.$T("scux.bidApplication.model.bidApplication.status").$D("状态"),
          fieldCode: "targetStatusMeaning",
        },
        {
          fieldName: this.$T("scux.bidApplication.model.bidApplication.approveStatus").$D("审批状态"),
          fieldCode: "approveStatusMeaning",
        },
        {
          fieldName: this.$T("scux.bidApplication.model.bidApplication.approvelComment").$D("最新审批意见"),
          fieldCode: "approvelComment",
        },
        {
          fieldName: this.$T("scux.bidApplication.model.bidApplication.remark").$D("备注"),
          fieldCode: "modifyReason",
        },
      ];
    },
    getLineColumns() {
      return [
        {
          fieldName: this.$T("scux.bidApplication.model.bidApplication.targetClass").$D("标的分级"),
          fieldCode: "targetClassMeaning",
        },
        {
          fieldName: this.$T("scux.bidApplication.model.bidApplication.targetClassScope").$D("分级适用范围"),
          fieldCode: "targetClassScope",
        },
        {
          fieldName: this.$T("scux.bidApplication.model.bidApplication.professQualification").$D("专业资质"),
          fieldCode: "professQualification",
        },
        {
          fieldName: this.$T("scux.bidApplication.model.bidApplication.lastYearRevenue").$D("上年营业收入大于等于(万元)"),
          fieldCode: "lastYearRevenue",
        },
        {
          fieldName: this.$T("scux.bidApplication.model.bidApplication.achievement").$D("近三年业绩数量"),
          fieldCode: "achievement",
        },
        {
          fieldName: this.$T("scux.bidApplication.model.bidApplication.registeredCapital").$D("注册资金(万元)"),
          fieldCode: "registeredCapital",
        },
        {
          fieldName: this.$T("scux.bidApplication.model.bidApplication.industryRanking").$D("行业排名"),
          fieldCode: "industryRanking",
        },
        {
          fieldName: this.$T("scux.bidApplication.model.bidApplication.enterpriseNature").$D("企业性质"),
          fieldCode: "enterpriseNatureMeaning",
        },
        {
          fieldName: this.$T("scux.bidApplication.model.bidApplication.enterpriseCertification").$D("体系认证"),
          fieldCode: "enterpriseCertificationMeaning",
        },
      ];
    },
  },
  beforeMount() {
    // 解析参数
    let params = this.$route.query;
    this.targetInfoId = params.targetInfoId;
    this.targetCode = params.targetCode;
  },
  async mounted() {
    const result = await getBaseInfoApi(this.targetInfoId, this.targetCode);
    if (result) {
      if (!result.failed) {
        this.bidInfoDataSet.setData(result.targetInfoList);
        this.lineInfoDataSet.setData(result.targetLineList);
        this.bidInfo = result.targetInfoList;
        this.lineInfo = result.targetLineList;
      }
    }
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