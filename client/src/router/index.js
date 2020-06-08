import Vue from 'vue'
import Router from 'vue-router'
import ListWord from '@/components/ListWord'
import List from '@/components/List'
import HelloWorld from '@/components/HelloWorld'
import Revision from '@/components/Revision'
import Recap from '@/components/Recap'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/listword/:packId',
      name: 'ListWord',
      component: ListWord
    },
    {
      path: '/index',
      name: 'HelloWord',
      component: HelloWorld
    },
    {
      path: '/list',
      name: 'List',
      component: List
    },
    {
      path: '/revision',
      name: 'Revision',
      component: Revision
    },
    {
      path: '/recap',
      name: 'Recap',
      component: Recap
    }
  ]
})
