<template>
  <div>
    <div class="bottom-status">
      <span
        v-for="(item, key) in li.processList.children || []"
        :key="key"
        :class="{ active: key < li.processList.lineSeq }">
        <i>{{ key + 1 }}</i>
        {{ item.nodeConfigName }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressList",
  props: {
    li: {
      type: Object | Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="stylus" scoped></style>
