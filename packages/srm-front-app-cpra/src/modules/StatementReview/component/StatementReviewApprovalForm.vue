<template>
  <!-- 组件 -->
  <div v-loading="initLoading" style="min-height: 400px;">
    <section v-if="loading" class="mainDetail">
      <div ref="wrapper" class="contentWrap wrapper">
        <srm-scroll-tab class="content">
          <!-- 基本信息 -->
          <srm-scroll-tab-item :label="getLanguageDefine('baseInfoTab')">
            <div ref="headInfo" class="infoContent headInfo">
              <div v-if="!headInfo.billHeaderId" class="noContent">
                <span>
                  {{ getLanguageDefine("noContent") }}
                </span>
              </div>
              <ul v-else style="padding: 16px 15px;" @click="openDetailPop('header', headInfo)">
                <!-- 个性化组件替换后的代码 -->
                <customize
                  :columns="getHeadColumns"
                  :data-source="headInfo"
                  :code="getCustomizeCode('baseInfoTab')"
                  type="list"
                  :need-padding="false"/>
              </ul>
            </div>
          </srm-scroll-tab-item>

          <!-- 交易方信息 -->
          <!-- <srm-scroll-tab-item :label="getLanguageDefine('payInfoTab')">
            <div ref="headInfo" class="infoContent headInfo">
              <div v-if="!headInfo.billHeaderId" class="noContent">
                <span>
                  {{ getLanguageDefine("noContent") }}
                </span>
              </div>
              <ul v-else style="padding: 16px 15px;" @click="openDetailPop('line1', headInfo)"> -->
          <!-- 个性化组件替换后的代码 -->
          <!-- <customize
                  :columns="getLineColumns('payInfoTab')"
                  :data-source="headInfo"
                  :code="type === 'supplier' ? '' : getCustomizeCode('payInfoTab')"
                  type="list"
                  :need-padding="false"/>
              </ul>
            </div>
          </srm-scroll-tab-item> -->

          <!-- 交易金额信息 -->
          <srm-scroll-tab-item :label="getLanguageDefine('amountInfoTab')">
            <div ref="headInfo" class="infoContent headInfo">
              <div v-if="!headInfo.billHeaderId" class="noContent">
                <span>
                  {{ getLanguageDefine("noContent") }}
                </span>
              </div>
              <ul v-else style="padding: 16px 15px;" @click="openDetailPop('line2', headInfo)">
                <!-- 个性化组件替换后的代码 -->
                <customize
                  :columns="getLineColumns('amountInfoTab')"
                  :data-source="headInfo"
                  :code="getCustomizeCode('amountInfoTab')"
                  type="list"
                  :need-padding="false"/>
              </ul>
            </div>
          </srm-scroll-tab-item>

          <!-- 交易明细信息 -->
          <srm-scroll-tab-item :label="getLanguageDefine('detailInfoTab')" style="position: relative;">
            <srm-list :scrollable="false"
                      :data-set="dataSet"
                      :columns="getLineColumns('detailInfoTab')"
                      :customize-code="getCustomizeCode('detailInfoTab')"
                      height="auto"
                      style="height: auto"
                      @itemClick="onItemClick"/>
          </srm-scroll-tab-item>

          <!-- 主策略信息 -->
          <srm-scroll-tab-item :label="getLanguageDefine('mainConfigInfoTab')">
            <div ref="headInfo" class="infoContent headInfo">
              <div v-if="!headInfo.billHeaderId" class="noContent">
                <span>
                  {{ getLanguageDefine("noContent") }}
                </span>
              </div>
              <ul v-else style="padding: 16px 15px;" @click="openDetailPop('line4', headInfo)">
                <!-- 个性化组件替换后的代码 -->
                <customize
                  :columns="getLineColumns('mainConfigInfoTab')"
                  :data-source="headInfo"
                  :code="getCustomizeCode('mainConfigInfoTab')"
                  type="list"
                  :need-padding="false"/>
              </ul>
            </div>
          </srm-scroll-tab-item>

          <!-- 其他信息 -->
          <!-- <srm-scroll-tab-item :label="getLanguageDefine('otherInfoTab')">
            <div ref="headInfo" class="infoContent headInfo">
              <div v-if="!headInfo.billHeaderId" class="noContent">
                <span>
                  {{ getLanguageDefine("noContent") }}
                </span>
              </div>
              <ul v-else style="padding: 16px 15px;" @click.prevent.stop="openDetailPop('line5', headInfo)"> -->
          <!-- 个性化组件替换后的代码 -->
          <!-- <customize
                  :columns="getLineColumns('otherInfoTab')"
                  :data-source="headInfo"
                  :code="getCustomizeCode('otherInfoTab')"
                  type="list"
                  :need-padding="false"/>
              </ul>
            </div>
          </srm-scroll-tab-item> -->
        </srm-scroll-tab>
      </div>

      <!-- 弹框 -->
      <srm-popup :visible.sync="visible"
                 :title="customizeInfo.title"
                 :show-header="false"
                 position="right"
                 height="100%">
        <div v-if="customizeInfo.title === 'detailInfoTab'" style="height: 100%;">
          <srm-tab-bar display="justify">
            <srm-tab-item :label="getLanguageDefine('settleMainInfoTab')">
              <srm-flex direction="column" align="start">
                <srm-flex-item style="width: 100%;background: #ffffff" @click.native="openDetailLinePop('1', linesDetailInfo)">
                  <p style="height: 36px;display: flex;align-items: center;padding: 10px 15px;font-size: 12px;color: #333333;">
                    {{ getLanguageDefine("payInfoTab") }}
                  </p>
                  <ul style="padding: 16px 15px;border-top: 1px solid #f0f2f5;border-bottom: 6px solid #f0f2f5;">
                    <customize :columns="getLineInfoColumns('1')"
                               :data-source="linesDetailInfo"
                               :code="type === 'supplier' ? '' : getCustomizeCode('settleMain-payInfoTab')"
                               type="list"
                               :need-padding="false"/>
                  </ul>
                </srm-flex-item>
                <srm-flex-item style="width: 100%;background: #ffffff" @click.native="openDetailLinePop('2', linesDetailInfo)">
                  <p style="height: 36px;display: flex;align-items: center;padding: 10px 15px;font-size: 12px;color: #333333;">
                    {{ getLanguageDefine("amountInfoTab") }}
                  </p>
                  <ul style="padding: 16px 15px;border-top: 1px solid #f0f2f5;border-bottom: 6px solid #f0f2f5;">
                    <customize :columns="getLineInfoColumns('2')"
                               :data-source="linesDetailInfo"
                               :code="getCustomizeCode('settleMain-amountInfoTab')"
                               type="list"
                               :need-padding="false"/>
                  </ul>
                </srm-flex-item>
                <srm-flex-item style="width: 100%;background: #ffffff" @click.native="openDetailLinePop('3', linesDetailInfo)">
                  <p style="height: 36px;display: flex;align-items: center;padding: 10px 15px;font-size: 12px;color: #333333;">
                    {{ getLanguageDefine("transactionAffair") }}
                  </p>
                  <ul style="padding: 16px 15px;border-top: 1px solid #f0f2f5">
                    <customize :columns="getLineInfoColumns('3')"
                               :data-source="linesDetailInfo"
                               :code="getCustomizeCode('settleMain-thingInfo')"
                               type="list"
                               :need-padding="false"/>
                  </ul>
                </srm-flex-item>
              </srm-flex>
            </srm-tab-item>
            <srm-tab-item :label="getLanguageDefine('settleExecInfoTab')">
              <srm-flex direction="column" align="start">
                <srm-flex-item style="width: 100%;background: #ffffff" @click.native="openDetailLinePop('4', linesDetailInfo)">
                  <p style="height: 36px;display: flex;align-items: center;padding: 10px 15px;font-size: 12px;color: #333333;">{{ type === "supplier" ? getLanguageDefine('billInfo') : getLanguageDefine('payInfoTab') }}</p>
                  <ul style="padding: 16px 15px;border-top: 1px solid #f0f2f5;border-bottom: 6px solid #f0f2f5;">
                    <customize :columns="getLineInfoColumns('4')"
                               :data-source="linesDetailInfo"
                               :code="getCustomizeCode('settleExec-payInfoTab')"
                               type="list"
                               :need-padding="false"/>
                  </ul>
                </srm-flex-item>
                <srm-flex-item style="width: 100%;background: #ffffff" @click.native="openDetailLinePop('5', linesDetailInfo)">
                  <p style="height: 36px;display: flex;align-items: center;padding: 10px 15px;font-size: 12px;color: #333333;">
                    {{ getLanguageDefine('invoiceInfo') }}
                  </p>
                  <ul style="padding: 16px 15px;border-top: 1px solid #f0f2f5;border-bottom: 6px solid #f0f2f5;">
                    <customize :columns="getLineInfoColumns('5')"
                               :data-source="linesDetailInfo"
                               :code="getCustomizeCode('settleExec-invoiceInfo')"
                               type="list"
                               :need-padding="false"/>
                  </ul>
                </srm-flex-item>
                <srm-flex-item style="width: 100%;background: #ffffff" @click.native="openDetailLinePop('6', linesDetailInfo)">
                  <p style="height: 36px;display: flex;align-items: center;padding: 10px 15px;font-size: 12px;color: #333333;">{{ type === "supplier" ? getLanguageDefine('collectionInfo') : getLanguageDefine('paymentInfo') }}</p>
                  <ul style="padding: 16px 15px;border-top: 1px solid #f0f2f5;">
                    <customize :columns="getLineInfoColumns('6')"
                               :data-source="linesDetailInfo"
                               :code="type === 'supplier' ? '' : getCustomizeCode('settleExec-paymentInfo')"
                               type="list"
                               :need-padding="false"/>
                  </ul>
                </srm-flex-item>
              </srm-flex>
            </srm-tab-item>
            <srm-tab-item :label="getLanguageDefine('settleConfigInfoTab')">
              <srm-flex direction="column" align="start">
                <srm-flex-item style="width: 100%;background: #ffffff" @click.native="openDetailLinePop('7', linesDetailInfo)">
                  <p style="height: 36px;display: flex;align-items: center;padding: 10px 15px;font-size: 12px;color: #333333;">
                    {{ getLanguageDefine('settleDataRule') }}
                  </p>
                  <ul style="padding: 16px 15px;border-top: 1px solid #f0f2f5;border-bottom: 6px solid #f0f2f5;">
                    <customize :columns="getLineInfoColumns('7')"
                               :data-source="linesDetailInfo"
                               :code="getCustomizeCode('settleConfig-dataRule')"
                               type="list"
                               :need-padding="false"/>
                  </ul>
                </srm-flex-item>
                <srm-flex-item style="width: 100%;background: #ffffff" @click.native="openDetailLinePop('8', linesDetailInfo)">
                  <p style="height: 36px;display: flex;align-items: center;padding: 10px 15px;font-size: 12px;color: #333333;">
                    {{ getLanguageDefine('billRule') }}
                  </p>
                  <ul style="padding: 16px 15px;border-top: 1px solid #f0f2f5;">
                    <customize :columns="getLineInfoColumns('8')"
                               :data-source="linesDetailInfo"
                               :code="type === 'supplier' ? '' : getCustomizeCode('settleConfig-billRule')"
                               type="list"
                               :need-padding="false"/>
                  </ul>
                </srm-flex-item>
              </srm-flex>
            </srm-tab-item>
          </srm-tab-bar>

          <!-- 弹框 -->
          <srm-popup :visible.sync="visibleLine"
                     :show-header="false"
                     position="right"
                     height="100%">
            <customize-detail
              class="card-pop"
              :columns="getLineDetailColumns(customizeLineInfo.name)"
              :data-source="detailLineInfo"
              :code="customizeLineInfo['code']"/>
          </srm-popup>
        </div>
        <customize-detail
          v-else
          class="card-pop"
          :columns="getDetailColumns(customizeInfo.name)"
          :data-source="detailInfo"
          :code="customizeInfo['code']"/>
      </srm-popup>
    </section>
  </div>
