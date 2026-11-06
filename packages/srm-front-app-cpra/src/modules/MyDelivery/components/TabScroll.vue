<template>
  <section v-if="headInfo" class="mainDetail">
    <div class="navWrap">
      <ul class="navContent">
        <li
          v-for="(item,index) in (isMallOrder ? multipleLanguage.navArr: multipleLanguage.navArr.slice(0,3))"
          :key="index"
          :class="{'active': navIndex === index}"
          @click="changeNav(index)">
          {{ item }}
        </li>
      </ul>
    </div>
    <div ref="wrapper" class="contentWrap wrapper">
      <div ref="content" class="content">
        <div ref="headInfo" class="infoContent headInfo">
          <h3>{{ $T("hipspfm.common.view.message.title.headInfo").$D("头信息") }}</h3>
          <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
            <span>{{ $T("hipspfm.supplierDelivery.view.message.title.noDeliveryHeaderInfo").$D("暂无头信息") }}</span>
          </div>
          <div v-else>
            <ul>
              <li>
                <span>
                  <span class="block"/>
                  <span>{{ $T("hipspfm.common.message.supplier").$D("供应商") }}：{{ headInfo.supplierCompanyName }}</span>
                </span>
              </li>
              <li>
                <span>{{ $T("sinv.common.model.common.organizationName").$D("收货组织") }}：{{ headInfo.organizationName }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.common.model.common.shipDate").$D("发货日期") }}： {{ headInfo.shipDate|CalcDate }}</span>
              </li>
              <li>
                <span
                  v-if="headInfo.immedShippedFlag=='1'">{{ $T("sinv.common.model.common.immedShippedFlag").$D("是否直发") }}： {{ $T("hipspfm.common.status.yes").$D("是") }}</span>
                <span
                  v-if="headInfo.immedShippedFlag=='0'">{{ $T("sinv.common.model.common.immedShippedFlag").$D("是否直发") }}： {{ $T("hipspfm.common.status.no").$D("否") }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.supplierDelivery.model.supplierDelivery.shipToLocationAddress").$D("收货地点") }}:</span>
                <span>{{ headInfo.shipToLocationAddress }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.common.model.common.remark").$D("备注") }}： {{ headInfo.remark?headInfo.remark : $T("hipspfm.common.currency.none").$D("无") }}</span>
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
        </div>
        <div ref="lineInfo" class="infoContent lineInfo">
          <h3>{{ $T("hipspfm.common.view.message.title.lineInfo").$D("行信息") }}</h3>
          <div v-if="JSON.stringify(lineInfo) == '[]'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noOrderLineInfo").$D("暂无行信息") }}</span>
          </div>
          <div
            v-for="(item,index) in lineInfo"
            v-else
            :key="index"
            class="lineInfo-content"
            @click="showLineInfoDetail(item)">
            <div class="headCompany">
              <span class="block"/>
              <span class="code">
                <span class="materiel-name">{{ item.itemName }}</span>
                <span
                  v-if="item.cancelledFlag == 1">{{ $T("sinv.common.model.common.cancelledFlag").$D("已取消") }}</span>
                <span
                  v-else-if="item.closedFlag == 1">{{ $T("sinv.common.model.common.closedFlag").$D("已关闭") }}</span>
                <span v-else/>
              </span>
            </div>
            <ul>
              <li>
                <span
                  class="materialCode">{{ $T("sinv.common.model.common.itemCode").$D("物料编码") }}: {{ item.itemCode }}</span>
                <span>{{ $T("sinv.supplierDelivery.model.supplierDelivery.asnLineNum").$D("行号") }}：{{ item.asnLineNum }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.supplierDelivery.model.supplierDelivery.shipQuantity").$D("发货数量") }}: {{ item.shipQuantity }}</span>
                <span>{{ $T("sinv.common.model.common.unit").$D("单位") }}: {{ item.uomName }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.supplierDelivery.model.supplierDelivery.receiveQuantity").$D("已接收") }}: {{ item.receiveQuantity }}</span>
              </li>
            </ul>
            <div class="footInfo">
              <span>{{ $T("sinv.common.model.common.receiveStatus").$D("接收状态") }}：</span>
              <span>{{ item.receiveStatusMeaning }}</span>
            </div>
          </div>
        </div>
        <div ref="logisticsInfo" class="infoContent headInfo">
          <h3>{{ $T("sinv.supplierDelivery.view.message.title.logistics").$D("物流信息") }}</h3>
          <div class="language-class-input">
            <label>{{ $T('sinv.common.model.common.logisticsCompany').$D('物流公司') }}</label>
            <hips-input
              v-model="logisticsCompany"
              show-clear-button
              :placeholder="$T('hipspfm.supplierDelivery.view.message.handlerLogisticsCompany').$D('请填写物流公司')"
              type="text"
              label-position="left">
              <div slot="right">
                <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
              </div>
            </hips-input>
          </div>
          <div class="language-class-input">
            <label>{{ $T('sinv.common.model.common.logisticsStaff').$D('配送人员') }}</label>
            <hips-input
              v-model="logisticsStaff"
              show-clear-button
              :placeholder="$T('hipspfm.supplierDelivery.view.message.handlerLogisticsStaff').$D('请填写配送人员')"
              type="text"
              label-position="left">
              <div slot="right">
                <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
              </div>
            </hips-input>
          </div>
          <div class="language-class-input">
            <label>{{ $T('sinv.common.model.common.logisticsContactInfo').$D('联系方式') }}</label>
            <hips-input
              v-model="logisticsContactInfo"
              show-clear-button
              :placeholder="$T('hipspfm.supplierDelivery.view.message.handlerLogisticsContactInfo').$D('请填写联系方式')"
              type="text"
              label-position="left">
              <div slot="right">
                <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
              </div>
            </hips-input>
          </div>
          <div class="language-class-input">
            <label>{{ $T('sinv.common.model.common.logisticsCost').$D('物流费用') }}</label>
            <hips-input
              v-model="logisticsCost"
              show-clear-button
              :placeholder="$T('hipspfm.supplierDelivery.view.message.handlerLogisticsCost').$D('请填写物流费用')"
              type="text"
              label-position="left">
              <div slot="right">
                <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
              </div>
            </hips-input>
          </div>
          <div class="language-class-input">
            <label>{{ $T('sinv.common.model.common.expressNum').$D('快递单号') }}</label>
            <hips-input
              v-model="expressNum"
              show-clear-button
              :placeholder="$T('hipspfm.supplierDelivery.view.message.handlerExpressNum').$D('请填写快递单号')"
              type="text"
              label-position="left">
              <div slot="right">
                <img src="@/assets/icon_editor@3x.png" class="input-edit image-gray-default" >
              </div>
            </hips-input>
          </div>
        </div>
      </div>
    </div>
    <!-- 行信息详情弹窗 -->
    <hips-popup v-model="show" class="FullPop" style="height: 100%;width:100%" position="right">
      <section class="lineInfoDetail">
        <hips-nav-bar slot="header" :have-border="false">
          <div slot="left" class="left-button" @click="closeLineInfoDetail">
            <img class="image-gray-default" src="@/assets/icon_close_normal@3x.png" alt >
          </div>
          <div
            slot="center"
            class="header">
            {{ $T("hipspfm.common.view.message.title.itemsInfo").$D("物料信息") }}
          </div>
        </hips-nav-bar>
        <div class="lineHead">
          <li>
            <span>
              <span>{{ $T("sinv.supplierDelivery.model.supplierDelivery.asnLineNum").$D("行号") }}: {{ lineInfoDetail.asnLineNum }}</span>
            </span>
          </li>
          <p>
            <span>{{ $T("sinv.common.model.common.itemCode").$D("物料编码") }}：</span>
            <span>{{ lineInfoDetail.itemCode }}</span>
          </p>
          <p>
            <span>{{ $T("sinv.common.model.common.itemName").$D("物料名称") }}：</span>
            <span>{{ lineInfoDetail.itemName }}</span>
          </p>
        </div>
        <div class="language-class-ul-li">
          <ul>
            <li>
              <span>{{ $T("sinv.common.model.common.shipQuantity").$D("发货数量") }}：</span>
              <span>{{ lineInfoDetail.quantity }}</span>
            </li>
            <li>
              <span>{{ $T("sinv.common.model.common.uomName").$D("单位") }}：</span>
              <span>{{ lineInfoDetail.uomName }}</span>
            </li>
            <li>
              <span>{{ $T("sinv.common.model.common.receiveStatus").$D("接收状态") }}：</span>
              <span>{{ lineInfoDetail.receiveStatusMeaning }}</span>
            </li>
            <li>
              <span>{{ $T("sinv.common.model.common.receiveQuantity").$D("已接收") }}：</span>
              <span>{{ lineInfoDetail.receiveQuantity }}</span>
            </li>
            <li>
              <span>{{ $T("sinv.common.model.common.displayPoNum").$D("订单号") }}：</span>
              <span>{{ lineInfoDetail.displayPoNum }}</span>
            </li>
            <li>
              <span>{{ $T("sinv.common.model.common.neededDate").$D("需求日期") }}：</span>
              <span>{{ lineInfoDetail.neededDate|CalcDate }}</span>
            </li>
            <li>
              <span>{{ $T("hipspfm.supplierDelivery.model.supplierDelivery.promiseDate").$D("承诺日期") }}：</span>
              <span>{{ lineInfoDetail.promisedDate|CalcDate }}</span>
            </li>
            <li class="language-attachment">
              <span>{{ $T("smbl.common.view.attachment").$D("附件") }}：</span>
              <span
                style="color: var(--color-other-default-b);"
                @click="showFilePop(lineInfoDetail.attachmentUuid||uuid)">
                {{ $T("hipspfm.common.button.viewAttachments").$D("查看附件") }}
                <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt >
              </span>
            </li>
            <li>
              <span>{{ $T("sinv.common.model.common.product.number").$D("商品编码") }}：</span>
              <span>{{ lineInfoDetail.productNum }}</span>
            </li>
            <li>
              <span>{{ $T("sinv.common.model.common.catalog.name").$D("商品目录") }}：</span>
              <span>{{ lineInfoDetail.catalogName }}</span>
              <span v-show="false">{{ change }}</span>
            </li>
            <li>
              <span>{{ $T("sinv.common.model.common.product.name").$D("商品名称") }}：</span>
              <span>{{ lineInfoDetail.productName }}</span>
            </li>
            <li>
              <span>{{ $T("sinv.common.model.common.purchaseRemark").$D("采购方行备注") }}：</span>
              <span>{{ lineInfoDetail.purchaseRemark ? lineInfoDetail.purchaseRemark : $T("hipspfm.common.currency.none").$D("无") }}</span>
            </li>
            <li v-if="getTenantNum === 'SRM-SANJIANG'">
              <span>{{ $T('sinv.common.model.common.materialBarcode').$D('物料条码') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar4 }}</span>
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
          </ul>
        </div>
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
                class="store-header">
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
    </hips-popup>
    <div id="FootButton" class="invite" @click="collection">
      <span>{{ $T('hipspfm.common.button.save').$D('保存') }}</span>
    </div>
  </section>
</template>

<script>
import BScroll from "better-scroll";
import uuid from "uuid";
import { Popup, NavBar, Input } from "hips";
import { getLogisticsApi, getStoreInfoList } from "../api/index";
import { SrmUtil } from "srm-mobile-ui";

export default {
  modules: [ "sinv.supplierDelivery", "hipspfm.common", "hipspfm.supplierDelivery", "sinv.common", "smbl.common" ],
  name: "TabScroll",
  components: {
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Input.name]: Input
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
    getOrderHeader: {
      type: Function
    },
    lineInfo: Array
  },
  data() {
    return {
      scroll: "",
      show: false,
      navIndex: 0,
      contentLenArr: [],
      lineInfoDetail: {},
      multipleLanguage: {
        navArr: [
          this.$T("hipspfm.common.view.message.title.headInfo").$D("头信息"),
          this.$T("hipspfm.common.view.message.title.lineInfo").$D("行信息"),
          this.$T("sinv.supplierDelivery.view.message.title.logistics").$D("物流信息")
        ],
      },
      logisticsCompany: "", //物流公司
      logisticsStaff: "", // 配送人员
      logisticsContactInfo: "", // 联系方式
      logisticsCost: "", // 物流费用
      expressNum: "", //快递单号
      normal: "",
      uuid: uuid(),
      storeInfoShow: false,
      storeList: [],
    };
  },
  computed: {
    isMallOrder() {
      return this.headInfo.asnTypeCode === "E_COMMERCE_DELIVERY_LIST";
    },
    change() {
      const tempChange =
        this.logisticsCompany +
        this.logisticsStaff +
        this.logisticsContactInfo +
        this.logisticsCost +
        this.expressNum;
      this.$emit("GetChange", tempChange);
      return tempChange;
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
            this.$refs.lineInfo.offsetHeight,
            this.$refs.logisticsInfo.offsetHeight
          ];
          const oHeight = this.contentLenArr.reduce((a, b) => a + b) + 360;
          this.$refs.content.style.height = 100 / 667 * oHeight + "vh";
          this.scroll && this.scroll.refresh();
        });
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        eventPassthrough: "horizontal",
        useTransform: false,
        click: true,
        observeDOM: false,
        probeType: 3
        // bounce: false    //关闭回弹效果
      });
      this.scroll.on("scroll", this.handlerScroll);
    });
    this.inital();
  },
  methods: {
    // 显示行信息详情
    showLineInfoDetail(data) {
      this.lineInfoDetail = data;
      setTimeout(() => {
        this.show = true;
      }, 200);
    },
    closeLineInfoDetail() {
      this.show = false;
    },
    // 滑倒可视位置
    // intoView(val){
    //   this.$nextTick(() => {
    //     this.scroll.scrollTo(0, val, 600,"smooth");
    //   });
    // },
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
    inital() {
      this.logisticsCompany = this.headInfo.logisticsCompany ?
        this.headInfo.logisticsCompany :
        "";
      this.logisticsStaff = this.headInfo.logisticsStaff ?
        this.headInfo.logisticsStaff :
        "";
      this.logisticsContactInfo = this.headInfo.logisticsContactInfo ?
        this.headInfo.logisticsContactInfo :
        "";
      this.logisticsCost = this.headInfo.logisticsCost ?
        this.headInfo.logisticsCost :
        "";
      this.expressNum = this.headInfo.expressNum ?
        this.headInfo.expressNum :
        "";
      this.normal =
        this.logisticsCompany +
        this.logisticsStaff +
        this.logisticsContactInfo +
        this.logisticsCost +
        this.expressNum;
      this.$emit("GetNormal", this.normal);
    },
    // 补录信息
    collection() {
      let asnHeaderId = this.headInfo.asnHeaderId;
      let params = {
        asnHeaderId: this.headInfo.asnHeaderId,
        expressNum: this.expressNum,
        logisticsCompany: this.logisticsCompany,
        logisticsContactInfo: this.logisticsContactInfo,
        logisticsCost: this.logisticsCost,
        logisticsStaff: this.logisticsStaff,
        objectVersionNumber: this.headInfo.objectVersionNumber ?
          this.headInfo.objectVersionNumber :
          "",
        _token: this.headInfo._token
      };
      getLogisticsApi(params, asnHeaderId).then((res) => {
        if (res.failed) {
          this.$hips.toast({
            message: res.message,
            duration: 1500
          });
        } else {
          this.$hips.toast({
            message: this.$T("hipspfm.common.message.saveSuccess").$D(
              "保存成功"
            ),
            duration: 900
          });
          this.normal =
            this.logisticsCompany +
            this.logisticsStaff +
            this.logisticsContactInfo +
            this.logisticsCost +
            this.expressNum;
          this.$emit("GetNormal", this.normal);
          const _this = this;
          setTimeout(function() {
            _this.$router.replace({ name: "MyDeliveryList" });
          }, 1000);
        }
      });
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
      this.storeList = [];
      this.storeInfoShow = false;
    }
  }
};
</script>

