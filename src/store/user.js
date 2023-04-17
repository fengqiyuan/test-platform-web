import { defineStore } from 'pinia';

const USERID_KEY = 'user_id'
const USERNAME_KEY = 'username'
const TOKEN_KEY = 'access_token';

// 定义 User Store
const useUserStore = defineStore('User', {
  // state 定义
  state: () => ({
    user_id: localStorage.getItem(USERID_KEY) || '',
    username: localStorage.getItem(USERNAME_KEY) || '',
    access_token: localStorage.getItem(TOKEN_KEY) || '',
  }),
  actions: {
    // 判断是否有用户登录信息
    isLogin() {
      return !!this.access_token;
    },
    // 存储/更新用户信息
    setUser(userData) {
      this.user_id = userData.user_id;
      this.username = userData.username;
      this.access_token = userData.access_token;
      localStorage.setItem(USERID_KEY, this.user_id);
      localStorage.setItem(USERNAME_KEY, this.username);
      localStorage.setItem(TOKEN_KEY, this.access_token);
    },
    // 登出
    clearUser() {
      localStorage.removeItem(USERID_KEY);
      localStorage.removeItem(USERNAME_KEY);
      localStorage.removeItem(TOKEN_KEY);
      this.user_id = '';
      this.username = '';
      this.access_token = '';
    },
  },
});

export default useUserStore;
