<template>
  <form class="ui form">
    <div class="field">
      <label>Git地址</label>
      <input
        v-model="url"
        type="text"
        name="first-name"
        placeholder="{{this.url}}"
      />
    </div>
    <button class="ui button" type="submit" @click="gitImport">开始导入</button>
  </form>
</template>

<script>
import http from "../../axios";
export default {
  name: "GitImport",
  data() {
    return {
      url: "https://gitee.com/fengrocky/TestLiteMall.git",
    };
  },
  methods: {
    async gitImport() {
      let res = await http.put("/test/case/import", {
        params: { git_url: this.url },
      });
      console.log(res);
      this.$router.push('/test/scenario')
    },
  },
};
</script>
<style scoped>
.container {
  max-width: 75rem;
  margin: 0 auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.ui.form {
  margin-top: 1rem;
}

.ui.table {
    word-break: break-all;
}
</style>