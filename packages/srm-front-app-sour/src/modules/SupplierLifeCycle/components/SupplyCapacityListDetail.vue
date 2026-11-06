<!-- eslint-disable rulesdir/no_hips -->
<template>
  <hips-popup
    v-model="showLineDetail"
    class="FullPop"
    style="height: 100%;width:100%"
    position="bottom">
    <section class="lineInfoDetail">
      <hips-nav-bar slot="header" :have-border="false">
        <div slot="left" class="left-button" @click="closeLineInfoDetail">
          <img class="image-gray-default" src="@/assets/icon_close_normal@3x.png" alt >
        </div>
        <div slot="center" class="header">{{ $T("sslm.supplierDetail.view.message.title.supplyCapacityList").$D("供货能力详情") }}</div>
      </hips-nav-bar>
      <div class="lineBody">
        <li>
          <span>{{ $T("sslm.supplyAbility.model.supplyAbility.itemCode").$D("物料编码") }}：</span>
          <span>{{ lineInfoDetail.itemCode }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplyAbility.model.supplyAbility.itemName").$D("物料名称") }}：</span>
          <span>{{ lineInfoDetail.itemName }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplyAbility.model.supplyAbility.itemCategoryCode").$D("品类代码") }}：</span>
          <span>{{ lineInfoDetail.itemCategoryCode }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplyAbility.model.supplyAbility.categoryName").$D("品类名称") }}：</span>
          <span>{{ lineInfoDetail.itemCategoryName }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplyAbility.model.supplyAbility.supplyFlag").$D("是否可供") }}：</span>
          <span>{{ lineInfoDetail.supplyFlag === 1 ? $T("hipspfm.common.status.yes").$D("是"):$T("hipspfm.common.status.no").$D("否") }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplyAbility.model.supplyAbility.adapterProducts").$D("适配产品") }}：</span>
          <span>{{ lineInfoDetail.adapterProducts }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplyAbility.model.supplyAbility.countryIdMeaning").$D("服务国家") }}：</span>
          <span>{{ lineInfoDetail.countryIdMeaning }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplyAbility.model.supplyAbility.regionIdMeaning").$D("服务地区") }}：</span>
          <span>{{ lineInfoDetail.regionIdMeaning }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplyAbility.model.supplyAbility.cityIdMeaning").$D("服务城市") }}：</span>
          <span>{{ lineInfoDetail.cityIdMeaning }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplyAbility.model.supplyAbility.supplyStatus").$D("可供状态") }}：</span>
          <span>{{ lineInfoDetail.supplyStatus }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplyAbility.model.supAbility.psaEvaluationLevel").$D("PSA评级") }}：</span>
          <span>{{ lineInfoDetail.psaEvaluationLevel }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplyAbility.model.supplyAbility.psaEvaluationScore").$D("PSA评分") }}：</span>
          <span>{{ lineInfoDetail.psaEvaluationScore }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplyAbility.model.supplyAbility.psaFinishDate").$D("PSA完成时间") }}：</span>
          <span>{{ lineInfoDetail.psaFinishDate }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplyAbility.model.supplyAbility.spaEvaluationLevel").$D("SPA评级") }}：</span>
          <span>{{ lineInfoDetail.spaEvaluationLevel }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplyAbility.model.supplyAbility.spaEvaluationScore").$D("SPA评分") }}：</span>
          <span>{{ lineInfoDetail.spaEvaluationScore }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplyAbility.model.supplyAbility.spaFinishDate").$D("SPA完成时间") }}：</span>
          <span>{{ lineInfoDetail.spaFinishDate }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplyAbility.model.supplyAbility.evaluateRemark").$D("评价信息") }}：</span>
          <span>{{ lineInfoDetail.evaluateRemark }}</span>
        </li>
        <li>
          <span>{{ $T("sslm.supplyAbility.view.message.tab.enclosureTable").$D("附件") }}：</span>
          <span style="color: var(--color-other-default-b);" @click="showFilePop(lineInfoDetail.attachmentUuid||uuid)">
            {{ $T("hipspfm.common.button.viewAttachments").$D("查看附件") }}
            <img class="image-gray-default" src="@/assets/icon_screenlist_right_normal@3x.png" alt >
          </span>
        </li>
        <div class="line-div">
          <span class="line-block"/>
        </div>
      </div>
    </section>
  </hips-popup>
</template>

<script>
import { Popup, NavBar } from "hips";
import uuid from "uuid";

export default {
  modules: [ "sslm.supplierDetail", "sslm.supplyAbility", "hipspfm.common" ],
  name: "SupplyCapacityListDetail",
  components: {
    [NavBar.name]: NavBar,
    [Popup.name]: Popup
  },
  props: {
    value: {
      // 弹出层状态
      type: Boolean,
      default: false
    },
    lineInfoDetail: {
      // 弹出层内容
      type: Object,
      default: () => ({})
    },
    showFilePop: {
      type: Function,
      default: () => ({})
    },
    queryParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      uuid: ""
    };
  },
  computed: {
    showLineDetail: {
      get() {
        return this.value;
      },
      // eslint-disable-next-line no-unused-vars
      set(val) {}
    }
  },
  mounted() {
    this.uuid = uuid();
  },
  methods: {
    closeLineInfoDetail() {
      this.showLineDetail = false;
      this.$emit("input", false);
    }
  }
};
</script>

<style lang="stylus" scoped>
// >>> .hips-nav-bar__theme-default {
//   height: 71px !important;
// }

.lineInfoDetail {
  background: #FAFBFC;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color:var(--color-font-default);
    text-align: center;
    font-weight: 700;
    line-height: 26px;
  }

  .lineBody {
    background-color:var(--color-font-default-d);
    height: 100%
    overflow: auto;

    li {
      display: flex;
      padding: 16px 20px 15px 0;
      margin-left: 20px;
      border-bottom:1px solid var(--color-border-default);

      &:nth-of-type(1) {
        // padding-top: 20px;
      }

      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color:var(--color-font-default);
        line-height: 22px;

        &:nth-child(1) {
          width: 31%;
        }

        &:nth-child(2) {
          color:var(--color-font-default-b);
          display: inline-block;
          width: 220px;
          text-align: left;
          word-wrap: break-word;
          word-break: break-all;

          img {
            width: 12px;
            height: 12px;
            float: right;
            margin-top: 4px;
          }
        }
      }
    }

    .line-div {
      height: 34px;
      display: flex;
      justify-content: center;

      .line-block {
        width: 35.7%;
        height: 6px;
        // border-radius:100px;
        // background-color : #000000;
        position: relative;
        bottom: -18px;
      }
    }
  }
}
</style>