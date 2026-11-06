<!--eslint-disable-->
<template>
  <section v-if="headInfo" class="mainDetail">
    <div class="navWrap">
      <ul class="navContent">
        <li
          v-for="(item,index) in (isMallOrder ? navArr: navArr.slice(0,2))"
          :key="index"
          :class="{'active': navIndex === index}"
          @click="changeNav(index)">
          {{ item }}
        </li>
      </ul>
    </div>
    <div ref="wrapper" class="contentWrap wrapper">
      <div ref="content" class="content">
        <div ref="headInfo" class="infoContent language-class-ul-li">
          <h3>{{ $T('sinv.purchaserDelivery.view.message.title.deliveryHeaderInfo').$D('送货单头信息') }}</h3>
          <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
            <span>{{ $T("hipspfm.deliveryQuery.view.message.title.noDeliveryHeaderInfo").$D("暂无送货单头信息") }}</span>
          </div>
          <ul v-else>
            <li>
              <span>{{ $T('entity.customer.tag').$D('客户') }}</span>
              <span>{{ headInfo.companyName }}</span>
            </li>
            <li>
              <span>{{ $T('entity.supplier.tag').$D('供应商') }}</span>
              <span>{{ headInfo.supplierCompanyName }}</span>
            </li>
            <li>
              <span>{{ $T('entity.organization.class.receiving').$D('收货组织') }}</span>
              <span>{{ organizationName }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.agentName').$D('采购员') }}</span>
              <span>{{ purchaseAgentName }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.shipDate').$D('发货日期') }}</span>
              <span>{{ headInfo.shipDate|CalcDate }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.shipAddress').$D('收货地点') }}</span>
              <span>{{ headInfo.shipToLocationAddress }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.remark').$D('备注') }}</span>
              <span>{{ headInfo.remark?headInfo.remark : $T("hipspfm.common.currency.none").$D("无") }}</span>
            </li>
            <li v-if="getTenantNum === 'SRM-SANJIANG'">
              <span>{{ $T('sinv.common.model.common.oldItemCode22').$D('订单需求日期') }}</span>
              <span>{{ headInfo.attributeDate1?headInfo.attributeDate1 : $T("hipspfm.common.currency.none").$D("无") }}</span>
            </li>
            <li v-if="getTenantNum === 'SRM-SANJIANG'">
              <span>{{ $T('sinv.common.model.common.contactInfo').$D('联系人') }}</span>
              <span>{{ headInfo.attributeVarchar2?headInfo.attributeVarchar2 : $T("hipspfm.common.currency.none").$D("无") }}</span>
            </li>
            <li v-if="getTenantNum === 'SRM-SANJIANG'">
              <span>{{ $T('sinv.common.model.common.contactPhone').$D('联系人电话') }}</span>
              <span>{{ headInfo.attributeVarchar3?headInfo.attributeVarchar3 : $T("hipspfm.common.currency.none").$D("无") }}</span>
            </li>
            <li v-if="getTenantNum === 'SRM-SANJIANG'">
              <span>{{ $T('sinv.common.model.common.transportType').$D('运输类型') }}</span>
              <span>{{ headInfo.transportTypeMeaning?headInfo.transportTypeMeaning : $T("hipspfm.common.currency.none").$D("无") }}</span>
            </li>
          </ul>
        </div>
        <div ref="lineInfo" class="infoContent lineInfo">
          <h3>{{ $T('hipspfm.deliveryQuery.view.message.title.deliveryLineInfo').$D('送货单行信息') }}</h3>
          <div v-if="JSON.stringify(lineInfo) == '[]'" class="noContent">
            <span>{{ $T("hipspfm.deliveryQuery.view.message.title.noDeliveryLineInfo").$D("暂无送货单行信息") }}</span>
          </div>
          <div
            v-for="(item,index) in lineInfo"
            v-else
            :key="index"
            @click="showLineInfoDetail(item)">
            <div class="headCompany">
              <span class="block"/>
              <span class="code">
                <span class="materiel-name"> {{ item.itemName }}</span>
                <span >{{ $T("sinv.purchaseReception.view.message.lineNum").$D("行号") }}：{{ item.asnLineNum }}</span>
              </span>
            </div>
            <ul>
              <li>
                <span class="materialCode">{{ $T('sinv.common.model.common.itemCode').$D('物料编码') }}：{{ item.itemCode }}</span>
                <span>{{ $T('sinv.common.model.common.displayLineLocationNum').$D('发运号') }}：{{ item.displayLineLocationNum }}</span>
              </li>
              <li>
                <span>{{ $T('sinv.common.model.common.amount').$D('数量') }}：{{ item.quantity }}</span>
                <span>{{ $T('sinv.common.model.common.uomName').$D('单位') }}：{{ item.uomName }}</span>
              </li>
            </ul>
            <div class="footInfo">
              <span>{{ $T("sinv.common.model.common.neededDate").$D("需求日期") }}：</span>
              <span>{{ item.neededDate|CalcDate }}</span>
              <div >
                <span v-if="item.cancelledFlag=='1'">{{ $T('hipspfm.common.button.cancel').$D('取消') }}</span>
                <span v-if="item.closedFlag=='1'" class="flag-red">{{ $T('hipspfm.common.view.button.close').$D('关闭') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 行信息详情弹窗 -->
    <hips-popup v-model="show" class="FullPop" style="height: 100%;width:100%" position="right">
      <section v-if="isMallOrder" class="lineInfoDetail">
        <hips-nav-bar slot="header" :have-border="false">
          <div slot="left" class="left-button" @click="closeLineInfoDetail">
            <img class="image-black-default" src="@/assets/back@3x.png">
          </div>
          <div slot="center" class="header">{{ $T('hipspfm.common.view.message.title.itemsInfo').$D('物料信息') }}</div>
        </hips-nav-bar>
        <div class="lineHead">
          <li class="tag">
            <span><span>{{ $T('sinv.common.model.common.asnLineNum').$D('行号') }}: {{ lineInfoDetail.asnLineNum }}</span></span>
            <div>
              <span v-if="lineInfoDetail.cancelledFlag=='1'">{{ $T('hipspfm.common.button.cancel').$D('取消') }}</span>
              <span v-if="lineInfoDetail.closedFlag=='1'">{{ $T('sinv.common.status.close').$D('关闭') }}</span>
            </div>
          </li>
          <p>
            <span>{{ $T('sinv.common.model.common.itemCode').$D('物料编码') }}：</span>
            <span>{{ lineInfoDetail.itemCode }}</span>
          </p>
          <p>
            <span>{{ $T('sinv.common.model.common.itemName').$D('物料名称') }}：</span>
            <span>{{ lineInfoDetail.itemName }}</span>
          </p>
        </div>
        <div class="language-class-ul-li">
          <ul>
            <li>
              <span>{{ $T('sinv.common.model.common.sendQuantity').$D('发货数量') }}：</span>
              <span>{{ lineInfoDetail.shipQuantity }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.receiveQuantity').$D('已接收') }}：</span>
              <span>{{ lineInfoDetail.receiveQuantity }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.uomName').$D('单位') }}：</span>
              <span>{{ lineInfoDetail.uomName }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.displayPoNum').$D('订单号') }}：</span>
              <span>{{ lineInfoDetail.displayPoNum }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.displayLineNum').$D('订单行号') }}：</span>
              <span>{{ lineInfoDetail.displayAsnLineNum }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.neededDate').$D('需求日期') }}：</span>
              <span>{{ lineInfoDetail.neededDate|CalcDate }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.purchaseRemark').$D('采购方行备注') }}：</span>
              <span>{{ lineInfoDetail.purchaseRemark ? lineInfoDetail.purchaseRemark: $T("hipspfm.common.currency.none").$D("无") }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.product.number').$D('商品编码') }}：</span>
              <span>{{ lineInfoDetail.productNum }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.product.name').$D('商品名称') }}：</span>
              <span>{{ lineInfoDetail.productName }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.catalog.name').$D('商品目录') }}：</span>
              <span>{{ lineInfoDetail.catalogName }}</span>
            </li>
          </ul>
        </div>
      </section>
      <section v-else class="lineInfoDetail">
        <hips-nav-bar slot="header" :have-border="false">
          <div slot="left" class="left-button" @click="closeLineInfoDetail">
            <img src="@/assets/back@3x.png" class="image-black-default">
          </div>
          <div slot="center" class="header">{{ $T('hipspfm.common.view.message.title.itemsInfo').$D('物料信息') }}</div>
        </hips-nav-bar>
        <div class="lineHead">
          <li class="tag">
            <span><span>{{ $T('sinv.purchaseReception.view.message.lineNum').$D('行号') }}: {{ lineInfoDetail.asnLineNum }}</span></span>
            <div>
              <span v-if="lineInfoDetail.cancelledFlag=='1'">{{ $T('hipspfm.common.button.cancel').$D('取消') }}</span>
              <span v-if="lineInfoDetail.closedFlag=='1'">{{ $T('hipspfm.common.status.close').$D('关闭') }}</span>
            </div>
          </li>
          <p>
            <span>{{ $T('entity.item.code').$D('物料编码') }}：</span>
            <span>{{ lineInfoDetail.itemCode }}</span>
          </p>
          <p>
            <span>{{ $T('entity.item.name').$D('物料名称') }}：</span>
            <span>{{ lineInfoDetail.itemName }}</span>
          </p>
        </div>
        <div class="language-class-ul-li">
          <ul>
            <li>
              <span>{{ $T('sinv.common.model.common.sendQuantity').$D('发货数量') }}：</span>
              <span>{{ lineInfoDetail.shipQuantity }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.receiveQuantity').$D('已接收') }}：</span>
              <span>{{ lineInfoDetail.receiveQuantity }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.uomName').$D('单位') }}：</span>
              <span>{{ lineInfoDetail.uomName }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.displayPoNum').$D('订单号') }}：</span>
              <span>{{ lineInfoDetail.displayPoNum }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.displayLineNum').$D('订单行号') }}：</span>
              <span>{{ lineInfoDetail.displayAsnLineNum }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.displayLineLocationNum').$D('发运号') }}：</span>
              <span>{{ lineInfoDetail.displayLineLocationNum }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.neededDate').$D('需求日期') }}：</span>
              <span>{{ lineInfoDetail.neededDate|CalcDate }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.promiseDeliveryDate').$D('承诺交货日期') }}：</span>
              <span>{{ lineInfoDetail.promisedDate|CalcDate }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.purchaseRemark').$D('采购方行备注') }}：</span>
              <span>{{ lineInfoDetail.purchaseRemark ? lineInfoDetail.purchaseRemark : $T("hipspfm.common.currency.none").$D("无") }}</span>
            </li>
            <li>
              <span>{{ $T('sinv.common.model.common.supplierRemark').$D('供应商行备注') }}：</span>
              <span>{{ lineInfoDetail.supplierRemark ? lineInfoDetail.supplierRemark : $T("hipspfm.common.currency.none").$D("无") }}</span>
            </li>
            <li v-if="getTenantNum === 'SRM-SANJIANG'">
              <span>{{ $T('sinv.common.model.common.materialBarcode').$D('物料条码') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar4 }}</span>
            </li>
            <li v-if="getTenantNum === 'SRM-SANJIANG'">
              <span> {{ $T('sinv.common.model.common.specifications').$D('规格') }} </span>
              <span>{{ lineInfoDetail.attributeVarchar6 }}</span>
            </li>
            <li v-if="getTenantNum === 'SRM-SANJIANG'">
              <span>{{ $T('sinv.common.model.common.packageQuantity').$D('件数') }}：</span>
              <span>{{ lineInfoDetail.attributeBigint1 }}</span>
            </li>
            <li v-if="getTenantNum === 'SRM-SANJIANG'">
              <span>{{ $T('sinv.common.model.common.poUnitPrice').$D('含税单价') }}：</span>
              <span>{{ lineInfoDetail.attributeDecimal3 }}</span>
            </li>
            <li v-if="getTenantNum === 'SRM-SANJIANG'">
              <span>{{ $T('sinv.common.model.common.taxIncludedUnitPrice').$D('含税行金额') }}：</span>
              <span>{{ lineInfoDetail.attributeDecimal4 }}</span>
            </li>
            <li v-if="getTenantNum === 'SRM-SANJIANG'">
              <span>{{ $T('sinv.common.model.common.excludingTaxPrice').$D('不含税行金额') }}：</span>
              <span>{{ lineInfoDetail.attributeDecimal5 }}</span>
            </li>
            <li v-if="getTenantNum === 'SRM-SANJIANG'" @click="clickToViewStoreDetail(lineInfoDetail.asnLineId)">
              <span>{{ $T('sinv.common.model.common.storeDetail').$D('门店明细') }}：</span>
              <span style="color: var(--color-other-default-b);">
                {{ $T('sinv.common.model.common.clickToView').$D('点击查看') }}
              </span>
            </li>
            <li class="language-attachment">
              <span>{{ $T('entity.attachment.tag').$D('附件') }}：</span>
              <span style="color: var(--color-other-default-b);" @click="showFilePop(lineInfoDetail.attachmentUuid||uuid())">{{ $T('hipspfm.common.button.viewAttachments').$D('查看附件') }}
                <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt="">
              </span>
            </li>
          </ul>
        </div>
      </section>
    </hips-popup>
    <hips-popup v-model="storeInfoShow" style="height:80%;width:100%" class="FullPop" position="bottom">
      <div class="lineInfoDetail">
        <hips-nav-bar slot="header" :have-border="false">
          <div
            slot="left"
            class="left-button"
            @click="closeStoreInfoDetail">
            <img class="image-black-default" src="@/assets/icon_navigationbars_off_normal@3x.png" >
          </div>
          <div
            slot="center"
            class="header">
            {{ $T('hipspfm.common.model.common.storeDetail').$D('门店明细') }}
          </div>
        </hips-nav-bar>
        <div class="prequalification-detail">
          <ul>
            <li v-for="store in storeList" :key="store.asnStoreId" class="store-item">
              <div class="store-info-line">
                <div class="store-info-title">{{ $T('sinv.common.model.common.storeName').$D('门店名称') }}：</div>
                <div class="store-info-content">{{ store.storeName }}</div>
              </div>
              <div class="store-info-line">
                <div class="store-info-title">{{ $T('sinv.common.model.common.shippedQuantitys').$D('需求数量') }}：</div>
                <div class="store-info-content">{{ store.needQuantity }}</div>
              </div>
              <div class="store-info-line">
                <div class="store-info-title">{{ $T('sinv.common.model.common.sendQuantity').$D('发货数量') }}：</div>
                <div class="store-info-content">{{ store.shipQuantity }}</div>
              </div>
              <div class="store-line-view"/>
            </li>
          </ul>
        </div>
      </div>
    </hips-popup>
  </section>
</template>

<script>
/*eslint-disable*/
import uuid from "uuid";
import BScroll from "better-scroll";
import { Popup, Icon, NavBar } from "hips";
import { getStoreInfoList } from "../api/index.js";
import { SrmUtil } from "srm-mobile-ui";

export default {
  modules: [ "sinv.purchaserDelivery", "hipspfm.deliveryQuery", "entity.organization", "sinv.common", "hipspfm.common", "sinv.purchaseReception", "entity.customer", "entity.supplier", "entity.item", "entity.attachment" ],
  name: "TabScroll",
  components: {
    [Popup.name]: Popup,
    [Icon.name]: Icon,
    [NavBar.name]: NavBar
  },
  props: {
    headInfo: {
      type: Object,
      default: {}
    },
    organizationName: {
      type: String,
      default: ""
    },
    purchaseAgentName: {
      type: String,
      default: ""
    },
    showFilePop: {
      type: Function
    },
    lineInfo: Array
  },
  data() {
    return {
      uuid: uuid,
      scroll: "",
      show: false,
      navIndex: 0,
      contentLenArr: [],
      lineInfoDetail: {},
      navArr: [ this.$T("sinv.purchaserDelivery.view.message.title.deliveryHeaderInfo").$D("送货单头信息"), this.$T("hipspfm.deliveryQuery.view.message.title.deliveryLineInfo").$D("送货单行信息") ],
      storeList: [],
      storeInfoShow: false,
    };
  },
  computed: {
    isMallOrder() {
      return this.headInfo.asnTypeCode === "E_COMMERCE_DELIVERY_LIST";
    },
    getTenantNum() {
      return SrmUtil.getTenantNum();
    }
  },
  watch: {
    lineInfo: {
      handler() {
        this.$nextTick(() => {
          this.contentLenArr = [
            this.$refs.headInfo.offsetHeight,
            this.$refs.lineInfo.offsetHeight
          ];
          const oHeight = this.contentLenArr.reduce((a, b) => a + b) + 250;
          this.$refs.content.style.height = 100 / 667 * oHeight + "vh";
          this.scroll && this.scroll.refresh();
        });
      },
      immediate: true,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        click: true,
        probeType: 3
        // bounce: false    //关闭回弹效果
      });
      this.scroll.on("scroll", this.handlerScroll);
    });
  },
  methods: {
    // 显示行信息详情
    showLineInfoDetail(data) {
      this.show = true;
      this.lineInfoDetail = data;
    },
    closeLineInfoDetail() {
      this.show = false;
    },
    // 切换tab
    changeNav(index) {
      const newArr = this.contentLenArr.slice(0, index);
      const offsetLen = newArr.length ? newArr.reduce((a, b) => a + b) : 0;
      this.$nextTick(() => {
        this.scroll.scrollTo(0, -offsetLen, 600, "bounce");
      });
      this.navIndex = index;
    },
    // 滚动事件
    handlerScroll({ x, y }) {
      const len1 = -this.contentLenArr[0];
      const len2 = len1 - this.contentLenArr[1];
      const len3 = len2 - this.contentLenArr[2];
      if (y > len1 && y < 100) {
        this.navIndex = 0;
      } else if (y > len2 && y <= len1) {
        this.navIndex = 1;
      } else if (y > len3 && y <= len2) {
        this.navIndex = 2;
      } else {
        this.navIndex = 3;
      }
    },
    clickToViewStoreDetail(asnLineId) {
      this.storeList = [];
      this.storeInfoShow = true;
      this.$loading.show();
      getStoreInfoList(asnLineId).then((res) => {
        this.$loading.hide();
        if (!res.empty) {
          this.storeList = res.content;
        }
      });
    },
    closeStoreInfoDetail() {
      this.storeInfoShow = false;
      this.storeList = [];
    }
  }
};
</script>

<style lang="stylus" scoped>
.mainDetail {
  .navWrap {
    width: 100%;
    height: 44px;
    position: relative;
    z-index: 999;

    &::-webkit-scrollbar {
      display: none;
    }

    .navContent {
      width: 150%;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      li {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default-b);
        letter-spacing: 0;
        text-align: center;
        line-height: 24px;
        text-align: center;
        position: relative;
        margin-left: 20px;

        &.active {
          font-size: 16px;
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
  .contentWrap {
    font-family: PingFangSC-Medium;
    height: calc(100vh - 137px);
    overflow: hidden;

    .content {
      .infoContent {
        .materiel-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        h3 {
          padding: 20px 53px 12px 20px;
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color:var(--color-font-default);
          line-height: 26px;
          font-weight:700;
          background:var(--color-bg-default-b);
        }
        .materialCode{
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .footInfo{
          padding:12px 20px 12px 20px;
          border-bottom: 8px solid var(--color-border-default);
          font-family : PingFangSC-Medium;
          color:var(--color-font-default);
          font-size: 14px;
          display:flex;
          line-height:22px;
          font-weight:600;
          span:nth-child(2) {
            // width:80px;
            flex-grow: 1;
          }
          div{
            span{
              font-family: PingFangSC-Medium;
              font-size: 10px;
              color:var(--color-font-default-c);
              line-height: 18px;
              display:inline-block;
              background:var(--color-bg-default-d,rgba(65,70,96,0.1));
              border-radius: 2px;
              padding:1px 4px;
              margin-left:8px;
            }
           .flag-red{
            background:var(--color-bg-default-e);
            color: var(--color-other-default);
           }
          }
        }
        .headCompany  {
          display: flex;
          flex-direction: row;
          padding-bottom:11px;
          margin:14px 0 3px 20px;
          border-bottom:1px solid var(--color-border-default);
          padding-right:20px;
          align-items:center;
          .block{
            width:6px;
            height:14px;
            border-radius:1px;
            background-color:var(--color-other-default-b);
            margin:0px 10px 0 0;
          }
          .code{
            flex :1;
            font-size: 16px;
            color:var(--color-font-default);
            line-height : 24px;
            display: flex;
            justify-content : space-between;
            font-weight:600;
            span:nth-child(2){
              font-family: PingFangSC-Medium;
              font-size: 14px;
              color: var(--color-font-default-e);
              text-align: right;
              // line-height: 22px;
              font-weight:bold;
            }
          }
        }
      }
      .lineInfo{
        ul {
          padding-left:20px;
          li:nth-last-child(1){
            padding-bottom:11px;
            border-bottom:1px solid var(--color-border-default);
          }
          li {
            display: flex;
            align-items: center;
            padding: 9px 20px 0 0;
            margin-bottom: 2px;
            span {
              flex:1;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color:var(--color-font-default);
              line-height: 22px;
            }
          }
          }
      }
    }
  }
}

.lineInfoDetail {
  background:var(--color-bg-default);
  height: 100%;
  display:flex;
  flex-direction: column;
  .header {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color:var(--color-font-default);
    text-align: center;
    line-height: 26px;
    font-weight:700;
    padding:9px 0;
  }

  .lineHead {
    padding: 8px 20px 12px;
    background-color:var(--color-font-default-d);
    font-family:'PingFangSC-Medium';
    color:var(--color-font-default);
    font-size:16px;
    line-height :24px;
    border-bottom: 8px solid var(--color-border-default);

    li {
      padding: 0;
      margin-bottom: 4px;
      height: 24px;
      display: flex;
      color: var(--color-font-default-e);
    }

    p {
      span {
        color:var(--color-font-default);
        line-height: 24px;
        font-size: 16px;
        font-weight:600;
      }
    }
  }
  .lineHead :nth-child(2) {
    margin-bottom: 4px;
  }

  .lineBody {
    background-color:var(--color-font-default-d);
    overflow: auto;
    li {
      display: flex;
      padding: 20px 20px  11px 0;
      margin-bottom: 2px;
      margin-left: 20px;
      border-bottom:1px solid var(--color-border-default);
      &:nth-of-type(1){
        padding-top: 20px;
      }

      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default);
        line-height: 22px;
        &:nth-child(1){
          width: 98px;
        }
        &:nth-child(2) {
          color:var(--color-font-default-b);
          display: inline-block;
          width: 237px;
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
    .line-div{
      height: 34px;
      display: flex;
      justify-content: center;
      .line-block{
        width:35.7%;
        height:6px;
        position:relative;
        bottom:-18px;
      }
    }
  }
}
.tag {
  display: flex;
  justify-content: space-between;
  div {
    span {
      display: inline-block;
      border-radius: 2px;
      height: 20px;
      line-height 20px;
      text-align: center;
      font-size: 10px !important;
      &:nth-child(1) {
        background:var(--color-bg-default-d,rgba(65,70,96,0.1));
        color:var(--color-font-default-c) !important;
      }
      &:nth-child(2) {
        color: var(--color-other-default) !important;
        text-align: center !important;
        background:var(--color-bg-default-e);
        margin-left: 8px;
      }
    }
  }
}

.store-item {
  display: flex;
  flex-direction: column;
  border-bottom: solid 1px var(--color-border-default);
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 15px;
  padding-right: 15px;
  .store-info-line {
    width: 100%;
    margin-top: 8px;
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
  }
  .store-info-title {
    font-size: 14px;
    color: var(--color-font-default);
  }
  .store-info-content {
    font-size: 14px;
    margin-left: 12px;
    color: var(--color-font-default-b);
  }
}
</style>
