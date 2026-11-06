<!-- eslint-disable rulesdir/no_hips -->
<template>
  <hips-popup
    :value="value"
    class="FullPop"
    style="width:100%"
    :overlay-on-click-close="false"
    position="left"
    @click-overlay="$emit('input',false)">
    <!-- <hips-view> -->
    <nav-head
      :title="$T('ssrc.inquiryHall.view.message.modal.quotationDetail').$D('报价明细')"
      @goTop="goTop"
      @goClose="goClose"
      @goBack="goBack"/>

    <div ref="content" class="content">
      <new-detail-head
        :title="detailInfo.templateName"
        no-file
        no-history>
        <div class="head-lin">
          <!-- <span>模版编码-模版名称：2093023-模版名称</span> -->
        </div>
      </new-detail-head>

      <h3>{{ $T("ssrc.inquiryHall.view.message.modal.quotationDetail").$D("报价明细") }}</h3>
      <div class="info">
        <ul v-for="(li, key) in supQuotationDetail" :key="key" class="info-card">
          <li class="card-title">{{ li.configName }}</li>
          <li>{{ $T("ssrc.common.model.common.configCode").$D("报价明细编码") }}：{{ li.configCode }}</li>
          <div class="card-price">
            <div class="card-left price-card">
              <div class="price-title">{{ $T("ssrc.inquiryHall.model.inquiryHall.validQuotationPrice").$D("单价") }}</div>
              <!-- <div class="price-left price">{{ li.quotationColumns[1].supQuotationColumnValue }}.<span class="little">00</span> -->
              <div class="price-left price">
                {{ showQuantity(li.quotationColumns, 'Price') }}.<span class="little">00</span>
              </div>
            </div>
            <div class="card-right price-card">
              <div class="price-title">{{ $T("ssrc.inquiryHall.model.inqueryHall.quantity").$D("数量") }}</div>
              <!-- <div class="price-right price">{{ li.quotationColumns[0].supQuotationColumnValue }} -->
              <div class="price-right price">
                {{ showQuantity(li.quotationColumns, 'Quantity') }}
              </div>
            </div>
          </div>

          <div class="line-title">{{ $T("ssrc.inquiryHall.model.inquiryHall.remarks").$D("备注") }}</div>
          <div class="line-text">
            <hips-textarea
              :value="li.quotationColumns[3] && li.quotationColumns[3].supQuotationColumnValue"
              placeholder=""
              label-position="top"
              :min-height="64"
              :max-height="64"
              disabled/>
            <img
              class="text-img"
              src="@/assets/4.0/icon_Test_filled_disabled@3x.png">
          </div>
        </ul>
        <no-content
          v-if="supQuotationDetail.length===0"
          :title="$T('hipspfm.common.view.message.title.noData').$D('暂无数据')"
          img-src="NoOrder@3x.png"/>
      </div>
    </div>
  <!-- </hips-view> -->
  </hips-popup>
</template>

<script>
import { View, Popup, Input, NavBar, Textarea } from "hips";
import { getPriceDetailApi } from "../../api/RfxPrice";
import NavHead from "@/components/NavHead";
import NoContent from "@/components/NoContent";
import NewDetailHead from "@/components/NewDetailHead";

export default {
  modules: [ "ssrc.inquiryHall", "ssrc.common", "hipspfm.common" ],
  name: "NewQuotationDetail",
  components: {
    NavHead,
    NoContent,
    NewDetailHead,
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar,
    [Textarea.name]: Textarea,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    queryParams: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      detailInfo: {},
      supQuotationDetail: [],
    };
  },
  computed: {
    showQuantity() {
      return (data, code) => {
        const obj = data.find((item) => item.columnCode === code) || {};
        return obj["supQuotationColumnValue"];
      };
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.getPriceDetail();
      }
    }
  },
  mounted() {
    // this.queryParams = this.$route.query
    // try {
    //   this.getPriceDetail();
    // } catch (err) {
    //   this.$loading.hide();
    //   console.log(err, "error");
    // }
  },
  methods: {
    // 获取数据
    getPriceDetail() {
      getPriceDetailApi(this.queryParams).then((res) => {
        this.detailInfo = res;
        const { content = [] } = res.supQuotationDetailPage;
        this.supQuotationDetail = content.reduce((pre, cur) => cur.children ? pre.concat(cur.children) : pre, []);
        console.log("this.supQuotationDetail", this.supQuotationDetail);
      });
    },
    // 返回
    goBack() {
      console.log("back....");
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
    min-height 535px;
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
          .price-right{
            color: #333333;
          }

        }

        .card-left {
          border-right: 1px solid #f6f6f6;
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
