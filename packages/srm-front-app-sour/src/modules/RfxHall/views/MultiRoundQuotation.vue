<template>
  <div>
    <nav-head
      :title="$T('ssrc.inquiryHall.view.message.title.roundQuotation').$D('多轮报价')"
      @goTop="goTop"
      @goClose="goClose"
      @goBack="goBack"/>

    <div ref="content" class="content">
      <srm-detail-head
        :columns="getHeadColumn"
        :data-source="headInfo"/>

      <div v-if="headInfo.startingReason">
        <div class="line-title">{{ $T('ssrc.bidHall.model.bidHall.startingReason').$D('开始原因') }}</div>
        <div class="line-text">
          <srm-textarea-field
            v-model="headInfo.startingReason"
            placeholder=""
            :min-height="32"
            :max-height="64"
            disabled/>
        </div>
      </div>

      <nav-wrap :nav-arr="getNavArr" />

      <div class="info">
        <ul v-for="(li, key) in lineInfo" :key="key" class="info-card">
          <customize code="" :need-padding="true" :data-source="li" :columns="getLineInfoColumns" />
        </ul>
      </div>
    </div>

    <div :class="isEndTime ? 'bottom-tip red-tip':'bottom-tip'" >{{ $T('ssrc.quoController.model.quoController.roundQuotationEndDate').$D('截止时间') }}：{{ headInfo.latestQuotationEndDate }}</div>
    <!-- 底部按钮 -->
    <bottom-handler :btn-arr="getBtnArr" />

    <!-- 发起新一轮报价弹窗 -->
    <new-quote-pop :visible="newQuotePop" @confirm="toNew" @changeVisible="changeVisible"/>

    <!-- 更多报价信息弹窗 -->
    <more-round-pop :visible="moreRoundPop" :round-quotation="roundQuotation" :currency-code-meaning="headInfo.currencyCodeMeaning" @changeVisible="changeVisible" />

    <!-- 操作记录弹窗 -->
    <!-- <OperationRecord
        v-model="operationPopup"
        :operationArr="operationArr"
    />

    <AttachedFile v-model="filePopup" :attachmentUuid="attachmentUuid" /> -->
  </div>
</template>

<script>
import { $T, SrmListHeader } from "srm-mobile-ui";
import { getHeadInfoApi, getLineInfoApi, getCreateNewQuoteApi, getSubmitQuotaeApi } from "../api/RfxPrice.js";
import BottomHandler from "@/components/NewBottomHandler";
import NavWrap from "@/components/NavWrap";
import NavHead from "@/components/NavHead";
// eslint-disable-next-line rulesdir/check_modules
import NewQuotePop from "../components/rfxPricePop/NewQuotePop";
import MoreRoundPop from "../components/rfxPricePop/MoreRoundPop";

