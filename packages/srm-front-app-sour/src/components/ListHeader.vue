<script>
export default {
  name: "ListHeader",
  props: {
    showTitle: {
      type: Boolean,
      default: false
    },
    showMoreIcon: {
      type: Boolean,
      default: false
    }
  },
  render() {
    return (
      <div class="list-header">
        <span
          class="list-header-left"
          style={{
            fontWeight: this.showTitle ? "bold" : "normal",
            maxWidth: this.$slots.rightTag ? "60%" : "100%"
          }}>
          {this.$slots.default}
        </span>
        <span class="list-header-right">
          { this.$slots.rightTag }
          {this.showMoreIcon && <span class="srm-icon icon-chevron-right header-more-icon" />}
        </span>
      </div>
    );
  }
};
</script>

<style scoped lang="stylus">

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 20px;
  width: 100%;

  .list-header-left {
    max-width: 60%;
    text-align: left;
    font-size: 12px;
    line-height: 16px;
    color: var(--font-color-default);
    word-break: break-all;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .list-header-right {
    max-width: 40%;
    min-width: 50px;
    text-align: right;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    color: var(--font-color-default);
    word-break: break-all;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .header-more-icon {
    margin-left: 8px;
  }
}
</style>