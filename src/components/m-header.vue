<template>
  <header>
    <a href="/logout" class="logout">退出登录</a>
    <h1>建设联结 - 第三方合作商管理系统</h1>
  </header>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$notify({
        title: '退出登录',
        message: '稍后将跳转至登录页!',
        duration: 2000
      })
    }
  }
}
</script>

<style lang="stylus">
header {
  padding: 0 5%;
  min-height: 80px;
  background: #324157;
  color: #fff;
}
a
  color #fff
</style>
