<template>
  <div v-loading="loading">
    <section class="table-header">
      <div
        :class="['fixed-title-mark', transformX < 0 ? 'shadow-show' : '']"
        :style="{
          width: handleCellSize(firstColumn.width),
          height: handleCellSize(headerHeight),
        }">
        <h5-table-cell
          :key="Math.random()"
          :item="firstColumn"
          :data-value="firstColumn.fieldName"/>
      </div>
      <div
        v-show="moreMark"
        class="fixed-title-more"
        :style="{
          height: handleCellSize(headerHeight),
        }"
        @click="showMoreMarkField">
        <div class="mark" />
      </div>
      <h5-table-header
        ref="tableContainerRef"
        :columns="columns"
        :class="['title-header']"
        :height="headerHeight"
        :root-value="rootValue"/>
    </section>
    <div
      ref="tableRef"
      class="table"
      :style="{
        height: handleCellSize(tableHeight),
      }">
      <section
        :class="['first-column', transformX < 0 ? 'shadow-show' : '']"
        :style="{
          width: handleCellSize(firstColumn.width),
        }">
        <div
          v-for="(item, index) in dataSet.records"
          :key="index"
          :class="['table-row-column', 'first-table-row-column']"
          :style="{
            width: handleCellSize(firstColumn.width),
            height: handleCellSize(rowHeight),
          }">
          <h5-table-cell
            :key="index"
            :item="firstColumn"
            :data-value="
              firstColumn.fieldCode ? item.get(firstColumn.fieldCode) : ''
            "
            :data-item="item"/>
        </div>
      </section>
      <section
        id="table-content"
        class="table-content">
        <h5-table-row
          v-for="(item, index) in dataSet.records"
          :key="index"
          :data-item="item"
          :columns="columns"
          :height="rowHeight"
          :root-value="rootValue"/>
      </section>
      <section
        class="loading"
        @click="loadingMore">
        {{ loadingText }}
      </section>
    </div>
  </div>
</template>
<script>
import { debounce } from "lodash";

import { copyPropertiesIgnoreExists, pxtorem } from "./utils/index";
import H5TableCell from "./H5TableCell.vue";
import H5TableHeader from "./H5TableHeader.vue";
import H5TableRow from "./H5TableRow.vue";