<style scoped  lang="stylus">
.blackFont {
  color:var(--color-font-default);
}

.block {
  width: 6px;
  height: 14px;
  border-radius: 1px;
  background-color: var(--color-other-default-b);
  margin: 0px 8px 0 0;
}

.closeFont {
  color:var(--color-font-default-c) !important;
  border-color:var(--color-font-default-c) !important;
}

.noContent {
  height: 78px;
  padding-left: 20px;

  span {
    position: relative;
    top: 16px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color:var(--color-font-default-b);
    letter-spacing: 0;
    line-height: 22px;
  }
}

.mainDetail {
  .navWrap {
    width: 100%;
    height: 44px;
    overflow: hidden;
    position: relative;
    z-index: 999;

    .navContent {
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
    position: relative;

    .content {
      position: absolute;
      width: 100%;

      .infoContent {
        .materiel-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 220px;
        }

        .materialCode {
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
          font-weight: 700;
          background:var(--color-bg-default-b);
        }

        .footInfo {
          padding: 11px 15px 12px 20px;
          font-family: PingFangSC-Medium;
          color:var(--color-font-default);
          font-size: 14px;
          display: flex;
          line-height: 22px;
          font-weight: 600;

          span:nth-child(1) {
            // width:80px;
          }
        }

        .headCompany {
          display: flex;
          flex-direction: row;
          padding-bottom: 12px;
          margin: 15px 0 2px 20px;
          border-bottom:1px solid var(--color-border-default);
          padding-right: 20px;

          // line-height: 26px;
          span:nth-child(3) {
            color: var(--color-font-default-e);
            font-size: 14px;
            position: absolute;
            right: 20px;
            line-height: 22px;
          }

          .block {
            width: 6px;
            height: 14px;
            border-radius: 1px;
            background-color: var(--color-other-default-b);
            margin: 4px 10px 0 0;
          }

          .code {
            flex: 1;
            font-size: 16px;
            color:var(--color-font-default);
            line-height: 22px;
            display: flex;
            justify-content: space-between;
            font-weight: 600;

            span:nth-child(2) {
              font-family: PingFangSC-Medium;
              font-size: 14px;
              color: var(--color-font-default-e);
              text-align: right;
              line-height: 22px;
              font-weight: bold;
            }
          }
        }

        ul {
          padding-left: 20px;

          li:nth-last-child(1) {
            padding-bottom: 11px;
            border-bottom:1px solid var(--color-border-default);
          }

          li {
            display: flex;
            align-items: center;
            padding: 10px 20px 0 0;
            margin-bottom: 2px;

            span {
              flex: 1;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color:var(--color-font-default);
              line-height: 22px;
            }
          }

          div {
            padding: 8px 20px 0px 20px;

            li {
              padding: 0;

              .tag {
                display: inline-block;
                width: 30px;
                margin-left: 5px;
                color: var(--color-other-default);
                font-size: 10px;
                line-height: 18px;
                text-align: center;
                border-radius: 1px;
                border: 1px solid var(--color-other-default);
              }

              &:nth-child(2) {
                span {
                  line-height: 22px;
                  font-size: 14px;
                  color:var(--color-font-default);
                }
              }
            }
          }
        }
      }

      .headInfo {
        ul {
          padding: 0;

          li:nth-child(1) {
            padding: 13px 20px 7px 0px;
            margin-bottom: 0px;
            border: none;

            span {
              display: flex;
              align-items: center;
              flex: none;

              .block {
                display: inline-block;
                margin: 0 14px 0 0;
              }

              span:nth-child(2) {
                margin-right: 12px;
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color:var(--color-font-default);
                line-height: 22px;
                font-weight: 700;
              }
            }
          }

          li {
            margin-bottom: 2px;
            padding: 5px 20px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color:var(--color-font-default);
            line-height: 22px;
          }

          li:nth-last-child(1) {
            padding: 5px 20px 13px 20px;
            border: none;
            margin-bottom: 0px;
          }
        }
      }

      .lineInfo-content:not(:last-child) {
        .footInfo {
          border-bottom: 8px solid var(--color-border-default);
        }
      }
    }
  }
}

