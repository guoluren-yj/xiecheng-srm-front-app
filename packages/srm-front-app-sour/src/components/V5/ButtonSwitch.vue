<template>
  <div class="button-switch">
    <!-- <input type="checkbox" :id="uuid" v-model="checked" :disabled="disabled"  class="input"  /> -->
    <!-- <input type="checkbox" :id="uuid" :checked="!value" @input="input" :disabled="disabled"  class="input"  /> -->
    <input :id="uuid" type="checkbox" :checked="!Boolean(value)" :disabled="disabled" class="input" @input="input" >
    <label :for="uuid" :class="[disabled ? 'toggle disable-class': 'toggle']">
      <span class="left-btn btn">{{ btnArr[0] }}</span>
      <span class="right-btn btn">{{ btnArr[1] }}</span>
    </label>
  </div>
</template>

<script>
import uuid from "uuid";
export default {
  name: "ButttonSwitch",
  props: {
    value: {
      type: Boolean | Number,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    btnArr: {
      type: Array,
      default: () => [ "1", "2" ]
    },
    // 额外参数
    record: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      uuid: uuid(),
    };
  },
  methods: {
    input(e) {
      const value = e.target.checked;
      this.$emit("input", Number(!value));
      this.$emit("change", { value: !value, record: this.record });
    }
  }
};
</script>

<style lang="stylus" >

.button-switch {
    display inline-block;
    input {
        display none;
    }
    .toggle {
        display flex;
        position: relative;
        border-radius: 10px;
        background #EEEEEE;
        // padding 4px 8px;
        padding 2px;
        .btn {
            font-size 10px;
            line-height 12px;
            padding 4px 8px;

            color: #757575;
            margin-right: 8px;
            &:last-child {
                margin-right: 0;
            }
        }
        .left-btn {
            border-radius: 10px;
            background: #ffffff;
            color: #1f1f1f;
        }
    }
    input:checked + .toggle .right-btn {
      border-radius: 10px;
      background: #ffffff;
      color: #1f1f1f;
    }
    input:checked + .toggle .left-btn {
      border-radius: 0;
      background: none;
      color: #757575;
    }
}

</style>
