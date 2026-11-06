<template>
  <hips-view>
    <hips-nav-bar slot="header" :have-border="false">
      <div v-if="showBackFlag" slot="left" class="left-button" @click="goBack">
        <img src="@/assets/CUX/back@3x.png" class="image-black-default">
      </div>
      <div slot="center" class="header">{{ $T('sinv.supplierDelivery.view.message.title').$D('我的送货单') }}</div>
      <div slot="right" class="right-button" @click="showPopup">
        <img class="image-black-default" src="@/assets/CUX/screen_normal@3x.png" alt >
      </div>
    </hips-nav-bar>
    <div class="content">
      <Searchs
        v-model="searchVal"
        :handle-search="handleSearch"
        :placeholder="$T('hipspfm.common.view.tab.handlerAsnNum').$D('请输入送货单号查询')"/>
      <TotalCount :list-len="list.length" :count="totalCount" info="hipspfm.supplierDelivery.view.message.deliveryInfo"/>
      <div v-if="this.list.length" class="scrollWrap">
        <hips-scroll
          ref="scroll"
          :data="[list]"
          :scroll-options="scrollOption"
          @pulling-down="loadRefresh"
          @pulling-up="loadMore">
          <div
            v-for="(li,index) in list"
            :key="index"
            class="card"
            @click="toDetail(li.asnHeaderId,li.companyName,li.asnNum)">
            <div>
              <span class="block"/>
              <span class="code">{{ li.asnNum }}</span>
              <span class="status">{{ li.asnStatusMeaning }}</span>
            </div>
            <ul>
              <li>
                <span>{{ $T('sinv.common.model.common.customer').$D('客户') }}:</span>
                <span>{{ li.companyName }}</span>
              </li>
              <li>
                <span>{{ $T('sinv.common.model.common.organizationName').$D('收货组织') }}:</span>
                <span>{{ li.organizationName }}</span>
              </li>
            </ul>
            <li class="foot-li">
              <span>{{ $T('sinv.common.model.common.expectedArriveTime').$D('预计到货时间') }}:</span>
              <span>{{ li.expectedArriveDate }}</span>
            </li>
          </div>
        </hips-scroll>
      </div>
      <NoContent v-else-if="list.length===0&&loading" :title="'hipspfm.supplierDelivery.view.message.title.noDeliveryInfo'" :refresh="loadRefresh" img-src="NoOrder@3x.png" />
    </div>
    <!-- 筛选弹窗 -->
    <hips-popup v-model="show" position="top">
      <div class="filterWrap">
        <li>
          <span>{{ $T('hipspfm.common.message.createTime').$D('创建日期') }}</span>
        </li>
        <div class="dateWrap">
          <span class="date-item" @click="choseData('date1')">{{ date1 ? date1:$T("hipspfm.common.message.startTime").$D("开始日期") }}</span>
          <span>~</span>
          <span class="date-item" @click="choseData('date2')">{{ date2 ? date2:$T("hipspfm.common.message.endTime").$D("截至日期") }}</span>
          <span>
            <img class="image-gray-default" src="@/assets/CUX/icon_screenlist_right_normal@3x.png" alt="">
          </span>
          <!-- 日期弹窗 -->
          <DateChooser v-model="datePopup" @submitDate="handleConfirm" />
        </div>

        <DateTip :date-clear-flag="dateClearFlag" :chose-date-handler="choseDateHandler" />

        <li>
          <span>{{ $T('sinv.common.model.common.customer').$D('客户') }}</span>
        </li>
        <div class="supplier" @click="showSupplierPop">
          <span v-show="!supplierValue.companyName" class="status-span">{{ $T('hipspfm.common.view.message.selectCustomer').$D('请选择客户') }}</span>
          <div>
            <div v-show="supplierValue.companyName" class="supplier-item">{{ supplierValue.companyName }}</div>
          </div>
          <span v-show="supplierValue.companyName" @click.stop="clearSupplier">
            <img class="image-gray-default" src="@/assets/CUX/icon_screenlist_delete_normal@3x.png" alt="">
          </span>
          <span>
            <img class="image-gray-default" src="@/assets/CUX/icon_screenlist_right_normal@3x.png" alt="">
          </span>
          <!-- <Lov
              code="SINV.ASN_CUSTOMER"
              v-model="supplierPopup"
              @submitValue="GetSupplier"
              :clearFlag="clearFlag"
            /> -->
        </div>
        <li>
          <span>{{ $T('sinv.supplierDelivery.model.supplierDelivery.asnStatus').$D('送货单状态') }}</span>
        </li>
        <div class="sonhuodan" @click="showOrderSatusPop">
          <span v-show="!orderStatusValue.length" class="status-span">{{ $T('hipspfm.supplierDelivery.view.message.selectAsnStatus').$D('请选择送货单状态') }}</span>
          <div v-show="orderStatusValue.length" class="status-item">
            <span v-for="(item,index) in orderStatusValue" :key="index" class="status">
              {{ JSON.parse(item).meaning }}
              <span class="delete" @click.stop="deleteStatus(index)">
                <img class="image-gray-default" style="height:12px;width:12px" src="@/assets/CUX/icon_screenlist_delete_normal@3x.png" alt="">
              </span>
            </span>
          </div>
          <span>
            <img class="image-gray-default" src="@/assets/CUX/icon_screenlist_right_normal@3x.png" alt="">
          </span>
          <SelectOrderStatus
            v-model="orderStatusPopup"
            :title="'sinv.supplierDelivery.model.supplierDelivery.asnStatus'"
            :status-arr="statusArr"
            :clear-flag="clearFlag"
            @GetOrderStatus="GetOrderStatus"/>
        </div>
        <!-- <li>
          <span>仅查询未结算送货单</span>
          <span>
            <hips-switch v-model="checked" :disabled="!!orderStatusValue.length"/>
          </span>
        </li> -->
      </div>
      <div class="handlerWrap">
        <span class="reset" @click="handleReset">{{ $T('hipspfm.common.button.reset').$D('重置') }}</span>
        <span class="submit" @click="submit">{{ $T('hipspfm.common.button.complete').$D('完成') }}</span>
      </div>
    </hips-popup>
    <Lov
      v-if="loading"
      v-model="supplierPopup"
      code="SINV.ASN_CUSTOMER"
      :clear-flag="clearFlag"
      @submitValue="GetSupplier"/>
  </hips-view>
