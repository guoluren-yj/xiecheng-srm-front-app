<!--eslint-disable-->
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
            <h3>{{ $T("sinv.supplierDelivery.view.message.title.deliveryHeaderInfo").$D("送货单头信息") }}</h3>
            <div v-if="JSON.stringify(headInfo) == '{}'" class="noContent">
              <span>{{ $T("hipspfm.supplierDelivery.view.message.title.noDeliveryHeaderInfo").$D("暂无头信息") }}</span>
            </div>
            <ul v-else>
              <li>
                <span>{{ $T("sinv.purchaseReception.view.message.asnTypeCode").$D("送货单类型") }}：</span>
                <span>{{ headInfo.asnTypeCodeMeaning }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.common.model.common.supplierCompanyName").$D("供应商") }}：</span>
                <span>{{ headInfo.supplierCompanyName }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.common.model.common.customer").$D("客户") }}：</span>
                <span>{{ headInfo.companyName }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.common.model.common.invOrganizationName").$D("收货组织") }}：</span>
                <span>{{ headInfo.organizationName }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.common.model.common.shipToLocationAddress").$D("收货地点") }}：</span>
                <span>{{ headInfo.shipToLocationAddress }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.common.model.common.supplierSiteName").$D("发货地点") }}：</span>
                <span>{{ headInfo.supplierSiteName }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.common.model.common.immedShippedFlag").$D("是否直发") }}：</span>
                <span>{{ headInfo.immedShippedFlag === 1? $T("hipspfm.common.status.yes").$D("是"): $T("hipspfm.common.status.no").$D("否") }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.common.model.common.actualReceiverName").$D("送达方") }}：</span>
                <span>{{ headInfo.actualReceiverName }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.common.model.common.shipDate").$D("发货日期") }}：</span>
                <span>{{ headInfo.shipDate|CalcDate }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.common.table.column.remark").$D("备注") }}：</span>
                <span>{{ headInfo.remark ? headInfo.remark : $T("hipspfm.common.currency.none").$D("无") }}</span>
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
            <h3>{{ $T("hipspfm.common.view.message.title.lineInfo").$D("行信息") }}</h3>
            <div v-if="JSON.stringify(lineInfo) == '[]'" class="noContent">
              <span>{{ $T("hipspfm.common.view.message.title.noOrderLineInfo").$D("暂无行信息") }}</span>
            </div>
            <ul
              v-for="(item,index) in lineInfo"
              v-else
              :key="index"
              @click="showLineInfoDetail(item,index)">
              <li>
                <span>
                  <span class="block"/>
                  {{ item.itemName }}
                </span>
                <span>{{ $T("sinv.purchaseReception.view.message.lineNum").$D("行号") }}：{{ item.displayAsnLineNum }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.common.model.common.itemCode").$D("物料编码") }}：{{ item.itemCode }}</span>
                <span>{{ $T("sinv.common.model.common.unit").$D("单位") }}：{{ item.uomName }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.common.model.common.theShipQuantity").$D("本次发货") }}：{{ item.shipQuantity }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.common.model.common.promiseDeliveryDate").$D("承诺交货日期") }}：</span>
                <span>{{ item.promisedDate|CalcDate }}</span>
              </li>
            </ul>
          </div>
          <div ref="logisticsInfo" class="infoContent headInfo">
            <h3>{{ $T("sinv.common.view.message.title.logistics").$D("物流信息") }}</h3>
            <ul>
              <li>
                <span>{{ $T("sinv.common.model.common.logisticsCompany").$D("物流公司") }}：</span>
                <span>{{ headInfo.logisticsCompany }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.common.model.common.logisticsStaff").$D("配送人员") }}：</span>
                <span>{{ headInfo.logisticsStaff }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.common.model.common.logisticsContactInfo").$D("联系方式") }}：</span>
                <span>{{ headInfo.logisticsContactInfo }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.common.model.common.logisticsCost").$D("物流费用") }}：</span>
                <span>{{ headInfo.logisticsCost }}</span>
              </li>
              <li>
                <span>{{ $T("sinv.common.model.common.expressNum").$D("快递单号") }}：</span>
                <span>{{ headInfo.expressNum }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 行信息详情弹窗 -->
      <div v-if="lineInfoDetail">
        <order-line-detail
          v-model="show"
          :show-file-pop="showFilePop"
          :line-info-detail="lineInfoDetail"
          :close-line-info-detail="closeLineInfoDetail"/>
      </div>
    </section>
    <div class="supplier-confirm">
      <span @click="handleReject">{{ $T("hipspfm.common.message.reject").$D("拒绝") }}</span>
      <span @click="handleAdopt">{{ $T("hipspfm.common.message.pass").$D("通过") }}</span>
    </div>
    <opinion v-model="opinionPopup" :type="option" @comfirmOpinion="comfirmOpinion" />
  </div>
</template>

<script>
/*eslint-disable*/
import BScroll from "better-scroll";
import Opinion from "../components/Opinion";
import { adoptApi, rejectApi } from "../api";
import OrderLineDetail from "./OrderLineDetail";
import { Popup, Icon, NavBar, Textarea } from "hips";
import { SrmUtil } from "srm-mobile-ui";

export default {
  modules: [ "sinv.supplierDelivery", "hipspfm.common", "sinv.common", "hwfp.task", "hipspfm.supplierDelivery", "sinv.purchaseReception", "sinv.deliveryApproved", "hipspfm.deliveryApproved" ],
  name: "TabScroll",
  components: {
    Opinion,
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
    lineInfo: Array,
    showFilePop: {
      type: Function
    }
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
        this.$T("hipspfm.common.view.message.title.headInfo").$D("头信息"),
        this.$T("hipspfm.common.view.message.title.lineInfo").$D("行信息"),
        this.$T("sinv.common.view.message.title.logistics").$D(
          "物流信息"
        )
      ],
      // lineInfos: this.lineInfo,
      textareaHeight: "180",
      currentIndex: "",
      opinionPopup: false,
      option: "adopt",
      approvedRemark: ""
    };
  },
  computed: {
    getTenantNum() {
      return SrmUtil.getTenantNum();
    }
  },
  watch: {
    // lineInfo(value) {
    //   this.lineInfos = [...value];
    // }
  },
  mounted() {
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollY: true,
        click: true,
        probeType: 3
        // bounce: false    //关闭回弹效果
      });
      this.contentLenArr = [
        this.$refs.headInfo.offsetHeight,
        this.$refs.lineInfo.offsetHeight,
        this.$refs.logisticsInfo.offsetHeight
      ];
      // this.$refs.content.style.height = this.contentLenArr.reduce((a,b)=>a+b) + 350 + 'px' ;
      const oHeight = this.contentLenArr.reduce((a, b) => a + b) + 250;
      this.$refs.content.style.height = 100 / 667 * oHeight + "vh";
      this.scroll.refresh();
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
    },
    showOpinionPopup() {
      this.opinionPopup = !this.opinionPopup;
    },
    //填写审批意见后拒绝or通过
    comfirmOpinion(inputValue, type) {
      this.approvedRemark = inputValue;
      if (type === "adopt") {
        this.confirmAdopt();
        this.showOpinionPopup();
      } else if (type === "reject" && !inputValue) {
        this.opinionPopup = true;
        this.$notification.open({
          message: this.$T("hwfp.task.view.message.commentNotBeNull").$D("审批意见不能为空"),
          description: "",
          class: "notification",
          duration: 3
        });
      } else {
        this.confirmReject();
        this.showOpinionPopup();
      }
    },
    // 拒绝该订单
    handleReject() {
      this.option = "reject";
      this.showOpinionPopup();
    },
    confirmReject() {
      const self = this;
      this.$hips.dialog.confirm({
        content: "是否拒绝该送货单?",
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          const params = self.buildParams();
          rejectApi(params).then((res) => {
            if (res.length) {
              self.$notification.open({
                message: this.$T("hipspfm.common.view.validation.rejectSuccess").$D("审批拒绝成功"),
                description: "",
                key: "refuse",
                class: "notification",
                duration: 3
              });
              setTimeout(() => {
                self.$router.push({ name: "DeliveryBillList" });
              }, 1500);
            } else {
              self.$notification.open({
                message: res.message,
                description: "",
                key: "refuse",
                class: "notification",
                duration: 3
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
      this.option = "adopt";
      this.showOpinionPopup();
    },
    confirmAdopt() {
      const self = this;
      this.$hips.dialog.confirm({
        content: this.$T("hipspfm.deliveryApproved.validation.message.refuseDeliveryBill").$D("是否通过该送货单?"),
        okText: this.$T("hipspfm.common.button.ok").$D("确定"),
        cancelText: this.$T("hipspfm.common.button.cancle").$D("取消"),
        closable: false,
        onOk() {
          const params = self.buildParams();
          adoptApi(params).then((res) => {
            if (res.length) {
              self.$notification.open({
                message: this.$T(
                  "hipspfm.common.view.validation.approvelSuccess"
                ).$D("审批通过成功"),
                description: "",
                key: "approvel",
                class: "notification",
                duration: 3
              });
              setTimeout(() => {
                self.$router.push({ name: "DeliveryBillList" });
              }, 1500);
            } else {
              // self.$hips.toast({ message: res.message });
              self.$notification.open({
                message: res.message,
                description: "",
                key: "approvel",
                class: "notification",
                duration: 3
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
      const { _token, asnHeaderId, objectVersionNumber } = this.headInfo;
      const params = [
        {
          asnHeaderId,
          objectVersionNumber,
          _token
        }
      ];
      if (this.approvedRemark) {
        params[0].approvedRemark = this.approvedRemark;
      }
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
          padding: 15px 20px;
          margin-bottom: 4px;
          font-size: 18px;
          color:var(--color-font-default);
          line-height: 28px;
          font-weight: 600;
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
        ul {
          // border-bottom: 8px solid var(--color-border-default);
          li {
            span {
              &:nth-child(1) {
                display: inline-block;
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
              display: flex;
              justify-content: space-between;
              padding: 15px 20px 11px 0px;

              span {
                line-height: 22px;

                &:nth-child(1) {
                  font-weight: bold;
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

            &:nth-child(2), &:nth-child(3) {
              display: flex;

              span {
                color:var(--color-font-default);

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

            &:nth-child(4) {
              padding-top: 11px;

              span {
                color:var(--color-font-default);
                font-size: 14px;
                font-weight: bold;
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

    &:nth-of-type(1) {
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
  font-weight: 600;
  font-size: 18px;
  color: var(--color-other-default-b);
  background:var(--color-bg-default);
  box-shadow: 0 -2px 8px 0 rgba(27, 30, 43, 0.1);
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
</style>
