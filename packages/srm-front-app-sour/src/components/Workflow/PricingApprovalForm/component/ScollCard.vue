<!-- 评分要素滑块组件 -->
<script>


import { SrmMath } from "srm-mobile-ui";
import BigNumber from "bignumber.js";
import { isNil } from "lodash";

import grid from "@/assets/grid.svg";

export default {
  modules: [ "hipspfm.expertScoring", "ssrc.expertScoring", "ssrc.common", "ssrc.inquiryHall" ],
  name: "ScollCard",
  props:{
    // 激活当前卡片时，禁止重复触发回调方法，默认开启
    bidRepeatClick: {
      type: Boolean,
      default: true,
    },
    dataList: {
      type: Array,
      default: () => [],
    },
    activiteTab: {
      type: Number,
      default: 0,
    },
    tabName: {
      type: String,
      default: "",
    },
    isTax: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currentTabName: "",
    };
  },
  computed: {
    activiteCard() {
      return this.activiteTab || 0;
    },
  },
  watch: {
    tabName(val) {
      this.currentTabName = val;
    },
  },
  methods: {
    // 卡片点击回调
    handClick(data, index) {
      // 激活当前卡片时，禁止重复触发回调方法
      if (this.bidRepeatClick) {
        if (this.activiteCard !== index) {
          this.$emit("handClick", data, index);
        }
      } else {
        this.$emit("handClick", data, index);
      }
    },
    selectAll() {
      this.$emit("handleSelect");
    },
    formatFinicial(amount) {
      if (isNil(amount)) {
        return "-";
      }
      return SrmMath.toFormat(amount, this.financialPrecision, BigNumber.ROUND_HALF_CEIL);
    },
  },
  getCurrentTabName() {
    const {
      tabName,
    } = this.$props;

    return tabName;
  },
  render() {
    const {
      tabName,
    } = this.$props;
    const list = this.dataList || [];
    const tab = this.currentTabName;
    const supplier = tabName === "supplier";
    const item = tabName === "item";

    if (list?.length < 2) {
      return "";
    }

    return (
      <div class="scroll-one supplier-scroll-one">
        <div class="scroll-two">
          <div class="scroll-container">
            <div class="scroll-card-box">
              {list.map((data, index) => {
                const { rfxLineSupplierId, rfxLineItemId, supplierCompanyName, itemName, localSuggestedQtnNetAmount, localSuggestedQtnTotalAmount, } = data || {};
                let valueName = supplierCompanyName;
                let key = rfxLineSupplierId;
                const winBidAmount = this.isTax ? localSuggestedQtnTotalAmount : localSuggestedQtnNetAmount;

                if (item) {
                  valueName = itemName;
                  key = rfxLineItemId;
                }

                return <div class="scroll-card" key={key} id={`${key}${index}`}>
                  <div class="scroll-card-divider"/>
                  <div class="scroll-card-wrap" style={this.activiteTab === index ? { backgroundImage: "linear-gradient(110deg, #034BF1 0%, #4D8CFF 100%)", color: "#FFFFFF " } : {}} onClick={() => this.handClick(data, index)} tabIndex='1'>
                    <div>
                      <div class="scroll-card-wrap-header">
                        <span class="scroll-card-wrap-header-name">{valueName}</span>
                      </div>

                      <div class="scroll-card-wrap-content" style={this.activiteTab === index ? { color: "#FFFFFF " } : {}}>
                        <div class="scroll-card-wrap-content-divider" style={this.activiteTab === index ? { border: "0.5px solid #FFFFFF; margin-top: 9px;" } : {}}/>
                        <div class="scroll-card-wrap-content-line">
                          <span>{ this.$T("ssrc.inquiryHall.model.goods.acceptMoney").$D("中标金额") }：{this.formatFinicial(winBidAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>;
              })}
            </div>
          </div>
        </div>

        <div class="ssrc-supplier-select-mode">
          <span onClick={() => this.selectAll()}>
            {this.$T("ssrc.common.view.scopeAll").$D("全部")}
            <em class="srm-icon icon-grid" style="font-size: 10px;" />
          </span>
        </div>
      </div>
    );
  }
};
</script>

<style lang="stylus" scoped>
.scroll-one {
  top 0
  .scroll-two{
    border-radius: 2px;
    .scroll-container {
      overflow: hidden;
      .scroll-card-box{
        display: flex;
        align-items: center;
        overflow-y: hidden;
        overflow-x: scroll;
        padding: 8px 15px 16px
        .scroll-card {
          display: flex;
          align-items: center;
          &-divider {
            width: 16px;
            flex-shrink: 0;
            background: #c9cdd4;
          }
          &-wrap {
            color: #1D2129;
            padding: 8px;
            font-size: 14px;
            width: 160px;
            height: 61px;
            flex-shrink: 0;
            background-image: linear-gradient(110deg, #F2F3F5 0%, #F7F8FA 100%);
            border-radius: 4px;
            &-header {
              font-size: 12px;
              letter-spacing: 0;
              line-height: 18px;
              font-weight: 600;
              display: flex;
              justify-content: space-between;
              &-name {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }
            &-content {
              font-size: 10px;
              color: #868D9C;
              letter-spacing: 0;
              font-weight: 400;
              &-divider {
                height: 1px;
                margin: 8px 0;
                flex-shrink: 0;
                border: 0.5px solid #c9cdd4;
              }
              &-line {
                &-divider {
                  display: inline-block;
                  height: 8px;
                  border-left: 1px solid;
                  padding: 0 4px;
                }
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: overlay;
                span:first-child {
                  margin-right: 6px;
                }
              }
            }

            &:focus {
              background-color: yellow;
            }
          }
          &:first-child {
            margin-left: -18px
          }
        }
      }
    }
  }
}

.supplier-scroll-one {
  display: flex;

  .scroll-two {
    width: calc(100% - 20px);
  }

  .scroll-card-divider {
    width: 8px !important;
  }

  .ssrc-supplier-select-mode {
    font-size: 10px;
    color: #868D9C;
    letter-spacing: 0;
    font-weight: 400;
    width: 18px;
    margin-top: 18px;
    text-align: center;
  }

  .model-icon {
    color: #868D9C;
    margin-top: 4px;
    height: 12px
  }
}

</style>

