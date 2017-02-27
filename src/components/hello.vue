<template>
  <div>
    <m-header></m-header>
    <h1 @click="msg">{{ message }}</h1>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        message: 'hello a-rule!'
      }
    },
    methods: {
      msg() {
        this.message = new Date()
      }
    }
  }
</script>

<style lang="stylus">
  h1
    color green
</style>
