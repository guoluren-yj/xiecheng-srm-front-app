<template>
  <div v-if="orderList" class="orders">
    <div v-for="(item,index) in orderList"
         :key="index"
         class="order-item"
         @click="toDetail(item.companyId,item.tenantId,item.srmCompanyId)">
      <div class="item-header">
        <span v-if="item.logoUrl==undefined || item.logoUrl==null || item.logoUrl==''" class="item-icon">
          <span>{{ item.companyName | splitName }}</span>
        </span>
        <span v-else class="item-icon item-have">
          <span><img :src="preImg(item.logoUrl)" onerror="this.style.display = 'none'" ></span>
        </span>
        <img v-if="item.certificationStatus=='PASS'" class="item-mark image-blue-default" src="@/assets/icon_certified@3x.png" alt >
        <span v-else class="item-mark"/>
        <span class="item-purchaser">{{ item.companyName }}</span>
      </div>
      <div class="item-content">
        <li class="item-supplier">
          <div class="supplier">{{ $T("spfm.companySearch.model.company.industry").$D("行业") }}： </div>
          <div class="supplier-number">{{ item.industries | merge }}</div>
        </li>
        <li class="item-time" >
          <div class="time">{{ $T("spfm.companySearch.model.company.childrenIndustry").$D("产品服务分类") }}： </div>
          <div class="time-number" >
            {{ item.childrenIndustries | merge }}
          </div>
        </li>
        <li class="item-scope">
          <div class="scope">{{ $T("spfm.companySearch.model.company.serviceArea").$D("送货或服务范围") }}： </div>
          <div class="scope-number">{{ item.serviceAreas | merge }}</div>
        </li>
        <li class="item-money" >
          <div>
            <div class="money">{{ $T("spfm.companySearch.model.company.capitalRange").$D("注册资本") }}： {{ item.registeredCapital ? CalcMicrometer(item.registeredCapital)+$T("hipspfm.common.message.tenThousandYuan").$D("万元") : $T("hipspfm.common.currency.none").$D("无") }}</div>
          </div>
          <button class="money-button" @click.stop="toInvite(item.companyId,item.companyName,item.tenantId)">{{ $T("spfm.companySearch.view.option.invite").$D("邀请合作") }}</button>
        </li>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  modules: [ "spfm.companySearch", "hipspfm.common" ],
  name: "OrderItem",
  filters:{
    splitName:function(val) {
      return val.charAt(0);
    },
    merge:function(val) {
      val = val.join();
      return val;
    }
  },
  props: [
    "orderList",
  ],
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    toDetail(companyId, tenantId, srmCompanyId) {
      this.$router.push({ name: "PurchaserDetail", query: { "companyId":companyId, "tenantId":tenantId, "srmCompanyId":srmCompanyId } });
    },
    toInvite(companyId, companyName, tenantId) {
      this.$router.push({ name: "InviteCooperation", query: { "companyId":companyId, "companyName":companyName, "tenantId":tenantId } });
    },
    merge:function(val) {
      val = val.join();
      return val;
    },
    // buildImgUrl(fileUrl,bucketName) {
    //   const baseUrl = process.env.VUE_APP_BASE_URL;
    //   const downApi = `/hfle/v1/files/redirect-url`;
    //   const access_token = window.localStorage.getItem("user-token");
    //   const url =  encodeURIComponent(fileUrl);
    //   return `${baseUrl + downApi}?access_token=${access_token}&bucketName=${bucketName}&url=${url}`;
    // },
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

  .order-item {
    border-bottom:8px solid var(--color-border-default) !important;
    background-color:var(--color-font-default-d);
    li {
      padding-top: 12px;
      font-size: 14px;
      line-height: 22px;
    }
    .item-header{
      padding: 16px 20px 12px 0;
      display : flex;
      align-items : center;
      flex-direction: row;
      margin:0px 0 0px 20px;
      border-bottom:1px solid var(--color-border-default);
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

        font-family: PingFangSC-Medium;
        font-size: 16px;
        color:var(--color-font-default);
        font-weight: bold;
        line-height: 24px;
      }
      .item-mark{
        width : 16px;
        position:relative;
        top: 14px;
        left: -16px;
      }
    }
    border-bottom: 8px solid var(--color-border-default);
    .item-content{

      .item-supplier {
        padding: 13px 20px 10px 20px;
        display: flex;
        justify-content: flex-start;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        color:var(--color-font-default);
      }

      .item-money {
        padding: 7px 20px 7px 20px;
        display: flex;
        justify-content: space-between;
        align-items: baseline ;
        font-size: 14px;
        line-height:22px;
        font-family: PingFangSC-Medium;
        font-weight:bold;
        color:var(--color-font-default);
        .money-button{
          width:88px;
          height:32px;
          background-color:var(--color-other-default-b);
          border:1px solid var(--color-other-default-b);
          border-radius:16px;
          color:var(--color-font-default-d) ;
          font-family: PingFangSC-Regular;
          max-width:130px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .item-time {
        padding: 2px 20px 10px 20px;
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
        margin: 0px 0 0 20px;
        padding: 0px 20px 13px 0;
        display: flex;
        justify-content: flex-start;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        color:var(--color-font-default);
        border-bottom:1px solid var(--color-border-default);
      }
    }
  }
  .order-item:last-child {
    border-bottom: 0;
  }
}
</style>