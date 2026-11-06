<script>
export default {
  name: "ApprovalDetailHead",
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    dataSource: {
      type: Object,
      default: () => {
      }
    },
    customizeCode: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
      mColumns: [],
    };
  },
  watch: {
    columns: {
      handler: function (val) {
        this.mColumns = val.map((item) => {
          if (item.fieldName) {
            item.fieldType = "TEXT";
          } else {
            item.fieldType = "EMPTY";
          }
          return item;
        });
      },
      immediate: true,
    }
  },
  render() {
    return (
      <div class="approval-detail-head">
        <div class="approval-detail-head-info">
          <Customize
            data-source={this.dataSource}
            columns={this.mColumns}
            code={this.customizeCode}/>
        </div>
        {this.$slots.default && <div class="approval-detail-head-slot">{this.$slots.default}</div>}
      </div>
    );
  }
};
</script>

<style lang="stylus" scoped>

.approval-detail-head {
  width: 100%;
  height: auto;
  color: var(--font-color-white);
  background: var(--color-primary)
  overflow: hidden;
  padding: 16px 15px 0 15px;
}

.approval-detail-head-info {
  margin-bottom: 8px;

  >>> .customize-item {
    margin-bottom 4px!important;

    .customize-item-field, .srm-field-wrapper, .srm-text {
      font-size: 14px!important;
      text-align: left;
      color: var(--font-color-white)!important;
      margin-bottom: 0;
    }

    &:first-child {
      .customize-item-field, .srm-field-wrapper, .srm-text {
        font-size: 16px!important;
        font-weight: bold!important;
        line-height: 22px;
        margin-bottom: 0;
        color: var(--font-color-white)!important;
      }
    }
  }
  >>> .customize-item:last-child {
    margin-bottom: 0!important;
  }
}

.approval-detail-head-slot {
  display: flex;
  overflow: auto;
  align-items: center;
  padding-bottom: 15px;

  > div {
    display: flex;
  }

  >>> button {
    height: 24px;
    color: var(--font-color-white)!important;
    border-color: var(--font-color-white)!important;
    background-color: transparent;
  }
}

</style>
