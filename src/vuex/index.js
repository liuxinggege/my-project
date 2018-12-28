import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const stores = {
    state: {
        //状态
        count:80,
        name:"haha"
    },
    mutations: {
        //修改stated的地方
    },
    getters: {
        //过滤
    },
    actions:{
        //异步的
    },
    modules:{
        //其他的子模块store
    }
}
export default new Vuex.Store(stores);