.lineInfoDetail {
  background: #FAFBFC;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    font-size: 20px;
    line-height: 32px;
  }

  // .left-button {
  // margin-left: 20px;
  // }
  .lineHead {
    padding: 8px 20px 12px;
    background-color:var(--color-font-default-d);
    font-family: 'PingFangSC-Medium';
    color:var(--color-font-default);
    font-size: 16px;
    line-height: 24px;
    border-bottom: 8px solid var(--color-border-default);

    li {
      padding: 0;
      margin-bottom: 9px;
      height: 24px;
      display: flex;
      color: var(--color-font-default-e);
    }

    p {
      span {
        color:var(--color-font-default);
        line-height: 24px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .lineHead :nth-child(2) {
    margin-bottom: 8px;
  }

  .language-class-ul-li {
    background-color:var(--color-font-default-d);
  }
}
.store-header {
  font-weight: bold;
  font-size: 16px;
}
.store-item {
  display: flex;
  flex-direction: column;
  padding-top: 6px;
  padding-bottom: 6px;
  margin-left: 15px;
  margin-right: 15px;
  border-bottom:1px solid var(--color-border-default);
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

.invite {
  width: 100%;
  background:var(--color-bg-default);
  position: fixed;
  bottom: 0;
  padding: 0 !important;
  line-height: 49px;
  height: calc(49px + constant(safe-area-inset-bottom));
  height: calc(49px + env(safe-area-inset-bottom));
  font-size: 18px;
  color: var(--color-other-default-b);
  box-shadow: 0 -2px 12px 0 rgba(27, 30, 43, 0.05);
  display: flex;

  span {
    width: 100%;
    text-align: center;
  }
}

>>> .hips-input__body .hips-input__input-value input::-webkit-input-placeholder {
  font-family: PingFangSC-Regular;
  color: var(--color-font-default-e);
  font-weight: normal;
}

>>> .hips-input__body .hips-input__input-value input:-moz-placeholder {
  font-family: PingFangSC-Regular;
  color: var(--color-font-default-e);
  font-weight: normal;
}

>>> .hips-input__body .hips-input__input-value input::-moz-placeholder {
  font-family: PingFangSC-Regular;
  color: var(--color-font-default-e);
  font-weight: normal;
}

>>> .hips-input__body .hips-input__input-value input:-ms-input-placeholder {
  font-family: PingFangSC-Regular !important;
  color: var(--color-font-default-e) !important;
  font-weight: normal;
}

>>> .hips-input__body .hips-input__input-value input::-ms-input-placeholder {
  font-family: PingFangSC-Regular;
  color: var(--color-font-default-e);
  font-weight: normal;
}

>>> .hips-input__body .hips-input__input-value input::placeholder {
  font-family: PingFangSC-Regular;
  color: var(--color-font-default-e);
  font-weight: normal;
}
</style>
