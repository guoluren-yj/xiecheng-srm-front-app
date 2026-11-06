<template>
  <div ref="itemButtonScroll" class="item-button-scroll" @touchmove.stop>
    <srm-flex
      justify="start"
      direction="row-reverse"
      align="end"
      class="item-button-container">
      <srm-button
        v-for="(button, index) in (buttons || [])"
        :key="index"
        class="item-button"
        :bordered="index !== 0"
        :fill="index === 0"
        @click="() => {
          button.action(button.data);
        }">
        {{ button.title }}
      </srm-button>
    </srm-flex>
  </div>
</template>

<script>
export default {
  name: "PaymentRecordItemButtons",
  props: {
    buttons: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
    };
  },
  watch: {
    buttons() {
      let positionX = this.$refs.itemButtonScroll.scrollWidth - this.$refs.itemButtonScroll.clientWidth;
      if (positionX < 0) {
        positionX = 0;
      }
      this.$nextTick(() => {
        this.$refs.itemButtonScroll.scrollTo(positionX, 0);
      });
    },
  },
  methods: {
  }
};
</script>

<style lang="stylus" scoped>
.item-button-scroll {
  width: 100%;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  // display: flex;
  // flex-direction: row-reverse;
}
.item-button-container {
  // height: 26px;
  // border-top: 1px solid var(--split-line-color-primary);
  width: max-content;
  min-width: 100%;

  .item-button {
    margin-left: 8px;
    flex-shrink: 0;
  }
}
</style>