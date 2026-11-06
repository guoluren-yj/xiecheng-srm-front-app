<template>
  <div>
    <section v-if="headInfo" class="mainDetail">
      <div ref="navWrap" class="navWrap">
        <ul class="navContent">
          <li
            v-for="(item, index) in getNavArr"
            :key="index"
            :class="{ active: navIndex === index }"
            @click="$changeNav(index)">
            {{ item.title }}
          </li>
        </ul>
      </div>
      <div ref="wrapper" class="contentWrap wrapper">
        <div ref="content" class="content">
          <div ref="headInfo" class="infoContent language-class-ul-li">
            <h3>
              {{
                $T("hipspfm.common.view.message.title.orderHeaderInfo").$D(
                  "订单头信息"
                )
              }}
            </h3>
            <div v-if="JSON.stringify(headInfo) == '[]'" class="noContent">
              <span>{{
                $T("hipspfm.common.view.message.title.noOrderHeaderInfo").$D(
                  "暂无订单头信息"
                )
              }}</span>
            </div>
            <ul v-else>
              <li>
                <span>{{
                  $T("hipspfm.common.message.company").$D("公司")
                }}</span>
                <span>{{ headInfo.companyName }}</span>
              </li>
              <li>
                <span>{{
                  $T("sodr.confirmOrder.model.confirmOrder.orgId").$D(
                    "业务实体"
                  )
                }}</span>
                <span>{{ headInfo.orgName }}</span>
              </li>
              <li>
                <span>{{
                  $T("sodr.common.model.common.supplierId").$D("供应商")
                }}</span>
                <span>{{ headInfo.supplierName }}</span>
              </li>
              <li>
                <span>{{
                  $T("sodr.confirmOrder.model.common.poTypeCode").$D("订单类型")
                }}</span>
                <span>{{ headInfo.poTypeDesc }}</span>
              </li>
              <li>
                <span>{{
                  $T("sodr.confirmOrder.model.common.purOrganizationId").$D(
                    "采购组织"
                  )
                }}：</span>
                <span>{{ headInfo.purchaseOrgName }}</span>
              </li>
              <li>
                <span>{{
                  $T("sodr.confirmOrder.model.confirmOrder.agentName").$D(
                    "采购员"
                  )
                }}：</span>
                <span>{{ headInfo.agentName }}</span>
              </li>
              <li>
                <span>{{
                  $T("sodr.confirmOrder.model.confirmOrder.releaseDate").$D(
                    "发布日期"
                  )
                }}：</span>
                <span>{{ headInfo.releasedDate }}</span>
              </li>
              <li>
                <span>{{
                  $T("sodr.common.model.common.sourcePlatform").$D(
                    "来源平台"
                  )
                }}：</span>
                <span>{{ headInfo.poSourcePlatformMeaning }}</span>
              </li>
              <li>
                <span>{{
                  $T("sodr.common.model.common.termsName").$D("付款条款")
                }}：</span>
                <span>{{ headInfo.termsName }}</span>
              </li>
              <li>
                <span>{{
                  $T("sodr.common.model.commonder.orderRemark").$D(
                    "订单摘要"
                  )
                }}：</span>
                <span>{{
                  headInfo.remark
                    ? headInfo.remark
                    : $T("hipspfm.common.currency.none").$D("无")
                }}</span>
              </li>
            </ul>
          </div>
          <div ref="lineInfo" class="infoContent lineInfo">
            <h3>
              {{
                $T(
                  "hipspfm.orderConfirmation.view.message.title.orderLineInfo"
                ).$D("行信息")
              }}
            </h3>
            <div v-if="JSON.stringify(lineInfo) == '[]'" class="noContent">
              <span>{{
                $T("hipspfm.common.view.message.title.noOrderLineInfo").$D(
                  "暂无行信息"
                )
              }}</span>
            </div>
            <ul
              v-for="(item, index) in lineInfo"
              :key="index"
              @click="showLineInfoDetail(item, index)">
              <li>
                <span>
                  <span class="block"/>
                  {{ item.itemName }}
                </span>
                <span>{{
                  $T("sodr.confirmOrder.model.common.displayLineNum").$D(
                    "行号"
                  )
                }}：{{ item.lineNum }}</span>
              </li>
              <li>
                <span>{{
                  $T("sodr.confirmOrder.model.confirmOrder.itemCode").$D(
                    "物品编码"
                  )
                }}：{{ item.itemCode }}</span>
                <span>{{
                  $T("sodr.common.model.common.displayLineLocationNum").$D(
                    "发运号"
                  )
                }}：{{ item.displayLineLocationNum }}</span>
              </li>
              <li @click.stop>
                <span>{{
                  $T("sodr.confirmOrder.model.common.quantity").$D("数量")
                }}<i class="require-span">*</i>：</span>
                <span
                  :class="
                    getQuantityClass(item)
                  ">
                  <hips-input
                    v-model="item.quantity"
                    :readonly="!editFlagFunction('QUANTITY', false)"
                    :change="lineQuantityChang(item)"
                    type="number">
                    <div v-if="editFlagFunction('QUANTITY', false)" slot="right" class="img-icon">
                      <img
                        src="@/assets/icon_editor@3x.png"
                        class="input-edit image-gray-default">
                    </div>
                  </hips-input>
                </span>
                <span>{{
                  $T("sodr.confirmOrder.model.common.originalQuantity").$D(
                    "原需求数量"
                  )
                }}：{{ item.originalQuantity }}</span>
              </li>
              <li>
                <span>{{
                  $T("sodr.confirmOrder.model.confirmOrder.needByDate").$D(
                    "需求日期"
                  )
                }}：{{ item.needByDate | CalcDate }}</span>
                <span>{{ $T("hipspfm.common.category.price").$D("单价") }}：{{
                  item.enteredTaxIncludedPrice | CalcMoney
                }}</span>
                <!-- <span>{{ item.needByDate|CalcDate }}</span> -->
              </li>
              <li @click.stop="showEditDatePop(index)">
                <span>{{
                  $T("sodr.common.model.common.promiseDeliveryDate").$D(
                    "承诺交货日期"
                  )
                }}<i class="require-span">*</i>：</span>
                <span v-if="item.promiseDeliveryDate">
                  <span
                    :class="
                      item.promiseDeliveryDate === item.needByDate
                        ? ''
                        : 'redFont'
                    ">{{ item.promiseDeliveryDate | CalcDate }}</span>
                  <img
                    v-if="item.promiseDeliveryDate === item.needByDate && editFlagFunction('COMMITTED_DELIVERY_DATE',false)"
                    class="image-gray-default"
                    src="@/assets/icon_list_date_normals@3x.png">
                  <img
                    v-if="item.promiseDeliveryDate !== item.needByDate && editFlagFunction('COMMITTED_DELIVERY_DATE',false)"
                    class="image-red-default"
                    src="@/assets/icon_list_date_warning@3x.png">
                </span>
                <span v-else>
                  <font color="#c6cad6">{{
                    $T(
                      "hipspfm.orderConfirmation.view.message.handlerPromiseDeliveryDate"
                    ).$D("请填写承诺交货日期")
                  }}
                  </font>
                  &nbsp;<img
                    class="image-gray-default"
                    src="@/assets/icon_editor@3x.png">
                </span>
              </li>
              <li
                class="feedBackInfo"
                @click.stop="showFeedBackInfoPop(index, item.feedback)">
                <span class="info">{{
                  $T("sodr.confirmOrder.model.common.feedback").$D(
                    "反馈信息"
                  )
                }}：</span>
                <span v-if="item.feedback" class="info-content">
                  <span>{{ item.feedback }}</span>
                  <img
                    class="image-gray-default"
                    src="@/assets/icon_editor@3x.png">
                </span>
                <span v-else class="info-content">
                  <span style="color: var(--color-font-default-e)">{{
                    $T(
                      "hipspfm.orderConfirmation.view.message.handlerFeedback"
                    ).$D("请输入反馈信息")
                  }}</span>
                  <img
                    class="image-gray-default"
                    src="@/assets/icon_editor@3x.png">
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 承诺交货日期弹窗 -->
      <date-chooser
        v-model="showEditDate"
        :title="
          $T('sodr.common.model.common.promiseDeliveryDate').$D('承诺交货日期')
        "
        @submitDate="handleConfirm"/>
      <!-- 反馈信息弹窗 -->
      <info-pop
        v-model="showFeedBackInfo"
        title="hipspfm.common.message.title.feedbackInfo"
        @confirmInfo="confirmFeedBackInfo"/>
      <!-- 行信息详情弹窗开始 -->
      <hips-popup
        v-model="show"
        class="FullPop"
        style="height: 100%; width: 100%"
        position="right">
        <div v-if="lineInfoDetail">
          <order-line-detail
            :handle-confirm="handleConfirm"
            :show-edit-date-pop="showEditDatePop"
            :show-feed-back-info-pop="showFeedBackInfoPop"
            :confirm-feed-back-info="confirmFeedBackInfo"
            :line-info-detail="lineInfoDetail"
            :close-line-info-detail="closeLineInfoDetail"
            :line-quantity-chang="lineQuantityChang"
            :edit-flag-function="editFlagFunction"/>
        </div>
      </hips-popup>
      <!-- 行信息详情弹窗结束 -->
    </section>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import InfoPop from "@/components/InfoPop";