</template>

<script>
import mx from "../datasource/mixin";
import { DataSet } from "srm-mobile-ui";
import billDs from "../datasource/billDs";
export default {
  modules: [ "ssta.purchaseInvoicePool", "hipspfm.common", "ssta.purchaseSettlePool", "ssta.purchaseSettle" ],
  name: "StatementReviewApprovalForm",
  mixins: [ mx ],
  data() {
    return {
      // 行详情
      visible: false,
      detailInfo: {},
      customizeInfo: {
        title: "",
        name: "",
      },
      // 行-行详情
      visibleLine: false,
      detailLineInfo: {},
      customizeLineInfo: {
        title: "",
        name: "",
      },
      // 筛选器
      filterPopup: false,
      filterConfig: false,
      dataSet: {},
    };
  },
  mounted() {
    this.dataSet = new DataSet(billDs(this.changeReqId, {
      billHeaderId: this.changeReqId,
      customizeUnitCode: this.type === "supplier" ? "SSTA.SUPPLIER_BILL_DETAIL.TRANSACTION_DETAILS,SSTA.SUPPLIER_BILL_DETAIL.TRANSACTION_DETAIL_SEARCH" : "SSTA.PURCHASER_BILL_DETAIL.TRANSACTION_DETAILS,SSTA.PURCHASER_BILL_DETAIL.TRANSACTION_DETAIL_SEARCH"
    }));
    this.dataSet.refresh();
  },
  methods: {
    onItemClick(item) {
      this.openDetailPop("line3", item.data);
    },
    async openDetailPop(name, item = {}) {
      this.detailInfo = { ...item };
      this.customizeInfo = {
        name: name
      };
      if (name === "header") {
        this.customizeInfo["code"] = "SMBL.BILL_WORKPLACE.BASE_INFO_DETAIL";
      }
      // if (name === "line1") {
      //   this.customizeInfo["code"] = this.type === "supplier" ? "" : "SMBL.BILL_WORKPLACE.TRADING_PARTY_INFO_DETAIL";
      // }
      if (name === "line2") {
        this.customizeInfo["code"] = "SMBL.BILL_WORKPLACE.TRANSACTION_AMOUNT_INFO_DETAIL";
      }
      if (name === "line3") {
        await this.fetchLineInfo(item.billHeaderId, item.settleId, item.settleConfigId);
        this.customizeInfo["code"] = "";
        this.customizeInfo["title"] = "detailInfoTab";
      }
      if (name === "line4") {
        this.customizeInfo["code"] = "SMBL.BILL_WORKPLACE.SETTLE_CONFIG_INFO_DETAIL";
      }
      // if (name === "line5") {
      //   this.customizeInfo["code"] = "SMBL.BILL_WORKPLACE.OTHER_INFO_DETAIL";
      // }
      this.visible = true;
    },
    openDetailLinePop(name, item = {}) {
      this.detailLineInfo = { ...item };
      this.customizeLineInfo = {
        name: name
      };
      if (name === "1") {
        this.customizeLineInfo["code"] = this.type === "supplier" ? "" : "SMBL.BILL_WORKPLACE.MAIN_TRADING_PARTY_INFO_DETAIL";
      }
      if (name === "2") {
        this.customizeLineInfo["code"] = "SMBL.BILL_WORKPLACE.MAIN_TRANSACTION_AMOUNT_INFO_DETAIL";
      }
      if (name === "3") {
        this.customizeLineInfo["code"] = "SMBL.BILL_WORKPLACE.MAIN_TRANSACTION_THING_INFO_DETAIL";
      }
      if (name === "4") {
        this.customizeLineInfo["code"] = "SMBL.BILL_WORKPLACE.EXEC_TRADING_PARTY_INFO_DETAIL";
      }
      if (name === "5") {
        this.customizeLineInfo["code"] = "SMBL.BILL_WORKPLACE.EXEC_INVOICE_INFO_DETAIL";
      }
      if (name === "6") {
        this.customizeLineInfo["code"] = this.type === "supplier" ? "" : "SMBL.BILL_WORKPLACE.EXEC_PAYMENT_INFO_DETAIL";
      }
      if (name === "7") {
        this.customizeLineInfo["code"] = "SMBL.BILL_WORKPLACE.SETTLE_DATA_RULE_DETAIL";
      }
      if (name === "8") {
        this.customizeLineInfo["code"] = this.type === "supplier" ? "" : "SMBL.BILL_WORKPLACE.SETTLE_BILL_RULE_DETAIL";
      }
      this.visibleLine = true;
    },
    showFilter() {
      this.filterPopup = true;
    },
  }
};
</script>

<style scoped lang="stylus">
.card-pop {
  padding: 0 12px;
}
.card-detail {
  padding-bottom: 12px;
  &:last-child {
    padding-bottom: 0px;
  }
}
.mainDetail {
  overflow visible;

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
        }
      }
    }
  }

  .contentWrap {
    overflow visible;
    .content {
      >>> .srm-tab-pane-title {
        background: var(--color-border-default) !important;
      }
      .headInfo {
        .first-item {
          display: flex;
          align-items: center;
          position: relative;
          .block {
            width: 7px;
            height: 10px;
            background-color: var(--color-other-default-b);
            position: absolute;
            left: -15px;
            top: 4px;
          }
          .text {
            line-height: 20px;
            font-size: 14px;
            color: var(--color-font-default);
            font-weight: bold;
          }
        }
        .lookSomePop {
          background: #276EF1;
          border: 1px solid #276EF1;
          border-radius: 16px;
          padding: 5px 10px;
          color: #FFFFFF;
          font-size: 12px
        }
      }
    }
  }
}
>>> .srm-list-item-card-head-left {
  max-width: 90% !important;
}

>>> .srm-list-search-line {
  position: absolute;
  top: -45px;
  z-index: 1;
  right: 0px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
