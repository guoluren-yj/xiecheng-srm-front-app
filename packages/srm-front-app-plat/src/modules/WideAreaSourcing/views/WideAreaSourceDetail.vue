<template>
  <div style="height: 100vh;">
    <!-- 导航 -->
    <nav-head :title="$T('smbl.wideArea.view.title.details').$D('供应商详情')" />
    <div v-loading="loading" class="main-info">
      <!-- 内容区域 -->
      <srm-scroll-tab class="content">
        <srm-scroll-tab-item :label="$T('smbl.wideArea.view.title.baseInfo').$D('基础信息')" @click.native="showLineDetail">
          <customize :need-padding="true" :data-source="baseInfo.registerInfo" :columns="getBaseInfoColumns" />
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('smbl.wideArea.modal.operatingIndexScore').$D('经营指数')" >
          <div v-show="!loading && Object.keys(wideSourceEval).length" class="chart-wrap">
            <div class="chart-warp-head">
              <div class="chat-wrap-head-tit">{{ wideSourceEval.finalScore }}</div>
              <div class="chart-warp-head-right">
                <div>
                  <srm-score :achieved-score="2" style-type="star" :number="2" />
                </div>
                <div class="chart-warp-head-status">{{ compLevel(wideSourceEval.finalScore) }}</div>
              </div>
            </div>
            <div id="manage-chart"/>
          </div>
          <div v-show="!loading && !Object.keys(wideSourceEval).length" class="no-data"> {{ $T('smbl.wideArea.view.title.noData').$D('暂无数据') }}</div>
        </srm-scroll-tab-item>
        <srm-scroll-tab-item :label="$T('smbl.wideArea.view.title.riskControlIndex').$D('风控指数')" >
          <div v-show="!loading && Object.keys(riskData).length" class="chart-wrap">
            <div class="chart-warp-head">
              <div class="chat-wrap-head-tit">{{ getRiskFinalScore }}</div>
              <div class="chart-warp-head-right">
                <div>
                  <srm-score :achieved-score="2" style-type="star" :number="2" />
                </div>
                <div class="chart-warp-head-status">{{ compRiskLevel }}</div>
              </div>
            </div>
            <div id="risk-chart"/>
          </div>
          <div v-show="!loading && !Object.keys(riskData).length" class="no-data"> {{ $T('smbl.wideArea.view.title.noData').$D('暂无数据') }}</div>
        </srm-scroll-tab-item>
      </srm-scroll-tab>
    </div>

    <!-- 行信息弹窗 -->
    <srm-popup :visible.sync="visible" height="100%" position="right" :title="$T('smbl.wideArea.view.title.baseInfo').$D('基础信息')">
      <div style="height: 100%; overflow: auto;">
        <customize-detail :need-padding="true" :data-source="baseInfo.registerInfo" :columns="getBaseInfoDetailColumns" />
      </div>
    </srm-popup>
  </div>
</template>

<script>
import {
  getDetailApi,
  getManageApi,
  getRiskApi,
} from "../api";

import { Radar } from "@antv/g2plot";
import { SrmUtil } from "srm-mobile-ui";

