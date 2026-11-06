<template>
  <div>
    <div v-if="dynamicResults && dynamicResults.length">
      <div class="risk-scan-result-panel">
        <div
          v-for="(item, index) in dynamicResults"
          :key="index"
          :style="{
            margin: '10px',
            marginRight: index % 2 === 0 ? '5px' : '10px',
            padding: '10px',
            background: '#F7F8FA',
            borderRadius: '2px',
            display: 'inline-block',
            flex: '1 1 45%',
            maxWidth: '46%',
          }">
          <div style="color: #333;font-size: 16px;font-weight: 600;line-height: 18px;">{{ item.count || 0 }}</div>
          <div style="color: #868D9C;font-size: 12px;font-weight: 400;line-height: 16px;">{{ item.title }}</div>
        </div>
      </div>
    </div>

    <div v-else style="color: #1d2129; text-align: center; line-height: 48px;">
      {{ $T('hzero.common.message.data.none').$D("暂无数据") }}
    </div>
  </div>
</template>

<script>
export default {
  modules: [ "hzero.common" ],
  name: "RiskScanResult",
  props: {
    results: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dynamicResults: [],
    };
  },
  watch: {
    results: {
      handler(newArr) {
        this.dynamicResults = newArr.filter((rcd) => rcd.count && rcd.count !== 0);
      },
      deep: true // 深度监听数组变化
    }
  },
};
</script>

<style lang="stylus" scoped>
.risk-scan-result-panel {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
}
</style>
