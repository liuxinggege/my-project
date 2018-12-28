import Vue from 'vue';
import Router from 'vue-router';

import Container from '../components/Container.vue';//主体组件
import Main2 from '../components/views/main2.vue';
import Main3 from '../components/views/main3.vue';

import Gis from '../components/testpage/Gis.vue';


const routes = [
    {
      path: '/',
      name: 'index',
      component: Container,
      children: [
          {
            path: '/main2',
            name: 'vmain2',
            component: Main2
          },
          {
            path: '/main3',
            name: 'vmain3',
            component: Main3
          },
          {
            path: '/gis',
            name: 'gis',
            component: Gis
          } 
      ]
    },
    
  ]


Vue.use(Router);
export default new Router({routes});
