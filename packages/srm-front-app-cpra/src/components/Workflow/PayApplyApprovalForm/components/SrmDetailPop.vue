<template>
  <srm-popup :visible="visible" :title="popTitle" height="calc(100vh - 20px)" rounded @onClose="closePop">
    <!-- 导航 -->
    <div ref="content" class="srm-detailpop-wrap">
      <!-- 内容区 -->
      <div class="srm-detailpop-context">
        <customize-detail :columns="columns" :data-source="dataSource" code="popCustomizeCode"/>
      </div>
    </div>
  </srm-popup>
</template>

<script>

import { $T } from "srm-mobile-ui";
import { Popup } from "hips";

/**
 * SrmDetailPop 详情页弹窗组件
 * @author ZLH
 * @date 2021-02-26
 * @version 1.0
 *
 * visible: 控制pop显示
 * popTitle:Pop标题名称
 * popCustomizeCode：Pop个性化编码
 * dataSource：数据源
 * columns：个性化字段排版
 */
export default {
  modules: [ "smbl.common" ],
  name: "SrmDetailPop",
  components: {
    [Popup.name]: Popup,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    popTitle: {
      type: String,
      default: $T("smbl.common.message.detailInfo").$D("明细信息详情")
    },
    popCustomizeCode: {
      type: String,
      default: ""
    },
    dataSource: {
      type: Object,
      default: () => {
      }
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      height: "height: calc(100vh - 120px)",
      noHeadHeight: "height: calc(100vh - 66px)",
    };
  },
  watch: {
    // visible(val) {
    //   this.$emit("update:visible", val);
    // }
  },
  methods: {
    closePop() {
      this.$emit("update:visible", false);
    }
  },
};
</script>

<style lang="stylus" scoped>

.srm-detailpop-wrap {
  width: 100%;
  height calc(100vh - 44px);
  overflow-y: auto;

  .srm-detailpop-context {
    width: 100%;
    color: #666666;
    padding 12px 15px;
    background: var(--color-bg-default);
  }
}

</style>
