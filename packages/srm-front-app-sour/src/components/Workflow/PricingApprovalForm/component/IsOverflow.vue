<template>
  <span>
    <span ref="title"> <slot name="title" /></span>
    <slot v-if="visible" name="tooltip" />
  </span>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
    };
  },
  mounted() {
    const element = this?.$refs?.title.children[0];
    if (element.scrollWidth > element.clientWidth) {
      this.visible = true;
    }
  }
};
</script>

