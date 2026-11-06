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
        <div ref="headInfo" class="infoContent  language-class-ul-li">
          <h3>{{ $T("hipspfm.common.view.message.title.orderHeaderInfo").$D("订单头信息") }}</h3>
          <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noOrderHeaderInfo").$D("暂无订单头信息") }}</span>
          </div>
          <ul v-else>
            <li>
              <span>{{ $T("hipspfm.sendOrder.model.sendOrder.company").$D("公司") }}</span>
              <span>{{ headInfo.companyName }}</span>
            </li>
            <li>
              <span>{{ $T("sodr.sendOrder.model.sendOrder.orgName").$D("业务实体") }}</span>
              <span>{{ headInfo.ouName }}</span>
            </li>
            <li>
              <span>{{ $T("sodr.sendOrder.model.sendOrder.supplierId").$D("供应商") }}</span>
              <span>{{ headInfo.supplierName }}</span>
            </li>
            <li>
              <span>{{ $T("sodr.sendOrder.model.sendOrder.poTypeCode").$D("订单类型") }}</span>
              <span>{{ headInfo.poTypeDesc }}</span>
            </li>
            <li>
              <span>{{ $T("sodr.sendOrder.model.sendOrder.purOrganizationId").$D("采购组织") }}</span>
              <span>{{ headInfo.purchaseOrgName }}</span>
            </li>
            <li>
              <span>{{ $T("sodr.sendOrder.model.sendOrder.agentId").$D("采购员") }}</span>
              <span>{{ headInfo.agentName }}</span>
            </li>
            <li>
              <span>{{ $T("sodr.sendOrder.model.sendOrder.releaseDate").$D("发布时间") }}</span>
              <span>{{ headInfo.releasedDate }}</span>
            </li>
            <li>
              <span>{{ $T("hipspfm.sendOrder.model.sendOrder.sourcePlatform").$D("来源平台") }}</span>
              <span>{{ headInfo.poSourcePlatformMeaning }}</span>
            </li>
            <li>
              <span>{{ $T("sodr.sendOrder.model.sendOrder.comments").$D("订单摘要") }}</span>
              <span>{{ headInfo.remark ? headInfo.remark : $T("hipspfm.common.currency.none").$D("无") }}</span>
            </li>
          </ul>
        </div>
        <div ref="lineInfo" class="infoContent lineInfo">
          <h3>{{ $T("hipspfm.common.view.message.title.lineInfo").$D("行信息") }}</h3>
          <div v-if="JSON.stringify(lineInfo) == '[]'" class="noContent">
            <span>{{ $T("hipspfm.common.view.message.title.noOrderLineInfo").$D("暂无行信息") }}</span>
          </div>
          <div v-for="(item,index) in lineInfo" v-else :key="index" @click="showLineInfoDetail(item)">
            <div class="headCompany">
              <span class="block"/>
              <span class="code">
                <span class="materiel-name"> {{ item.itemName }}</span>
                <span >{{ $T("sodr.sendOrder.model.sendOrder.poLineNum").$D("行号") }}：{{ item.lineNum }}</span>
              </span>
            </div>
            <ul>
              <li>
                <span class="materialCode">{{ $T("sodr.sendOrder.model.sendOrder.itemCode").$D("物料编码") }}: {{ item.itemCode }}</span>
                <span >{{ $T("sodr.sendOrder.model.sendOrder.shipmentNum").$D("发运号") }}: {{ item.displayLineLocationNum }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.sendOrder.model.sendOrder.quantity").$D("数量") }}: {{ item.quantity }}</span>
                <span>{{ $T("sodr.sendOrder.model.common.enteredTaxIncludedPrice").$D("单价") }}: {{ item.enteredTaxIncludedPrice|CalcMoney }}</span>
              </li>
              <li v-if="getTenantNum === 'SRM-SANJIANG'">
                <span>{{ $T("sodr.sendOrder.model.common.specifications").$D("规格") }}: {{ item.specifications }}</span>
                <span>{{ $T("sodr.sendOrder.model.common.outputCapacity").$D("产成率") }}: {{ item.attributeVarchar5 }}</span>
              </li>
            </ul>
            <div class="footInfo">
              <span>{{ $T("sodr.sendOrder.model.sendOrder.needByDate").$D("需求日期") }}：</span><span>{{ item.needByDate|CalcDate }}</span>
            </div>
          </div>
        </div>

        <div v-if="isMallOrder" ref="receiveInfo" class="infoContent language-class-ul-li">
          <h3>{{ $T("hipspfm.common.view.message.title.receiptGoodsAndOrders").$D("收货收单") }}</h3>
          <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
            <span>{{ $T("hipspfm.sendOrder.view.message.title.noReceiptGoodsAndOrders").$D("暂无收货收单信息") }}</span>
          </div>
          <ul v-else>
            <li>
              <span>{{ $T("hipspfm.sendOrder.model.sendOrder.receiverContactName").$D("收货联系人") }}</span>
              <span>{{ headInfo.shipToLocContName }}</span>
            </li>
            <li>
              <span>{{ $T("hipspfm.sendOrder.model.sendOrder.receiverTelNum").$D("收货联系电话") }}</span>
              <span>{{ headInfo.shipToLocTelNum }}</span>
            </li>
            <li>
              <span>{{ $T("hipspfm.sendOrder.model.sendOrder.shippingAddress").$D("收货地址") }}</span>
              <span>{{ headInfo.shipToLocationAddress }}</span>
            </li>
            <li>
              <span>{{ $T("hipspfm.sendOrder.model.sendOrder.invoiceContactName").$D("收单联系人") }}</span>
              <span>{{ headInfo.billToLocContName }}</span>
            </li>
            <li>
              <span>{{ $T("hipspfm.sendOrder.model.sendOrder.invoiceContactTel").$D("收单联系电话") }}</span>
              <span>{{ headInfo.billToLocTelNum }}</span>
            </li>
            <li>
              <span>{{ $T("hipspfm.sendOrder.model.sendOrder.receiverEmail").$D("收单邮箱") }}</span>
              <span>{{ headInfo.receiverEmailAddress }}</span>
            </li>
            <li>
              <span>{{ $T("hipspfm.sendOrder.model.sendOrder.receiverAddress").$D("收单地址") }}</span>
              <span>{{ headInfo.billToLocationAddress }}</span>
            </li>
          </ul>
        </div>
        <div v-if="isMallOrder" ref="invoiceInfo" class="infoContent language-class-ul-li">
          <h3>{{ $T("sodr.sendOrder.view.title.billingInformation").$D("开票信息") }}</h3>
          <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
            <span>{{ $T("hipspfm.sendOrder.view.message.title.nobillingInfo").$D("暂无开票信息") }}</span>
          </div>
          <ul v-else>
            <li>
              <span>{{ $T("sodr.sendOrder.model.common.invoiceCompanyName").$D("开票公司名称") }}</span>
              <span>{{ headInfo.invoiceTitle }}</span>
            </li>
            <li>
              <span>{{ $T("hipspfm.sendOrder.model.sendOrder.taxRegisterNum").$D("税号") }}</span>
              <span>{{ headInfo.taxRegisterNum }}</span>
            </li>
            <li>
              <span>{{ $T("sodr.sendOrder.model.common.invoiceType").$D("发票类型") }}</span>
              <span>{{ headInfo.invoiceTitleTypeName }}</span>
            </li>
            <li>
              <span>{{ $T("sodr.sendOrder.model.common.invoiceMethod").$D("开票方式") }}</span>
              <span>{{ headInfo.invoiceMethodName }}</span>
            </li>
            <li>
              <span>{{ $T("sodr.sendOrder.model.common.invoiceTitleTypeMeaning").$D("发票形式") }}</span>
              <span>{{ headInfo.invoiceTypeName }}</span>
            </li>
            <li>
              <span>{{ $T("sodr.sendOrder.model.common.invoiceDetail").$D("发票明细") }}</span>
              <span>{{ headInfo.invoiceDetailTypeName }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 行信息详情弹窗 -->
    <hips-popup v-model="show" class="FullPop" style="height: 100%;width:100%" position="right">
      <section class="lineInfoDetail">
        <hips-nav-bar slot="header" :have-border="false">
          <div slot="left" class="left-button" @click="closeLineInfoDetail">
            <img src="@/assets/back@3x.png" class="image-black-default">
          </div>
          <div slot="center" class="header">{{ $T("hipspfm.common.view.message.title.itemsInfo").$D("物料信息") }}</div>
        </hips-nav-bar>
        <div class="lineHead">
          <li>
            <span>{{ $T("sodr.sendOrder.model.sendOrder.poLineNum").$D("行号") }}: {{ lineInfoDetail.lineNum }}</span>
            <span>{{ $T("sodr.sendOrder.model.sendOrder.shipmentNum").$D("发运号") }}：{{ lineInfoDetail.displayLineLocationNum }}</span>
          </li>
          <p>
            <span>{{ $T("sodr.sendOrder.model.sendOrder.itemCode").$D("物料编码") }}：</span>
            <span>{{ lineInfoDetail.itemCode }}</span>
          </p>
          <p>
            <span>{{ $T("sodr.sendOrder.model.sendOrder.itemDescription").$D("物料名称") }}：</span>
            <span>{{ lineInfoDetail.itemName }}</span>
          </p>
        </div>
        <div class="language-class-ul-li" >
          <ul>
            <li >
              <span>{{ $T("sodr.sendOrder.model.sendOrder.uomName").$D("单位") }}</span>
              <span>{{ lineInfoDetail.uomName }}</span>
            </li>
            <li >
              <span>{{ $T("sodr.sendOrder.model.sendOrder.quantity").$D("数量") }}</span>
              <span>{{ lineInfoDetail.quantity }}</span>
            </li>
            <li>
              <span>{{ $T("sodr.sendOrder.model.sendOrder.taxRate").$D("税率") }}(%)</span>
              <span>{{ lineInfoDetail.taxRate }}</span>
            </li>
            <li>
              <span>{{ $T("sodr.sendOrder.model.sendOrder.taxedEnteredUnitPrice").$D("原币含税单价") }}</span>
              <span>{{ lineInfoDetail.enteredTaxIncludedPrice|CalcMoney }}</span>
            </li>
            <li >
              <span>{{ $T("sodr.sendOrder.model.sendOrder.taxedLineAmount").$D("含税行金额") }}</span>
              <span>{{ lineInfoDetail.taxIncludedLineAmount|CalcMoney }}</span>
            </li>
            <li>
              <span>{{ $T("sodr.sendOrder.model.sendOrder.needByDate").$D("需求日期") }}</span>
              <span>{{ lineInfoDetail.needByDate|CalcDate }}</span>
            </li>
            <li>
              <span>{{ $T("sodr.sendOrder.model.sendOrder.committedDeliveryDate").$D("承诺交货日期") }}</span>
              <span>{{ lineInfoDetail.promiseDeliveryDate|CalcDate }}</span>
            </li>
            <li v-if="getTenantNum =='SRM-BJHL'">
              <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar1').$D('年级') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar1Meaning }}</span>
            </li>
            <li v-if="getTenantNum =='SRM-BJHL'">
              <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar2').$D('学科') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar2Meaning }}</span>
            </li>
            <li v-if="getTenantNum =='SRM-BJHL'">
              <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar3').$D('课程类别') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar3Meaning }}</span>
            </li>
            <li v-if="getTenantNum =='SRM-BJHL'">
              <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar4').$D('总页码') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar4 }}</span>
            </li>
            <li v-if="getTenantNum =='SRM-BJHL'">
              <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar5').$D('封面用纸') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar5 }}</span>
            </li>
            <li v-if="getTenantNum =='SRM-BJHL'">
              <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar6').$D('封面印色') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar6Meaning }}</span>
            </li>
            <li v-if="getTenantNum =='SRM-BJHL'">
              <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar7').$D('内文用纸') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar7 }}</span>
            </li>
            <li v-if="getTenantNum =='SRM-BJHL'">
              <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar8').$D('内文印色') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar8Meaning }}</span>
            </li>
            <li v-if="getTenantNum =='SRM-BJHL'">
              <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar9').$D('规格尺寸') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar9 }}</span>
            </li>
            <li v-if="getTenantNum =='SRM-BJHL'">
              <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar10').$D('装订方式') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar10Meaning }}</span>
            </li>
            <li v-if="getTenantNum =='SRM-BJHL'">
              <span>{{ $T('spuc.common.model.common.bjhlpolineexportdto.attributeVarchar11').$D('工艺') }}：</span>
              <span>{{ lineInfoDetail.attributeVarchar11 }}</span>
            </li>
            <li>
              <span>{{ $T("sodr.sendOrder.model.sendOrder.purchaserComments").$D("采购方行备注") }}</span>
              <span>{{ lineInfoDetail.remark ? lineInfoDetail.remark : $T("hipspfm.common.currency.none").$D("无") }}</span>
            </li>
            <li>
              <span>{{ $T("sodr.sendOrder.model.sendOrder.feedbacks").$D("反馈信息") }}</span>
              <span>{{ lineInfoDetail.feedback }}</span>
            </li>
            <li v-if="getTenantNum === 'SRM-SANJIANG'">
              <span>{{ $T("sodr.sendOrder.model.common.specifications").$D("规格") }}</span>
              <span>{{ lineInfoDetail.specifications }}</span>
            </li>
            <li v-if="getTenantNum === 'SRM-SANJIANG'">
              <span>{{ $T("sodr.sendOrder.model.common.outputCapacity").$D("产成率") }}</span>
              <span>{{ lineInfoDetail.attributeVarchar5 }}</span>
            </li>
          </ul>

          <div class="line-div">
            <span class="line-block"/>
          </div>
        </div>
      </section>
    </hips-popup>
  </section>
</template>

<script>

import { SrmUtil } from "srm-mobile-ui";
import BScroll from "better-scroll";
import { Popup, NavBar } from "hips";

export default {
  modules: [ "hipspfm.common", "hipspfm.sendOrder", "sodr.sendOrder", "spuc.common" ],
  name: "TabScroll",
  components: {
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
  },
  props: {
    headInfo: {
      type: Object,
      default: () => ({})
    },
    lineInfo: Array,
    orgName: "",
  },
  data() {
    return {
      scroll: "",
      show: false,
      navIndex: 0,
      contentLenArr: [],
      lineInfoDetail: {},
      navArr: [
        this.$T("hipspfm.common.view.message.title.orderHeaderInfo").$D("订单头信息"),
        this.$T("hipspfm.common.view.message.title.orderLineInfo").$D("订单行信息"),
        this.$T("hipspfm.common.view.message.title.receiptGoodsAndOrders").$D("收货收单"),
        this.$T("hipspfm.common.view.message.title.billingInfo").$D("开票信息")
      ],
    };
  },
  computed: {
    isMallOrder() {
      return this.headInfo.poSourcePlatform === "E-COMMERCE";
    },
    getTenantNum() {
      return SrmUtil.getTenantNum();
    }
  },
  watch: {
    lineInfo:  {
      handler() {
        this.$nextTick(() => {
          this.contentLenArr = [
            this.$refs.headInfo.offsetHeight,
            this.$refs.lineInfo.offsetHeight,
            this.isMallOrder ? this.$refs.receiveInfo.offsetHeight : 0,
            this.isMallOrder ? this.$refs.invoiceInfo.offsetHeight : 0
          ];
          const oHeight = this.contentLenArr.reduce((a, b) => a + b) + 300;

          this.$refs.content.style.height = 100 / 667 * oHeight + "vh";
          this.scroll && this.scroll.refresh();
        });
      },
      immediate: true,
    }
  },
  async mounted() {
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY:true,
        eventPassthrough: "horizontal",
        tap: true,
        probeType: 3
        // bounce: false    //关闭回弹效果
      });
      this.scroll.on("scroll", this.handlerScroll);
    });
  },
  methods: {
    // 显示行信息详情
    showLineInfoDetail(data) {
      this.lineInfoDetail = data;
      setTimeout(() => {
        this.show = true;
      }, 150);
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
    handlerScroll({ y }) {
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
    },
  }
};

