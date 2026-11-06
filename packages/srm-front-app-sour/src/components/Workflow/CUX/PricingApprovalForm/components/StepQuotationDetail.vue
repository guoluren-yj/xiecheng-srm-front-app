<template>
  <hips-popup v-model="value" class="FullPop" style="height: 100%;width:100%" position="right">
    <div class="lineInfoDetail">
      <hips-nav-bar slot="header" :have-border="false">
        <div slot="left" class="left-button" @click="closePop">
          <img src="@/assets/back@3x.png" class="image-black-default">
        </div>
        <div slot="center" class="header">{{ $T('ssrc.inquiryHall.view.message.title.ladderQuotationDetails').$D('阶梯报价明细') }}</div>
      </hips-nav-bar>
      <div class="lineHead">
        <p>
          <span>{{ $T("ssrc.inquiryHall.model.inqueryHall.itemCode").$D("物料编码") }}：</span>
          <span>{{ stepQuotationDetail.itemCode }}</span>
        </p>
        <p>
          <span>{{ $T("ssrc.inquiryHall.model.inqueryHall.itemName").$D("物料名称") }}：</span>
          <span>{{ stepQuotationDetail.itemName }}</span>
        </p>
      </div>
      <div class="lineBody">
        <ul v-for="(li,key) in ladderInfo" :key="key">
          <li>
            <span>
              <span class="block"/>
              <span
                class="width-wrap">{{ $T('ssrc.inquiryHall.model.inquiryHall.price').$D('价格') }}：{{ li.currentLadderPrice }}</span>
              <span
                class="bigBlock">{{ $T("ssrc.inquiryHall.model.inquiryHall.rfxLineItemNum").$D("行号") }}：{{ li.rfxLadderLineNum }}</span>
            </span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.ladderFrom').$D('数量从(>=)') }}：{{ li.ladderFrom }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inquiryHall.ladderTo').$D('数量至') }}：{{ li.ladderTo }}</span>
          </li>
          <li>
            <span>{{ $T('ssrc.inquiryHall.model.inEnquiryHall.remark').$D('备注信息') }}：{{ li.remark }}</span>
          </li>
        </ul>
      </div>
    </div>
  </hips-popup>
</template>

<script>
import { View, Popup, NavBar } from "hips";
import { getLadderQuotationApi, } from "../api/Sw";
export default {
  modules: [ "ssrc.inquiryHall" ],
  name: "StepQuotationDetail",
  components: {
    [View.name]: View,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  props: {
    value: {
      type: Boolean
    },
    stepQuotationDetail: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      ladderInfo:[]
    };
  },
  watch:{
    stepQuotationDetail:{
      handler:async function() {
        await this.getLadderQuotation();
      },
      deep:true
    }
  },
  mounted() {},
  methods: {
    closePop() {
      this.$emit("input", false);
    },
    async getLadderQuotation() {
      this.$loading.show();
      await getLadderQuotationApi(this.stepQuotationDetail.quotationLineId).then((res) => {
        if (!res.empty) {
          this.ladderInfo = res.content;
        }
        this.$loading.hide();
      });
    },
  }
};
</script>

<style lang="stylus" scoped>
.font-blue {
  color: var(--color-other-default-b) !important;
}

.block {
  width: 6px;
  height: 14px;
  border-radius: 1px;
  background-color: var(--color-other-default-b);
  margin: 0px 8px 0 0;
}

.lineInfoDetail {
  background:var(--color-bg-default);
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color:var(--color-font-default);
    text-align: center;
    line-height: 26px;
    font-weight: 700;
    padding: 9px 0;
  }

  .lineHead {
    padding: 8px 20px 12px;
    background-color:var(--color-font-default-d);
    font-family: 'PingFangSC-Medium';
    color:var(--color-font-default);
    font-size: 16px;
    line-height: 24px;
    border-bottom: 8px solid var(--color-border-default);

    li {
      padding: 0;
      margin-bottom: 9px;
      height: 24px;
      display: flex;
      color: var(--color-font-default-e);
    }

    p {
      span {
        color:var(--color-font-default);
        line-height: 24px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .lineBody {
    overflow-y: auto;

    ul {
      padding: 0;

      li:nth-child(1) {
        padding: 13px 20px 7px 0px;
        margin-bottom: 0px;
        border: none;

        span {
          display: flex;
          align-items: center;
          flex: none;

          .block {
            display: inline-block;
            margin: 0 14px 0 0;
          }

          span:nth-child(2) {
            margin-right: 12px;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color:var(--color-font-default);
            line-height: 22px;
            font-weight: 700;
          }
        }
      }

      li {
        margin-bottom: 2px;
        padding: 5px 20px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default);
        line-height: 22px;
      }

      li:nth-last-child(1) {
        padding: 5px 20px 13px 20px;
        border: none;
        margin-bottom: 0px;
      }
    }
  }

  .width-wrap {
    max-width: 280px;
    word-break: break-all;
  }

  .bigBlock {
    border-radius: 2px;
    background:var(--color-bg-default-c);
    padding: 1px 4px;
    font-weight: normal;
    font-size: 10px !important;
    line-height: 18px !important;
    font-family: PingFangSC-Medium;
    color: var(--color-other-default-b);
    display: inline-block;
  }
}
</style>