</template>

<script>
import {
  Icon,
  View,
  Popup,
  NavBar,
  Scroll,
} from "hips";
import Lov from "@/components/Lov";
import Searchs from "@/components/Searchs";
import DateTip from "@/components/DateTip";
import NoContent from "@/components/NoContent";
import { closeWebView } from "srm-mobile-ui/src/utils/jsBridge";
import TotalCount from "srm-mobile-ui/packages/srm-list/TotalCount";
import DateChooser from "@/components/DateChooser";
import SelectOrderStatus from "@/components/SelectOrderStatus";
import {
  getSupplierApi,
  getDeliveryList,
  getDeliveryStatusApi
} from "../api/index";
export default {
  modules: [ "hipspfm.common","sinv.supplierDelivery","sinv.common","hipspfm.supplierDelivery" ],
  name: "jjy_MyDeliveryList",
  components: {
    DateTip,
    Lov,
    DateChooser,
    Searchs,
    NoContent,
    TotalCount,
    SelectOrderStatus,
    [View.name]: View,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Scroll.name]: Scroll,
  },
  data() {
    return {
      show: false,
      loading: false,
      datePopup: false,
      supplierPopup: false, //供应商弹窗
      orderStatusPopup: false, //送货单状态弹窗
      supplierValue: {}, //供应商选中值
      orderStatusValue: [], //送货单状态选中值
      checked: true,
      searchVal: "",
      date1: "",
      date2: "",
      statusArr: [], // 状态值集
      changeDate: "",
      choseedDate: "",
      list: [],
      totalCount: 0,
      currentPage: 0, //页码
      supplierTotalCount: "",
      supplierParams: {
        page: 0,
        size: 10,
        companyName: "",
        companyNum:"",
        //sortType: 1,
        organizationId: window.localStorage.organizationId || ""
      },
      queryParams : {
        creationDateFrom: "", //创建日期从
        creationDateTo: "", //创建日期到
        companyName: "", //客户
        companyId: "", //客户ID
        asnStatus:"", //送货单状态
        asnStatusMeaning:"", // 送货单状态描述
      },
      clearFlag: false, //重置状态传入组件里
      dateClearFlag: false,
    };
  },
  watch: {
    orderStatusValue(nVal) {
      if (nVal.length !== 0 && this.checked === true) {
        this.checked = false;
      } else if (nVal.length === 0 && this.checked === false) {
        this.checked = true;
      }
    }
  },
  // mounted() {
  // },
  async activated() {
    try {
      this.$loading.show();
      this.list = [];
      this.currentPage = 0;
      await this.fetchData();
      this.loading = true;
      this.$loading.hide();
    } catch (err) {
      this.loading = true;
      this.$loading.hide();
      console.log(err,"error");
    }

  },
  methods: {
    showPopup() {
      this.show = !this.show;
    },
    toDetail(asnHeaderId, organizationName, purchaseAgentName) {
      this.$router.push({
        path: "/jjy_MyDeliveryDetail",
        query: { asnHeaderId, organizationName, purchaseAgentName }
      });
    },
    // 退出子应用
    goBack() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    // 搜索框搜索
    handleSearch() {
      this.list = [];
      this.currentPage = 0;
      this.fetchData();
    },

    //供应商弹窗显示或隐藏
    showSupplierPop() {
      this.supplierPopup = !this.supplierPopup;
      if (this.supplierPopup === true) {

      } else {
        this.clearFlag = false;
      }
    },
    //订单弹窗显示或隐藏
    showOrderSatusPop() {
      this.orderStatusPopup = !this.orderStatusPopup;
      if (this.orderStatusPopup === true && !this.statusArr.length) {
        this.getDeliveryStatus();
      } else {
        this.clearFlag = false;
      }
    },
    //确认订单状态
    GetOrderStatus(val) {
      this.orderStatusValue = val;
    },
    //确认供应商
    GetSupplier(val) {
      this.supplierValue = val.length ? val[0] : {};
    },
    //清除供应商的值
    clearSupplier() {
      this.supplierValue = "";
      this.clearFlag = true;
    },
    //删除某项状态
    deleteStatus(index) {
      this.orderStatusValue.splice(index, 1);
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
      this.$loading.show();
      const params = {
        page: this.currentPage,
        size: 10,
        asnNum: this.searchVal, //送货单号
      };
      await getDeliveryList({ ...params,...this.queryParams }).then((res) => {
        this.$loading.hide();
        this.list = [ ...this.list, ...res.content ];
        this.totalCount = res.totalElements;
      });
    },

    // 获取订单状态
    getDeliveryStatus() {
      getDeliveryStatusApi().then((res) => {
        const status = res.status;
        this.statusArr = status.filter((item)=>item.value !== "CONFIRMED");
      });
    },

    //选择时间
    handleConfirm(value) {
      this[this.changeDate] = value;
      this.datePopup = false;
    },

    // 快捷选择时间
    choseDateHandler(startDate, endDate) {
      this.date1 = startDate;
      this.date2 = endDate;
      this.dateClearFlag = false;
    },

    //选择日期
    choseData(type) {
      this.changeDate = type;
      this.datePopup = true;
    },
    // 完成按钮搜索
    submit() {
      if (this.date1 && this.date2 && this.date1 > this.date2) {
        this.$notification.open({
          message:this.$T("hipspfm.common.validation.startIsBefore").$D("开始日期不能大于截止日期"),
          description: "",
          class:"notification",
          duration: 3,
        });
      } else {
        this.list = [];
        this.currentPage = 0;
        if (this.orderStatusValue[0]) {
          this.queryParams.asnStatusMeaning = this.orderStatusValue[0].meaning;
          this.queryParams.asnStatus = this.orderStatusValue[0].value;
        } else {
          this.queryParams.asnStatusMeaning = "";
          this.queryParams.asnStatus = "";
        }
        this.queryParams.creationDateFrom = this.date1 ? `${this.date1} 00:00:00` : ""; //创建日期从
        this.queryParams.creationDateTo = this.date2 ? `${this.date2} 00:00:00` : ""; //创建日期到
        this.queryParams.companyName = this.supplierValue.companyName || ""; //客户
        this.queryParams.companyId = this.supplierValue.companyId || ""; //客户ID
        this.fetchData();
        this.show = false;
      }
    },
    // 重置
    handleReset() {
      this.date1 = "";
      this.date2 = "";
      this.checked = true;
      this.supplierValue = {};
      this.orderStatusValue = [];
      this.clearFlag = true;
      this.dateClearFlag = true;
    }
  }
};
</script>

