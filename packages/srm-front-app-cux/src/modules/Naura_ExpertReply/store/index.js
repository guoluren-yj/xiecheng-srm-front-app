import { createGetter, createMutations } from "@/store/utils";

let state = {
  expertRatingList: {},
  expertRatingOperates: "",
  tenderHallList: {},
};

export default {
  namespaced: true,
  state,
  getters: createGetter(state),
  mutations: createMutations(state),
};