<template>
  <div
    ref="titleRef"
    class="title">
    <div
      v-for="(item, index) in columns"
      :key="'title' + index"
      :class="['table-row-column', index === 0 ? 'first-table-row-column' : '']"
      :style="{
        width: cellSize(item.width, rootValue),
        height: cellSize(height, rootValue),
        textAlign: item.align || 'center',
      }">
      <h5-table-cell
        :key="index"
        :item="item"
        :data-value="item.fieldName"/>
    </div>
  </div>
</template>

<script>
import H5TableCell from "./H5TableCell.vue";
import { pxtorem } from "./utils";

export default {
  name: "H5TableHeader",
  components: {
    H5TableCell,
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    height: {
      type: Number,
      default: 60,
    },
    rootValue: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      cellSize: pxtorem,
    };
  },
};
</script>

<style lang="stylus" scoped>
.title {
  display: flex;
  font-weight: 600;

  .table-row-column {
    position: relative;
    flex-grow: 1;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #eee;

    >>>.srmPopovers .tipImag {
      background: transparent;
    }
    >>>.srmPopovers .top {
      background: none;
    }
  }

  .first-table-row-column {
    flex-grow: 0;
  }
}
</style>