</script>

<style scoped  lang="stylus">
.blackFont {
  color:var(--color-font-default);
}

.closeFont{
  color:var(--color-font-default-c) !important;
  border-color:var(--color-font-default-c)!important;
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

    .content {
      .moreInfo{
        align-self:flex-end;
        width:18.3px;
        height:18.3px;
       }
      .infoContent {
        .materiel-name {
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          width: 210px;
        }
        .materialCode{
            overflow: hidden;
            text-overflow:ellipsis;
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
        .footInfo{
          padding:12px 15px 12px 20px;
          border-bottom: 8px solid var(--color-border-default);
          font-family : PingFangSC-Medium;
          color:var(--color-font-default);
          font-size: 14px;
          display:flex;
          line-height:22px;
          font-weight:600;
          span:nth-child(1) {
            // width:80px;
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

  .left-button {
    // margin-left: 20px;
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
      justify-content: space-between;
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

    .line-div{
      height: 34px;
      display: flex;
      justify-content: center;
      .line-block{
        width:35.7%;
        height:6px;
        // border-radius:100px;
        // background-color : #000000;
        position:relative;
        bottom:-18px;
      }
    }
}
.invite{
    width: 100%;
    text-align: center;
    line-height: 49px;
    height: calc(49px + constant(safe-area-inset-bottom));
    height: calc(49px + env(safe-area-inset-bottom));
    background:var(--color-bg-default);
    box-shadow: 0 -2px 8px 0 rgba(27,30,43,0.05);
    position: fixed;
    bottom: 0;
    display: flex;

    span {
        flex: 1;
        font-weight:bold;
        border-right: 1px solid var(--color-border-default);
        font-family: PingFangSC-Medium;
        font-size: 18px;
        letter-spacing: 0.34px;
    }

    span:nth-child(1) {
      color:var(--color-font-default-b);
    }
    span:nth-child(2) {
      color: var(--color-other-default);
    }
    span:nth-child(3) {
      color: var(--color-other-default-b);
    }
  }

</style>
