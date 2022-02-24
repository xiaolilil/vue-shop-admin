import {createStore} from 'vuex';
import menu from './modules/menu.js';
import user from './modules/user.js';


export default createStore({
    state:{},
    mutations:{},
    actions:{},
    modules: {
        menu,
        user,
    }
});