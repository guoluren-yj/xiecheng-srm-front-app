<template>
  <div>
    <section v-if="headInfo" class="mainDetail">
      <div class="navWrap">
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
          <div ref="headInfo" class="infoContent headInfo">
            <h3>{{ $T("hipspfm.common.view.message.title.orderHeaderInfo").$D("订单头信息") }}</h3>
            <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
              <span>{{ $T("hipspfm.common.view.message.title.noOrderHeaderInfo").$D("暂无订单头信息") }}</span>
            </div>
            <ul v-else>
              <li>
                <span>{{ $T("hipspfm.common.message.company").$D("公司") }}：</span>
                <span>{{ headInfo.companyName }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.deliveryDateReview.model.deliveryDateReview.orgName").$D("业务实体") }}：</span>
                <span>{{ headInfo.ouName }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.deliveryDateReview.model.common.supplierId").$D("供应商") }}：</span>
                <span>{{ headInfo.supplierName }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.deliveryDateReview.model.deliveryDateReview.poTypeCode").$D("订单类型") }}：</span>
                <span>{{ headInfo.poTypeDesc }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.deliveryDateReview.model.deliveryDateReview.purOrganizationName").$D("采购组织") }}：</span>
                <span>{{ headInfo.purchaseOrgName }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.deliveryDateReview.model.deliveryDateReview.agentName").$D("采购员") }}：</span>
                <span>{{ headInfo.agentName }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.sendOrder.model.common.releaseTime").$D("发布时间") }}：</span>
                <span>{{ headInfo.releasedDate }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.sendOrder.model.common.supplierSite").$D("供应商地址") }}：</span>
                <span>{{ headInfo.supplierSiteName }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.deliveryDateReview.model.common.receiverAddressName").$D("收货方地址") }}：</span>
                <span>{{ headInfo.shipToLocationAddress }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.deliveryDateReview.model.common.billToLocationAddress").$D("收单方地址") }}：</span>
                <span>{{ headInfo.billToLocationAddress }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.deliveryDateReview.model.common.termsName").$D("付款条款") }}：</span>
                <span>{{ headInfo.termsName }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.deliveryDateReview.model.deliveryDateReview.comments").$D("订单摘要") }}：</span>
                <span>{{ headInfo.remark ? headInfo.remark : $T("hipspfm.common.currency.none").$D("无") }}</span>
              </li>
            </ul>
          </div>
          <div ref="lineInfo" class="infoContent lineInfo">
            <h3>{{ $T("hipspfm.deliveryDateReview.view.message.title.orderLineInfo").$D("订单行信息") }}</h3>
            <div v-if="JSON.stringify(lineInfo) == '[]'" class="noContent">
              <span>{{ $T("hipspfm.deliveryDateReview.view.message.title.noOrderLineInfo").$D("暂无订单行信息") }}</span>
            </div>
            <ul
              v-for="(item,index) in lineInfo"
              v-else
              :key="index"
              @click="showLineInfoDetail(item,index)">
              <li>
                <span>
                  <span class="block"/>{{ item.itemName }}
                </span>
                <span>{{ $T("sodr.deliveryDateReview.model.deliveryDateReview.lineNum").$D("行号") }}{{ item.displayLineNum }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.deliveryDateReview.model.common.originalQuantity").$D("原需求数量") }}：{{ item.originalQuantity }}</span>
                <span>{{ $T("sodr.deliveryDateReview.model.deliveryDateReview.shipmentNum").$D("发运号") }}：{{ item.displayLineLocationNum }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.common.model.common.enteredTaxIncludedPrice").$D("含税单价") }}：{{ item.enteredTaxIncludedPrice|CalcMoney }}</span>
                <span>{{ $T("sodr.deliveryDateReview.model.common.needByDate").$D("需求日期") }}：{{ item.needByDate|CalcDate }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.deliveryDateReview.model.common.promiseDeliveryDate").$D("承诺交货日期") }}：</span>
                <span :class="item.needByDate != item.promiseDeliveryDate?'span-red':''">{{ item.promiseDeliveryDate|CalcDate }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.deliveryDateReview.model.deliveryDateReview.quantity").$D("数量") }}：</span>
                <span :class="getQuantityClass(item)">{{ item.quantity }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 行信息详情弹窗开始 -->
      <hips-popup v-model="show" class="FullPop" style="height:100%;width:100%" position="bottom">
        <div v-if="lineInfoDetail">
          <order-line-detail
            :line-info-detail="lineInfoDetail"
            :close-line-info-detail="closeLineInfoDetail"/>
        </div>
      </hips-popup>
      <!-- 行信息详情弹窗结束 -->
    </section>
    <div class="supplier-confirm">
      <span @click="handleReject">{{ $T("sodr.deliveryDateReview.view.button.sendBack").$D("退回") }}</span>
      <span @click="handleAdopt">{{ $T("sodr.deliveryDateReview.view.button.agree").$D("同意") }}</span>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { Popup, Icon, NavBar, Textarea } from "hips";
import { toast } from "@/utils/index";
import { someAdoptApi, someRejectApi } from "../api";
import OrderLineDetail from "./OrderLineDetail";
import { SrmMath } from "srm-mobile-ui";
import BigNumber from "bignumber.js";

export default {
  modules: [ "hipspfm.common", "hipspfm.deliveryDateReview", "sodr.deliveryDateReview", "sodr.sendOrder", "sodr.common", "spuc.common" ],
  name: "TabScroll",
  components: {
    OrderLineDetail,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Textarea.name]: Textarea
  },
  props: {
    headInfo: {
      type: Object,
      default: {}
    },
    lineInfo: Array
  },
  data() {
    return {
      scroll: "",
      navIndex: 0,
      show: false,
      saveButtonFlag: true,
      showEditDate: false,
      showFeedBackInfo: false,
      contentLenArr: [],
      lineInfoDetail: {},
      promiseDate: "",
      navArr: [
        this.$T("hipspfm.common.view.message.title.orderHeaderInfo").$D("订单头信息"),
        this.$T("hipspfm.deliveryDateReview.view.message.title.orderLineInfo").$D("订单行信息")
      ],
      textareaHeight: "180",
      currentIndex: "",
      dynamiLineCount:0//行动态计数
    };
  },
  computed: {
    isMallOrder() {
      return this.headInfo.poSourcePlatform === "E-COMMERCE";
    }
  },
  watch: {
    //监听为空获取行数量
    lineInfo:{
      handler(val) {
        this.dynamiLineCount = val.length;
      },
      immediate:true,
      deep:true
    },
    //监听为了动态设置内容框高度
    dynamiLineCount:{
      handler(val) {
        //当行数量变动的时候，重新计算内容框高度
        this.$nextTick(() => {
          this.dynamiContent();
        });
      },
      immediate:true,
      deep:true
    }
  },
  mounted() {
    this.$nextTick(() => {
      //以wrapper作为作为y轴的水平起点，往下y为负数，往上滚动为证书
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        click: true,
        probeType: 3
        // bounce: false    //关闭回弹效果
      });
      this.scroll.on("scroll", this.handlerScroll);
      this.scroll.refresh();
    });
  },
  methods: {
    //动态设置内容栏得高度，以适应包含其中的内容
    dynamiContent() {
      console.info("动态设置内容栏得高度");
      this.contentLenArr = [
        this.$refs.headInfo.offsetHeight,
        this.$refs.lineInfo ? this.$refs.lineInfo.offsetHeight : 0
      ];
      const oHeight = this.contentLenArr.reduce((a, b) => a + b) + 350;
      this.$refs.content.style.height = oHeight + "px";
    },
    // 显示行信息详情
    showLineInfoDetail(data, index) {
      this.show = true;
      data.index = index;
      this.lineInfoDetail = data;
    },
    // 关闭行信息详情弹窗
    closeLineInfoDetail() {
      this.show = false;
    },
    // 拒绝该订单
    handleReject() {
      const self = this;
      this.$hips.dialog.confirm({
        title:"",
        content: self.$T("sodr.deliveryDateReview.view.message.confirmReject").$D("是否退回交期审核") + "?",
        okText: self.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: self.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          // const params = self.buildParams();
          const params = [];
          params.push(self.headInfo);
          someRejectApi(params).then((res) => {
            if (res.length) {
              // self.$hips.toast({ message: "审批拒绝成功", duration: 1500 });
              self.$notification.open({
                message:self.$T("hipspfm.common.message.operationSuccessful").$D("操作成功"),
                description: "",
                class:"notification",
                duration: 1.5,
              });
              setTimeout(() => {
                self.$router.push({ name: "DeliveryTimeList" });
              }, 1500);
            } else {
              // self.$hips.toast({ message: res.message });
              self.$notification.open({
                message:res.message,
                description: "",
                class:"notification",
                duration: 1.5,
              });
            }
          });
        },
        onCancel(tx) {
          // on cancel
        }
      });
    },
    // 通过该订单
    handleAdopt() {
      const self = this;
      this.$hips.dialog.confirm({
        title:"",
        content: self.$T("sodr.deliveryDateReview.view.message.confirmAgree").$D("是否同意交期审核") + "？",
        okText: self.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: self.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          // const params = self.buildParams();
          const params = [];
          params.push(self.headInfo);
          someAdoptApi(params).then((res) => {
            if (res.length) {
              self.$notification.open({
                message:self.$T("hipspfm.common.message.operationSuccessful").$D("操作成功"),
                description: "",
                class:"notification",
                duration: 1.5,
              });
              setTimeout(() => {
                self.$router.replacePage({ name: "DeliveryTimeList" });
              }, 1000);
            } else {
              self.$notification.open({
                message:res.message,
                description: "",
                class:"notification",
                duration: 1.5,
              });
            }
          });
        },
        onCancel(tx) {
          // on cancel
        }
      });
    },
    buildParams() {
      let poLineDetailDTOs = [];
      const { _token, poHeaderId, objectVersionNumber, statusCode, versionNum } = this.headInfo;
      this.lineInfo.forEach((item) => {
        poLineDetailDTOs.push({
          _token: item._token,
          poHeaderId: item.poHeaderId,
          poLineId: item.poLineId,
          poLineLocationId: item.poLineLocationId,
          objectVersionNumber: item.objectVersionNumber,
          lineVersionNumber: item.lineVersionNumber,
          locationVersionNumber: item.locationVersionNumber,
          remark: item.remark,
        });
      });
      const params = [
        {
          poLineDetailDTOs,
          poHeaderDetailDTO: {
            _token,
            poHeaderId,
            objectVersionNumber,
            statusCode,
            versionNum,
          }
        }
      ];
      return params;
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
      //以wrapper作为作为y轴的水平七点，往下y为负数，往上滚动为证书
      let Ytemp = -y;
      //头高度
      const headerLen = this.contentLenArr[0];
      //行高度
      const lineLen = this.contentLenArr[1];
      if (Ytemp < headerLen) {
        this.navIndex = 0;
      } else {
        this.navIndex = 1;
      }
    },
    //获取数量的class
    getQuantityClass(item) {
      return !SrmMath.isZero(SrmMath.minus(new BigNumber(item.quantity), new BigNumber(item.originalQuantity))) ? "span-red" : "";
    }
  }
};
</script>

<style lang="stylus"scoped>

.mainDetail {
  .noContent{
    height:78px;
    padding-left:20px;
    span{
      position relative
      top:16px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color:var(--color-font-default-b);
      letter-spacing: 0;
      line-height: 22px;
    }
  }
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
      .infoContent {
        .materiel-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        h3 {
          padding: 20px 20px 12px 20px;
          margin-bottom: 4px;
          font-size: 18px;
          color:var(--color-font-default);
          line-height: 26px;
          font-weight: 700;
          background: var(--color-bg-default-b);
        }
        ul {
          padding-left: 20px;
          li {
            padding: 16px 20px 15px 0px;
            border-bottom:1px solid var(--color-border-default);
            span {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color:var(--color-font-default);
              line-height: 22px;
              img {
                width: 20px;
                height: 20px;
              }
              &:nth-child(2) {
                color:var(--color-font-default-b);
                display: inline-block;
                text-align: right;
                word-wrap: break-word;
                word-break: break-all;
              }
            }
          }
        }
      }
      .headInfo {
        ul{
          // border-bottom: 8px solid var(--color-border-default);
          li {
            span {
              &:nth-child(1) {
                display:inline-block;
                width: 84px;
              }
            }
          }
        }
      }
      .lineInfo {
        ul {
          border-bottom: 8px solid var(--color-border-default);
          li {
            padding: 12px 0px;
            &:nth-child(1) {
              display: flex
              justify-content: space-between
              padding: 11px 20px 11px 0px;
              span {
                line-height 22px;
                &:nth-child(1) {
                  font-weight: 600
                  font-size: 16px;
                  color:var(--color-font-default);
                }
                &:nth-child(2) {
                  font-size: 14px;
                  color: var(--color-font-default-e);
                }
              }
              .block {
                display: inline-block;
                height: 14px;
                width:6px;
                border-radius:1px;
                background:var(--color-other-default-b);
                margin:4px 10px 0 0;
              }
            }
            &:nth-child(2) {
              border-bottom: 0
              padding-top: 13px;
            }
            &:nth-child(3) {
              padding-top: 0px;
            }
            &:nth-child(2),&:nth-child(3) {

              display: flex;
              span {
                color:var(--color-font-default);
                &:nth-child(1) {
                  display:inline-block;
                  width: 187px
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                }
              }
            }
            &:nth-child(4) {
              padding-top: 11px;
              span {
                color:var(--color-font-default);
              }
            }
             &:nth-child(5) {
              padding-top: 11px;
              span {
                color:var(--color-font-default);
              }
            }
          }
        }
      }
    }
  }
}

.lineInfoDetail {
  .lineHead :nth-child(2) {
    margin-bottom: 8px;
  }

  height: 100%;

  .header {
    font-size: 18px;
    line-height: 26px;
    font-weight: bold;
  }

  div {
    padding: 8px 20px 12px;
    background-color:var(--color-font-default-d);

    li {
      padding: 0;
      margin-bottom: 12px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        color:var(--color-font-default-b);
        line-height: 24px;
        font-size: 16px;
      }

      &:nth-child(2) {
        margin-bottom: 0;

        span {
          color:var(--color-font-default);
        }
      }
    }

    p {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color:var(--color-font-default);
      line-height: 24px;
    }
  }

  > li {
    display: flex;
    justify-content: space-between;
    padding: 5px 20px;
    margin-bottom: 2px;

    &:nth-of-type(1){
      padding-top: 9px;
    }

    span {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color:var(--color-font-default);
      line-height: 22px;

      &:nth-child(2) {
        color:var(--color-font-default-b);
        display: inline-block;
        text-align: right;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }
}

.supplier-confirm {
  width: 100%;
  text-align: center;
  line-height: 49px;
  height: calc(49px + constant(safe-area-inset-bottom));
  height: calc(49px + env(safe-area-inset-bottom));
  font-weight:600;
  font-size: 18px;
  color: var(--color-other-default-b);
  background:var(--color-bg-default);
  box-shadow: 0 -2px 8px 0 rgba(27,30,43,0.10);
  position: fixed;
  bottom: 0;
  display: flex;

  span {
    flex: 1;
    border-right: 1px solid var(--color-border-default);
  }

  span:nth-child(odd) {
    color: var(--color-other-default);
  }
}

.span-red {
  color: red!important;
};
</style>
