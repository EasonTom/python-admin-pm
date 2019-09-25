import Vue from 'vue'
import VueRouter from 'vue-router'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from '@/store/index'

import util from '@/libs/util.js'

// 路由数据
import routes from './routes'
import layoutHeaderAside from '@/layout/header-aside'
import { frameInRoutes } from '@/router/routes'

Vue.use(VueRouter)

// 导出路由 在 main.js 里使用
const router = new VueRouter({
    routes,
    mode: 'history'
})

let RouteFresh = true

/**
 * 路由拦截
 * 权限验证
 */
router.beforeEach(async (to, from, next) => {
    console.log(router)
    // 进度条
    NProgress.start()
    // 处理动态理由 刷新后失效的问题 通过判断RouteFresh来确定是否加载
    if (RouteFresh) {
        store.dispatch('d2admin/user/get').then(res => { // 根据role过滤路由
            const r = res.routes || []
            const m = res.menus || []

            let children = r.map(item => {
                const index = m.findIndex(i => i.id === item.menu_id)
                return {
                    name: item.name,
                    path: m[index].path,
                    component: () => import(`@/views/` + item.path),
                    meta: {
                        auth: true,
                        name: item.name
                    }
                }
            })

            const route = [
                {
                    path: '/',
                    component: layoutHeaderAside,
                    children: children
                },
                { path: '*', redirect: '/404', hidden: true }
            ]

            router.$addRoutes(route)
            // 更新标签页池
            store.commit('d2admin/page/init', [
                ...frameInRoutes,
                ...route
            ])
            RouteFresh = false
            next({ ...to, replace: true })
        }).catch(err => {
            console.log(err)
        })
        return true
    }
    // 确认已经加载多标签页数据 https://github.com/d2-projects/d2-admin/issues/201
    await store.dispatch('d2admin/page/isLoaded')
    // 确认已经加载组件尺寸设置 https://github.com/d2-projects/d2-admin/issues/198
    await store.dispatch('d2admin/size/isLoaded')
    // 关闭搜索面板
    store.commit('d2admin/search/set', false)
    // 验证当前路由所有的匹配中是否需要有登录验证的
    if (to.matched.some(r => r.meta.auth)) {
        // 这里暂时将cookie里是否存有token作为验证是否登录的条件
        // 请根据自身业务需要修改
        const token = util.cookies.get('token')
        const user_info = store.state.d2admin.user.info
        if (token && token !== 'undefined' && JSON.stringify(user_info) != '{}') {
            next()
        } else {
            // 没有登录的时候跳转到登录界面
            // 携带上登陆成功之后需要跳转的页面完整路径
            next({
                name: 'login',
                query: {
                    redirect: to.fullPath
                }
            })
            // https://github.com/d2-projects/d2-admin/issues/138
            NProgress.done()
        }
    } else {
        // 不需要身份校验 直接通过
        next()
    }
})

router.afterEach(to => {
    // 进度条
    NProgress.done()
    // 多页控制 打开新的页面
    store.dispatch('d2admin/page/open', to)
    // 更改标题
    util.title(to.meta.title)
})

// 重置当前router的match = 初始router.match 防止回退之类的重置路由报重名警报 https://github.com/vuejs/vue-router/issues/1727
router.$addRoutes = (params) => {
    router.matcher = new VueRouter({ mode: 'history', routes }).matcher
    router.addRoutes(params)
}

export default router
