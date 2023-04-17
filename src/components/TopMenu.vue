<template>
  <div class="ui fixed inverted menu">
    <a class="header item"><img src="../assets/logo.png" class="image"><span>测试平台</span></a>
    <a class="item" to="/project/all">项目列表</a>
    <a class="item active" to="/testcase/all">测试管理</a>
    <a class="item">环境管理</a>
    <a class="item">测试能力管理</a>
    <a class="item">测试趋势分析</a>
    <div class="right menu">
      <a class="item">个人中心</a>
    </div>
  </div>
</template>
<style scoped>
.header {
  width: 15%;
  padding-left: inherit;
}
</style>
<script>
export default {
  name: "TopMenu",
};
</script>