export default {
  modules: [ "ssrc.bidHall", "hipspfm.common", "ssrc.inquiryHall", "ssrc.queryRfq", "ssrc.quoController", "ssrc.supplierQuotation" ],
  name: "MultiRoundQuotation",
  components: {
    MoreRoundPop,
    NewQuotePop,
    NavHead,
    NavWrap,
    BottomHandler,
  },
  data() {
    return {
      height: "height: calc(100vh - 120px)",
      noHeadHeight: "height: calc(100vh - 66px)",
      headerId: "",
      headInfo: {},
      lineInfo:[],
      attachmentUuid: "",
      operationArr: [],
      operationPopup: false,
      filePopup: false,
      newQuotePop: false,
      moreRoundPop:false, // 多轮报价弹窗
      roundQuotation:[]
    };
  },
  computed: {
    // 详情头
    getHeadColumn() {
      return [
        {
          fieldCode:"rfxTitle"
        },
        {
          fieldCode: "rfxNum",
        },
        {
          fieldCode:"quotationRoundNumber",
          fieldName:$T("ssrc.queryRfq.model.queryRfq.round").$D("轮次")
        },
      ];
    },
    getLineInfoColumns() {
      const columns = [
        {
          fieldCode: "supplierCompanyName",
          fieldType:"EMPTY",
          render:(val) => <SrmListHeader showOpenTag={false}>
            <span>{val}</span>
          </SrmListHeader>
        },
        {
          fieldName: $T("ssrc.bidHall.model.bidHall.quantity").$D("需求数量"),
          fieldCode: "rfxQuantity",
        },
        {
          fieldCode:"quotation",
          fieldType:"EMPTY",
          render:(val, record) => <div class="card-price">
            <div class="price-left price-card">
              <div class="price-title">{this.$T("ssrc.bidHall.model.bidHall.quotationAmntFirstRound").$D("首轮报价")}（{ this.headInfo.currencyCodeMeaning }）</div>
              { record.roundQuotation && record.roundQuotation[0].totalRoundPrice ? <div class="price-left price">
                { this.calcMicrometer(this.$options.filters.filterMoneyInt(record.roundQuotation[0].totalRoundPrice)) }<span class="little">{ this.$options.filters.filterMoneyFloat(record.roundQuotation[0].totalRoundPrice)}</span>
              </div> :
                <div class="price-left price">
                -
                </div>
              }
            </div>
            {this.headInfo.quotationRoundNumber > 1 &&
            <div class="price-right price-card" onClick={() => this.showMoreRound(record.roundQuotation)}>
              <div class="price-title">{this.$T("ssrc.bidHall.modal.inqueryHall.endRoundQuotation").$D("终轮报价") }（{ this.headInfo.currencyCodeMeaning }）<img class="more-img" src={require("@/assets/4.0/icon_list_cricle_default@3x.png")}/></div>
              {record.roundQuotation && record.roundQuotation[record.roundQuotation.length - 1].totalRoundPrice ?
                <div class="price-right price">
                  { this.calcMicrometer(this.$options.filters.filterMoneyInt(record.roundQuotation[record.roundQuotation.length - 1].totalRoundPrice)) }<span class="little">{ this.$options.filters.filterMoneyFloat(record.roundQuotation[record.roundQuotation.length - 1].totalRoundPrice) }</span>
                </div> :
                <div class="price-left price">
                -
                </div>
              }
            </div>
            }
          </div>
        },
        {
          fieldName: $T("ssrc.bidHall.modal.inqueryHall.itemName").$D("物料名称"),
          fieldCode: "itemName",
          fieldType:"EMPTY",
          render:(val, record) => <span>{this.$T("ssrc.bidHall.modal.inqueryHall.itemName").$D("物料名称")}｜{this.$T("ssrc.bidHall.modal.inqueryHall.itemCode").$D("编号") }：{record.itemName }｜{ record.itemCode }</span>
        },
        {
          fieldCode:"supplierCompanyNum",
          fieldName:$T("ssrc.bidHall.model.bidHall.supplierCode").$D("供应商编码")
        },
      ];
      return columns;
    },
    // 当前轮次
    roundNumber() {
      // console.log(2222222, this.headInfo.quotationRoundNumber);
      return this.headInfo.quotationRoundNumber;
    },
    // 时间是否截至
    isEndTime() {
      const now = new Date();
      // eslint-disable-next-line no-useless-escape
      const end = new Date((this.headInfo.latestQuotationEndDate || "").replace(/\-/g, "/"));
      // console.log(now.getTime(), end.getTime(), end.getTime() < now.getTime());
      if (end && end.getTime() < now.getTime()) {
        return true;
      }
      return false;
    },
    getNavArr() {
      let navArr = [
        {
          title: this.$T("ssrc.bidHall.view.message.tab.allSupplierQuot").$D("全部报价明细"),
          ref: "headInfo",
        },
      ];
      return navArr;
    },
    getBtnArr() {
      const arr = [
        {
          title: this.$T("ssrc.bidHall.view.button.startNerRoundQuotation").$D("发起新一轮报价"),
          color: !this.isEndTime || !this.headInfo.quotationRoundNumber ? "var(--color-font-default-e)" : "var(--color-other-default-b)",
          background: !this.isEndTime || !this.headInfo.quotationRoundNumber ? "var(--color-bg-default-b)" : "#eff3fe",
          handler: () => {
            this.showNew();
          },
        },
        {
          title: this.$T("ssrc.bidHall.view.button.sureEndRoundQuotationOver").$D("确认终轮报价结束"),
          color:!this.isEndTime ? "var(--color-font-default-e)" : "var(--color-font-default-d)",
          background: !this.isEndTime ? "var(--color-bg-default-b)" : "var(--color-other-default-b)",
          handler: () => {
            this.toSubmit();
          },
        },
      ];
      return arr;
    },
  },
  watch:{
    roundNumber:{
      handler(val) {
        if (!Array.isArray(this.lineInfo) || !this.lineInfo.length || !val) {
          return;
        }
        this.lineInfo.map((i) => {
          if (!i.roundQuotation.length) {
            for (let j = 1; j <= val; j++) {
              const newObj = {
                quotationRoundNumber:j,
                isQuotation:false,
                totalRoundQuotationPrice:null,
                totalRoundPrice:null
              };
              i.roundQuotation.push(newObj);
            }
            return;
          }
          if (val !== i.roundQuotation.length) {
            for (let j = 1; j <= val; j++) {
              const filterRoundQuotation = i.roundQuotation.filter(
                (item) => item && item.quotationRoundNumber === j
              );

              if (filterRoundQuotation.length) {
                continue;
              }
              const newObj = {
                quotationRoundNumber:j,
                isQuotation:false,
                totalRoundQuotationPrice:null,
                totalRoundPrice:null
              };
              i.roundQuotation.push(newObj);
            }
            i.roundQuotation.sort((a, b) => a.quotationRoundNumber - b.quotationRoundNumber);
          }
        });
      },
    }
  },
  async mounted() {
    const {
      headerId = "__-qTNANIbA0SS-thqJwa13_KSruiHFc1XZ4m1dOrUYGjU-__",
    } = this.$route.query;
    this.headerId = headerId;
    try {
      this.$loading.show();
      await this.getLineInfo();
      await this.getHeadInfo();
      this.$loading.hide();
    } catch (err) {
      this.$loading.hide();
      console.log(err, "error");
    }
  },
  methods: {
    async getHeadInfo() {
      await getHeadInfoApi(this.headerId).then((res) => {
        if (res && !res.failed) {
          this.headInfo = res;
        }
      });
    },
    async getLineInfo() {
      const params = {
        sourceFrom:"RFX"
      };
      await getLineInfoApi(this.headerId, params).then((res) => {
        if (res && res.rfxQuotationLineDTO) {
          this.lineInfo = res.rfxQuotationLineDTO;
        }
      });
    },
    validData() {
      let flag = true;
      this.lineInfo.map((i) => {
        if (i.indicatorType === "SCORE" && i.parentId !== -1 && !i.score) {
          flag = false;
        }
      });
      return flag;
    },
    showNew() {
      if (this.isEndTime && this.headInfo.quotationRoundNumber) {
        this.newQuotePop = !this.newQuotePop;
      }
    },
    showMoreRound(roundQuotation) {
      // 不改变原数组获取反转后的数组
      this.roundQuotation = roundQuotation.slice().reverse();
      this.moreRoundPop = true;
    },
    async toNew(params) {
      // console.log(111111, params);
      this.$loading.show();
      await getCreateNewQuoteApi(this.headerId, params).then(async (res) => {
        // eslint-disable-next-line no-empty
        if (res && res.failed) {

        } else {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D("操作成功"),
            description: "",
            class: "notification",
          });
          await this.getLineInfo();
          await this.getHeadInfo();
          this.newQuotePop = false;
        }
        this.$loading.hide();
      });
    },
    toSubmit() {
      if (!this.isEndTime) {
        return;
      }
      this.$loading.show();
      getSubmitQuotaeApi(this.headerId, "RFX").then((res) => {
        this.$loading.hide();
        // eslint-disable-next-line no-empty
        if (res && res.failed) {
        } else {
          this.$notification.open({
            message: this.$T("hipspfm.common.message.operationSuccessful").$D("操作成功"),
            description: "",
            class: "notification",
          });
          setTimeout(() => {
            this.$router.back();
          }, 1000);
        }
      });
    },
    showFilePop() {
      this.filePopup = !this.filePopup;
    },
    showOperationPop() {
      this.operationPopup = !this.operationPopup;
    },
    // 返回
    goBack() {
      this.$router.back();
    },
    //退出子应用
    goClose() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    changeVisible(visible) {
      this.moreRoundPop = visible;
      this.newQuotePop = visible;
    },
    //回到顶部
    goTop() {
      this.$nextTick(() => {
        this.$refs.content.scrollTop = 0;
      });
    },
    calcMicrometer(value) {
      if (typeof value !== "undefined" && typeof value !== "object") {
        return String(value).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      }
    }
  },
};
</script>

