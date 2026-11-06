<template>
  <div ref="navWrap" class="navWrap">
    <ul class="navContent">
      <li
        v-for="(item, index) in navArr"
        :key="index"
        :class="{ active: activeKey === index }"
        @click="changeNav(index)">
        {{ item.title }}
        <i v-show="item.haveTip||false">({{ item.tipVal||'' }})</i>
        <img
          v-show="activeKey === index && dropImg"
          class="navwrap-img"
          src="@/assets/Comp/icon_12px_fill_down_black@3x.png">
        <img
          v-show="activeKey === index && !dropImg"
          class="navwrap-img"
          src="@/assets/Comp/icon_12px_fill_top_black@3x.png">
        <img
          v-show="activeKey !== index"
          class="navwrap-img"
          src="@/assets/Comp/icon_12px_fill_down_gray@3x.png">
      </li>
    </ul>
    <slot/>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  props: {
    navArr: {
      type: Array,
      default: () => [],
    },
    activeKey: {
      type: Number,
      default: 0,
    },
    dropImg:{
      type:Boolean,
      default:false
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
      for (let i = 1; i < this.navArr.length; i++) {
        arr.push(i);
      }
      if (arr.includes(nVal)) {
        this.offsetX = 90 * (nVal - 1);
      } else {
        this.offsetX = 0;
      }
      this.navScroll.scrollTo(-this.offsetX, 0, 200, "bounce");
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.navScroll = new BScroll(this.$refs.navWrap, {
        scrollX: true,
        click: true,
      });
    });
  },
  methods: {
    changeNav(index) {
      console.log(index);
      if (index == this.activeKey) {
        this.$emit("DropNavTab", index);
      } else {
        this.$emit("changeNavTab", index);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.navWrap {
  width: 100vw;
  height: 44px;
  overflow: hidden;
  background: #ffffff;
  z-index: 999;
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
      color: #afafaf;
      line-height: 20px;
      text-align: center;
      position: relative;
      margin-left: 20px;
      white-space: nowrap;

      &.active {
        font-weight: bold;
        color: var(--color-font-default);
      }

      // &.active::before {
      //   content: '';
      //   left: 0;
      //   bottom: -10px;
      //   width: 100%;
      //   height: 2px;
      //   position: absolute;
      //   background-color: var(--color-other-default-b);
      // }

      .navwrap-img{
        width 12px
        height 12px
        position relative
        top 2px
      }

      .drop-nav-tip{
        background #EC0C0C
        border-radius 50%
        position absolute
        right 8px
      }
    }
  }
}
</style>