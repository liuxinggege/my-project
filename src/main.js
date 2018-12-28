import Vue from 'vue';
import router from './router'; 

// console.log(process.env.NODE_ENV)//可以获取环境    npm run dev 会设置为:"development"就是node运行的环境  npm run build 会设置为:"production"就是生产环境
// console.log(Vue.config)

//引入vuex store
import store from './vuex';

//引入自己的store
import myStore from './store.js'

//这里是引入 ElementUI插件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// import axios from 'axios'; 

import App from './components/App.vue';


Vue.config.productionTip = true;
//挂载app 将如有插件 依赖注入
new Vue({
  el: '#app',
  myStore,
  router, //这里必须以router为属性名
  store, //这里必须以store为属性名
  components: { App },
  template: '<App/>'
})