import OrderLineDetail from "./OrderLineDetail";
import DateChooser from "@/components/DateChooser";
import { Popup, Icon, NavBar, Input, Textarea } from "hips";
import { isEmpty } from "../../../utils/index";
import { SrmMath } from "srm-mobile-ui";
import BigNumber from "bignumber.js";

export default {
  modules: [ "sodr.confirmOrder", "hipspfm.orderConfirmation", "hipspfm.common", "sodr.common", "odr.confirmOrder", "spuc.common", "smbl.common" ],
  name: "TabScroll",
  components: {
    InfoPop,
    DateChooser,
    [Input.name]: Input,
    OrderLineDetail,
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Textarea.name]: Textarea,
  },
  props: {
    headInfo: {
      type: Object,
      default: () => ({}),
    },
    lineInfo: Array,
    fieldConfigMap:{
      type: Map,
      default: null
    },
    // eslint-disable-next-line vue/require-prop-types
    editFlagFunction:{
      tupe: Function,
      default: null
    }
  },
  data() {
    return {
      scroll: "",
      navScroll: "",
      navIndex: 0,
      show: false,
      saveButtonFlag: true,
      showEditDate: false,
      showFeedBackInfo: false,
      lineInfoDetail: {},
      promiseDate: "",
      // lineInfos: [],
      textareaHeight: "180",
      currentIndex: 0,
      contentLenArr: [],
      lengthArr: [],
    };
  },
  computed: {
    isMallOrder() {
      return this.headInfo.poSourcePlatform === "E-COMMERCE";
    },
    getNavArr() {
      let navArr = [
        {
          title: this.$T(
            "sodr.confirmOrder.view.message.title.orderHeaderInfo"
          ).$D("订单头信息"),
          ref: "headInfo",
        },
        {
          title: this.$T(
            "hipspfm.orderConfirmation.view.message.title.orderLineInfo"
          ).$D("行信息"),
          ref: "lineInfo",
        },
      ];
      return navArr;
    },
  },
  async mounted() {
    this.navScroll = new BScroll(this.$refs.navWrap, {
      scrollX: true,
      click: true,
    });
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        eventPassthrough: "horizontal",
        tap: true,
        probeType: 3,
      });
      this.$refreshScroll();
      this.scroll.on("scroll", this.handlerScroll);
    });
  },
  methods: {
    // 显示行信息详情
    showLineInfoDetail(data, index) {
      this.show = true;
      data.index = index;
      this.lineInfoDetail = data;
    },
    // 关闭行信息详情弹窗
    closeLineInfoDetail() {
      this.show = false;
      this.$forceUpdate();
    },
    // 显示编辑承诺交货日期弹窗
    showEditDatePop(index) {
      if (this.editFlagFunction("COMMITTED_DELIVERY_DATE", false)) {
        this.currentIndex = index;
        this.showEditDate = true;
      }
    },
    // 关闭编辑承诺交货日期弹窗
    closeEditDatePop() {
      this.showEditDate = false;
    },
    // 显示反馈信息弹窗
    showFeedBackInfoPop(index = 0, feedbackInfo = "") {
      this.currentIndex = index;
      this.feedBackInfo = feedbackInfo;
      this.showFeedBackInfo = !this.showFeedBackInfo;
    },
    // 提交承诺日期
    handleConfirm(value) {
      this.showEditDate = false;
      // eslint-disable-next-line vue/no-mutating-props
      this.lineInfo[this.currentIndex].promiseDeliveryDate =
       value + " 00:00:00";
    },
    // 提交反馈信息
    confirmFeedBackInfo(feedbackInfo) {
      this.showFeedBackInfo = false;
      // eslint-disable-next-line vue/no-mutating-props
      this.lineInfo[this.currentIndex].feedback = feedbackInfo;
    },
    // 滚动事件
    handlerScroll({ x, y }) {
      this.$handlerScroll(x, y, this);
    },
    inputFocus() {},
    inputLoseFocus() {},
    //行数据，数量变动触发方法
    lineQuantityChang(item) {
      if (!isEmpty(item.quantity)) {
        if (SrmMath.gt(new BigNumber(item.quantity), new BigNumber(item.originalQuantity))) {
          item.quantity = item.originalQuantity;
        } else if (SrmMath.lte(new BigNumber(item.quantity), new BigNumber(0))) {
          item.quantity = 1;
        }
      }
      //重新计算行不含税总价，含税总价
      let onceEnteredTaxIncludedPrice = item.onceEnteredTaxIncludedPrice || 0;
      // let lineAmountTemp = item.lineAmount;
      item.lineAmount = SrmMath.div(SrmMath.times(new BigNumber(item.quantity), new BigNumber(item.unitPrice)), Number(item.unitPriceBatch) && !SrmMath.isZero(Number(item.unitPriceBatch)) ? new BigNumber(item.unitPriceBatch) : 1);
      // let taxIncludedLineAmountTemp = item.taxIncludedLineAmount || 0;
      item.taxIncludedLineAmount = SrmMath.times(new BigNumber(item.quantity), new BigNumber(onceEnteredTaxIncludedPrice));
      //重新计算头不含税总价，行不含税总价
      // this.headInfo.amount =
      //   this.headInfo.amount - lineAmountTemp + item.lineAmount;
      // this.headInfo.taxIncludeAmount =
      //   this.headInfo.taxIncludeAmount -
      //   taxIncludedLineAmountTemp +
      //   item.taxIncludedLineAmount;
    },
    getQuantityClass(item) {
      return !SrmMath.isZero(SrmMath.minus(new BigNumber(item.quantity), new BigNumber(item.originalQuantity))) ?
        "quantity-input-red quantity-input-normal" :
        "quantity-input-normal";
    }
  },
};
</script>