<style lang="stylus" scoped>
$color-blue = #6699FF;
.right-button {
  margin-right: 8px;
  img {
    margin-right: 12px;
    height: 24px;
    width: 24px;
  }
}
.header {
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color:var(--color-font-default);
  text-align: center;
  line-height: 26px;
  font-weight: 600;
}

.content {
  height: 100%;
  font-family: PingFangSC-Regular;
  font-size: 14px;

  .scrollWrap {
    height: calc(100vh - 120px);

    .card {
      padding: 16px 0px 13px 20px
      // margin-top: 8px;
      color: #666666;
      background:var(--color-bg-default);
      border-bottom: 8px solid var(--color-border-default);

      div {
        display: flex;
        justify-content: space-between;
        padding-bottom:9px;
        margin-bottom : 1px;
        border-bottom:1px solid var(--color-border-default);
        padding-right:20px;
        align-items: center;
        // line-height: 26px;

        span {
          font-family :'PingFangSC-Medium';
          line-height :24px;
          font-size: 16px;
          color:var(--color-font-default);
        }
        .block{
          width:6px;
          height:14px;
          border-radius:1px;
          background-color : var(--color-other-default-b);
          margin-right:8px;
        }
        .code{
          font-weight:bold;
          position: absolute;
          left: 34px;
        }

        span:nth-child(3) {
          color:var(--color-font-default-b);
          font-size: 14px;
          text-align: right;
        font-weight:bold !important;

        }
      }

      ul {
        padding-bottom:13px;
        border-bottom:1px solid var(--color-border-default);
        li {
          padding-top: 12px;
          font-size: 14px;
          color:var(--color-font-default) ;
          padding-right:20px;
          line-height : 22px;
          font-family: 'PingFangSC-Regular';
          span:nth-child(odd) {
            text-align: left;
          }

          span:nth-child(even) {
            margin-left:12px;
            text-align: right;
          }
        }
      }
      .foot-li{
        font-family:'PingFangSC-Medium';
        color:var(--color-font-default);
        font-size:14px;
        font-weight:bold;
        line-height : 22px;
        padding-top:11px;
        span:nth-child(even) {
          margin-left:12px;
          text-align: right;
        }
      }
    }
    .card:last-child {
      border-bottom: 0;
    }
  }


}
.reset{
  border-top:1px solid var(--color-border-default);
}


