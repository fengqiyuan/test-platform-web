<template>
  <div class="ui middle aligned center aligned grid">
    <div class="column">
    <h2 class="ui teal image header">
      <img src="../../assets/logo.png" class="image">
      <div class="content">
        注册账号
      </div>
    </h2>
    <form class="ui large form">
      <div class="ui stacked segment">
        <div class="field">
          <div class="ui left icon input">
            <i class="user icon"></i>
            <input v-model="username" type="text" name="username" placeholder="请输入用户名">
          </div>
        </div>
        <div class="field">
          <div class="ui left icon input">
            <i class="lock icon"></i>
            <input v-model="password" type="password" name="password" placeholder="请输入密码" autocomplete>
          </div>
        </div>
        <div class="field">
          <div class="ui left icon input">
            <i class="lock icon"></i>
            <input v-model="confirm_password" type="password" name="confirm_password" placeholder="再次确认密码" autocomplete>
          </div>
        </div>
        <div class="field">
          <div class="ui left icon input">
            <i class="email icon"></i>
            <input v-model="email" type="text" name="email" placeholder="请输入邮箱账号">
          </div>
        </div>
        <div class="ui fluid large teal submit button" @click.prevent="register">注册</div>
      </div>

      <div class="ui error message"></div>

    </form>
  </div>
</div>
</template>
<script>
import http from "../../axios";

export default {
  name: "LoginForm",
  data() {
    return {
      username: '',
      password: '',
      confirm_password: '',
      email: ''
    };
  },
  methods: {
    async register() {
      console.log(this.username + this.password);
      const res = await http.post("/auth/register", {
        username: this.username,
        password: this.password,
        email: this.email
      });
      if (res.data.errcode === 0) {
        this.$router.push('/login')   
      }
    },
  },
}; 
$(function() {
      $('.ui.form')
        .form({
          fields: {
            username: {
              identifier  : 'username',
              rules: [
                {
                  type   : 'empty',
                  prompt : '请输入用户名'
                }
              ]
            },
            password: {
              identifier  : 'password',
              rules: [
                {
                  type   : 'empty',
                  prompt : '请输入密码'
                },
                {
                  type   : 'minLength[6]',
                  prompt : '密码必须6个字符以上'
                }
              ]
            },
            confirm_password: {
              identifier  : 'confirm_password',
              rules: [
                {
                  type   : 'empty',
                  prompt : '请再次输入密码'
                },
                {
                  type   : 'match[password]',
                  prompt : '密码不一致'
                }
              ]
            },
            email: {
              identifier  : 'email',
              rules: [
                {
                  type   : 'empty',
                  prompt : '请输入邮箱地址'
                },
                {
                  type   : 'email',
                  prompt : '请输入正确邮箱地址'
                }
              ]
            }
          }
      });
});
</script>
<style scoped>
.ui.grid {
    height: 100%;
}
.ui.column {
    max-width: 450px;
}
</style>

