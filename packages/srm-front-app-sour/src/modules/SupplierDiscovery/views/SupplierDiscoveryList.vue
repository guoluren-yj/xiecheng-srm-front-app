<template>
  <div style="height: 100vh">
    <nav-head :title="$T('spfm.companySearch.view.option.title.supplier').$D('发现供应商')" @goBack="goBack" />
    <srm-list :data-set="dataSet"
              customize-code="SMBL.SUPPLIER_DISCOVERY.LIST"
              :columns="getColumns"
              @itemClick="goToDetail">
      <div slot="searchLeft" class="srm-right-button" @click="toInviteRegister">
        <img class="image-black-default" src="@/assets/Navigation bar_Supplier_normal@3x.png" alt >
      </div>
    </srm-list>
    <!-- 管理标签弹窗 -->
    <srm-popup
      :visible.sync="labelPop"
      position="bottom"
      show-back
      height="70%"
      :show-close="false"
      class="label-pop"
      :title="$T('smbl.common.title.labelInfo').$D('标签信息')">
      <div class="labels-pop">
        <span v-for="(li,key) in tempData.supplierRelLabels" :key="key"
              :class="li.tempLabel ? 'disabled-span':''"
              @click="changeLabel(key)">{{ li.categoryDescription }}</span>
      </div>
      <div class="label-oprate">
        <span class="label-companyName">{{ tempData.companyName }}</span>
        <!-- <span class="label-button">
          <button class="manage-label button-label" @click="showLabelsPop(tempData)">{{ $T("hipspfm.supplier.button.manageLabel").$D("管理标签") }}</button>
          <button class="save-label button-label" @click="tempConfirm()">{{ $T("hipspfm.common.button.save").$D("保存") }}</button>
        </span> -->
      </div>
    </srm-popup>
  </div>
</template>

<script>

import indexDS from "../datasource/indexDS";
import { DataSet } from "srm-mobile-ui";
import { getLabelsApi, getConfirmLabelsApi } from "../api";
import { dateFormat } from "@/utils/index";

