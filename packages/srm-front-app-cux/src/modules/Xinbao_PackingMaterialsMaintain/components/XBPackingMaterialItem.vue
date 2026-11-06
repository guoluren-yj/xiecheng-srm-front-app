<template>
  <div class="material-item">
    <div class="item-num" :class="{'item-num-selected': isSelected}">
      {{ value.itemCode }}
    </div>
    <div class="item-specifications" :class="{'item-specifications-selected': isSelected}">
      {{ $T('smbl.common.mode.specifications').$D('规格') }}：{{ value.specifications }}
    </div>
    <div class="item-info">
      <srm-tag size="mid" type="primary" fill class="tag">
        {{ $T('smbl.common.model.name').$D('名称') }}：{{ value.itemName }}
      </srm-tag>
      <srm-tag size="mid" type="success" fill class="tag">
        {{ $T('smbl.common.mode.uomName').$D('单位') }}：{{ value.uomName }}
      </srm-tag>
    </div>
    <span v-if="isSelected" class="srm-icon icon-check" />
  </div>
</template>

<script>
export default {
  modules: [ "smbl.common" ],
  name: "XBPackingMaterialItem",
  props: {
    value: {
      type: Object,
      default: null,
    },
    isSelected: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {

    };
  },
  methods: {

  },

};
</script>

<style lang="stylus" scoped>
.material-item {
    width: 100%;
    position: relative;
    .icon-check {
      position: absolute;
      top: 6px;
      right: 4px;
      width: 16px;
      height: 16px;
      color: var(--font-color-primary);
      font-size: 16px;
    }

    .item-num {
        font-size: 16px;
        font-weight: bold;
        line-height: 22px;
        color: var(--font-color-default);
    }
    .item-num-selected {
        color: var(--font-color-primary);
    }

    .item-specifications {
        font-size: 14px;
        line-height: 20px;
        color: var(--font-color-second);
    }
    .item-specifications-selected {
        color: var(--font-color-primary);
    }

    .item-info {
        width: 100%;
        display: flex;
        align-items: center;
        margin-top: 4px;
        .tag {
          margin-right: 8px;
        }
    }
}
</style>
