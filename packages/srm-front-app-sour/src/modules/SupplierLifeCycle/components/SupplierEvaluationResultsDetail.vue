<!-- eslint-disable rulesdir/no_hips -->
<template>
  <hips-popup v-model="showLineDetail" class="FullPop" style="height: 100%;width:100%" position="bottom">
    <section class="lineInfoDetail">
      <hips-nav-bar slot="header" :have-border="false">
        <div slot="left" class="left-button" @click="closeLineInfoDetail">
          <img class="image-gray-default" src="@/assets/icon_close_normal@3x.png" alt="">
        </div>
        <div slot="center" class="header">{{ $T("sslm.supplierDetail.view.message.title.evaluationResults").$D("供应商考评结果") }}</div>
      </hips-nav-bar>
      <hips-scroll
        ref="scrollA"
        :data="[orderList]"
        :scroll-options="scrollOption"
        @pulling-up="loadMore">
        <div class="lineBody">
          <li>
            <span>{{ $T("hipspfm.supplierLifeCycle.model.supplierLifeCycle.enabledFlag").$D("状态") }}：</span>
            <span>{{ list.evalStatusMeaning }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.evaluationQuery.model.archive.num").$D("档案编码") }}：</span>
            <span>{{ list.evalNum }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.evaluationQuery.model.archive.describe").$D("档案描述") }}：</span>
            <span>{{ list.evalName }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.evaluationQuery.model.evaluation.template").$D("考评模板") }}：</span>
            <span>{{ list.evalTplName }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.evaluationQuery.model.evaluation.cycle").$D("考评周期") }}：</span>
            <span>{{ list.evalCycleMeaning }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.evaluationQuery.model.evaluation.startDate").$D("考评时间从") }}：</span>
            <span>{{ list.evalDateFrom|CalcDate }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.evaluationQuery.model.evaluation.endDate").$D("考评时间至") }}：</span>
            <span>{{ list.evalDateTo|CalcDate }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.evaluationQuery.model.evaluation.dimension").$D("考评维度") }}：</span>
            <span>{{ list.evalDimensionMeaning }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.evaluationQuery.model.evaluation.charger").$D("考评负责人") }}：</span>
            <span>{{ list.processUserName }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.evaluationQuery.model.archive.create.time").$D("建档时间") }}：</span>
            <span>{{ list.creationDate }}</span>
          </li>
        </div>

        <div class="financialSituation">
          <ul v-for="(item,index) in orderList" :key="index">
            <li>
              <span>
                <span class="block"/>
                <span>{{ item.supplierName }}</span>
                <span class="lineSamll">{{ $T("sslm.evaluationQuery.model.archive.rankNum").$D("排名") }}：{{ item.rankNum }}</span>
              </span>
            </li>
            <li>
              <span>{{ $T("slm.evaluationQuery.model.feedback.remark").$D("反馈") }}：{{ item.respRemarks }}</span>
            </li>
            <li v-if="item.categoryName">
              <span v-if="item.categoryName && list.evalGranularity === 'SU+CA'">{{ $T("sslm.supplyAbility.model.supplyAbility.itemCategoryName").$D("品类") }}：{{ item.categoryName }}</span>
              <span v-if="item.categoryName && list.evalGranularity === 'SU+IT'">{{ $T("sslm.evaluationQuery.model.material.item").$D("物料") }}：{{ item.categoryName }}</span>
            </li>
            <li>
              <span>{{ $T("sslm.evaluationQuery.model.archive.lineScore").$D("得分") }}：{{ item.lineScore }}</span>
              <span>{{ $T("sslm.evaluationQuery.model.item.level").$D("等级") }}：{{ item.levelCode }}</span>
            </li>
            <li>
              <span>{{ $T("sslm.evaluationQuery.model.archive.supplierNum").$D("供应商编码") }}：{{ item.supplierNum }}</span>
            </li>
          </ul>
        </div>
      </hips-scroll>
    </section>
  </hips-popup>
</template>

<script>
import { Popup, NavBar, Scroll } from "hips";
import uuid from "uuid";
import { getSupplierEvaluationResultsDetailApi } from "../api";

export default {
  modules: [ "sslm.supplierDetail", "hipspfm.supplierLifeCycle", "sslm.evaluationQuery", "slm.evaluationQuery", "sslm.supplyAbility" ],
  name:"SupplierEvaluationResultsDetail",
  components: {
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
    [Popup.name]: Popup,
  },
  props:{
    "value": { // 弹出层状态
      type: Boolean,
      default: false,
    },
    "lineInfoDetail": { // 弹出层内容
      type: Object,
      default: () => ({}),
    },
    "showFilePop":{
      type: Function,
      default: () => ({})
    },
    "queryParams": {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      uuid: "",
      list:{},
      orderList:[],
      totalCount:0,
      currentPage:0,
      scrollOption:{
        pullDownRefresh: false,
        pullUpLoad: {
          txt: {},
        },
      }
    };
  },
  computed: {
    showLineDetail:{
      get() {
        return this.value;
      },
      // eslint-disable-next-line no-unused-vars
      set(val) {
      }
    }
  },
  watch:{
    lineInfoDetail:{
      deep:true,
      // eslint-disable-next-line no-unused-vars
      handler: function(nVal, oVal) {
        this.currentPage = 0;
        this.orderList = [];
        if (nVal.evalHeaderId) {
          this.fetchData(nVal);
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.uuid = uuid();
  },
  methods:{
    closeLineInfoDetail() {
      this.showLineDetail = false;
      this.$emit("input", false);
    },
    async fetchData({ evalHeaderId = 11509 } = nVal) {
      this.$loading.show();
      const params = {
        "selectOptional": "SUPPLIER",
        evalHeaderId,
        "supplierId": this.queryParams.supplierCompanyId,
        "organizationId": Number(window.localStorage.getItem("organizationId")),
        "page":this.currentPage,
        "size":10
      };
      this.list = await getSupplierEvaluationResultsDetailApi(evalHeaderId, params);
      const { totalElements, content } = this.list.kpiEvalDetailLineDTOPage;
      this.totalCount = totalElements;
      this.orderList = [ ...this.orderList, ...content ];
      this.$loading.hide();
    },
    // 加载更多数据
    async loadMore() {
      if (this.orderList.length < this.totalCount) {
        this.currentPage++;
        await this.fetchData();
      } else {
        this.$nextTick(() => {
          this.$refs.scrollA.forceUpdate();
        });
      }
    },
  }
};
</script>

<style lang="stylus" scoped>
// >>> .hips-nav-bar__theme-default{
//     height:47px !important
// }
>>> .hips-scroll__pullup{
  background-color:var(--color-font-default-d);
}
.lineInfoDetail {
  background: #FAFBFC;
  height: 100%;
  display:flex;
  flex-direction: column;
  .header {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color:var(--color-font-default);
    text-align: center;
    font-weight:700;
    line-height: 26px;
  }

  .lineBody {
    background-color:var(--color-font-default-d);
    height: 100%
    overflow: auto;
    li {
      display: flex;
      padding: 16px 20px  15px 0;
      margin-left: 20px;
      border-bottom:1px solid var(--color-border-default);
      &:nth-of-type(1){
        // padding-top: 20px;
      }

      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default);
        line-height: 22px;
        &:nth-child(1){
          width:31%;
        }
        &:nth-child(2) {
          color:var(--color-font-default-b);
          display: inline-block;
          width: 60%;
          text-align: left;
          word-wrap: break-word;
          word-break: break-all;
          img{
            width:12px;
            height:12px;
            float: right;
            margin-top: 4px;
          }
        }
      }
    }

  }

  .block{
      width:6px;
      height:14px;
      border-radius:1px;
      background-color : var(--color-other-default-b);
      margin:0px 14px 0 0;
    }
    .financialSituation{
      border-top:8px solid var(--color-border-default);
      background-color:var(--color-font-default-d);
      .lineSamll {
        background:var(--color-bg-default-c);
        color: var(--color-other-default-b);
        margin-left:8px;
        border-radius: 2px;
        padding: 1px 4px;
        font-weight: normal;
        font-size: 10px !important;
        line-height: 18px;
        display:inline-block
      }
      ul{
        padding:0;
        li:nth-child(1){
          padding:13px 20px 7px 0px;
          margin-bottom:0px;
          border: none;
          span{
            display: flex;
            align-items: center;
            flex:none;
            .block{
              display:inline-block;
              margin:0 14px 0 0;
            }
            span:nth-child(2){
              margin-right:12px;
              font-family: PingFangSC-Medium;
              font-size: 14px;
              color:var(--color-font-default);
              line-height: 22px;
              font-weight:700;
              max-width:270px;
            }
          }
        }
        li{
          margin-bottom:2px;
          padding:5px 20px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color:var(--color-font-default);
          line-height: 22px;
          display: flex;
          span{
            flex:1
          }
        }
        li:nth-last-child(1){
          padding:5px 20px 13px 20px;
          border:none;
          margin-bottom:0px;
        }
      }
    }
}
</style>