export default {
  modules: [ "hipspfm.common", "spfm.companySearch", "sslm.supplierManage", "spfm.certificationApproval", "spcm.common", "sinv.receiptWorkbench", "entity.company", "hipspfm.supplier", "smbl.common", "spfm.supplier", "hzero.common", "spfm.invitationRegister" ],
  name: "SupplierDiscoverList",
  components: {
  },
  data() {
    return {
      dataSet: new DataSet(indexDS()),
      itemTipPop:false,
      itemTipPop1:false,
      labelsListInfo:[], //标签信息
      selectListData:[],
      selectListId:[],
      labelPop:false,
      tempData:{},
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
            // const currentLogoUrl = this.preImg(record.logoUrl);
            // const currentLogoUrl = "https://gateway.dev.isrm.going-link.com/hfle/v1/files/redirect-url?access_token=8e14cfed-aac8-4d26-b574-74a752f88998&bucketName=private-bucket&url=https://isrm-dev-private-bucket.obs.cn-east-2.myhuaweicloud.com:443/0/c377b482e6c54db2bab7ca782285edbb@%E4%BA%A7%E5%93%81%E8%AF%84%E5%88%86@3x.png";
            // { (typeof record.logoUrl === "undefined" || record.logoUrl === null || record.logoUrl === "") && <span class="item-icon"> {record.companyName} </span>}
            // { record.logoUrl !== null && <img class="item-icon item-have" src={require(currentLogoUrl)} alt=""/>}
            // <span class="item-icon"> {record.companyName} </span>
            <div class="srm-span-item-header">
              <span class="item-icon">
                <span> {record.companyName.charAt(0)} </span>
              </span>
              { record.certificationStatus === "PASS" && <img class="item-mark image-blue-default" src={require("@/assets/icon_certified@3x.png")} alt=""/>}
              <span class="item-purchaser" >
                <span>{ record.companyName }</span>
                <span>{ this.$T("spfm.supplier.model.supplier.platform.processTime").$D("认证通过时间") }：{ dateFormat(record.processDate) }</span>
              </span>
              <div class="item-header-status">
                {record.invitedFlag === 1 && <span>{ this.$T("spfm.companySearch.view.message.title.invitedFlag").$D("已邀约") }</span>}
              </div>
            </div>
            // <span>{ this.$T("spfm.companySearch.model.company.capitalRange").$D("注册资本") }：{ record.registeredCapital ? this.calcMicrometer(record.registeredCapital) + this.$T("hipspfm.common.message.tenThousandYuan").$D("万元") : this.$T("hipspfm.common.currency.none").$D("无") }</span>
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
          fieldName: this.$T("spfm.companySearch.model.company.capitalRange").$D("注册资本"),
          fieldCode: "registeredCapital",
          render:(val, record) => {
            const currencyNameStr = record.currencyName ? record.currencyName : this.$T("smbl.common.currency.yuan").$D("人名币");
            return record.registeredCapital ? this.calcMicrometer(record.registeredCapital) + this.$T("hzero.common.currency.ten.thousand").$D("万") + currencyNameStr : this.$T("hipspfm.common.currency.none").$D("无");
          }
        },
        {
          fieldCode: "emptyLast",
          fieldType: "EMPTY",
          render: (val, record) => {
            const currentSupplierRelLabels = record.supplierRelLabels || [];
            return <srm-flex class="srm-span-item-content" justify="end">
              <srm-flex-item>
                <div class="item-tip">
                  {
                    // eslint-disable-next-line no-unused-vars
                    currentSupplierRelLabels.map((item, key) =>
                      // console.log("item=>",item);
                      <span class="srm-span-tip-block">{ item.categoryDescription }</span>
                    )
                  }
                </div>
                <span class="srm-span-img-block" onClick = {(e) => {
                  e.stopPropagation();
                  this.showItemTipPop(record);
                }}>
                  <img src={require("@/assets/icon_form_more_normal.svg")} alt=""/>
                </span>
                {currentSupplierRelLabels !== null && currentSupplierRelLabels.length > 3 && <span class="srm-span-img-block" onClick = {(e) => {
                  e.stopPropagation();
                  this.showLabelsPop(record);
                }}><img src={require("@/assets/icon_form_down_normal.svg")} alt=""/></span>}
              </srm-flex-item>
              <srm-flex-item class="srm-span-button">
                <button onClick={(e) => {
                  e.stopPropagation();
                  this.toInvite(this.dataSet.current.data.companyId, this.dataSet.current.data.companyName, this.dataSet.current.data.tenantId);
                }}>{ this.$T("spfm.companySearch.view.option.invite").$D("邀请合作") }</button>
              </srm-flex-item>
            </srm-flex>;
            // <SrmButton slot="right" rect fill onClick={() => this.toInvite(this.dataSet.current.data.companyId,this.dataSet.current.data.companyName,this.dataSet.current.data.tenantId)}>
            //       { this.$T("spfm.companySearch.view.option.invite").$D("邀请合作") }
            //     </SrmButton>
            // <button onClick={() => this.toInvite(this.dataSet.current.data.companyId,this.dataSet.current.data.companyName,this.dataSet.current.data.tenantId)}>{ this.$T("spfm.companySearch.view.option.invite").$D("邀请合作") }</button>
          }
        },
      ];
    },
  },
  methods: {
    merge:function(val) {
      const currentVal = val.join();
      return currentVal;
    },
    showLabelsPop(item) {
      this.tempData = item;
      this.labelPop = !this.labelPop;
    },
    //前往邀请注册页面
    toInviteRegister() {
      this.$router.push({ name: "InviteRegisterSupplier" });
    },
    //跳转邀请供应商页面
    toInvite(companyId, companyName, tenantId) {
      this.$loading.show();
      this.$router.push({ name: "InviteCooperationSupplier", query: { "companyId":companyId, "companyName":companyName, "tenantId":tenantId } });
      this.$loading.hide();
    },
    //跳转详情页
    goToDetail(item) {
      const { srmCompanyId,
        tenantId,
        companyId } = item.data;

      this.$router.push({
        name: "SupplierDiscoveryDetail",
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
    //标签弹框
    async showItemTipPop(item) {
      this.selectListData = [];
      if (item && item.companyId) {
        const params = {
          page:0,
          size:10,
          companyId:item.companyId
        };
        await getLabelsApi(params).then((res) => {
          this.LabelsList = res;
          let selectObject = {};
          if (res && res.length > 0) {
            res.map((record) => {
              selectObject.value = record.categoryId;
              selectObject.meaning = record.categoryDescription;
              this.selectListData.push(selectObject);
              selectObject = {};
            });
          }
        });
      }
      this.showLov();
    },
    showLov() {
      this.$lov("", (val) => {
        this.selectListData = val;
        this.confirm();
      }, { multiple: true,
        displayField: "meaning",
        listData: this.selectListData });
    },
    //添加标签
    confirm() {
      const categoryIdSet = [];
      const selectListDataIds = this.selectListData.map((obj) => obj.value);
      // const supplierRelLabelsIds = this.dataSet.current.data.supplierRelLabels.map((obj) => {
      //   return obj.categoryId;
      // });
      selectListDataIds.forEach((element) => {
        categoryIdSet.push(element);
      });
      this.$loading.show();
      getConfirmLabelsApi(this.dataSet.current.data.companyId, categoryIdSet).then((res) => {
        if (res && res.failed !== true) {
          this.dataSet.refresh();
        }
        this.$loading.hide();
      });
    },
  },
};
</script>

<style lang="stylus" scoped>

.srm-right-button {
  img {
    margin-right: 12px;
    height: 24px;
    width: 24px;
  }
}

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