<style lang="stylus" scoped>
.content {
  height: calc(100vh - 44px);
  padding-bottom: 100px;
  overflow: auto;
  .info {
    background: var(--color-bg-default-b);
    min-height calc(100% - 150px)

    .info-card {
      background: var(--color-bg-default);
      font-size: 14px;
      color: var(--color-font-default);
      line-height: 20px;
      padding: 4px 15px 16px 15px;
      margin-bottom: 2px;
      word-break: break-all;

      .card-title {
        font-weight: bold;
      }

      .card-price {
        width:100%;
        margin-top: 12px;
        display: flex;
        align-items: center;
        border: 1px solid #f6f6f6;

        .price-card {
          flex: 1;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          .price-title {
            font-size: 12px;
            text-align: center;
            color: #757575;
            line-height: 16px;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
          }

          .price {
            font-size: 18px;
            font-weight: bold;
            line-height: 24px;
          }

          .little {
            font-size: 12px;
            line-height: 16px;
          }

          .price-left {
            color: var(--color-other-default-b);
          }

          .price-right {
            color: var(--color-other-default-d);
          }

          .more-img{
            width 12px
            height 12px;
          }
        }

        .price-left {
          border-right: 1px solid #f6f6f6;
        }
      }
    }

    li {
      margin-top: 12px;
    }
  }

  .line-title {
    margin: 16px 15px 8px 15px;
    font-size: 12px;
    text-align: left;
    color: var(--color-font-default-b);
    line-height: 16px;
  }

  .line-text {
    margin: 0 15px 16px 15px;
    height: 64px;
    background: var(--color-bg-default-b);
    border-radius: 8px;
    position: relative;
    .text-img {
      position: absolute;
      right: 12px;
      bottom: 12px;
      width: 20px;
      height: 20px;
    }
  }
}

.bottom-tip {
  position: fixed;
  bottom: 72px;
  bottom: calc(72px + constant(safe-area-inset-bottom));
  bottom: calc(72px + env(safe-area-inset-bottom));
  width: 100%;
  background: #fff2d9;
  font-size: 12px;
  text-align: center;
  color: #dc8b2c;
  line-height: 16px;
  padding: 8px 15px;
}
.red-tip{
  background #fed7d2
  color: var(--color-other-default);
}
</style>
