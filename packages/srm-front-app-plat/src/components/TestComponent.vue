<template>
  <div>
    ${{ tip }}
  </div>
</template>

<script>

export default {
  name: "TestComponent",
  modules: [ "smbl.common" ],
  data() {
    return {
      tip:"just test"
    };
  },
  computed: {
  },
  async beforeMount() {
  },
  methods: {
  }
};
</script>

<style lang="stylus" scoped>
</style>
