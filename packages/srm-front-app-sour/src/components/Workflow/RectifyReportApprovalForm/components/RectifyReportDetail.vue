<template>
  <hips-popup
    :value="show"
    class="FullPop"
    style="height:100%;width:100%"
    position="bottom">
    <div class="orderLineDetail">
      <hips-nav-bar slot="header" :have-border="false">
        <div slot="left" class="left-button" @click="closePop">
          <img src="@/assets/icon_navigationbars_off_normal@3x.png">
        </div>
        <div slot="center" class="header">
          {{ title || $T("smbl.common.view.detail").$D("详情") }}
        </div>
      </hips-nav-bar>
      <div class="card-personalized">
        <!-- 个性化组件替换后的代码 -->
        <customize-detail
          :columns="columns"
          :data-source="lineInfoDetail"
          :code="code"/>
      </div>
    </div>
  </hips-popup>
</template>

<script>
import { View, NavBar, Input, Popup } from "hips";

export default {
  modules: [ "smbl.common" ],
  name: "RectifyReportDetail",
  components: {
    [View.name]: View,
    [Input.name]: Input,
    [Popup.name]: Popup,
    [NavBar.name]: NavBar
  },
  props: {
    show: {
      type: Boolean,
    },
    lineInfoDetail: {
      type: Object,
    },
    columns: {
      type: Array,
    },
    title: {
      type: String,
      default: null,
    },
    code: {
      type: String,
    }
  },
  methods: {
    closePop() {
      this.$emit("input", false);
    },
  }
};
</script>

<style lang="stylus" scoped>
.orderLineDetail {
  height: 100%;
  position: relative;

  .header {
    font-size: 18px;
    line-height: 26px;
    font-weight: bold;
  }

  .right-button {
    margin-right: 8px;

    img {
      margin-right: 12px;
      height: 24px;
      width: 24px;
    }
  }

  .headInfo {
    padding: 16px 20px 12px 20px;
    border-bottom: solid 8px #F0F2F5;

    li {
      display: flex;
      margin-bottom: 8px;
      justify-content: space-between;

      span {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        display: inline-block;
        color: var(--color-font-default, #1b1e2b);
        line-height: 24px;

        &:nth-child(1) {
          // font-weight: 700;
        }
      }
    }

    &:last-child {
      margin-bottom: 0;
    }

    .lineNum {
      span {
        font-size: 16px;
        color: #C6CAD6;
      }
    }
  }

  .prequalification-detail {
    height: calc(100vh - 176px);
  }
}

.card-personalized {
  width: 100%;
  color: #666666;
  padding 12px 15px;
  background: var(--color-bg-default);

  .card-first-single {
    text-align: left;
    font-size: 14px;
    color: var(--color-font-default);
    font-weight: bold;
    line-height: 22px;
  }

  .card-first-between {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;

    .line-code {
      text-align: left;
      font-size: 16px;
      color: var(--color-font-default, #1b1e2b);
      font-weight: bold;
    }

    .line-num {
      font-size: 14px;
      color: #C6CAD6;
    }
  }
}
</style>
