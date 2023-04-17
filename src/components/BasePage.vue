<template>
  <div class="ui bottom attached segment pushable" id="pushable1">
    <div class="ui inverted labeled icon left inline vertical sidebar menu" style="">
      <div class="item">
        <a class="ui logo icon image" href="/index">
          <img src="../assets/logo.png">
        </a>
        <a href="/index"><b> 测试平台 </b></a>
      </div>
      <router-link class="item" to="/index">
        <i class="home icon"></i>
        主页
      </router-link>
      <router-link class="item" to="/test/scenario">
        <i class="th icon"></i>
        测试用例
      </router-link>
      <router-link class="item" to="/test/suite">
        <i class="list icon"></i>
        测试套件
      </router-link>
      <router-link class="item" to="/automation/runner">
        <i class="terminal icon"></i>
        测试runner
      </router-link>
      <router-link class="item" to="/automation/schedule">
        <i class="tasks icon"></i>
        定时任务
      </router-link>
      <router-link class="item" to="/analytics/result">
        <i class="folder icon"></i>
        测试结果
      </router-link>
      <router-link class="item" to="/analytics/report">
        <i class="envelope outline icon"></i>
        测试报告
      </router-link>
      <router-link class="item" to="/analytics/statistics">
        <i class="chart line icon"></i>
        数据分析
      </router-link>
    </div>
    <div class="pusher">
      <div class="ui basic segment">
        <div class="ui">
          <div class="ui top fixed inverted menu">
            <a class="item" id="sidebarIcon"><i class="sidebar icon"></i>菜单 </a>
            <router-link class="item" to="/tools/todos">我的待办 </router-link>
            <router-link class="item" to="/test/scenario">我的测试 </router-link>
            <router-link class="item" to="/analytics/result">我的Bug </router-link>
            <router-link class="item" to="/analytics/report">我的报告 </router-link>
            <router-link class="item" to="/config/project">项目管理 </router-link>
            <div class="right menu">
              <div class="item">
                <i class="user icon"></i>
                <span>{{ userStore.username }}</span>
              </div>
            </div>
            <a class="item" @click="logout">退出</a>
          </div>
        </div>
      </div>
      <div><router-view></router-view></div>
    </div>
  </div>
</template>
<style scoped>
.logo {
  width: 20px;
}
</style>
<script setup>
import http from '../axios'
import { useRouter } from 'vue-router'
import useUserStore from '../store/user';
const userStore = useUserStore()
const router = useRouter()
$(function () {
  $('.ui.sidebar')
    .sidebar({
      context: $('#pushable1'),
      transition: 'push',
      mobileTransition: 'uncover'
    })
    .sidebar('attach events', '#sidebarIcon');
});
async function logout() {
      try {
        const res = await http.post('/auth/logout');
      } catch (error) {
        console.error(error);
      } finally {
        userStore.clearUser()
        router.push('/login');
      }
    }
</script>