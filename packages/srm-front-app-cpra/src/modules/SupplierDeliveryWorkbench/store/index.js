const { createMutations, createGetter } = require("srm-front-app-core/script/store");

let state = {
  tabPosition: "create",
  detailFlag: false, // 判断当前页面是否是由明细退出到列表
  nodeTemplateCode: null,
};

export default {
  namespaced: true,
  state,
  getters: createGetter(state),
  mutations: createMutations(state),
};
