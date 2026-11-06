const { createMutations, createGetter } = require("srm-front-app-core/script/store");

let state = {
  fieldConfigMap: null, //订单字段属性配置
};

export default {
  namespaced: true,
  state,
  // getters,
  // mutations,
  getters: createGetter(state),
  mutations: createMutations(state),
};
