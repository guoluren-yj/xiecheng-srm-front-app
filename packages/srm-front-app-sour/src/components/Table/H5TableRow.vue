<template>
  <section class="table-row">
    <div
      v-for="(item, index) in columns"
      :key="'row' + index"
      :class="['table-row-column', index === 0 ? 'first-table-row-column' : '']"
      :style="{
        width: cellSize(item.width, rootValue),
        height: cellSize(height, rootValue),
        textAlign: item.align || 'center',
      }">
      <h5-table-cell
        :key="index"
        :item="item"
        :data-value="item.fieldCode ? dataItem.get(item.fieldCode) : ''"
        :renderer="item.render"
        :data-item="dataItem"/>
    </div>
  </section>
</template>
<script>
import H5TableCell from "./H5TableCell.vue";
import { pxtorem } from "./utils";

export default {
  name: "H5TableRow",
  components: {
    H5TableCell,
  },
  props: {
    dataItem: {
      type: Object,
      default: () => ({}),
    },
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
.table-row {
  display: flex;
  flex-wrap: nowrap;
}
.table-row-column {
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #f4f4f4;
}
.first-table-row-column {
  flex-grow: 0;
}

.cell {
  width: 100%;
  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;
}

.left {
  text-align: left;
}

.right {
  text-align: right;
}

.center {
  text-align: center;
}
</style>