export default {
  name: "H5Table",
  modules: [ "hipspfm.common" ],
  components: {
    H5TableCell,
    H5TableHeader,
    H5TableRow,
  },
  props: {
    minTableHeight: {
      type: Number,
      default: 600,
    }, //表格最小高度
    rowNum: {
      type: Number,
      default: 6,
    }, // 表格显示几行
    headerHeight: {
      type: Number,
      default: 75,
    }, // 头部默认高度
    rowHeight: {
      type: Number,
      default: 60,
    }, //每行数据的默认高度
    dataSet: {
      type: Object,
      default: () => ({})
    },
    columns: {
      type: Array,
      default: () => []
    },
    fixedHeader: {
      type: Boolean,
      default: true,
    }, // 是否固定表头
    offset: {
      type: Number,
      default: 10,
    }, //触发加载的底部距离
    rootValue: {
      type: Number,
      default: 30,
    },
  },
  data() {
    return {
      loading: false,
      error: false,
      tableHeight: 500,
      tableWidth: 0,
      tableContent: 0,
      tableRef: null,
      tableContainerRef: null,
      tableContentEL: null,
      moreMark: false,
      distanX: 0,
      distanY: 0,
      previousX: 0,
      transformX: 0,
      realRowHeight: 100,
      isMounted: false,
      pagination: { page: 0, size: 10 },
      handleCellSize: (x, rootV) => pxtorem(x, rootV || this.rootValue),
      start: {
        x: 0,
        y: 0,
      },
      end: {
        x: 0,
        y: 0,
      },
    };
  },
  computed: {
    loadingText() {
      let str = "";
      if (this.loading) {
        str = this.$T("hipspfm.common.view.message.title.loading").$D("加载中...");
      }
      if (!this.dataSet.hasMore && !this.loading) {
        str = this.$T("hipspfm.common.view.message.title.toEnd").$D("到底了");
      }
      if (this.error) {
        str = this.$T("hipspfm.common.view.message.title.error").$D("出错了");
      }
      if (this.dataSet.isReady() && !this.dataSet.records.length) {
        str = this.$T("hipspfm.common.view.message.title.noData").$D("暂无数据");
      }
      return str;
    },
    firstColumn() {
      return this.columns[0];
    }
  },
  watch: {
    // "dataSet.records.length"() {
    //   this.updateTableHeight();
    // },
    // rowNum() {
    //   this.updateTableHeight();
    // },
  },
  beforeMount() {
    this.initColumns();
    this.loading = true;
    this.dataSet.query().then(() => {
      this.loading = false;
    }).catch(() => {
      this.error = true;
    });
  },
  mounted() {
    this.handleBottom();
    this.tableRef = this.$refs.tableRef;
    this.tableContainerRef = this.$refs.tableContainerRef;
    this.tableContentEL = document.querySelector("#table-content");
    this.calculateTableContent();
    this.calculateTableWidth();
    this.calculateRealRowHeight();
    this.tableRef.addEventListener("touchstart", this.startHandle, {
      passive: false,
    });
    this.tableRef.addEventListener("touchmove", this.moveHandle, {
      passive: false,
    });
    this.tableRef.addEventListener("touchend", this.endHandle, {
      passive: false,
    });
    this.tableRef.addEventListener("scroll", this.handelScrollBase, {
      passive: false,
    });
    window.addEventListener("resize", this.calculateTableContent);
    window.addEventListener("resize", this.calculateTableWidth);
    window.addEventListener("resize", this.calculateRealRowHeight);
    window.addEventListener("resize", this.resetMove);
  },
  beforeDestroy() {
    if (this.tableRef) {
      let targetDom = this.tableRef;
      targetDom.removeEventListener("touchstart", this.startHandle, {
        passive: false,
      });
      targetDom.removeEventListener("touchmove", this.moveHandle, {
        passive: false,
      });
      targetDom.removeEventListener("touchend", this.endHandle, {
        passive: false,
      });
      targetDom.removeEventListener("scroll", this.handelScrollBase);
      window.removeEventListener("resize", this.calculateTableContent);
      window.removeEventListener("resize", this.calculateTableWidth);
      window.removeEventListener("resize", this.calculateRealRowHeight);
      window.removeEventListener("resize", this.resetMove);
    }
  },
  methods: {
    initColumns() {
      //初始化columns
      if (this.columns) {
        this.columns.forEach((col) => {
          if (col && col.fieldCode) {
            const fields = this.dataSet.fields.filter((e) => e.fieldCode === col.fieldCode);

            if (fields && fields.length) {
              copyPropertiesIgnoreExists(col, fields[0]);
            }
          }
        });
      }
    },
    handelScrollBase() {
      if (this.distanY <= 0) {
        this.handleBottom();
      }
    },
    resetMove() {
      this.previousX = 0;
      this.transformX = 0;
      this.handleTransform(0);
    },
    handleBottom() {
      if (this.tableRef) {
        if (
          this.tableRef.scrollHeight - this.tableRef.scrollTop <
          this.tableRef.clientHeight + this.offset
        ) {
          this.loadingMore();
        }
      }
    },
    loadingMore() {
      if (!this.loading && this.dataSet.hasMore) {
        this.loading = true;
        this.pagination.page = this.pagination.page + 1;
        this.dataSet.setQueryParameter({ ...this.dataSet.queryParameter, ...this.pagination });
        this.dataSet.query().then(() => {
          this.loading = false;
        }).catch(() => {
          this.error = true;
        });
      }
    },
    handleTouchBottom(distanceX) {
      if (this.tableRef) {
        let temp = this.tableContent - (this.tableRef.clientWidth - distanceX);
        if (temp >= 0 && temp < 10) {
          this.moreMark = false;
        } else {
          this.moreMark = true;
        }
      }
    },
    handleTransform(val) {
      if (this.tableContainerRef.$refs.titleRef) {
        let dom = this.tableContainerRef.$refs.titleRef;
        dom.style.transform = `translateX(${val}px)`;
      }
      if (this.tableContentEL) {
        let dom = this.tableContentEL;
        dom.style.transform = `translateX(${val}px)`;
      }
      if (!this.showMoreMark) {
        this.showMoreMark = debounce(this.handleTouchBottom, 200, { trailing: true });
      }
      this.showMoreMark(val);
    },
    touchend() {
      this.previousX = this.transformX;
      this.distanX = 0;
      this.distanY = 0;
    },
    touchmove(event, direction) {
      if (direction) {
        event.cancelable && event.preventDefault();
        const max = this.tableContent - this.tableWidth;
        // 只有表格内容超过了 表格外部 才让拖动
        if (max > 0) {
          const temp = Math.min(this.previousX + this.distanX, 0);
          const res = Math.max(-max, temp);
          this.transformX = res;
          this.handleTransform(this.transformX);
        }
      }
      if (this.tableRef?.scrollTop !== 0) {
        event.stopPropagation();
      }
    },
    startHandle(e) {
      let touch = e.touches[0];
      if (touch) {
        this.start.x = touch.pageX;
        this.start.y = touch.pageY;
      }
    },
    getAngle(x, y) {
      return Math.atan2(y, x) * 180 / Math.PI;
    },
    getTouchDirection(x, y) {
      if (Math.abs(x) > 5) {
        let angle = this.getAngle(x, y);
        if (angle >= -45 && angle <= 45) {
          // 向右
          return "right";
        } else if (
          angle >= 135 && angle <= 180 ||
          angle >= -180 && angle < -135
        ) {
          // 向左
          return "left";
        }
      } else {
        return "";
      }
    },
    moveHandle(e) {
      let touch = e.touches[0];
      if (touch) {
        this.$set(this.end, "x", touch.pageX);
        this.$set(this.end, "y", touch.pageY);
        let direction = this.getTouchDirection(this.end.x - this.start.x, this.end.y - this.start.y);
        this.distanX = this.end.x - this.start.x;
        this.distanY = this.end.y - this.start.y;
        this.touchmove(e, direction);
      }
    },
    endHandle(e) {
      let touch = e.changedTouches[0];
      if (touch) {
        this.end.x = touch.pageX;
        this.end.y = touch.pageY;
        this.touchend(e);
      }
    },
    calculateTableContent() {
      if (
        this.tableContainerRef &&
        this.tableContainerRef.$refs.titleRef
      ) {
        let rem = Number(
          document.documentElement.style.fontSize.replace("px", "")
        ) || 16;
        let children =
          this.tableContainerRef.$refs.titleRef.children;
        if (children.length > 0) {
          // 是否显示更多的标识
          let count = 0;
          this.columns.forEach((item) => {
            count += item.width || 200;
          });
          this.tableContent = count / this.rootValue * rem;
          this.moreMark = count / this.rootValue * rem > window.screen.width;
        }
      }
    },
    calculateTableWidth() {
      if (this.tableRef) {
        this.tableWidth = this.tableRef.clientWidth;
      }
    },
    calculateRealRowHeight() {
      const rem = Number(
        document.documentElement.style.fontSize.replace("px", "")
      ) || 16;
      this.realRowHeight = this.rowHeight / this.rootValue * rem;
    },
    updateTableHeight() {
      if (this.dataSet?.records?.length >= this.rowNum) {
        this.tableHeight = Math.max(
          this.rowHeight * this.rowNum,
          this.minTableHeight
        );
      }
    },
    showMoreMarkField() {
      const max = this.tableContent - this.tableWidth;
      // 只有表格内容超过了 表格外部 才让拖动
      if (max > 0) {
        this.transformX -= 10;
        this.handleTransform(this.transformX);
      }
    }
  },
};
</script>
<style lang="stylus" scoped>
.table {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.fixedHeader {
  // position: fixed;
  z-index: 2;
  min-width: 100%;
}

.table-header {
  position: relative;
  overflow: hidden;
}

.fixed-title-mark {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
  background-color: #eee;
  font-weight: 600;
}

.first-column {
  position: absolute;
  top: 0;
  z-index: 1;
  background-color: #fff;

  .table-row-column {
    flex-grow: 1;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #f4f4f4;
  }

  .cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.shadow-show {
  box-shadow: 2px 0 4px -2px rgba(0, 0, 0, 0.2);
}

.loading {
  text-align: center;
  height: 50px;
  line-height: 50px;
}

.fixed-title-more {
  position: absolute;
  right: 0;
  width: 60px;
  z-index: 3;
  background-color: #eee;

  .mark {
    position: absolute;
    height: 10px;
    width: 10px;
    // background-color: transparent; /* 模块背景为透明 */
    border-color: #999;
    border-style: solid;
    border-width: 3px 3px 0 0;
    top: 30%;
    left: 30%;
    transform: rotate(45deg); /* 箭头方向可以自由切换角度 */
  }
}
</style>
