<template>
  <srm-popup
    :visible="visible" height="100%" position="right" @onClose="close">
    <!-- <hips-view> -->
    <nav-head
      :title="$T('ssrc.inquiryHall.view.message.button.ladderInquiryFlag').$D('阶梯报价')"
      @goTop="goTop"
      @goClose="goClose"
      @goBack="goBack"/>

    <div ref="content" class="content" :style="{ height: showBackFlag ? 'calc(100vh - 44px)' : '100vh' }">
      <srm-detail-head
        :columns="getHeadColumn"
        :data-source="queryParams"/>
      <h3>{{ $T("ssrc.priceLibrary.model.priceLibrary.ladderPrice").$D("阶梯价格") }}</h3>
      <div class="info">
        <ul v-for="(li, key) in ladderData" :key="key" class="info-card">
          <div class="card-price">
            <div class="card-left price-card">
              <div class="price-title">{{ doubleUnitFlagPriceName() }}</div>
              <div class="price-left price">
                {{ (doubleUnitFlag ? (priceTypeCode === 'NET_PRICE' ? li.currentNetLadderSecPrice : li.currentLadderSecPrice) : (priceTypeCode === 'NET_PRICE' ? li.currentNetLadderPrice : li.currentLadderPrice))|filterMoneyInt }}<span class="little">{{ (doubleUnitFlag ? (priceTypeCode === 'NET_PRICE' ? li.currentNetLadderSecPrice : li.currentLadderSecPrice) : (priceTypeCode === 'NET_PRICE' ? li.currentNetLadderPrice : li.currentLadderPrice))|filterMoneyFloat }}</span>
              </div>
            </div>
            <div class="price-card">
              <div class="price-title">{{ $T("ssrc.priceLibrary.model.priceLibrary.numberRange").$D("数量范围") }}</div>
              <div class="number">
                <div class="number-left number-card">
                  <span class="number-val-left"> {{ doubleUnitFlag ? li.secondaryLadderFrom : li.ladderFrom }}</span>
                  <img
                    class="number-img"
                    src="@/assets/4.0/icon_Form_≤_disabled@3x.png">
                </div>
                <div class="number-right number-card">
                  <img
                    class="number-img"
                    src="@/assets/4.0/icon_Form___disabled@3x.png">
                  <span class="number-val-right"> {{ doubleUnitFlag ? li.secondaryLadderTo : li.ladderTo }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="line-title">{{ $T("ssrc.inquiryHall.model.inquiryHall.remarks").$D("备注") }}</div>
          <div class="line-text">
            <srm-textarea-field
              v-model="li.remark"
              placeholder=""
              :min-height="64"
              :max-height="64"
              disabled/>
          </div>

          <li><div class="card-tip">{{ $T("ssrc.inquiryHall.model.inquiryHall.lineNumber").$D("行号") }}：{{ li.rfxLadderLineNum }}</div></li>
        </ul>
        <no-content
          v-if="ladderData.length===0"
          :title="$T('hipspfm.common.view.message.title.noData').$D('暂无数据')"
          img-src="NoOrder@3x.png"/>
      </div>
    </div>
  <!-- </hips-view> -->
  </srm-popup>
</template>

<script>
import { getLadderQuotationApi } from "../../api/RfxPrice";
import NoContent from "@/components/NoContent";
import NavHead from "@/components/NavHead";
import { getPriceName, getNetPriceName } from "@/utils/doubleUnit";

export default {
  modules: [ "ssrc.inquiryHall", "ssrc.priceLibrary", "hipspfm.common" ],
  name: "NewLadderQuotationDetail",
  components: {
    NavHead,
    NoContent,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    queryParams: {
      type: Object,
      default: () => ({})
    },
    doubleUnitFlag: {
      type: Boolean,
      default: false,
    },
    priceTypeCode: {
      type: String,
      default: 'NET_PRICE',
    }
  },
  data() {
    return {
      ladderData: [],
    };
  },
  computed:{
  // 详情头
    getHeadColumn() {
      return [
        {
          fieldCode: "companyName",
        },
        {
          fieldCode: "itemCode",
        },
      ];
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.getLadderQuotation();
      }
    }
  },
  mounted() {
    this.getLadderQuotation();
  },
  methods: {
    close() {
      this.$emit("changePopVisible", false);
    },
    // 获取阶梯报价数据
    getLadderQuotation() {
      // const { quotationLineId } = this.$route.query;
      getLadderQuotationApi(this.queryParams.quotationLineId).then(({ content = [] }) => {
        this.ladderData = content;
      });
    },
    // 返回
    goBack() {
      // this.$router.back();
      this.$emit("input", false);
    },
    //退出子应用
    goClose() {
      try {
        closeWebView();
      } catch (err) {
        this.$router.back();
      }
    },
    //回到顶部
    goTop() {
      this.$nextTick(() => {
        this.$refs.content.scrollTop = 0;
      });
    },
    doubleUnitFlagPriceName() {
      return this.priceTypeCode === 'NET_PRICE' ? getNetPriceName(this.doubleUnitFlag) : getPriceName(this.doubleUnitFlag);
    }
  },
};
</script>

