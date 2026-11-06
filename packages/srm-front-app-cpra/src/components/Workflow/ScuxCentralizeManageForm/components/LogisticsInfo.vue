<template>
  <div v-loading="loading" class="srm-logistics-content">
    <div v-if="actionData.length">
      <div v-for="(record, index) in recordList" :key="index">
        <div v-for="(item, idx) in showAll ? record : record.slice(0, 3)" :key="idx" class="srm-logistics-item">
          <div class="srm-logistics-item-content">
            <srm-tooltip :title="item.acceptStation">
              <div class="srm-logistics-item-remark" v-text="item.acceptStation"/>
            </srm-tooltip>
            <div class="srm-logistics-item-title">
              <span>{{ item.acceptTime }}</span>
            </div>
          </div>
        </div>
        <srm-button
          v-if="!showAll && record.length > 3" class="srm-item-expand" full-width plain
          @click="showAll = true">
          {{ $T("smbl.common.button.expendLogisticsInfo").$D("展开物流信息") }}
          <span class="srm-icon icon-chevrons-right"/>
        </srm-button>
        <srm-button
          v-if="showAll && record.length > 3" class="srm-item-expand" full-width plain
          @click="showAll = false">
          {{ $T("smbl.common.button.deExpendLogisticsInfo").$D("收起物流信息") }}
          <span class="srm-icon icon-chevrons-left"/>
        </srm-button>
      </div>
    </div>
    <no-content v-else :title="$T('smbl.common.message.data.none').$D('暂无数据')"/>
  </div>
</template>

<script>
import NoContent from "srm-mobile-ui/packages/srm-list/NoContent";

export default {
  modules: [ "smbl.common" ],
  name: "LogisticsInfo",
  components: { NoContent },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    actionData: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      showAll: false,
      recordList: [],
    };
  },
  watch: {
    actionData: {
      handler() {
        this.init();
      },
      immediate: true
    },
  },
  methods: {
    init() {
      this.recordList = this.actionData;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~srm-mobile-ui/src/style/var.styl"

.srm-logistics-content {
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 600;
  height 100%;
  min-height 200px;
}

.srm-logistics-item {
  padding 0 10px;
  display flex;
  .srm-logistics-item-content::before {
    content: '';
    position: absolute;
    left -3px;
    top 0;
    display block;
    width 6px;
    height 6px;
    border-radius 3px;
    background var(--font-color-disable);
    z-index 1;
  }
}

.srm-logistics-item:nth-child(1) {
  margin-top 16px;
  .srm-logistics-item-content::before {
    content: '';
    position: absolute;
    left -3px;
    top 0;
    display block;
    width 6px;
    height 6px;
    border-radius 3px;
    background var(--font-color-primary);
    z-index 1;
  }
}

.srm-logistics-item-content {
  position relative;
  flex: 1;
  border-left: 2px solid var(--split-line-color-primary);
  padding 0 0 22px 12px;
  width calc(100% - 64px)
}

.srm-logistics-item-title {
  text-align: left;
  color: #757575;
  line-height: 16px;
  overflow hidden;
  margin-top 2px;
  display: block;
  word-break break-all;
  text-overflow: ellipsis;
  width 100%;
  white-space:pre-wrap;
  span {
    font-size: 12px;
    transform: scale(0.8);
  }
}

.srm-logistics-item-remark {
  font-size: 12px;
  text-align: left;
  color: #757575;
  line-height: 16px;
  overflow hidden;
  margin-top -4px;
  display: block;
  word-break break-all;
  text-overflow: ellipsis;
  width 100%;
  white-space:pre-wrap;
}

.srm-item-expand {
  height 32px !important;
  border-top var(--split-line-color-primary) solid 1px;
  border-bottom var(--split-line-color-primary) solid 1px;
}

>>> .srm-field-wrapper-container {
  margin-top: 0 !important;
}

</style>
