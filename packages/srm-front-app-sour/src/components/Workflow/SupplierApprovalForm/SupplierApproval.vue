<!-- eslint-disable rulesdir/no_hips -->
<template>
  <section v-if="loading" class="mainDetail">
    <div ref="navWrap" class="navWrap">
      <ul class="navContent">
        <li
          v-for="(item,index) in navArr"
          :key="index"
          :class="{'active': navIndex === index}"
          @click="changeNav(index)">
          {{ item }}
        </li>
      </ul>
    </div>
    <div ref="wrapper" class="contentWrap wrapper">
      <div ref="content" class="content">
        <!-- 申请单头信息 -->
        <div ref="headInfo" class="infoContent headInfo">
          <h3>{{ $T("hipspfm.workFlowSupplier.view.title.supplierHeadInfo").$D("申请单头信息") }}</h3>
          <div class="detail-info">
            <ul>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.applicationNum').$D('申请单号') }}：</span>
                <span>{{ headInfo.changeReqNumber }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.supplierNum').$D('供应商编码') }}：</span>
                <span>{{ headInfo.supplierCompanyNum }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.supplierName').$D('供应商名称') }}：</span>
                <span>{{ headInfo.supplierCompanyName }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.applicationState').$D('申请状态') }}：</span>
                <span>{{ headInfo.reqStatusMeaning }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.creator').$D('创建人') }}：</span>
                <span>{{ headInfo.createUserRealName }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.creationDate').$D('创建日期') }}：</span>
                <span>{{ headInfo.creationDate|CalcDate }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.submitDate').$D('提交日期') }}：</span>
                <span>{{ headInfo.submitDate|CalcDate }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.changeRemark').$D('变更备注') }}：</span>
                <span>{{ headInfo.remark }}</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 供货清单能力 -->
        <div ref="lineInfo" class="infoContent lineInfo">
          <div class="btn-h3">
            <div>{{ $T("sslm.supplierInform.view.message.fixCatalog.supplyCapacityList").$D("供货能力清单") }}</div>
            <div
              :class="abilityInfoAfter?'btn-class-A':'btn-class-B'"
              @click="showAfterInfo('abilityInfoAfter')">
              {{ abilityInfoAfter ? $T("sslm.supplierInform.view.title.afterChange").$D("查看变更后"):$T("sslm.supplierInform.view.title.beforeChange").$D("查看变更前") }}
            </div>
          </div>
          <div v-for="(item,index) in showAbilityInfo" :key="index" class="detail-info">
            <section class="sub-header">
              <div class="left-info">
                <div>
                  <span>{{ $T('sslm.supplyAbility.model.supplyAbility.itemCode').$D('物料编码') }}：</span>
                  <span
                    :class="item.itemCodeStateFlag!=='original'?'changeColor':''">{{ item.itemCode }}</span>
                </div>
                <div>
                  <span>{{ $T('sslm.supplyAbility.model.supplyAbility.itemName').$D('物料名称') }}：</span>
                  <span
                    :class="item.itemIdStateFlag!=='original'?'changeColor':''">{{ item.itemName }}</span>
                </div>
              </div>
              <hy-tag
                :title="item.supplyFlag? $T('hipspfm.workFlowSupplier.model.workFlowSupplier.supplyFlagA').$D('可供') : $T('hipspfm.workFlowSupplier.model.workFlowSupplier.supplyFlagB').$D('不可供')"
                :bg-color="item.supplyFlag?'var(--color-other-default-b)':'#C6CAD6'"/>
            </section>
            <ul>
              <li>
                <span>{{ $T('sslm.supplyAbility.model.supplyAbility.itemCategoryCode').$D('品类代码') }}：</span>
                <span
                  :class="item.itemCategoryCodeStateFlag!=='original'?'changeColor':''">{{ item.itemCategoryCode }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplyAbility.model.supplyAbility.categoryName').$D('品类名称') }}：</span>
                <span
                  :class="item.itemCodeStateFlag!=='original'?'changeColor':''">{{ item.categoryName }}</span>
              </li>
              <li>
                <span>{{ $T('slm.supplyAbility.model.supplyAbility.remark').$D('备注') }}：</span>
                <span :class="item.remarkStateFlag!=='original'?'changeColor':''">{{ item.remark }}</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 地点层信息 -->
        <div ref="placeInfo" class="infoContent headInfo">
          <div class="btn-h3">
            <div>{{ $T("sslm.supplierInform.view.fixCatalog.locationInform").$D("地点层信息") }}</div>
            <div
              :class="addressInfoAfter?'btn-class-A':'btn-class-B'"
              @click="showAfterInfo('addressInfoAfter')">
              {{ addressInfoAfter ? $T("sslm.supplierInform.view.title.afterChange").$D("查看变更后"):$T("sslm.supplierInform.view.title.beforeChange").$D("查看变更前") }}
            </div>
          </div>
          <div class="detail-info">
            <ul v-for="(it,index) in showAddressInfo" :key="index" class="has-bottom">
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.countryName').$D('国家') }}：</span>
                <span
                  :class="it.countryIdStateFlag!=='original'?'changeColor':''">{{ it.countryName }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.regionIds').$D('地区') }}：</span>
                <span
                  :class="it.regionIdStateFlag!=='original'?'changeColor':''">{{ it.regionName }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.city').$D('城市') }}：</span>
                <span :class="it.cityIdStateFlag!=='original'?'changeColor':''">{{ it.city }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.contacts').$D('联系人') }}：</span>
                <span
                  :class="it.contactNameStateFlag!=='original'?'changeColor':''">{{ it.contactName }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.addressDetail').$D('详细地址') }}：</span>
                <span :class="it.addressStateFlag!=='original'?'changeColor':''">{{ it.address }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.contactsMethod').$D('联系方式') }}：</span>
                <span
                  :class="it.contactPhoneStateFlag!=='original'?'changeColor':''">{{ it.contactPhone }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.view.model.supplierInform.OUMessage').$D('OU层信息') }}：</span>
                <span class="fileBtn" @click="showOuInfoPop(it.supChangeAddId)">
                  {{ $T('sslm.supplierInform.view.look.infor').$D('查看信息') }}
                  <img class="image-gray-default" src="@/assets/icon_list_right_normal@3x.png" alt >
                </span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 其他信息 -->
        <div ref="otherInfo" class="infoContent headInfo">
          <div class="btn-h3">
            <div>{{ $T('sslm.supplierInform.view.message.fixCatalog.otherInform').$D('其他信息') }}</div>
            <div
              :class="otherInfoAfter?'btn-class-A':'btn-class-B'"
              @click="showAfterInfo('otherInfoAfter')">
              {{ otherInfoAfter ? $T("sslm.supplierInform.view.title.afterChange").$D("查看变更后"):$T("sslm.supplierInform.view.title.beforeChange").$D("查看变更前") }}
            </div>
          </div>
          <div class="detail-info">
            <ul class="long">
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.billType').$D('税票种类') }}：</span>
                <span
                  :class="showOtherInfo.billTypeStateFlag!=='original'?'changeColor':''">{{ showOtherInfo.billTypeMeaning }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.supplierType').$D('供应商类型') }}：</span>
                <span
                  :class="showOtherInfo.stageIdStateFlag!=='original'?'changeColor':''">{{ showOtherInfo.stageDescription }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.purchaseType').$D('采购类型') }}：</span>
                <span
                  :class="showOtherInfo.procurementTypeStateFlag!=='original'?'changeColor':''">{{ showOtherInfo.procurementTypeMeaning }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.deliveryTerms').$D('交货条件') }}：</span>
                <span
                  :class="showOtherInfo.deliveryTermsStateFlag!=='original'?'changeColor':''">{{ showOtherInfo.deliveryTerms }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.projectName').$D('项目名称') }}：</span>
                <span
                  :class="showOtherInfo.projectNameStateFlag!=='original'?'changeColor':''">{{ showOtherInfo.projectName }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.bankFee').$D('银行转账费用承担') }}：</span>
                <span
                  :class="showOtherInfo.bankTransferStateFlag!=='original'?'changeColor':''">{{ showOtherInfo.bankTransferMeaning }}</span>
              </li>
              <li>
                <span>{{ $T('sslm.supplierInform.model.supplierInform.remark').$D('备注') }}：</span>
                <span
                  :class="showOtherInfo.remarkStateFlag!=='original'?'changeColor':''">{{ showOtherInfo.remark }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- OU信息详情弹窗 -->
    <hips-popup
      v-model="ouInfoPop"
      class="FullPop"
      style="height: 100%;width:100%"
      position="bottom">
      <ou-detail-info v-if="ouInfo.length" :show-ou-info-pop="showOuInfoPop" :ou-info="ouInfo" />
    </hips-popup>
  </section>
</template>

<script>
import uuid from "uuid";
import BScroll from "better-scroll";
import HyTag from "@/components/HyTag";
import { Popup, NavBar, Input } from "hips";
import OuDetailInfo from "./components/OuDetailInfo";
// import {
//   getOuInfoApi,
//   getHeadInfoApi,
//   getOtherInfoApi,
//   getAddressInfoApi,
//   getSupplyCapacityListApi,
// } from "../api/Hyt";
import {
  getOuInfoApi,
  getHeadInfoApi,
  getOtherInfoApi,
  getAddressInfoApi,
  getSupplyCapacityListApi,
} from "./api/index.js";

export default {
  modules: [ "hipspfm.workFlow", "sslm.supplierInform", "hipspfm.workFlowSupplier", "sslm.supplyAbility", "slm.supplyAbility", "hipspfm.common", "smbl.common" ],
  name: "SupplierApproval",
  components: {
    HyTag,
    OuDetailInfo,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Input.name]: Input
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    showFilePop: {
      type: Function
    }
  },
  data() {
    return {
      headInfo: {},
      lineInfo: [],
      otherInfo: [ [], [] ],
      addressInfo: [],
      ouInfo: [],
      loading:false,
      scroll: "",
      navScroll: "",
      offsetX: 0,
      ouInfoPop: false,
      navIndex: 0,
      contentLenArr: [],
      abilityInfoAfter: false,
      addressInfoAfter: false,
      otherInfoAfter: false,
    };
  },
  computed: {
    showAbilityInfo() {
      return this.abilityInfoAfter ? this.lineInfo[0] : this.lineInfo[1];
    },
    showAddressInfo() {
      return this.addressInfoAfter ? this.addressInfo[0] : this.addressInfo[1];
    },
    showOtherInfo() {
      return this.otherInfoAfter ?
        this.otherInfo[0][0] || {} :
        this.otherInfo[1][0] || {};
    },
    navArr() {
      return [
        this.$T("hipspfm.workFlow.view.message.applicationHeader").$D(
          "申请头信息"
        ),
        this.$T("sslm.supplierInform.view.message.fixCatalog.supplyCapacityList").$D(
          "供货能力清单"
        ),
        this.$T("sslm.supplierInform.view.fixCatalog.locationInform").$D("地点层信息"),
        this.$T("sslm.supplierInform.view.fixCatalog.otherInform").$D("其他信息")
      ];
    }
  },
  watch: {
    showAbilityInfo: {
      handler() {
        this.refreshScroll();
      },
      immediate: true
    },
    showAddressInfo: {
      handler() {
        this.refreshScroll();
      },
      immediate: true
    },
    navIndex(nVal) {
      if ([ 1, 2, 3 ].includes(nVal)) {
        this.offsetX = 90 * (nVal - 1);
      }
      this.navScroll.scrollTo(-this.offsetX, 0, 200, "bounce");
    }
  },
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getSupplierOrderHeader();
        await this.getSupplierOrderLine();
        await this.getAddressInfo();
        await this.getOtherInfo();
        this.loading = true;
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit("GetApprovalTitle", this.$T("hipspfm.workFlowSupplier.view.title.supplierApproval").$D("供应商信息变更审批"));
    this.$nextTick(() => {
      this.navScroll = new BScroll(this.$refs.navWrap, {
        scrollX: true,
        click: true
      });
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        click: true,
        probeType: 3
      });
      this.scroll.on("scroll", this.handlerScroll);
    });
  },
  methods: {
    // 获取申请单头信息
    async getSupplierOrderHeader() {
      await getHeadInfoApi(this.changeReqId).then((res) => {
        this.headInfo = res || {};
        let attachmentUuid = this.headInfo.attachmentUuid || uuid();
        this.$emit("GetAttachmentUuid", attachmentUuid);
      });
    },
    //获取供货能力清单信息
    async getSupplierOrderLine() {
      await getSupplyCapacityListApi(this.changeReqId).then((res) => {
        this.lineInfo = res;
      });
    },
    //获取地点层信息
    async getAddressInfo() {
      await getAddressInfoApi(this.changeReqId).then((res) => {
        this.addressInfo = res;
      });
    },
    //获取其他信息
    async getOtherInfo() {
      await getOtherInfoApi(this.changeReqId).then((res) => {
        this.otherInfo = res;
      });
    },
    // 切换tab
    changeNav(index) {
      this.navIndex = index;
      const newArr = this.contentLenArr.slice(0, index);
      const offsetLen = newArr.length ? newArr.reduce((a, b) => a + b) : 0;
      this.$nextTick(() => {
        this.scroll.scrollTo(0, -offsetLen, 200, "bounce");
      });
    },
    showAfterInfo(flag) {
      this[flag] = !this[flag];
    },
    // 显示/关闭OU信息
    showOuInfoPop(supChangeAddId) {
      this.ouInfoPop = !this.ouInfoPop;
      if ([ "number" ].includes(typeof supChangeAddId)) {
        getOuInfoApi(supChangeAddId).then((res) => {
          this.ouInfo = res.content;
        });
      }
    },
    refreshScroll() {
      this.$nextTick(() => {
        this.contentLenArr = [
          this.$refs.headInfo.offsetHeight,
          this.$refs.lineInfo.offsetHeight,
          this.$refs.placeInfo.offsetHeight,
          this.$refs.otherInfo.offsetHeight
        ];
        const oHeight = this.contentLenArr.reduce((a, b) => a + b) + 360;
        this.$refs.content.style.height = 100 / 667 * oHeight + "vh";
        this.scroll && this.scroll.refresh();
      });
    },
    // 滚动事件
    // eslint-disable-next-line no-unused-vars
    handlerScroll({ x, y }) {
      const len1 = -this.contentLenArr[0];
      const len2 = len1 - this.contentLenArr[1];
      const len3 = len2 - this.contentLenArr[2];
      const len4 = len3 - this.contentLenArr[3];
      if (y > len1 && y < 100) {
        this.navIndex = 0;
      } else if (y > len2 && y <= len1) {
        this.navIndex = 1;
      } else if (y > len3 && y <= len2) {
        this.navIndex = 2;
      } else if (y > len4 && y <= len3) {
        this.navIndex = 3;
      } else {
        this.navIndex = 4;
      }
    }
  }
};
</script>

<style scoped  lang="stylus">
.blackFont {
  color:var(--color-font-default);
}

.closeFont {
  color:var(--color-font-default-c) !important;
  border-color:var(--color-font-default-c) !important;
}

.mainDetail {
  .navWrap {
    width: 100%;
    height: 44px;
    // overflow-x: auto;
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
        h3 {
          padding: 20px 53px 12px 20px;
          font-family: PingFangSC-Medium;
          font-size: 18px;
          color:var(--color-font-default);
          line-height: 26px;
          font-weight: 700;
          background:var(--color-bg-default-b);
        }

        .btn-h3 {
          display: flex;
          background: var(--color-bg-default-b);
          padding: 15px 16px 15px 20px;
          justify-content: space-between;

          div:nth-child(1) {
            font-size: 20px;
            color:var(--color-font-default);
            font-weight: bold;
            line-height: 28px;
          }

          .btn-class-A {
            width: 76px;
            height: 28px;
            line-height: 28px;
            font-size: 12px;
            color:var(--color-font-default-d);
            text-align: center;
            background: var(--color-other-default-b);
            border-radius: 14px;
          }

          .btn-class-B {
            width: 76px;
            height: 28px;
            line-height: 28px;
            font-size: 12px;
            color: var(--color-other-default-b);
            text-align: center;
            background:var(--color-bg-default);
            border-radius: 14px;
            border: 1px solid var(--color-other-default-b);
          }
        }

        .input-edit {
          margin-top: 18px;
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}

.lineInfoDetail {
  background: #FAFBFC;
  height: 100%;

  .header {
    font-size: 20px;
    line-height: 32px;
  }

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

  .lineBody {
    background-color:var(--color-font-default-d);
    height: calc(100vh - 160px);
    overflow: auto;

    li {
      display: flex;
      padding: 20px 20px 11px 0;
      margin-bottom: 2px;
      margin-left: 20px;
      border-bottom:1px solid var(--color-border-default);

      &:nth-of-type(1) {
        padding-top: 20px;
      }

      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default);
        line-height: 22px;

        &:nth-child(1) {
          width: 122px;
        }

        &:nth-child(2) {
          color:var(--color-font-default-b);
          display: inline-block;
          width: 213px;
          text-align: left;
          word-wrap: break-word;
          word-break: break-all;

          img {
            width: 12px;
            height: 12px;
            float: right;
            margin-top: 4px;
          }
        }
      }
    }
  }
}

.detail-info {
  .sub-title {
    width: 100%;
    padding: 16px 20px;
    line-height: 22px;
    font-size: 14px;
    color:var(--color-font-default);
    font-weight: bold;
    background: var(--color-bg-default-b);
    border-top:1px solid var(--color-border-default);
  }

  .sub-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    background: var(--color-bg-default-b);
    border-top:1px solid var(--color-border-default);

    .left-info {
      padding: 14px 20px;

      > div {
        margin-bottom: 4px;

        &:last-child {
          margin-bottom: 0;
        }

        span {
          display: inline-block;
          font-size: 14px;
          color:var(--color-font-default);
          font-weight: bold;
          line-height: 22px;

          &:first-child {
            width: 100px;
          }
        }
      }
    }
  }

  ul {
    padding-left: 20px;

    &.has-bottom {
      border-bottom:8px solid var(--color-border-default);
    }

    &:last-child {
      border-bottom: 0;
    }

    li {
      display: flex;
      border-bottom:1px solid var(--color-border-default);
      padding: 16px 20px 16px 0;

      &:last-child {
        border-bottom: none;
      }

      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default);
        line-height: 22px;

        img {
          width: 16px;
          height: 16px;
          float: right;
        }
      }

      span:nth-child(1) {
        width: 100px;
      }

      span:nth-child(2) {
        width: 235px;
        color:var(--color-font-default-b);
      }

      span.fileBtn {
        color: var(--color-other-default-b);
      }
    }

    .edit-wrap {
      align-items: center;
    }
  }

  ul.long {
    padding-left: 20px;

    &.has-bottom {
      border-bottom:8px solid var(--color-border-default);
    }

    &:last-child {
      border-bottom: 0;
    }

    li {
      display: flex;
      border-bottom:1px solid var(--color-border-default);
      padding: 16px 20px 16px 0;

      &:last-child {
        border-bottom: none;
      }

      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default);
        line-height: 22px;

        img {
          width: 16px;
          height: 16px;
          float: right;
        }
      }

      span:nth-child(1) {
        width: 126px;
      }

      span:nth-child(2) {
        width: 209px;
        color:var(--color-font-default-b);
      }

      span.fileBtn {
        color: var(--color-other-default-b);
      }
    }

    .edit-wrap {
      align-items: center;
    }
  }
}

.card-info {
  .card {
    padding-left: 20px;
    color: #666666;
    background:var(--color-bg-default);
    border-bottom:8px solid var(--color-border-default);

    div {
      display: flex;
      justify-content: space-between;
      height: 50px;
      line-height: 50px;
      padding-right: 20px;
      border-bottom:1px solid var(--color-border-default);

      .code {
        text-align: left;
        font-size: 16px;
        color:var(--color-font-default);
        font-weight: bold;

        span {
          display: inline-block;
          width: 6px;
          height: 14px;
          background: var(--color-other-default-b);
          border-radius: 1px;
          margin-right: 8px;
        }
      }

      .noWrap {
        width: 260px;
      }

      .head-num, .line-num {
        span {
          font-size: 14px;
          color: var(--color-font-default-e);
        }
      }
    }

    ul {
      padding-right: 20px;

      li {
        display: flex;
        justify-content: space-between;
        line-height: 32px;
        height: 32px;
        margin-top: 2px;
        font-size: 14px;
        color:var(--color-font-default);

        &:first-child, &:last-child {
          margin-top: 8px;
        }

        > span {
          flex: 1;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color:var(--color-font-default);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          .fileBtn {
            color: var(--color-other-default-b);
          }
        }

        > span:nth-child(odd) {
          text-align: left;
        }

        &:last-child {
          height: 46px;
          line-height: 46px;
          border-top:1px solid var(--color-border-default);

          span:nth-child(1) {
            font-weight: bold;
          }

          span:nth-child(2) {
            color: var(--color-other-default);
          }
        }
      }
    }
  }
}

.changeColor {
  color: var(--color-other-default) !important;
}
</style>
