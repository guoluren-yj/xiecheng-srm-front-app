const { createMutations, createGetter } = require("srm-front-app-core/script/store");

let state = {
  batchData: []
};

export default {
  namespaced: true,
  state,
  getters: createGetter(state),
  mutations: createMutations(state),
};
