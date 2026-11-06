<template>
  <div>
    <section v-if="headInfo" class="mainDetail">
      <div class="navWrap">
        <ul class="navContent">
          <li
            v-for="(item,index) in getNavArr"
            :key="index"
            :class="{'active': navIndex === index}"
            @click="$changeNav(index)">
            {{ item.title }}
          </li>
        </ul>
      </div>
      <div
        ref="wrapper"
        class="contentWrap wrapper"
        :style="{height: `calc(100vh - ${topHeight}px)`}">
        <div ref="content" class="content">
          <div ref="headInfo" class="infoContent headInfo">
            <h3>{{ $T("hipspfm.common.view.message.title.orderHeaderInfo").$D("订单头信息") }}</h3>
            <div v-if="JSON.stringify(headInfo) == '[]'" class="noContent">
              <span>{{ $T("hipspfm.common.view.message.title.noOrderHeaderInfo").$D("暂无订单头信息") }}</span>
            </div>
            <div class="card">
              <ul>
                <li class="name-title">
                  <span>{{ $T("hipspfm.common.message.company").$D("公司") }}：{{ headInfo.companyName }}</span>
                </li>
                <li>
                  <span>{{ $T("sodr.common.model.common.supplierId").$D("供应商") }}：{{ headInfo.supplierCode }} {{ headInfo.supplierName }}</span>
                </li>
                <li>
                  <span>{{ $T("sodr.common.model.common.displayPoNum").$D("订单号") }}：{{ headInfo.displayPoNum }}</span>
                </li>
                <li>
                  <span>{{ $T("sodr.common.model.common.taxIncludeAmount").$D("含税金额") }}：{{ headInfo.taxIncludeAmount|CalcMoney }}</span>
                  <span>{{ $T("sodr.orderApproval.model.common.Price").$D("不含税金额") }}：{{ headInfo.amount|CalcMoney }}</span>
                </li>
                <li>
                  <span>{{ $T("sodr.orderApproval.model.common.currencyName").$D("币种") }}：{{ headInfo.currencyCode }}</span>
                  <span>{{ $T("sodr.orderApproval.model.common.releaseNum").$D("发放号") }}：{{ headInfo.releaseNum }}</span>
                </li>
                <li>
                  <span>{{ $T("sodr.orderApproval.model.common.poTypeCode").$D("订单类型") }}：{{ headInfo.poTypeDesc }}</span>
                </li>
                <li>
                  <span>{{ $T("sodr.sendOrder.model.common.versionNumber").$D("版本号") }}：{{ headInfo.versionNum }}</span>
                </li>
                <li>
                  <span>{{ $T("sodr.orderApproval.model.common.purOrganizationId").$D("采购组织") }}：{{ headInfo.purchaseOrgName }}</span>
                </li>
                <li>
                  <span>{{ $T("sodr.orderApproval.model.common.agentName").$D("采购员") }}：{{ headInfo.agentName }}</span>
                </li>
                <li>
                  <span>{{ $T("sodr.common.model.common.totalQuantity").$D("总数量") }}：{{ headInfo.quantityTotal }}</span>
                </li>
                <li>
                  <span>{{ $T("sodr.orderApproval.model.common.remark").$D("订单摘要") }}：{{ headInfo.remark ? headInfo.remark : $T("hipspfm.common.currency.none").$D("无") }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div ref="lineInfo" class="infoContent lineInfo">
            <h3>{{ $T("hipspfm.common.view.message.title.orderLineInfo").$D("订单行信息") }}</h3>
            <div v-if="JSON.stringify(lineInfo) == '[]'" class="noContent">
              <span>{{ $T("hipspfm.common.view.message.title.noOrderLineInfo").$D("暂无行信息") }}</span>
            </div>
            <ul
              v-for="(item,index) in lineInfo"
              :key="index"
              @click="showLineInfoDetail(item,index)">
              <li>
                <span>
                  <span class="block"/>
                  {{ item.itemName }}
                </span>
                <span>{{ $T("sodr.orderApproval.model.common.displayLineNum").$D("行号") }}：{{ item.lineNum }}</span>
              </li>
              <li>
                <span>{{ $T("hipspfm.order.model.line.title").$D("标题") }}：{{ item.title }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.orderApproval.model.common.itemCode").$D("物品编码") }}：{{ item.itemCode }}</span>
                <span>{{ $T("sodr.orderApproval.model.common.shipmentNum").$D("发运号") }}：{{ item.displayLineLocationNum }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.orderApproval.model.common.quantity").$D("数量") }}：{{ item.quantity }}</span>
                <span>{{ $T("sodr.orderApproval.model.common.taxedEnteredUnitPrice").$D("含税单价") }}：{{ item.enteredTaxIncludedPrice|CalcMoney }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.common.model.common.uomCode").$D("单位") }}：{{ item.uomCode }}</span>
                <span>{{ $T("sodr.common.model.common.taxRate").$D("税率") }}：{{ item.taxRate }}</span>
              </li>
              <li>
                <span>{{ $T("sodr.orderApproval.model.common.taxIncludedLineAmount").$D("含税行金额") }}：{{ item.lineAmount }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 行信息详情弹窗 -->
      <BTNOrderLineDetail v-model="orderLineDetailPopup" :line-info-detail="lineInfoDetail" />
    </section>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { Icon, NavBar, Textarea } from "hips";
import BTNOrderLineDetail from "./components/BTNOrderLineDetail";
import { getOrderHeaderApi, getOrderLineApi } from "./api";

export default {
  modules: [ "hipspfm.common","sodr.orderApproval","sodr.common","sodr.sendOrder","hipspfm.order" ],
  name: "BTN-OrderApproval",
  components: {
    BTNOrderLineDetail,
    [NavBar.name]: NavBar,
    [Textarea.name]: Textarea
  },
  props: {
    changeReqId: {
      type: String | Number,
      default: ""
    },
    topHeight: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      scroll: "",
      navIndex: 0,
      orderLineDetailPopup: false,
      contentLenArr: [],
      lengthArr: [],
      lineInfoDetail: {},
      promiseDate: "",
      currentIndex: "",
      headInfo: {},
      lineInfo: []
    };
  },
  computed: {
    getNavArr() {
      let navArr = [
        {
          title: this.$T(
            "hipspfm.common.view.message.title.orderHeaderInfo"
          ).$D("订单头信息"),
          ref: "headInfo"
        },
        {
          title: this.$T("hipspfm.common.view.message.title.orderLineInfo").$D(
            "订单行信息"
          ),
          ref: "lineInfo"
        }
      ];
      return navArr;
    }
  },
  watch: {},
  async mounted() {
    if (this.changeReqId) {
      try {
        this.$loading.show();
        await this.getOrderHeader();
        await this.getOrderLine();
        this.$loading.hide();
      } catch (err) {
        this.$loading.hide();
        console.log(err, "error");
      }
    }
    this.$emit(
      "GetApprovalTitle",
      this.$T("sodr.orderApproval.view.message.headerTitle").$D("订单审批")
    );
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        eventPassthrough: "horizontal",
        tap: true,
        probeType: 3
      });
      this.$refreshScroll();
      this.scroll.on("scroll", this.handlerScroll);
    });
  },
  methods: {
    // 显示行信息详情
    showLineInfoDetail(data, index) {
      this.orderLineDetailPopup = true;
      data.index = index;
      this.lineInfoDetail = data;
    },
    //获取订单头信息
    async getOrderHeader() {
      const params = {
        camp: 1
      };
      const headInfo = await getOrderHeaderApi(this.changeReqId, params);
      this.headInfo = { orgName: this.orgName, ...headInfo };
    },
    //获取订单行信息
    async getOrderLine() {
      this.$loading.show();
      const params = {
        camp: 1,
        page: 0,
        size: 10,
        sortType: 1,
        customizeUnitCode: "SODR.ORDER_APPROVE_LINE_LIST.APPROVE,SODR.ORDER_APPROVE_LINE_LIST.OTHER"
      };
      await getOrderLineApi(this.changeReqId, params).then((res) => {
        this.$loading.hide();
        if (!res.empty) {
          this.lineInfo = res.content;
        }
      });
    },
    // 滚动事件
    handlerScroll({ x, y }) {
      this.$handlerScroll(x, y, this);
    }
  }
};
</script>

