import { createRouter, createWebHistory } from "vue-router";
//import App from './App.vue';
import BasePage from './components/BasePage.vue';
import Index from './components/Index.vue';
import Register from './views/account/Register.vue';
import Login from './views/account/Login.vue';

import Result from './views/analytics/Result.vue'
import Report from './views/analytics/Report.vue'
import ReportList from './views/analytics/ReportList.vue'
import Statistics from './views/analytics/Statistics.vue'

import Runner from './views/automation/Runner.vue'
import RunnerList from './views/automation/RunnerList.vue'
import ScheduleList from './views/automation/ScheduleList.vue'

import Project from './views/config/Project.vue';
import Environment from './views/config/Environment.vue';
import ProjectDetail from './views/config/ProjectDetail.vue';
import Module from './views/config/Module.vue';

import TestCaseAPI from './views/testmgmt/TestCaseAPI.vue';
import TestCaseAPP from './views/testmgmt/TestCaseAPP.vue'
import TestCaseImport from './views/testmgmt/TestCaseImport.vue';
import TestCaseWeb from './views/testmgmt/TestCaseWeb.vue'
import TestScenario from './views/testmgmt/TestScenario.vue'
import TestSuite from './views/testmgmt/TestSuite.vue'
import TestSuiteList from './views/testmgmt/TestSuiteList.vue'

import useUserStore from './store/user'


const routes = [
    {
        path: '/',
        component: Login
    },
    {
        path: '/login',
        component: Login,
        meta: { title: '登陆 | 啄木鸟测试平台' },
    },
    {
        path: '/logout',
        name: 'logout',
        meta: { requiresAuth: true },
        beforeEnter: (to, from, next) => {
          const store = userStore()
          store.clearUser()
          next('/login')
        }
    },
    {
        path: '/',
        component: BasePage,
        meta: { requireLogin: true },
        children:[
            {   
                path: 'index',
                component: Index,
                meta: { title: '主页 | 啄木鸟测试平台' },
            } 
        ]
    },
    {
        path: '/register',
        component: () => import('./views/account/Register.vue'),
        meta: { title: '注册 | 啄木鸟测试平台' },
    },
    {
        path: '/test',
        component: BasePage,
        meta: { requireLogin: true },
        children:[
            {
                path: 'scenario',
                component: TestScenario,
                meta: { title: '测试场景 | 啄木鸟测试平台' },
            },
            {
                path: 'case/api/:scenario_id(\\d+)',
                component: TestCaseAPI,
                meta: { title: 'API用例 | 啄木鸟测试平台' },
            },
            {
                path: 'case/web/:scenario_id(\\d+)',
                component: TestCaseWeb,
                meta: { title: 'Web用例 | 啄木鸟测试平台' },
            },
            {
                path: 'case/app/:scenario_id(\\d+)',
                component: TestCaseAPP,
                meta: { title: 'APP用例 | 啄木鸟测试平台' },
            },
            {
                path: 'case/import',
                component: TestCaseImport,
                meta: { title: '导入用例 | 啄木鸟测试平台' },
            },
            {
                path: 'suite',
                component: TestSuiteList,
                meta: { title: 'TestSuite | 啄木鸟测试平台' },
            },
            {
                path: 'suite/edit/:testsuite_id(\\d+)',
                component: TestSuite,
                meta: { title: 'TestSuite | 啄木鸟测试平台' },
            },
            {
                path: 'suite/add',
                component: TestSuite,
                meta: { title: 'TestSuite | 啄木鸟测试平台' },
            },

        ]
    },
    {
        path: '/config',
        component: BasePage,
        meta: { requireLogin: true },
        children:[
            {
                path: 'project',
                component: Project,
                meta: { title: '项目配置 | 啄木鸟测试平台' },
            },
            {
                path: 'env',
                component: Environment,
                meta: { title: '环境配置 | 啄木鸟测试平台' },
            },
            {
                path: 'module',
                component: Module,
                meta: { title: '模块配置 | 啄木鸟测试平台' },
            },
            {
                path: 'project/detail',
                component: ProjectDetail,
                meta: { title: '项目详情 | 啄木鸟测试平台' },
            }
        ]
    },
    {
        path: '/tools',
        component: BasePage,
        children:[
            {
                path: 'http',
                component: () => import('./views/tools/HttpRequest.vue'),
                meta: { title: 'HTTP请求 | 啄木鸟测试平台' },
            },
            {
                path: 'mock/add',
                component: () => import('./views/tools/MockServer.vue'),
                meta: { requireLogin: true, title: 'Mock配置 | 啄木鸟测试平台' },
            },
            {
                path: 'mock/edit/:mock_id(\\d+)',
                component: () => import('./views/tools/MockServer.vue'),
                meta: { requireLogin: true, title: 'Mock配置 | 啄木鸟测试平台' },
            },
            {
                path: 'mock',
                component: () => import('./views/tools/MockServerList.vue'),
                meta: { requireLogin: true, title: 'Mock列表 | 啄木鸟测试平台' },
            },
            {
                path: 'todos',
                component: () => import('./views/tools/Todos.vue'),
                meta: { title: '待办 | 啄木鸟测试平台' },
            }
        ]
    },
    {
        path: '/automation',
        component: BasePage,
        meta: { requireLogin: true },
        children:[
            {
                path: 'runner/add',
                component: Runner,
                meta: { title: 'Runner配置 | 啄木鸟测试平台' },
            },
            {
                path: 'runner/edit/:runner_id(\\d+)',
                component: Runner,
                meta: { title: 'Runner配置 | 啄木鸟测试平台' },
            },
            {
                path: 'runner',
                component: RunnerList,
                meta: { title: 'Runner列表 | 啄木鸟测试平台' },
            },
            {
                path: 'schedule',
                component: ScheduleList,
                meta: { title: '定时任务 | 啄木鸟测试平台' },
            }
        ]
    },
    {
        path: '/analytics',
        component: BasePage,
        meta: { requireLogin: true },
        children:[
            {
                path: 'result',
                component: Result,
                meta: { title: '测试结果 | 啄木鸟测试平台' },
            },
            {
                path: 'report',
                component: ReportList,
                meta: { title: '测试报告 | 啄木鸟测试平台' },
            },
            {
                path: 'report/:report_id(\\d+)',
                component: Report,
                meta: { title: '测试报告详情 | 啄木鸟测试平台' },
            },
            {
                path: 'statistics',
                component: Statistics,
                meta: { title: '统计分析 | 啄木鸟测试平台' },
            }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 全局导航守卫
router.beforeEach(
    (to, from) => {
      const userStore = useUserStore()
      // 如果目标路由有requireLogin值，则读取store判断用户是否已经登录
      if (to.meta.requireLogin) {
        
        if (userStore.isLogin()) {
          if (to.meta.title) {
            document.title = to.meta.title;
          }
          return true;
        }
        router.push('/login');
      }
      // 设置页面title
      if (to.meta.title) {
        document.title = to.meta.title;
      }
      return true;
    }
  );

export default router