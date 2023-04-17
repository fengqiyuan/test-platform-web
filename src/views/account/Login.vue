<template>
  <div class="ui middle aligned center aligned grid">
    <div class="column">
      <h2 class="ui teal image header">
        <img src="../../assets/logo.png" class="image">
        <div class="content">
          登陆测试平台
        </div>
      </h2>
      <form class="ui form">
        <div class="ui stacked segment">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input v-model="data.username" type="text" name="username" placeholder="用户名" autocomplete>
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input v-model="data.password" type="password" name="password" placeholder="密码" autocomplete>
            </div>
          </div>
          <div><button class="ui fluid large teal button" @click.prevent="login">登陆</button></div>
        </div>
        <div class="ui error message">
          <p>{{ data.message }}</p>
        </div>
      </form>
      <div class="ui message">
        新用户? <a href="/register#">注册</a>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { reactive, onMounted } from "vue";
import useUserStore from "../../store/user";
import http from "../../axios";

const router = useRouter()
const userStore = useUserStore()
const data = reactive({
  username: "",
  password: "",
  message: ""
});

onMounted(() => {
  if(userStore.isLogin()){
    router.replace('/index')
  }
})

const login = () => {
  let valid = $('.ui.form').form('is valid')
  if (valid) {
    http.post("/auth/login", {
      username: data.username,
      password: data.password,
    }).then((res) => {
      console.log(res)
      if (res.data.errcode === 0) {
        console.log("test")
        userStore.setUser(res.data.data)
        router.push('/index')
      } else {
        $('.ui.form').form('set error')
        data.message = res.data.message;
      }
    }).catch((error) => {
      console.error(error)
    }
    );
  }
}
$(function () {
  $('.ui.form')
    .form({
      // inline: true,
      on: 'blur',
      fields: {
        username: {
          identifier: 'username',
          rules: [
            {
              type: 'empty',
              prompt: '请输入用户名'
            }
          ]
        },
        password: {
          identifier: 'password',
          rules: [
            {
              type: 'empty',
              prompt: '请输入密码'
            }
          ]
        }
      }
    });
});
</script>
<style scoped>
.ui.grid {
  height: 100vh;
  background-color: #DADADA;
}

.column {
  max-width: 450px;
}
</style>