<style lang="stylus" scoped>
.detail-navbar {
  .left-button {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: var(--color-font-default);
    line-height: 24px;
    font-weight: bold;

    img {
      height: 12.7px;
      width: 15.3px;
      margin-right: 10.7px;
      margin-top: 4px;
    }
  }

  .right-button {
    margin-right: 15px;
    z-index: 1;
    color: var(--color-font-default-f);

    span {
      display: flex;
      align-items: center;
      width: 77px;
      height: 32px;
      padding: 7px 10px;
      background: var(--color-bg-default);
      border: 1px solid var(--color-border-default);
      border-radius: 18px;

      i {
        margin: 0px 8px;
        position: relative;
        top: -1px;
      }
    }

    img {
      height: 18px;
      width: 18px;
    }
  }
}

.content {
  height: calc(100vh - 44px);
  // padding-bottom: 100px;
  overflow: auto;

  .head-lin {
    font-size: 14px;
    line-height: 20px;
    padding-bottom: 16px;
  }

  h3 {
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    text-align: left;
    color: #333333;
    line-height: 22px;
    background: var(--color-bg-default-b);
    padding: 20px 15px 12px 15px;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .info {
    min-height 492px;
    height calc(100% - 130px)
    background: var(--color-bg-default-b);

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
        margin-top: 12px;
        display: flex;
        align-items: center;
        border: 1px solid #f6f6f6;

        .price-card {
          flex: 1;
          padding: 12px 12px;
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

          .number {
            font-size: 12px;
            color: #757575;
            line-height: 16px;
            display: flex;
            align-items: cneter;
            justify-content: space-between;
            width: 100%;

            .number-img {
              width: 20px;
              height: 20px;
            }

            .number-card {
              border: 1px solid var(--color-border-default);
              border-radius: 12px;
              padding: 4px 2px;
              display: flex;
              align-items: center;

              .number-val-left {
                margin: 0 4px 0 6px;
              }

              .number-val-right {
                margin: 0 6px 0 4px;
              }
            }

            .number-left {
              margin-right: 21px;
            }
          }
        }

        .card-left {
          border-right: 1px solid #f6f6f6;
          flex: 0 1 145px;
        }
      }

      .card-tip {
        padding: 2px;
        font-size: 10px;
        color: var(--color-font-default);
        line-height: 12px;
        background: var(--color-bg-default-b);
        display: inline-block;
      }
    }

    li {
      margin-top: 12px;
    }
  }

  .line-title {
    margin: 16px 0 8px 0;
    font-size: 12px;
    text-align: left;
    color: var(--color-font-default-b);
    line-height: 16px;
  }

  .line-text {
    margin: 0 0 16px 0;
    height: 64px;
    background: var(--color-bg-default-b);
    border-radius: 8px;
    position: relative;

    >>> .hips-textarea {
      position: static;
      background-color: var(--color-bg-default-b) !important;
      padding: 0 !important;
      textarea:disabled, textarea[disabled]{ -webkit-opacity:0.22; opacity: 0.22;color:var(--color-font-default) !important  }
    }

    >>> .hips-textarea--disabled {
      opacity: 1;
    }

    >>> .hips-textarea__input-value {
      padding: 12px;

      textarea {
        height: 40px !important;
        font-size: 14px !important;
        color: #cbcbcb !important;
        line-height: 20px !important;
      }
    }

    .text-img {
      position: absolute;
      right: 12px;
      bottom: 12px;
      width: 20px;
      height: 20px;
    }
  }
}
</style>
