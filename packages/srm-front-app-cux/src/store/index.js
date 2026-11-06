import Vue from "vue";
import Vuex from "vuex";
import uuid from "uuid";
let dynamicModules = [];

try {
  dynamicModules = require("vue-dynamic-modules");
} catch (err) {
  console.log(err);
}

let modules = {};

if (process.env.VUE_APP_BUILD === "dev") {

  if (process.env.VUE_APP_TARGET === "module") {
    // 单模块构建
    // eslint-disable-next-line no-unused-vars
    for (const curModule of dynamicModules) {
      curModule && curModule.id.includes("store") && curModule.keys().map((key) => {
        // 添加store
        const name = curModule.id.match(/modules\/(\S*)\/store/)[1];

        modules[name] = curModule(key).default;
      });
    }
  } else {
    // 全模块构建
    //获取标准子应用目录
    const modulesDirNameArr = require.context("../modules", true, /^\.\/\w*\/store\/index\.js$/);
    let standDirNameArr = [];

    modulesDirNameArr.keys().forEach((key) => {
      standDirNameArr.push(key.substring(key.indexOf("./") + 1, key.indexOf("/store")));
    });
    //获取二开子应用目录
    const modulesCuxDirNameArr = require.context("../modules/CUX", true, /^\.\/\w*\/store\/index\.js$/);
    let cuxDirNameArr = [];

    modulesCuxDirNameArr.keys().forEach((key) => {
      cuxDirNameArr.push("/CUX" + key.substring(key.indexOf("./") + 1, key.indexOf("/store")));
    });

    //所有完成相对modules路径
    const allArr = standDirNameArr.concat(cuxDirNameArr);

    allArr.forEach((item) => {
      let currentItem = item.replace(/\//g, "");

      modules[currentItem] = require(`@/modules${item}/store`).default;
    });
  }
} else {
  let moduleName = process.env.VUE_APP_TARGET;
  let currentItem = moduleName.replace(/\//g, "");

  modules[currentItem] = require(`@/modules/${moduleName}/store`).default;
}

Vue.use(Vuex);

let store = new Vuex.Store({
  modules,
  state: {
    routerHistory: [],
    // eslint-disable-next-line no-void
    userInfo: void 0,
    // eslint-disable-next-line no-void
    allSystemUser: void 0,
    // eslint-disable-next-line no-void
    locationSearch: void 0,
    expertRatingList: {},
    expertRatingOperates: "",
    tenderHallList: {},
    budgetItem: {},
    budgetItemChildren: {},
    customizeConfigData: {}, //个性化信息
    tabChangeFlag:0
  },
  getters: {
    getRouterHistory: (state) => state.routerHistory,
    getUserInfo: (state) => state.userInfo,
    getAllSystemUser: (state) => state.allSystemUser,
    getLocationSearch: (state) => state.locationSearch,
    getExpertRatingList: (state) => state.expertRatingList,
    getExpertRatingOperates: (state) => state.expertRatingOperates,
    getTenderHallList: (state) => state.tenderHallList,
    getBudgetItem:(state) => state.budgetItem,
    getBudgetItemChildren: (state) => state.budgetItemChildren,
  },
  mutations: {
    setRouterHistory: (state, value) => {
      state.routerHistory = value;
    },
    setUserInfo: (state, value) => {
      state.userInfo = value;
    },
    setAllSystemUser: (state, value) => {
      state.allSystemUser = value;
    },
    setLocationSearch: (state, value) => {
      state.locationSearch = value;
    },
    setExpertRatingList: (state, value) => {
      state.expertRatingList = value;
    },
    setExpertRatingOperates: (state, value) => {
      state.expertRatingOperates = value;
    },
    setTenderHallList: (state, value) => {
      state.tenderHallList = value;
    },
    setBudgetItem: (state, value) => {
      state.budgetItem = value;
    },
    setBudgetItemChildren: (state, value) => {
      state.budgetItemChildren = value;
    },
    setTabChange(state) {
      state.tabChangeFlag = uuid();
    }
  },
});

export default store;
