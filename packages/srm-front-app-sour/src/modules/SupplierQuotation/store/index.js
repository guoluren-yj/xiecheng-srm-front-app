/*
 * @Author: your name
 * @Date: 2019-11-07 19:57:14
 * @LastEditTime: 2019-12-10 19:37:12
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \srm-mobile-spuc\src\modules\SupplierQuotation\store\index.js
 */
const { createMutations, createGetter } = require("srm-front-app-core/script/store");

let state = {};

export default {
  namespaced: true,
  state,
  getters: createGetter(state),
  mutations: createMutations(state),
};
