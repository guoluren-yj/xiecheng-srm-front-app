<script>
export default {
  name: "H5TableCell",
  props: {
    renderer: Function, // 自定义渲染函数
    dataItem: {
      type: Object,
      default: () => ({}),
    }, // 任意类型的数据项
    item: {
      type: Object,
      default: () => ({}),
    },
    dataValue: {
      type: String | Number,
      required: true // 必须提供的值
    },
    slotKey: String, // 插槽的键
    slots: {
      type: Object,
      default: () => ({}) // 提供一个空的默认插槽对象
    }
  },
  render() {
    const align = this.item.align;
    // 插槽优先级最高
    if (this.slots && this.slotKey && this.slots[this.slotKey]) {
      return this.slots[this.slotKey](this.dataItem);
    }
    if (this.renderer) {
      return <srm-text-field align={align}>{this.renderer(this.dataValue, this.dataItem.data)}</srm-text-field>;
    }
    // 默认value
    return <srm-text-field align={align}> { this.dataValue || "-" } </srm-text-field>;
  }
};
</script>

<style lang="stylus" scoped>
.cell {
}

.has-slot {
/* 带有插槽的单元格样式 */
}
</style>