export default {
  modules: [ "smbl.wideArea" ],
  name: "WideAreaSourceDetail",
  components: {
  },
  data() {
    return {
      corpName: "", //公司名称
      taxNo:"",
      visible: false, //行信息弹窗
      unreadCount: 0,
      loading: true,
      baseInfo: {}, //基础信息
      riskData: {}, //风险信息
      wideSourceEval: {}, //经营信息
      riskMapData: {}, //风险配置信息
    };
  },
  computed: {
    // 基础信息
    getBaseInfoColumns() {
      const columns = [
        {
          formRow: 0,
          fieldCode: "itemName",
          fieldType: "EMPTY",
          render: (val, item) => <SrmListHeader>
            <span>{item.enterpriseName}</span>
            <span slot="right" style="color: #05944F">{item.operateStatus}</span>
          </SrmListHeader>
        },
        {
          fieldName: this.$T("smbl.wideArea.model.companyType").$D("公司类型"),
          fieldCode: "enterpriseType",
        },
        {
          fieldName: this.$T("smbl.wideArea.model.lookNums").$D("浏览数"),
          fieldCode: "viewCount",
          render: () => this.baseInfo.viewCount
        },
        {
          fieldName: this.$T("smbl.wideArea.model.localArea").$D("所在地区"),
          fieldCode: "areaName",
        },
        {
          fieldName: this.$T("smbl.wideArea.model.registeredCapitalWithUnit").$D("注册资本"),
          fieldCode: "registeredCapital",
        },
        {
          fieldName: this.$T("smbl.wideArea.model.creationDate").$D("成立日期"),
          fieldCode: "validityFrom",
        },
        {
          fieldName: this.$T("smbl.wideArea.model.businessRound").$D("经营范围"),
          fieldCode: "businessScope",
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.legalPerson").$D("法人"),
          fieldCode: "legalRepresentative",
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.socialCreditCode").$D("统一社会信用代码"),
          fieldCode: "unifiedSocialCreditCode",
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.phoneNumber").$D("电话"),
          fieldCode: "telephone",
        },
        {
          fieldName: this.$T("smbl.wideArea.model.officialWebsite").$D("官网"),
          fieldCode: "website",
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.email").$D("邮箱"),
          fieldCode: "email",
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.address").$D("地址"),
          fieldCode: "address",
        },
      ];
      return columns;
    },
    // 送货单行详细信息
    getBaseInfoDetailColumns() {
      const columns = [
        {
          fieldName: this.$T("smbl.wideArea.model.companyName").$D("公司名称"),
          fieldCode: "enterpriseName",
        },
        {
          fieldName: this.$T("smbl.wideArea.model.companyStatus").$D("公司状态"),
          fieldCode: "operateStatus",
        },
        {
          fieldName: this.$T("smbl.wideArea.model.companyType").$D("公司类型"),
          fieldCode: "enterpriseType",
        },
        {
          fieldName: this.$T("smbl.wideArea.model.lookNums").$D("浏览数"),
          fieldCode: "viewCount",
          render: () => this.baseInfo.viewCount
        },
        {
          fieldName: this.$T("smbl.wideArea.model.localArea").$D("所在地区"),
          fieldCode: "areaName",
        },
        {
          fieldName: this.$T("smbl.wideArea.model.registeredCapitalWithUnit").$D("注册资本"),
          fieldCode: "registeredCapital",
        },
        {
          fieldName: this.$T("smbl.wideArea.model.creationDate").$D("成立日期"),
          fieldCode: "validityFrom",
        },
        {
          fieldName: this.$T("smbl.wideArea.model.businessRound").$D("经营范围"),
          fieldCode: "businessScope",
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.legalPerson").$D("法人"),
          fieldCode: "legalRepresentative",
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.socialCreditCode").$D("统一社会信用代码"),
          fieldCode: "unifiedSocialCreditCode",
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.phoneNumber").$D("电话"),
          fieldCode: "telephone",
        },
        {
          fieldName: this.$T("smbl.wideArea.model.officialWebsite").$D("官网"),
          fieldCode: "website",
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.email").$D("邮箱"),
          fieldCode: "email",
        },
        {
          fieldName: this.$T("smbl.wideArea.modal.address").$D("地址"),
          fieldCode: "address",
        },
      ];
      return columns;
    },
    // 计算经营指数评级
    compLevel() {
      return (score) => {
        const sum = parseFloat(score);
        const count = sum <= 550 ? 1 : sum <= 650 && sum > 550 ? 2 : 3;
        return count === 3 ?
          this.$T("smbl.wideArea.view.tag.well").$D("优秀") :
          count === 2 ?
            this.$T("smbl.wideArea.view.tag.normal").$D("良好") :
            this.$T("smbl.wideArea.view.tag.serious").$D("一般");
      };
    },
    // 计算风险指数评级
    compRiskLevel() {
      const score = this.getRiskFinalScore;
      const sum = parseFloat(score);
      const count = sum <= 250 ? 1 : sum <= 500 && sum > 250 ? 2 : 3;
      return count === 3 ?
        this.$T("smbl.wideArea.view.tag.warning").$D("预警") :
        count === 2 ?
          this.$T("smbl.wideArea.view.tag.focus").$D("关注") :
          this.$T("smbl.wideArea.view.tag.normalWell").$D("正常");
    },
    // 计算风险总分
    getRiskFinalScore() {
      const { riskData: { modelPointList = [] }, riskMapData = {} } = this;
      let scoreSum = 0;
      if (modelPointList.length) {
        modelPointList.forEach((item) => {
          const proportion = riskMapData[item.name] || 0;
          scoreSum += item.value * proportion;
        });
      }
      return (parseFloat(scoreSum) * 1000).toFixed(2);
    }
  },
  async mounted() {
    const {
      taxNo,
      corpName,
    } = this.$route.query;
    this.taxNo = taxNo;
    this.corpName = corpName;
    this.getBaseInfo();
    this.getRisk();
    this.getManage();

    SrmUtil.getValueSetBatch({ riskMapData: "SMBL.WIDE_AREA_RISK.DATA" }, this);
  },
  methods: {
    // 查看行详情
    showLineDetail() {
      this.visible = !this.visible;
    },
    // 获取基本信息
    getBaseInfo() {
      const { corpName, taxNo } = this;
      const params = {
        taxNo: taxNo,
        corpName: corpName,
      };
      getDetailApi(params).then((res = {}) => {
        this.baseInfo = Object.freeze(res);
      }).finally(() => {
        this.loading = false;
      });
    },
    // 获取风控信息
    getRisk() {
      const { corpName, taxNo } = this;
      const params = {
        taxNo: taxNo,
        corpName: corpName,
      };
      getRiskApi(params).then((res) => {
        if (res.failed) {
          this.riskData = {};
        } else {
          this.riskData = res || {};
          this.paintRiskChart();
        }
      });
    },
    // 获取经营指数
    getManage() {
      const { corpName, taxNo } = this;
      const params = {
        taxNo: taxNo,
        corpName: corpName,
      };
      getManageApi(params).then((res) => {
        this.wideSourceEval = res.wideSourceEval || {};
        this.paintManageChart();
      });
    },
    // 绘制经营指数雷达图
    paintManageChart() {

      const { wideSourceEval: { score0 = 0, score1 = 0, score2 = 0, score3 = 0, score4 = 0 } } = this;
      const data = [
        { name: this.$T("smbl.wideArea.view.title.performanceAbility").$D("履约能力"), value: parseFloat(score0, 10) },
        { name: this.$T("smbl.wideArea.view.title.customerStability").$D("客户稳定度"), value: parseFloat(score1, 10) },
        { name: this.$T("smbl.wideArea.view.title.productQuality").$D("商品质量"), value: parseFloat(score2, 10) },
        { name: this.$T("smbl.wideArea.view.title.commodityStability").$D("商品稳定度"), value: parseFloat(score3, 10) },
        { name: this.$T("smbl.wideArea.view.title.historicalPerformance").$D("历史绩效"), value: parseFloat(score4, 10) },
      ];
      const radarPlot = new Radar("manage-chart", {
        data: data,
        xField: "name",
        yField: "value",
        meta: {
          value: {
            min: 0,
            nice: true,
          },
        },
        xAxis: {
          line: null,
          tickLine: null,
          grid: {
            line: {
              style: {
                lineDash: null,
              },
            },
          },
        },
        yAxis: {
          line: null,
          tickLine: null,
          grid: {
            line: {
              type: "line",
              style: {
                lineDash: null,
              },
            },
          },
        },
        area: {},
      });
      radarPlot.render();
    },
    // 绘制风险指数雷达图
    paintRiskChart() {

      const { riskData: { modelPointList = [] } } = this;
      const data = modelPointList.map((v) => ({ name: v.name, value: (parseFloat(v.value) * 1000).toFixed(2) }));
      // 具体配置文档地址：https://g2plot.antv.vision/zh/examples/more-plots/radar#line-grid
      const radarPlot = new Radar("risk-chart", {
        data: data,
        xField: "name",
        yField: "value",
        // 全局化配置图表数据元信息，以字段为单位进行配置，来定义数据的类型和展示方式
        meta: {
          value: {
            min: 0,
            nice: true,
          },
        },
        // 轴线配置，与yAxis相同
        xAxis: {
          // 坐标轴线的配置项，null 表示不展示。
          line: null,
          // 坐标轴刻度线的配置项，null 表示不展示。
          tickLine: null,
          // 坐标轴网格线的配置项，null 表示不展示。
          grid: {
            // 线的样式,
            line: {
              // 虚线配置，第一个值为虚线每个分段的长度，第二个值为分段间隔的距离。
              style: {
                lineDash: null,
              },
            },
          },
        },
        yAxis: {
          line: null,
          tickLine: null,
          grid: {
            line: {
              type: "line",
              style: {
                lineDash: null,
              },
            },
          },
        },
      });
      radarPlot.render();
    },
  },
};
</script>

<style lang="stylus" scoped>
.main-info {
  height: 100%;
  overflow-y: auto;
  background: #f6f6f6;
  padding-bottom: 75px;
  padding-bottom: calc(75px + constant(safe-area-inset-bottom));
  padding-bottom: calc(75px + env(safe-area-inset-bottom));
}
.chart-wrap {
  width: 100%;
  max-height: 300px;
  padding: 16px 15px;
  .chart-warp-head {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .chat-wrap-head-tit {
      font-size: 22px;
      color: #333333;
      line-height: 32px;
      font-weight: 600;
    }

    .chart-warp-head-right {
      display: flex;
      .chart-warp-head-status {
        color: #FFC043;
      }
    }

  }
  #manage-chart, #risk-chart {
    width: 100%;
    height: 220px;
  }
}
.no-data {
  width: 100%;
  height: 300px;
  line-height: 300px;
  text-align: center;
}
</style>
