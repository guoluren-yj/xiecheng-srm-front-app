<!-- eslint-disable rulesdir/no_hips -->
<template>
  <hips-view>
    <!-- 基本信息详情弹窗 -->
    <!-- <hips-popup class="FullPop" style="height: 100%;width:100%" v-model="show" position="right"> -->
    <section class="headInfoDetail">
      <hips-nav-bar v-if="showBackFlag" :have-border="false" class="detail-navbar">
        <div slot="left" class="left-button" @click="goBack">
          <img
            src="@/assets/4.0/icon_Navigation_bar_left_default_w@3x.png"
            class="image-black-default">
          {{ $T("sslm.siteInvestigateReport.view.tabs.basicInfo").$D("基本信息") }}
        </div>
        <div slot="right" class="right-button">
          <span>
            <img
              class="image-black-default"
              src="@/assets/4.0/icon_Navbar_top_default_w@3x.png"
              alt
              @click="goTopA">
            <i>|</i>
            <img
              class="image-black-default"
              src="@/assets/4.0/icon_Navbar_closed_default_w@3x.png"
              alt
              @click="goClose">
          </span>
        </div>
      </hips-nav-bar>
      <div class="lineHead">
        <li>
          <span>
            <span>{{ headInfo.evalNum }}</span>
          </span>
        </li>
        <p>
          <span>{{ $T("sslm.siteInvestigateReport.modal.mange.describe").$D("考察报告描述") }}：</span>
          <span>{{ headInfo.evalDescription }}</span>
        </p>
        <p>
          <span>{{ $T("sslm.siteInvestigateReport.modal.mange.supplier").$D("供应商") }}：</span>
          <span>{{ headInfo.supplierName }}</span>
        </p>
      </div>
      <div ref="headDetail" class="language-class-ul-li line-border">
        <ul>
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.creationDate").$D("创建时间") }}：</span>
            <span>{{ headInfo.creationDate }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.createdBy").$D("创建人") }}：</span>
            <span>{{ headInfo.realName }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.createDepartment").$D("创建人部门") }}：</span>
            <span>{{ headInfo.unitName }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.company").$D("公司") }}：</span>
            <span>{{ headInfo.companyName }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.inventoryOrg").$D("库存组织") }}：</span>
            <span>{{ headInfo.organizationName }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.warehouse").$D("库房") }}：</span>
            <span>{{ headInfo.inventoryName }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.scoreWay").$D("评分方式") }}：</span>
            <span>{{ headInfo.evalTypeMeaning }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.template").$D("考察模板") }}：</span>
            <span>{{ headInfo.evalTplName }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.weightCalculation").$D("权重式计算") }}：</span>
            <span>{{ headInfo.weightedFlag === 1 ? $T("hipspfm.common.status.yes").$D("是"):(headInfo.weightedFlag === 0?$T("hipspfm.common.status.no").$D("否"):'') }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.surveyTimeFrom").$D("考察时间从") }}：</span>
            <span>{{ headInfo.evalDateFrom | CalcDate }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.surveyTimeTo").$D("考察时间至") }}：</span>
            <span>{{ headInfo.evalDateTo | CalcDate }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.supplierContact").$D("供应商联系人") }}：</span>
            <span>{{ headInfo.supplierContactor }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.supplierContactInfo").$D("供应商联系方式") }}：</span>
            <span>{{ headInfo.supplierContactPhone ? headInfo.internationalTelMeaning + " | " + headInfo.supplierContactPhone : "" }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.supplierType").$D("供应商类型") }}：</span>
            <span>{{ headInfo.supplierTypeMeaning }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.supplierProfile").$D("供应商概况") }}：</span>
            <span>{{ headInfo.supplierOverview }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.supplierRegistAddress").$D("供应商注册地址") }}：</span>
            <span>{{ headInfo.supplierRegisteredAddress }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.actualSurveyAddress").$D("实际考察地址") }}：</span>
            <span>{{ headInfo.evalAddress }}</span>
          </li>
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.inspectionInstruct").$D("考察说明") }}：</span>
            <span>{{ headInfo.evalRemark }}</span>
          </li>
        </ul>
      </div>
    </section>
  </hips-view>
</template>

<script>
import {
  View,
  Popup,
  Input,
  NavBar,
  Scroll,
} from "hips";

export default {
  modules: [ "sslm.siteInvestigateReport", "hipspfm.common" ],
  name: "SiteInvestigateReportDetailB",
  components: {
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
  },
  data() {
    return {
      height: "height: calc(100vh - 120px)",
      noHeadHeight: "height: calc(100vh - 66px)",
      headInfo:{}
    };
  },
  computed: {
  },
  async mounted() {
    const { headInfo } = this.$route.query;

    this.headInfo = headInfo;
  },
  methods: {
    // 返回
    goBack() {
      this.$router.back();
    },
    //退出子应用
    goClose() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    //回到顶部
    goTopA() {
      this.$refs.headDetail.scrollTop = 0;
    },
    // 滚动事件
    handlerScroll({ x, y }) {
      this.$handlerScroll(x, y, this);
    }
  }
};
</script>

<style lang="stylus" scoped>

.detail-navbar{
  .left-button {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: var(--color-font-default);
    line-height: 24px;
    font-weight: bold;

    img {
      height: 12.7px;
      width: 15.3px;
      margin-right: 10.7px;
      margin-top: 4px;
    }
  }

  .right-button {
    margin-right: 15px;
    z-index: 1;
    color: var(--color-font-default-f);

    span {
      display: flex;
      align-items: center;
      width: 77px;
      height: 32px;
      padding: 7px 10px;
      background: var(--color-bg-default);
      border: 1px solid var(--color-border-default);
      border-radius: 18px;

      i {
        margin: 0px 8px;
        position relative
        top:-1px
      }
    }

    img {
      height: 18px;
      width: 18px;
    }
  }

}

.tab-scroll{
  .contentWrap {
    height: calc(100vh - 88px);
    overflow: hidden;
  }

    .navWrap {
      width: 100%;
      height: 44px;
      // overflow: hidden;
      position: relative;
      z-index: 999;

      .navContent {
        width: 150%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        li {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: var(--color-font-default-b);
          line-height: 20px;
          text-align: center;
          position: relative;
          margin-left: 20px;

          &.active {
            font-weight bold
            color:var(--color-font-default);
          }

          &.active::before {
            position: absolute;
            left: 0;
            bottom: -10px;
            width: 100%;
            height: 2px;
            background-color: var(--color-other-default-b);
            content: '';
          }
        }
      }
    }

    .infoContent{
      background:var(--color-bg-default)
      font-size: 14px;
      text-align: left;
      color: var(--color-font-default);
      line-height: 20px;
      h3{
          padding 16px 15px 4px 15px
          font-size: 18px;
          font-weight: bold;
          line-height: 24px;
      }
    }
    .headInfo{
      ul{
        padding 4px 0 12px 0
        li{
          margin 8px 15px 0 15px
          isplay: flex;
          align-items: center;

          &:nth-child(1){
            margin-left 0
            font-weight bold
          }

          .has-rgb-blo{
            display inline-block
            width: 6px;
            height: 14px;
            background: var(--color-other-default-b);
            margin-right 9px
          }
        }

      }
    }

    .lineInfo{
      .lineInfo-content{
        margin 12px 15px 0 15px
        .editImg{
          width 16px
          height 16px
        }
        .cardNumber{
          width 70px
          height auto
          padding 0
          >>> .hips-input__error-message{
            position absolute
            left 88px
            top -6px
            width 54px
          }
        }
        .can-input{
          display flex
          align-items center
        }
      }
      .distance{
        display flex
        align-items center
        span{
          width 165px
          &:nth-child(1){
            margin-right 15px
            display flex
            align-items center
          }
        }
      }
      .lineInfo-first{
        font-weight bold
      }
      .footer{
        height: 22px;
        background: var(--color-bg-default-d);
        border-radius: 2px;
        margin 12px 15px
        display inline-block
        text-align center
        font-size: 10px;
        color: var(--color-font-default-c);
        line-height: 22px;
        padding 0 8px
      }
    }

    .materielInfo,.groupInfo{
      ul{
        li{
          &:nth-child(1){
            margin-left 15px
            font-weight bold
          }
        }
      }
    }

    .groupInfo{
      .groupInfo-first{
        display flex
        align-items center
        justify-content space-between
        span:nth-child(2){
          color var(--color-font-default-b)
          font-weight normal
        }

        .groupInfo-tip{
          display inline-block
          background: var(--color-other-default-d);
          border-radius: 4px;
          font-size: 10px;
          font-weight: normal;
          color: var(--color-font-default-d);
          line-height: 12px;
          margin-left 6px;
          padding 2px
        }
      }
    }
}

.fixed-file{
      position fixed
      top 0
      left 0
      transform: translate(302px, 520px);
      z-index:100;
      width: 52px;
      height: 52px;
      background: var(--color-font-default-d);
      box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.09);
      border-radius 50%
      display flex
      align-items center
      justify-content center
      .fixed-file-img{
        width 24px
        height 24px
      }
}

.headInfoDetail{
  >>> .hips-nav-bar__theme-default{
    background-color var(--color-other-default-b) !important
  }
  .detail-navbar .right-button span{
    background var(--color-other-default-b)
    border none
  }
  .left-button{
    color var(--color-font-default-d)
  }

  .lineHead{
    background var(--color-other-default-b)
    padding: 16px 15px 28px 15px
    text-align: left;
    color: var(--color-font-default-d);
    line-height: 20px;
    li{
      font-size: 16px;
      font-weight:bold
      margin-bottom 4px
    }
    p{
      font-size: 14px;
    }
  }
  .line-border{
    position: relative;
    top: -12px;
    border-radius: 12px 12px 0px 0px;
    background var(--color-bg-default)
    height 515px
  }
}

</style>
