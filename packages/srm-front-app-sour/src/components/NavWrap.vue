<template>
  <div ref="navWrap" class="navWrap">
    <ul class="navContent">
      <template v-for="(item,index) in navArr">
        <li
          v-if="item"
          :key="index"
          :class="{'active': activeKey === index}"
          @click="changeNav(index)">
          {{ item.title }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script>

import BScroll from "better-scroll";
export default {
  props: {
    navArr: {
      type: Array,
      default: () => []
    },
    activeKey:{
      type:Number,
      default:0
    }
  },
  data() {
    return {
      navScroll: null,
    };
  },
  watch: {
    activeKey(nVal) {
      const arr = [];
      for (let i = 1; i < 12; i++) {
        arr.push(i);
      }
      if (arr.includes(nVal)) {
        this.offsetX = 90 * (nVal - 1);
      } else {
        this.offsetX = 0;
      }
      this.navScroll.scrollTo(-this.offsetX, 0, 200, "bounce");
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log(99999999);
      this.navScroll = new BScroll(this.$refs.navWrap, {
        scrollX: true,
        click: true
      });
    });
  },
  methods: {
    changeNav(index) {
      console.log(index);
      this.$emit("changeNavTab", index);
    }
  }
};
</script>

<style lang="stylus" scoped>

    .navWrap {
      width: 100vw;
      height: 44px;
      overflow: hidden;
      position: sticky;
      background #ffffff;
      z-index: 999;
    // 吸顶
      position: sticky;
      top: 0;
      background: var(--color-bg-default);

      .navContent {
        // width: 150%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        li {
          font-size: 14px;
          font-family: PingFangSC-Regular;
          color: var(--color-font-default-b);
          line-height: 20px;
          text-align: center;
          position: relative;
          margin-left: 20px;

          &.active {
            font-weight bold
            color:var(--color-font-default);
          }

          &.active::before {
            content: '';
            left: 0;
            bottom: -10px;
            width: 100%;
            height: 2px;
            position: absolute;
            background-color: var(--color-other-default-b);
          }
        }
      }
    }
</style>
