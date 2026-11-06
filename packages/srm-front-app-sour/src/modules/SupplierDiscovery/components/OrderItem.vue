<template>
  <div v-if="orderList" class="orders" @click="toDetail(orderList.srmCompanyId,orderList.tenantId,orderList.companyId)">
    <!-- <div class="order-item"

    >  -->
    <div class="item-header">
      <div>
        <span v-if="orderList.logoUrl==undefined || orderList.logoUrl==null || orderList.logoUrl==''" class="item-icon">
          <span>{{ orderList.companyName | splitName }}</span>
        </span>
        <span v-else class="item-icon item-have">
          <span><img :src="preImg(orderList.logoUrl)" onerror="this.style.display = 'none'" ></span>
        </span>
        <img v-if="orderList.certificationStatus=='PASS'" class="item-mark image-blue-default" src="@/assets/icon_certified@3x.png" alt >
        <span v-else class="item-mark"/>
        <span class="item-purchaser" >
          <span>{{ orderList.companyName }}</span>
          <span>{{ $T("spfm.companySearch.model.company.capitalRange").$D("注册资本") }}：{{ orderList.registeredCapital ? CalcMicrometer(orderList.registeredCapital)+$T("hipspfm.common.message.tenThousandYuan").$D("万元") : $T("hipspfm.common.currency.none").$D("无") }}</span>
        </span>
      </div>
      <div class="item-header-status">
        <span v-if="orderList.invitedFlag">{{ $T("spfm.companySearch.view.message.title.invitedFlag").$D("已邀约") }}</span>
      </div>
    </div>
    <div class="item-content">
      <li class="item-supplier">
        <div class="supplier">{{ $T("spfm.companySearch.model.company.industry").$D("行业") }}： </div>
        <div class="supplier-number">{{ orderList.industries | merge }}</div>
      </li>
      <li class="item-time" >
        <div class="time">{{ $T("spfm.companySearch.model.company.childrenIndustry").$D("产品服务分类") }}： </div>
        <div class="time-number" >
          {{ orderList.childrenIndustries | merge }}
        </div>
      </li>
      <li class="item-scope">
        <div class="scope">{{ $T("spfm.companySearch.model.company.serviceArea").$D("送货或服务范围") }}： </div>
        <div class="scope-number">{{ orderList.serviceAreas | merge }}</div>
      </li>
      <li class="item-money" >
        <div>
          <div ref="itemTip" class="item-tip">
            <span v-for="(li,key) in orderList.supplierRelLabels" :key="key" class="tip-block">{{ li.categoryDescription }}</span>
          </div>
          <span class="img-block" @click.stop.prevent="showSupplierPop(orderList)">
            <img src="@/assets/icon_form_more_normal.svg" >
          </span>
          <span v-if="orderList.supplierRelLabels && orderList.supplierRelLabels.length > 3" class="img-block" @click.stop.prevent="showLabelsPop(orderList)">
            <img src="@/assets/icon_form_down_normal.svg" >
          </span>
        </div>
        <div class="money-button">
          <button @click.stop="toInvite(orderList.companyId,orderList.companyName,orderList.tenantId)">{{ $T("spfm.companySearch.view.option.invite").$D("邀请合作") }}</button>
        </div>
      </li>
    </div>
    <!-- </div> -->
    <!-- 弹窗start -->
    <hips-popup v-model="productPopup" style="height:91%;width:100%" class="top-boder-radius" position="bottom">
      <div class="supplier-container">
        <hips-nav-bar slot="header" :have-border="false" class="supplier-header">
          <div slot="center" >
            <div v-if="slide" slot="center" class="supplier-center">{{ $T("spfm.companySearch.view.option.title.selectTags").$D("选择") }}</div>
          </div>
          <div slot="right" class="cancel" @click="showSupplierPop">
            <img class="image-gray-default" src="@/assets/icon_screenlist_delete_normal@3x.png" alt="">
          </div>
        </hips-nav-bar>
        <div v-show="!slide" ref="hiddenTitle" class="hidden-title">
          <div ref="lovTitle" class="sub-title">{{ $T("spfm.companySearch.view.option.title.selectTags").$D("选择") }}</div>
        </div>
        <!-- 可滚动 -->
        <div v-if="supplierArr.length != 0" class="scroll-wrap">
          <hips-scroll
            :scroll-events="scrollEvents"
            :data="[supplierArr]"
            :scroll-option="scrollOption"
            @scroll="onScroll">
            <div class="supplier-list">
              <hips-checkbox-group
                v-model="supplierValue"
                :checkbox-border="false">
                <hips-checkbox
                  v-for="(item,index) in supplierArr"
                  :key="index"
                  :option="JSON.stringify(item.categoryId)">
                  <div v-if="item&&item.categoryId" class="content-info">
                    <i class="lov-content">{{ item.categoryDescription }}</i>
                  </div>
                  <!-- 默认 -->
                  <div v-else>
                    <i style="fontSize: 16px;"/>
                  </div>
                </hips-checkbox>
                <div class="block"/>
              </hips-checkbox-group>
            </div>
          </hips-scroll>
        </div>
        <no-content v-else img-src="NoResult@3x.png" />
        <!-- 可滚动 -->

        <!-- 底部确认 -->
        <div class="foot-bottom-btn">
          <hips-checkbox v-model="flag" :border="false">
            <i
              style="fontSize: 16px;color:var(--color-font-default-b) ">{{ $T("hipspfm.common.message.selectAll").$D("全选") }}</i>
          </hips-checkbox>
          <!-- <span class="msg-info">{{ $T("hipspfm.common.validation.multiple").$D("该选择为多选")}}</span> -->
          <span class="handler-btn" @click="confirm">{{ $T("hipspfm.common.validation.confirmSelect").$D("确认选择") }}</span>
        </div>
      </div>
    </hips-popup>
    <!-- 弹窗end -->
    <hips-popup v-model="labelPop" class="label-pop">
      <div class="labels-pop">
        <span v-for="(li,key) in tempData.supplierRelLabels" :key="key"
              :class="li.tempLabel ? 'disabled-span':''"
              @click="changeLabel(key)">{{ li.categoryDescription }}</span>
      </div>
      <div class="label-oprate">
        <span class="label-companyName">{{ tempData.companyName }}</span>
        <span class="label-button">
          <button class="manage-label button-label" @click="showSupplierPop(tempData)">{{ $T("hipspfm.supplier.button.manageLabel").$D("管理标签") }}</button>
          <button class="save-label button-label" @click="tempConfirm()">{{ $T("hipspfm.common.button.save").$D("保存") }}</button>
        </span>
      </div>
    </hips-popup>
  </div>
