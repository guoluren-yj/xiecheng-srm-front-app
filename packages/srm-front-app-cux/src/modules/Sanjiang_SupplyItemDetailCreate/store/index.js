import { createGetter, createMutations } from '@/store/utils'

let state = {
    supplyItemList: [],
}

export default {
    namespaced: true,
    state,
    getters: createGetter(state),
    mutations: createMutations(state),
}
