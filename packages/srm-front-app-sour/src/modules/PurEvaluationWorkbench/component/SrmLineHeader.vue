<script>

export default {
  name: "SrmLineHeader",
  inject: {
    srmList: {
      default: null
    },
  },
  props: {
    showOpenTag: {
      type: Boolean,
      default: true,
    },
    defaultShowCheckbox: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    showCheckbox() {
      if (!this.srmList) {
        return this.defaultShowCheckbox;
      }
      return this.srmList.dataSet.editFlag;
    },
    mShowOpenTag() {
      if (this.srmList) {
        return !this.srmList.dataSet.editFlag && this.showOpenTag;
      }
      return this.showOpenTag;
    }
  },
  render() {
    return <div class={[ "srm-list-item-card-head", { "open-tag": this.mShowOpenTag } ]}>
      <span
        class="srm-list-item-card-head-left"
        style={{
          transform: this.showCheckbox ? "translateX(27px)" : "translateX(0)",
          maxWidth: this.$slots.right ? "80%" : "100%",
        }}>
        {this.$slots.default}
      </span>
      <span class="srm-list-item-card-head-right">
        {this.$slots.right}
      </span>
    </div>;
  }
};
</script>

<style scoped lang="stylus">
.open-tag {
  position: relative;

  &::before {
    content: "";
    width: 1.867vw;
    height: 2.667vw;
    background: var(--color-primary)
    position: absolute;
    left: -4vw;
    top: 50%;
    transform: translateY(-50%);
  }
}

.srm-list-item-card-head {
  display: flex;
  align-items center;
  justify-content: space-between;
  line-height: 20px;
  width 100%;

  .srm-list-item-card-head-left {
    max-width 60%;
    transition transform .3s ease;
    text-align: left;
    font-size: 14px;
    color: var(--font-color-default);
    font-weight: 600;
    word-break: break-all;
    overflow: hidden;
    {/* white-space nowrap; */}
    text-overflow ellipsis;
  }

  .srm-list-item-card-head-right {
    max-width 40%;
    min-width 50px;
    text-align: right;
    font-weight: bold;
    height: 20px;
    line-height: 20px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color var(--font-color-primary);
    word-break: break-all;
    overflow: hidden;
    white-space nowrap;
    text-overflow ellipsis;
    display flex;
    align-items center;
    justify-content: flex-end;
  }
}

</style>
