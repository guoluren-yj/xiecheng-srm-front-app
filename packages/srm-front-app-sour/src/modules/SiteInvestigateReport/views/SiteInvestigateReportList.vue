<!-- eslint-disable rulesdir/no_hips -->
<template>
  <hips-view>
    <hips-nav-bar v-if="showBackFlag" :have-border="false">
      <div slot="left" class="left-button" @click="goBack">
        <img
          src="@/assets/4.0/icon_Navigation bar_left_default b@3x.png"
          class="image-black-default">
        {{ $T("sslm.siteInvestigateReport.view.filling.title").$D("现场考察报告填制") }}
      </div>
      <div slot="right" class="right-button">
        <span>
          <img
            class="image-black-default"
            src="@/assets/4.0/icon_Navbar_top_default_blank@3x.png"
            alt
            @click="goTop">
          <i>|</i>
          <img
            class="image-black-default"
            src="@/assets/4.0/icon_Navbar_closed_default_blank@3x.png"
            alt
            @click="goBack">
        </span>
      </div>
    </hips-nav-bar>
    <div class="content">
      <div class="search-line">
        <searchs
          v-model="searchVal"
          :handle-search="handleSearch"
          :placeholder="$T('sslm.siteInvestigateReport.view.write.mange.describe').$D('请输入考察报告描述查询')"/>
        <div>
          <img
            class="img-filter"
            src="@/assets/4.0/icon_Searchbar_filter_default@3x.png"
            alt
            @click="showPopup">
        </div>
      </div>
      <total-count :list-len="list.length" :count="totalCount" :info="$T('hipspfm.common.message.documentInfo').$D('单据信息')" />
      <div v-if="list.length" class="scrollWrap" :style="showBackFlag?height:noHeadHeight">
        <hips-scroll
          ref="scroll"
          :data="[list]"
          :scroll-options="scrollOption"
          @pulling-down="loadRefresh"
          @pulling-up="loadMore">
          <div v-for="(li,index) in list" :key="index" class="card">
            <ul @click="toDetail(li)">
              <li class="code">
                <span>{{ li.evalNum }}</span>
                <span style="font-weight:bold;color:#354FF7">{{ li.evalStatusMeaning }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.siteInvestigateReport.modal.mange.supplier").$D("供应商") }}：{{ li.supplierName }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.siteInvestigateReport.modal.mange.template").$D("考察模板") }}：{{ li.evalTplName }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.siteInvestigateReport.modal.mange.describe").$D("考察报告描述") }}：{{ li.evalDescription }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.siteInvestigateReport.modal.mange.createdBy").$D("创建人") }}：{{ li.realName }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.siteInvestigateReport.modal.mange.company").$D("公司") }}：{{ li.companyName }}</span>
              </li>
              <li>
                <span>{{ $T("sslm.siteInvestigateReport.modal.mange.creationDate").$D("创建时间") }}：{{ li.creationDate }}</span>
              </li>
            </ul>
          </div>
        </hips-scroll>
      </div>
      <!-- 空白页 -->
      <no-content
        v-else-if="list.length===0&&finishLoad"
        :refresh="loadRefresh"
        img-src="NoOrder@3x.png"/>
    </div>
    <!-- 筛选弹窗 -->
    <hips-popup v-model="show" position="top">
      <div class="filterWrap">
        <li>
          <span>{{ $T("sslm.siteInvestigateReport.modal.mange.creationDate").$D("创建时间") }}</span>
        </li>
        <div class="dateWrap">
          <span
            :class="date1?'date-item date-color':'date-item'"
            @click="choseData('date1')">{{ date1 ? date1:$T('hipspfm.common.message.startTime').$D('开始日期') }}</span>
          <span/>
          <span
            :class="date2?'date-item date-color':'date-item'"
            @click="choseData('date2')">{{ date2 ? date2:$T('hipspfm.common.message.endTime').$D('截至日期') }}</span>
          <!-- 日期弹窗 -->
          <date-chooser v-model="datePop" @submitDate="handleConfirm" />
        </div>

        <div class="divBox">
          <li>
            <span>{{ $T("sslm.siteInvestigateReport.modal.mange.createdBy").$D("创建人") }}</span>
          </li>
          <div class="supplier">
            <hips-input
              v-model="realName"
              :placeholder="$T('sslm.siteInvestigateReport.view.write.mange.createdBy').$D('请输入创建人名称')"
              type="text"/>
            <img class="supplier-input-img" src="../../../assets/icon_screenlist_delete_normal@3x.png" @click="clearValue">
          </div>
        </div>
      </div>

      <div class="handlerWrap">
        <span class="reset" @click="handleReset">{{ $T('hipspfm.common.button.reset').$D('重置') }}</span>
        <span class="submit" @click="submit">{{ $T("hipspfm.common.button.complete").$D("完成") }}</span>
      </div>
    </hips-popup>
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
import NoContent from "@/components/NoContent";
import Searchs from "@/components/New/Searchs";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import TotalCount from "srm-mobile-ui/packages/srm-list/TotalCount";
import DateChooser from "@/components/DateChooser";
import {
  getEvaluatListApi
} from "../api/index";
export default {
  modules: [ "hipspfm.common", "sslm.siteInvestigateReport" ],
  name: "SiteInvestigateReportList",
  components: {
    Searchs,
    NoContent,
    TotalCount,
    DateChooser,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
  },
  data() {
    return {
      show: false, //筛选弹窗
      finishLoad: false,
      datePop: false, //日期弹窗
      searchVal: "", //搜索订单号
      date1: "", //开始日期
      date2: "", //截止日期
      choseedDate: "", //选中的时间
      changeDate: "",
      list: [], //列表数据
      totalCount: 0,
      currentPage: 0, //页码
      height: "height: calc(100vh - 120px)",
      noHeadHeight: "height: calc(100vh - 66px)",
      realName:"",
      queryParams:{
        evalDateFrom:"",
        evalDateTo:"",
        realName:""
      }
    };
  },
  computed: {
  },
  watch: {
  },
  async activated() {
    try {
      this.$loading.show();
      this.list = [];
      await this.fetchData();
      this.finishLoad = true;
      this.$loading.hide();
    } catch (err) {
      this.finishLoad = true;
      this.$loading.hide();
      console.log(err, "error");
    }
  },
  methods: {
    //退出子应用
    goBack() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    //回到顶部
    goTop() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    // 显示/隐藏筛选弹窗
    showPopup() {
      this.show = !this.show;
    },
    toDetail(list = {}) {
      const { evalHeaderId } = list;

      this.$router.push({
        name: "SiteInvestigateReportDetail",
        query: { evalHeaderId }
      });
    },
    // 搜索框搜索
    handleSearch() {
      this.list = [];
      this.currentPage = 0;
      this.fetchData();
    },
    //监听输入改变
    handleInputChange() {
      if (!this.searchVal.length) {
        this.fetchData();
      }
    },
    //清除值
    clearValue() {
      this.realName = "";
    },
    // 加载刷新数据
    async loadRefresh() {
      this.list = [];
      this.currentPage = 0;
      await this.fetchData();
    },
    // 加载更多数据
    async loadMore() {
      if (this.list.length < this.totalCount) {
        this.currentPage++;
        await this.fetchData();
      } else {
        this.$nextTick(() => {
          this.$refs.scroll.forceUpdate();
        });
      }
    },
    // 请求数据
    async fetchData() {
      const params = {
        size: 10,
        page: this.currentPage,
        evalDescription: this.searchVal,
      };

      this.finishLoad = false;
      this.$loading.show();
      await getEvaluatListApi({ ...params, ...this.queryParams }).then((res) => {
        this.$loading.hide();
        this.finishLoad = true;
        if (res && res.content) {
          this.list = [ ...this.list, ...res.content ];
          this.totalCount = res.totalElements;
        } else {
          this.list = [];
        }
      });
    },
    choseData(type) {
      this.changeDate = type;
      this.datePop = true;
    },
    //选择时间
    handleConfirm(value) {
      this.choseedDate = value;
      this[this.changeDate] = this.choseedDate;
      this.datePop = false;
    },
    // 完成按钮搜索
    submit() {
      if (this.date1 && this.date2 && this.date1 > this.date2) {
        this.$notification.open({
          message: this.$T("hipspfm.common.validation.startIsBefore").$D(
            "开始日期不能大于截止日期"
          ),
          description: "",
          class: "notification",
          duration: 3
        });
      } else {
        this.queryParams.evalDateFrom = this.date1 ? this.date1 + " 00:00:00" : "";
        this.queryParams.evalDateTo = this.date2 ? this.date2 + " 00:00:00" : "";
        this.queryParams.realName = this.realName;
        this.fetchData();
        this.show = false;
        this.list = [];
        this.currentPage = 0;
      }
    },
    // 重置
    handleReset() {
      this.date1 = "";
      this.date2 = "";
      this.realName = "";
      Object.keys(this.queryParams).map((x) => {
        this.queryParams[x] = "";
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
>>> .hips-cell {
  line-height: 4.4vw !important;
}

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
    }
  }

  img {
    height: 18px;
    width: 18px;
  }
}

.cancelEdit {
  margin-left: 13.4px;
}

.content {
  font-family: PingFangSC-Regular;
  font-size: 14px;

  .search-line {
    margin: 4px 0px;
    display: flex;
    align-items: center;

    >>> .hips-search{
      width:301px;
    }
    .img-edit {
      height: 18.8px;
      width: 18.8px;
      margin-right: 22.6px;
    }

    .img-filter {
      width: 18.7px;
      height: 16.8px;
    }
  }

  >>> .hips-ellipsis {
    font-size: 16px;
    color: var(--color-font-default);
  }

  .scrollWrap {
    font-size: 14px;

    >>> .hips-checkbox__checked {
      position: absolute !important;
      top: 3vw !important;
      left: 20px !important;
    }

    >>> .hips-cell {
      padding: 0 !important;
    }

    .checkWrap {
      height: 100%;
      overflow: auto;
    }

    .card {
      border-bottom: 1px solid #F5F6FA;
      margin: 0 15px;

      ul {
        li {
          display: flex;
          justify-content: space-between;
          padding-top: 8px;
          font-family: Alibaba-PuHuiTi-R;
          font-size: 14px;
          color: var(--color-font-default);

          &:nth-child(2) span {
            line-height: 22px;
          }

          span {
            display: inline-block;
            line-height: 20px;
          }

          &:last-child {
            margin-bottom: 12px;
          }

        }

        .code {
          font-weight: bold;
          margin-top: 4px;
        }
      }
    }

    .cards {
      margin: 0;
      padding: 0px 15px;
      width: 100%;

      .code {
        padding-left: 38px;
      }
    }

    >>> .hips-group:last-child {
      border-bottom: 0 !important;
    }
  }
}

.filterWrap {
  margin: 16px 15px 0px 15px;
  padding-bottom: 16px;
  font-size: 16px;
  max-height: 556px;
  min-height: 340px;
  overflow: auto;

  .divBox {
    margin-top: 24px;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    color: var(--color-font-default);
    font-weight: bold;

    &:nth-child(1) {
      margin-top: 0;

      span {
        font-weight: bold;
      }
    }
  }

  .dateWrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 12px 0px;

    span:nth-child(2) {
      height: 2px;
      width: 20px;
      display: inline-block;
      background: var(--color-bg-default-b);
    }

    .date-item {
      display: inline-block;
      width: 150px;
      height: 44px;
      text-align: left;
      background: #F5F6FA;
      border-radius: 4px;
      font-size: 14px;
      color: #82879E;
      line-height: 44px;
      text-align: center;
    }

    .date-color {
      background: rgba(53, 79, 247, 0.1);
      color: #354ff7;
    }
  }

  .supplier, .order-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-border-default);
    font-size: 16px;
    color: var(--color-font-default-b);
    height: 56px;
    font-family: PingFangSC-Regular;

    >>> .hips-input {
      width: 100vw;
      padding: 0 !important;
      height: 6.96vw !important;
      position: static !important;

      input {
        font-size: 16px !important;
      }
    }

    >>> .hips-input__input-value input::-webkit-input-placeholder {
      color: var(--color-font-default-b) !important;
    }
    .supplier-input-img{
      margin 0 8px
    }
  }
}

.datePop {
  .header {
    font-size: 18px;
    color: var(--color-font-default);
    line-height: 26px;
  }

  #dateConfirm {
    width: 100%;
    height: 49px;
    text-align: center;
    line-height: 49px;
    background: var(--color-bg-default);
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: var(--color-other-default-b);
    letter-spacing: 0.34px;
    text-align: center;
  }
}

.handlerWrap {
  display: flex;
  padding: 20px 15px;

  span {
    flex: 1;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    line-height: 44px;
    border-radius: 4px;
    text-align: center;

    &:nth-child(1) {
      margin-right: 25px;
      color: var(--color-font-default-b);
      background: var(--color-bg-default-b);
    }

    &:nth-child(2) {
      color: var(--color-font-default-d);
      background: var(--color-other-default-b);
    }
  }
}

>>> .bscroll-indicator {
  display: none !important;
}
</style>
