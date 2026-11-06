<template>
  <srm-popup :visible="value" :title="title" @onClose="$emit('input', false)">
    <div v-if="list.length" class="srm-select" >
      <div v-for="(item,index) in list" :key="index" :class="choseDataIndex.includes(index) ? 'srm-select-item active' : 'srm-select-item'" @click="choseItem(index)">
        <span class="srm-select-item-tit">{{ item[displayField] }}</span>
        <span class="srm-icon icon-check srm-select-item-icon" />
      </div>
    </div>
    <!-- 空白页 -->
    <no-content v-else :title="'hipspfm.common.message.noScreenResults'" img-src="NoResult@3x.png"/>
    <!-- 底部确认 -->
    <div class="srm-select-wrapper">
      <span
        class="srm-select-msg-info">{{
          multiple ? $T("hipspfm.common.validation.multiple").$D("该选择为多选") : $T("hipspfm.common.validation.single").$D("该选择为单选")
        }}</span>
      <srm-button fill size="mid" @click="submitValue">
        {{
          $T("hipspfm.common.validation.confirmSelect").$D("确认选择")
        }}
      </srm-button>
    </div>
  </srm-popup>
</template>

<script>
import NoContent from "@/components/NoContent";

export default {
  modules: [ "hipspfm.common" ],
  name: "SrmSelect",
  components: {
    NoContent,
  },
  inject: {
    multiple: {
      type: Boolean,
      default: false,
    },
    displayField: {
      type: String,
      default: "",
    },
    valueField: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    mDisplay: {
      type: Array,
      default: () => [],
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      choseData: [],
      choseDataIndex: [],
    };
  },
  watch: {
    value(val) {
      if (val && !this.mDisplay.length) {
        this.choseData = [];
        this.choseDataIndex = [];
      }
    }
  },
  methods: {
    choseItem(index) {
      this.choseDataIndex = [ index ];
      this.choseData = this.list.filter((v, i) => this.choseDataIndex.includes(i));
    },
    submitValue() {
      this.$emit("input", false);
      this.$emit("submitValue", this.choseData);
    }
  }
};
</script>

<style lang="stylus" scoped>

.srm-select {
  height: calc(100% - 48px);
  overflow: auto;
  padding-left: 15px;
  .srm-select-item {
    padding: 16px 15px 16px 0;
    border-bottom: 1px solid  #F6F6F6;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &.active {
      color: #276EF1;
      .srm-icon {
        font-size: 16px;
      }
    }
    .srm-select-item-tit, .srm-select-item-icon {
      font-size: 16px;
      line-height: 22px;
    }
    .srm-select-item-icon {
      font-size: 0;
    }
  }
}

.srm-select-wrapper {
  background white;
  padding 10px;
  z-index 9999;
  width 100%;
  position fixed;
  bottom 0;
  display flex;
  justify-content space-between;
  align-items center;
}

.srm-select-msg-info {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: var(--color-font-default-e);
  letter-spacing: 0;
  line-height: 24px;
  border-right: none;
  text-align: left;
  height: auto;
}

</style>
