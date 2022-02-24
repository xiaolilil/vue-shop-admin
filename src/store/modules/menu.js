const state = {
    menu: []
};

const getters = {
    menus: state => {
        return state.menu;
    }
};

const mutations = {
    incrementCount(state) {
        state.count++;
    },
    decrementCount(state, payload) {
        state.count -= payload.amout;
    },
    getMenu(state, payload){
        state.menu = payload; 
    }
};

const actions = {
    incrementCountAsync({ commit }) {
        setTimeout(() => {
            commit('incrementCount');
        }, 2000);
    },
    decrementCountAsync({ commit }, payload) {
        setTimeout(() => {
            commit('decrementCount', payload);
        }, 1000);
    },
    // getMenu({ commit }, payload){
    //     console.log(commit)
    //     console.log(payload)
    //     setTimeout(() => {
    //         commit('updateMenu', payload);
    //     }, 1000);
    // }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};