<style lang="stylus"scoped>
.mainDetail {
  .noContent {
    height: 78px;
    padding-left: 20px;

    span {
      position: relative;
      top: 16px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: var(--color-font-default-b);
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
        color: var(--color-font-default-b);
        letter-spacing: 0;
        text-align: center;
        line-height: 24px;
        text-align: center;
        position: relative;
        margin-left: 20px;

        &.active {
          font-size: 16px;
          color: var(--color-font-default, #1b1e2b);
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
    // height: calc(100vh - 344px);
    overflow: hidden;

    .content {
      .infoContent {
        h3 {
          padding: 20px 20px 12px;
          font-size: 18px;
          color: var(--color-font-default);
          line-height: 26.1px;
          font-weight: 700;
          background: var(--color-bg-default-b);
        }
      }

      // .headInfo {
      // ul {
      // padding-left: 20px;
      // }

      // & ul li {
      // margin-bottom: 8px;
      // padding: 9px 10px 14px 0;
      // border-bottom: 1px solid var(--color-border-default);
      // display: flex;
      // align-items: baseline;

      // span {
      // font-family: PingFangSC-Regular;
      // font-size: 14px;
      // color: var(--color-font-default, #1b1e2b);
      // line-height: 22px;
      // }

      // span:nth-child(1) {
      // flex: 0 1 98px;
      // }

      // span:nth-child(2) {
      // flex: 0 1 237px;
      // color: var(--color-font-default-b);
      // }
      // }

      // & ul li:nth-child(1) {
      // padding: 20px 20px 11px 0;

      // span:nth-child(1) {
      // flex: 0 1 98px;
      // }
      // }

      // & ul li:nth-child(1) span:nth-child(2) {
      // // flex: 0 1 190.7px;
      // // word-break:break-word;
      // // overflow: hidden;
      // // text-overflow: ellipsis;
      // // display: -webkit-box;
      // // -webkit-line-clamp:3;
      // // -webkit-box-orient: vertical;
      // }

      // & ul li:nth-last-child(1) {
      // border-bottom: 0;
      // margin-bottom: 1px;
      // }
      // }
      .lineInfo {
        ul {
          padding-left: 20px;

          li:nth-last-child(1) {
            padding-bottom: 11px;
            border-bottom: 1px solid var(--color-border-default);
          }

          li {
            display: flex;
            align-items: center;
            padding: 9px 20px 0 0;
            margin-bottom: 2px;

            span {
              flex: 1;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: var(--color-font-default, #1b1e2b);
              line-height: 22px;
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
    background-color: var(--color-font-default-d);

    li {
      padding: 0;
      margin-bottom: 12px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        color: var(--color-font-default-b);
        line-height: 24px;
        font-size: 16px;
      }

      &:nth-child(2) {
        margin-bottom: 0;

        span {
          color: var(--color-font-default, #1b1e2b);
        }
      }
    }

    p {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: var(--color-font-default, #1b1e2b);
      line-height: 24px;
    }
  }

  > li {
    display: flex;
    justify-content: space-between;
    padding: 5px 20px;
    margin-bottom: 2px;

    &:nth-of-type(1) {
      padding-top: 9px;
    }

    span {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: var(--color-font-default, #1b1e2b);
      line-height: 22px;

      &:nth-child(2) {
        color: var(--color-font-default-b);
        display: inline-block;
        text-align: right;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }
}

.card {
  width: 100%;
  color: #666666;
  background: var(--color-bg-default);

  .card-btn {
    font-size: 12px;
    color: var(--color-other-default-b);
    float: right;
    text-align: right;

    img {
      height: 16px;
      width: 16px;
      vertical-align: middle;
    }
  }

  div {
    display: flex;
    justify-content: space-between;
    height: 50px;
    line-height: 50px;

    .code {
      display: flex;
      align-items: center;
      text-align: left;
      font-size: 16px;
      color: var(--color-font-default);
      font-weight: bold;

      .tag {
        display: inline-block;
        width: 6px;
        height: 14px;
        background: var(--color-other-default-b);
        border-radius: 1px;
        margin-right: 8px;
      }

      .place-holder {
        display: inline-block;
        width: 30px;
        height: 100%;
      }
    }

    .noWrap {
      width: 260px;
    }

    .head-num, .line-num {
      span {
        font-size: 14px;
        color: #C6CAD6;
      }
    }
  }

  .sub-single-title {
    padding: 0 20px;
    font-size: 16px;
    color: var(--color-font-default);
    font-weight: bold;
    line-height: 24px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-border-default);

    .percent {
      font-size: 16px;
      color: var(--color-other-default-c);
      text-align: right;
    }
  }

  ul {
    padding: 0 5.333vw 8px 5.333vw;

    li {
      display: flex;
      line-height: 32px;
      margin-top: 2px;
      font-size: 14px;
      color: var(--color-font-default);

      &:first-child {
        margin-top: 8px;
      }

      > span {
        flex: 1;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: var(--color-font-default);

        .fileBtn {
          color: var(--color-other-default-b);
        }
      }

      > span:nth-child(1) {
        text-align: left;
      }
    }

    .name-title {
      display: flex;
      align-items: center;
      position: relative;

      span:first-child {
        font-size: 14px;
        color: var(--color-font-default);
        line-height: 22px;
        font-weight: bold;
      }

      .name-tag {
        font-size: 10px;
        color: var(--color-other-default-b);
        height: 20px;
        line-height: 20px;
        padding: 0 4px;
        display: inline-block;
        background: var(--color-bg-default-c);
        border-radius: 2px;
        margin-right: 8px;

        &:nth-child(2) {
          margin-left: 12px;
        }
      }

      .item-name {
        line-height: 22px;
        padding: 14px 0;
        font-weight: 700;
      }

      .item-num {
        height: 20px;
        margin-left: 8px;
        padding: 0 4px;
        font-size: 10px;
        color: var(--color-other-default-b);
        line-height: 20px;
        border-radius: 2px;
        background: var(--color-bg-default-c);
      }
    }

    .name-title:before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 14px;
      background: var(--color-other-default-b);
      position: absolute;
      left: -20px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
