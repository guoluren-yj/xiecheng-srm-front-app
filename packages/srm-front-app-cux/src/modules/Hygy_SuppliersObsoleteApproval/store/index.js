import { createGetter } from "@/store/utils";

let state = {
  item: null,
};

let mutations = {
  // eslint-disable-next-line no-shadow
  pushRouterParam: function (state, item) {
    state.item = item;
  }
};

export default {
  namespaced: true,
  state,
  getters: createGetter(state),
  mutations
};