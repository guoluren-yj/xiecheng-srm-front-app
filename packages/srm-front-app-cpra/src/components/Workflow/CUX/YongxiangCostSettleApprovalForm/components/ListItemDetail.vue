<!--
 * @Description: 表格行详情
 * @Date: 2022-04-28 01:16:27
 * @Author: JSS <shangshang.jing@gong-link.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2022, Hand
-->

<template>
  <div class="detail-popup-content">
    <srm-form class="detail-popup-top" :data-set="dataSet" :columns="getTopColumns" />
    <srm-form customize-type="detail" :data-set="dataSet" :columns="getBottomColumns" />
  </div>
</template>

<script>
import { take, drop } from "lodash";
export default {
  props: {
    dataSet: {
      type: Object,
      default: null,
    },
    takeLength: {
      type: Number,
      default: 2,
    },
  },
  computed: {
    getTopColumns() {
      return take(this.dataSet.fields, this.takeLength);
    },
    getBottomColumns() {
      return drop(this.dataSet.fields, this.takeLength);
    },
  },
};
</script>

<style lang="stylus" scoped>
.detail-popup-content {
  .detail-popup-top {
    min-height: 0;
    border-bottom: 8px solid var(--background-color-empty-second);
    /deep/ .customize {
       font-weight: 600 !important;
    }
  }
}
</style>