.filterWrap {
  >>> .hips-switch__input:checked {
    background: var(--color-other-default-b);
  }

  padding: 16px 20px 32px 20px;
  font-size: 16px;
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // line-height: 26px;
    font-size: 18px;
    color:var(--color-font-default);
    font-weight: 700;
    margin-top: 28px;

    &:nth-child(1) {
      margin-top: 0;
    }
  }


  .dateWrap, .supplier, .sonhuodan {
      display flex
      align-items center
      justify-content space-between
      border-bottom:1px solid var(--color-border-default);
      font-size: 16px;
      color:var(--color-font-default-b);
      // line-height: 34px;
      padding: 8px 0px 7px 0px;
      font-family: PingFangSC-Regular;
    .status-span{
      line-height :24px;
    }
    .date-item {
      width: 27vw;
      text-align: left;
      margin-top: 4px;
    }

    .supplier-item {
      width: 265px;
      color:var(--color-font-default);
    }

    .status-item {
      width: 80%;
      display flex;
      flex-wrap wrap;
      .status {
        margin-right 10px;
        color: var(--color-other-default-b);
        background: #EEFBFA;
        height: 28px;
        line-height 28px;
        font-size: 12px;
        padding: 0px 5px 5px 12px;
      }

      .delete {
        display: inline-block;
        margin-left: 4px;
        height: 12px;
        width: 12px;
        color: var(--color-font-default-e);
        position:relative;
        top:1.5px;
      }
    }
  }
}

.handlerWrap {
  display: flex;
  .clear{
    border-top:1px solid var(--color-border-default);
  }
  span {
    flex: 1;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color:var(--color-font-default-b);
    line-height: 56px;
    text-align: center;

    &:nth-child(2) {
      color:var(--color-font-default-d);
      background: var(--color-other-default-b);
    }
  }
}
</style>
