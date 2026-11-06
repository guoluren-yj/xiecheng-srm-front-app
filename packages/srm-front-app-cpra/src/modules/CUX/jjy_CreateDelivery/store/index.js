const { createMutations, createGetter } = require("srm-front-app-core/script/store");

let state = {
    filterParams: {page: 4},
}

export default {
    namespaced: true,
    state,
    getters: createGetter(state),
    mutations: createMutations(state),
}