<style lang="stylus" scoped>
.redFont {
  color: var(--color-other-default) !important;
}

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
          color: var(--color-font-default);
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
          padding: 15px 20px;
          margin-bottom: 4px;
          font-size: 20px;
          color: var(--color-font-default);
          line-height: 28px;
          font-weight: 600;
        }
      }

      .lineInfo {
        ul {
          border-bottom: 8px solid var(--color-border-default);

          li {
            padding: 12px 20px;

            img {
              width: 16px;
              height: 16px;
              margin-left: 8px;
            }

            span {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: var(--color-font-default);
              line-height: 22px;
            }

            &:nth-child(1) {
              display: flex;
              justify-content: space-between;
              padding: 15px 20px 11px 0px;

              span {
                line-height: 22px;

                &:nth-child(1) {
                  font-weight: 600;
                  font-size: 16px;
                  color: var(--color-font-default);
                }

                &:nth-child(2) {
                  font-size: 14px;
                  color: var(--color-font-default-e);
                }
              }

              .block {
                display: inline-block;
                height: 14px;
                width: 6px;
                border-radius: 1px;
                background: var(--color-other-default-b);
                margin: 4px 10px 0 0;
              }
            }

            &:nth-child(2) {
              border-bottom: 0;
              padding-top: 13px;
            }

            &:nth-child(2), &:nth-child(4) {
              display: flex;

              span {
                &:nth-child(1) {
                  display: inline-block;
                  width: 187px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }

                &:nth-child(2) {
                  margin-left: 16px;
                }
              }
            }

            &:nth-child(3) {
              display: flex;
              align-items: center;

              span {
                &:nth-child(1) {
                  width: 50px;
                  display: inline-block;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }

                &:nth-child(3) {
                  margin-left: 52px;
                }
              }
            }

            &:nth-child(5) {
              display: flex;

              span {
                display: flex;
                align-items: center;

                &:nth-child(5) {
                  frontcolor: red;
                }
              }
            }
          }

          .feedBackInfo {
            display: flex;

            .info {
              font-weight: bold;
            }

            .info-content {
              display: flex;
              align-items: center;
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
          color: var(--color-font-default);
        }
      }
    }

    p {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: var(--color-font-default);
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
      color: var(--color-font-default);
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

.quantity-input-red {
  >>> .hips-input__body .hips-input__input-value input {
    color: red;
  }
}

.quantity-input-normal {
  >>> .hips-input {
    height: 22px !important;
    width: 100px !important;
    padding: 0 !important;
    font-size: 14px;

    .img-icon {
      display: flex;
      align-items: center;
    }
  }
}
</style>