</template>

<script>
import { View, Popup, NavBar, Checkbox, CheckboxGroup, Scroll, } from "hips";
import { getLabelsApi, getConfirmLabelsApi } from "../api";
import NoContent from "@/components/NoContent";
export default {
  modules: [ "spfm.companySearch", "hipspfm.common", "hipspfm.supplier" ],
  name: "OrderItem",
  components:{
    NoContent,
    [View.name]: View,
    [Popup.name]: Popup,
    [Scroll.name]: Scroll,
    [NavBar.name]: NavBar,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
  },
  filters:{
    splitName:function(val) {
      return val.charAt(0);
    },
    merge:function(val) {
      if (val) {
        val = val.join();
      }
      return val;
    }
  },
  props: [
    "orderList",
    "loadRefresh",
  ],
  data() {
    return {
      showMore:{},
      supplierArr:[],
      supplierValue: [],
      scrollOption: {
        pullDownRefresh: false,
        pullUpLoad: false,
      },
      scrollEvents: [ "scroll", ],
      tempY:0, // 上一次的滚动Y值
      slide:false,
      productPopup:false,
      companyIdPop:"",
      labelPop:false,
      tempData:{},
      flag: false, //是否全选
    };
  },
  watch: {
    orderList() {
      // this.calcWidth()
      console.log(13, this.orderList);
      this.$forceUpdate();
    },
    flag(value) {
      if (value) {
        this.supplierValue = this.supplierArr.reduce((a, b) => [ ...a, JSON.stringify(b.categoryId) ], []);
      } else if (
        this.supplierValue.length === this.supplierArr.length &&
        !value
      ) {
        this.supplierValue = [];
      }
    },
    supplierValue(value) {
      if (value.length == this.supplierArr.length && value.length) {
        this.flag = true;
      } else {
        this.flag = false;
      }
    }
  },
  mounted() {
    // console.log(this.$refs.itemTip)
    // this.calcWidth()
  },
  methods: {
    // calcWidth(){
    //   if(this.$refs.itemTip){
    //     this.$refs.itemTip.map((li,key)=>{
    //       this.showMore[key]=false;
    //       if(li.scrollWidth>li.offsetWidth){
    //         this.showMore[key]=true;
    //       }
    //     })
    //     this.$forceUpdate()
    //   }
    // },
    toDetail(companyId, tenantId, companyIdTrue) {
      this.$router.push({ name: "SupplierDiscoveryDetail", query: { "companyId":companyId, "tenantId":tenantId, "companyIdTrue":companyIdTrue } });
    },
    toInvite(companyId, companyName, tenantId) {
      this.$router.push({ name: "InviteCooperationSupplier", query: { "companyId":companyId, "companyName":companyName, "tenantId":tenantId } });
    },
    onScroll({ x, y }) {
      if (y < 0) {
        this.$refs.lovTitle.style.top = 100 / 667 * y + "vh";
      } else {
        this.$refs.lovTitle.style.top = "0vh";
      }
      this.$refs.hiddenTitle.style.height = 100 / 667 * (38 + y) + "vh";
      if (38 + y <= 0) {
        this.slide = true;
      } else {
        this.slide = false;
      }
    },
    showLabelsPop(item) {
      this.tempData = item;
      this.labelPop = !this.labelPop;
    },
    async showSupplierPop(item) {
      this.supplierValue = [];
      if (item && item.companyId) {
        this.companyIdPop = item.companyId;
        await this.getLabels(item.companyId);
        if (item.supplierRelLabels) {
          item.supplierRelLabels.map((li) => {
            this.supplierValue.push(JSON.stringify(li.categoryId));
          });
        }
      }
      this.productPopup = !this.productPopup;
    },
    async getLabels(companyId) {
      const params = {
        page:0,
        size:10,
        companyId
      };
      await getLabelsApi(params).then((res) => {
        this.supplierArr = res;
      });
    },
    changeLabel(index) {
      this.tempData.supplierRelLabels[index].tempLabel = !this.tempData.supplierRelLabels[index].tempLabel;
      this.$forceUpdate();
    },
    tempConfirm() {
      this.tempData.supplierRelLabels.map((x, y) => {
        if (!x.tempLabel) {
          this.supplierValue.push(x.categoryId);
        }
      });
      this.companyIdPop = this.tempData.companyId;
      this.confirm();
    },
    confirm() {
      this.supplierValue.map((item, key) => {
        if (item) {
          this.supplierValue[key] = Number(item);
        }
      });
      this.$loading.show();
      getConfirmLabelsApi(this.companyIdPop, this.supplierValue).then((res) => {
        this.productPopup = false;
        this.labelPop = false;
        this.loadRefresh();
        this.$loading.hide();
      });
    },
    preImg(val) {
      const downApi = "/hfle/v1/files/redirect-url";
      let previewImg = this.buildImgUrl(val, "private-bucket", downApi);
      return previewImg;
    },
    CalcMicrometer(value) {
      if (typeof value !== "undefined" && typeof value !== "object") {
        return String(value).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.orders {
  width: 100%;

  .img-block{
    // height:22px;
    background: var(--color-bg-default-d);
    border-radius: 2px;
    padding:5px;
    height: 22px;
    display: inline-flex;
    margin-left: 8px;
    img{
      width:12px;
      height:12px;
    }
  }
  .tip-block{
    background: var(--color-bg-default-d);
    border-radius: 2px;
    padding:2px 8px;
    font-family: PingFangSC-Medium;
    font-size: 10px;
    color: var(--color-font-default-c);
    line-height: 18px;
    display:inline-block;
    margin-right:8px;
    width:56px;
    white-space:nowrap;
    text-overflow:ellipsis;
    text-align: center;
    overflow:hidden;
  }

    // background-color:var(--color-font-default-d);
    // margin-left:15px;
    // border-bottom:1px solid var(--color-border-default) !important;
    li {
      padding-top: 12px;
      font-size: 14px;
      line-height: 22px;
    }
    .item-header{
      padding: 12px 15px 12px 0;
      display : flex;
      align-items : center;
      flex-direction: row;
      justify-content: space-between;
      & div:nth-child(1){
        flex: 1;
        display: flex;
      }
      .item-header-status{
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: var(--color-other-default-b);
        text-align: right;
        line-height: 22px;
        font-weight:700;
      }
      .item-icon{
        width:40px;
        height : 40px;
        background:var(--color-bg-default-c);
        border: 1px solid var(--color-other-default-b);
        border-radius:50%;
        color : var(--color-other-default-b);
        display : flex;
        justify-content : center;
        align-items : center;
        overflow hidden;
        & img {
          width:40px;
          height : 40px;
        }
      }
      .item-have{
        border:none;
      }
      .item-purchaser{
        position : relative;
        left:-8px;
        display: flex;
        flex-direction: column;
        span:nth-child(1){
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color:var(--color-font-default);
          font-weight: 700 ;
          line-height: 24px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          max-width:205px;
        }
        span:nth-child(2){
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: var(--color-font-default-b);
          line-height: 16px;
        }
      }
      .item-mark{
        width : 16px;
        height: 16px;
        position:relative;
        top: 26px;
        left: -16px;
      }
    }
    // border-bottom: 8px solid var(--color-border-default);
    .item-content{

      .item-supplier {
        padding: 0px 15px 8px 0px;
        display: flex;
        justify-content: flex-start;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        color:var(--color-font-default);
      }

      .item-money {
        padding: 0px 15px 8px 0px;
        display: flex;
        justify-content: space-between;
        align-items: center ;
        div{
          display: flex;
          align-content: center;
          .img-block:nth-child(2){
            margin-left:0px
          }
        }
        .item-tip{
          display:block;
          overflow: auto;
          white-space: nowrap;
          max-width:192px;
          height:22px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .item-tip::-webkit-scrollbar {
          display: none; /* Chrome Safari */
        }
        .money-button{
          button{
            margin-left:8px;
            padding:5px 16px;
            height:30px;
            background-color:var(--color-other-default-b);
            border:1px solid var(--color-other-default-b);
            border-radius: 2px;
            color:var(--color-font-default-d) ;
            font-family: PingFangSC-Regular;
            max-width:96px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

        }
      }

      .item-time {
        padding: 0px 15px 8px 0px;
        display: flex;
        justify-content: flex-start;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        color:var(--color-font-default);
        .time-number{
            width:70%;
            overflow hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
        }
      }

      .item-scope {
        padding: 0px 15px 12px 0px;
        display: flex;
        justify-content: flex-start;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        color:var(--color-font-default);
      }
    }
}

.supplier-container {
  position relative
  height: 100%;
  overflow hidden
  .supplier-header {
    height: 48px;
    .supplier-center {
      font-size: 18px;
      line-height: 26px;
      color:var(--color-font-default);
      font-weight: bold;
      height: 44px;
      padding: 10px 0 9px 0;
    }
    .cancel {
      color:var(--color-font-default-b);
      margin-right: 22.8px;
    }
  }

  .scroll-wrap {
    // padding-bottom: 50px;
    height: calc(100% - 26vw);
    .supplier-list {
      margin-top: 8px;
      font-size: 16px;
      .content-info{
        width: 90%;
      }

      .lov-content{
        font-size: 16px;
        color:var(--color-font-default);
      }
      .supplier-code {
        font-size: 12px;
        color:var(--color-font-default-b);
        margin-left: 5px;
      }
    }
  }
}
  >>> .hips-cell{
    padding-left: 20px;
    padding-right: 20px;
    height: 54px;
  }

  .hips-checkbox__checked--active + .content-info{
    .lov-content,.supplier-code{
      color: var(--color-other-default-b) !important;
    }
  }
  .hidden-title{
    overflow-y:hidden;
    max-height:40px;
    .sub-title {
      position:relative;
      width: 100%;
      height: 32px;
      line-height: 32px;
      padding-left: 20px;
      font-weight: bold;
      font-size: 24px;
      color:var(--color-font-default);
    }
  }
   .msg-info {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: var(--color-font-default-e);
    letter-spacing: 0;
    line-height: 24px;
    border-right: none;
    line-height:24px;
    padding-left: 20px;
    text-align: left;
    height:auto;
  }

  .handler-btn {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: var(--color-other-default-b);
    letter-spacing: 0;
    padding-right: 20px;
    line-height:25px;
    text-align: right;
  }
.block{
  width:100%;
  height:38px;
}
.label-pop{
  width: 316px;
  border-radius:4px;
  .labels-pop{
    padding:8px 12px 16px;
    border-bottom:1px solid var(--color-border-default)
    span{
      transition all 0.2s;
      background: var(--color-bg-default-c);
      border-radius: 2px;
      padding:4px 12px;
      margin:8px 12px 0px 0px;
      display:inline-block;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: var(--color-other-default-b);
      line-height: 20px;
    }
    .disabled-span{
      background: var(--color-bg-default-b);
      color: var(--color-font-default-e);
    }
  }
  .label-oprate{
    padding:8px 12px;
    display: flex;
    justify-content: space-between;
    .label-companyName{
      font-family: PingFangSC-Medium;
      font-size: 12px;
      color: var(--color-font-default);
      line-height: 24px;
      font-weight:bold;
      width:174px;
      text-overflow:ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .button-label{
      background: var(--color-other-default-d);
      border none;
      border-radius: 2px;
      font-family: PingFangSC-Regular;
      padding:4px 8px;
      font-size: 12px;
      letter-spacing: 0;
      text-align: center;
      line-height: 16px;
      color: var(--color-font-default-d);
    }
    .manage-label{
      background: var(--color-other-default-d);
      margin-right:12px;
    }
    .save-label{
      background: var(--color-other-default-b);
    }
  }
}
</style>