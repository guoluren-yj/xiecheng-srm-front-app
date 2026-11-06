<template>
  <div style="height: 100vh">
    <nav-head :title="$T('spfm.companySearch.view.option.title.purchaser').$D('发现采购商')" @goBack="goBack" />
    <srm-list :data-set="dataSet"
              customize-code="SMBL.FIND_PURCHASER.LIST"
              :columns="getColumns"
              @itemClick="goToDetail"/>
  </div>
</template>

<script>

import indexDS from "../datasource/indexDS";
import { DataSet, JsBridge } from "srm-mobile-ui";

export default {
  modules: [ "hipspfm.common", "spfm.companySearch", "sslm.supplierManage", "spfm.certificationApproval", "spcm.common", "sinv.receiptWorkbench", "entity.company", "hipspfm.supplier", "smbl.common", "spfm.supplier", "hzero.common", "spfm.invitationRegister" ],
  name: "FindPurchaserList",
  components: {
  },
  data() {
    return {
      dataSet: new DataSet(indexDS()),
    };
  },
  computed: {
    getColumns() {
      return [
        {
          formRow: 0,
          fieldCode: "emptyFirst",
          fieldType: "EMPTY",
          render: (val, record) =>
            <div class="srm-span-item-header">
              <span class="item-icon">
                <span> {record.companyName.charAt(0)} </span>
              </span>
              { record.certificationStatus === "PASS" && <img class="item-mark image-blue-default" src={require("@/assets/icon_certified@3x.png")} alt=""/>}
              <span class="item-purchaser" >
                <span>{ record.companyName }</span>
              </span>
            </div>
        },
        {
          fieldName: this.$T("spfm.companySearch.model.company.industry").$D("行业"),
          fieldCode: "industries",
          render:(val) => this.merge(val),
        },
        {
          fieldName: this.$T("spfm.companySearch.model.company.childrenIndustry").$D("产品服务分类"),
          fieldCode: "childrenIndustries",
          render:(val) => this.merge(val),
        },
        {
          fieldName: this.$T("spfm.companySearch.model.company.serviceArea").$D("送货或服务范围"),
          fieldCode: "serviceAreas",
          render:(val) => this.merge(val),
        },
        {
          fieldCode: "emptyLast",
          fieldType: "EMPTY",
          render: (val, record) => <srm-flex class="srm-span-item-content" justify="end">
            <srm-flex-item>
              <span>
                { this.$T("spfm.companySearch.model.company.capitalRange").$D("注册资本") } ：{ record.registeredCapital ? this.calcMicrometer(record.registeredCapital) + this.$T("hzero.common.currency.ten.thousand").$D("万") + (record.currencyName ? record.currencyName : this.$T("smbl.common.currency.yuan").$D("人名币")) : this.$T("hipspfm.common.currency.none").$D("无")}
              </span>
            </srm-flex-item>
            <srm-flex-item class="srm-span-button">
              <button onClick={(e) => {
                e.stopPropagation();
                this.toInvite(record.companyId, record.companyName, record.tenantId);
              }}>{ this.$T("spfm.companySearch.view.option.invite").$D("邀请合作") }</button>
            </srm-flex-item>
          </srm-flex>
        },
      ];
    },
  },
  methods: {
    merge:function(val) {
      const currentVal = val.join();
      return currentVal;
    },
    //跳转邀请供应商页面
    toInvite(companyId, companyName, tenantId) {
      this.$loading.show();
      this.$router.push({ name: "InviteCooperation", query: { "companyId":companyId, "companyName":companyName, "tenantId":tenantId } });
      this.$loading.hide();
    },
    //跳转详情页
    goToDetail(item) {
      const {
        srmCompanyId,
        tenantId,
        companyId } = item.data;

      this.$router.push({
        name: "PurchaserDetail",
        query: { "companyId":srmCompanyId,
          "tenantId":tenantId,
          "companyIdTrue":companyId }
      });
    },
    // 退出子应用
    goBack() {
      this.$router.back();
    },
    //图片地址构建
    preImg(val) {
      const downApi = "/hfle/v1/files/redirect-url";
      let previewImg = this.buildImgUrl(val, "private-bucket", downApi);
      return previewImg;
    },
    calcMicrometer(value) {
      return typeof value !== "undefined" && typeof value !== "object" ? String(value).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,") : "";
    },
  },
};
</script>

<style lang="stylus" scoped>
.srm-span-item-header{
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
        align-items: right;
        line-height: 22px;
        font-weight:700;
        margin-left:25px;
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
        left:8px;
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
        top: 16px;
        left: -16px;
      }
    }

  .srm-span-item-content{
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

    .srm-span-tip-block{
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

    .srm-span-img-block{
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

    .srm-span-button{
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

</style>
