<template>
  <div class="ai-check-result-panel">
    <srm-list
      :scrollable="false"
      height="auto"
      style="height: auto"
      :data-set="dataSet"
      :code="code"
      :columns="columns"/>
    <div v-if="showAll" class="load-more" @click="loadMore">
      {{ $T("hzero.common.view.message.loadMore").$D("加载更多") }}
    </div>
  </div>
</template>

<script>
export default {
  modules: [ "hzero.common", "smbl.checkRules" ],
  name: "AiCheckResult",
  props: {
    code: {
      type: String,
      default: "",
    },
    dataSet: {
      type: Object,
      default: () => {},
    },
    columns: {
      type: Array,
      default: () => [],
    },
    allList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showAll: false,
      loadDataList: [], // 当前加载的列表
    };
  },
  watch: {
    allList: {
      handler(newVal) {
        const ds = this.dataSet;
        if (ds && ds.records) {
          ds.records.forEach((r) => r.destroy && r.destroy());
          ds.records.splice(0, ds.records.length);
          ds.selected = [];
        }
        this.loadDataList = newVal.length > 5 ? newVal.slice(0, 5) : newVal;
        this.showAll = newVal.length > 5 && this.loadDataList.length === 5;
        ds.setData(this.loadDataList.map((item) => ({ ...item })));
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    loadMore() {
      // 先移除当前已有的数据，防止追加导致重复
      const ds = this.dataSet;
      if (ds && ds.records) {
        ds.records.forEach((r) => r.destroy && r.destroy());
        ds.records.splice(0, ds.records.length);
        ds.selected = [];
      }
      this.loadDataList = [ ...this.allList ];
      this.showAll = false;
      ds.setData(this.loadDataList.map((item) => ({ ...item })));
    },
  },
};
</script>

<style lang="stylus" scoped>
.load-more {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  font-size: 12px;
  color: #276EF1;
  line-height: 16px;
  font-weight: 500;
}
</style>
