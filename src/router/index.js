import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/store'
  },
  {
    path: '/ebook',
    name: 'ebook',
    component: () => import('../views/ebook/index.vue'),
    children: [
      {
        path: ':fileName',
        component: () => import('../components/ebook/EbookReader.vue')
      }
    ]
  },
  {
    path: '/store',
    redirect: '/store/home',
    component: () => import('@/views/store/index.vue'),
    children: [
      {
        path: 'home',
        component: () => import('@/views/store/StoreHome.vue')
      },
      {
        path: 'list',
        component: () => import('@/views/store/StoreList.vue')
      },
      {
        path: 'detail',
        component: () => import('@/views/store/StoreDetail.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
