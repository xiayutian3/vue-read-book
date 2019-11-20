<template>
  <div id="app">
    <!-- <span class="aa">abcdefg</span> -->
    <router-view/>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'

// // 仿照mapgetters方法
// const getters = {
//   a: () => 11,
//   b: () => 22
// }
// function fn (keys) {
//   const data = {}
//   keys.forEach(key => {
//     if (getters.hasOwnProperty(key)) {
//       data[key] = getters[key]
//     }
//   })
//   return data
// }

export default {
  // computed: {
  // ...mapGetters(['test']),
  // ...fn(['a', 'b', 'c'])
  // },
  // mounted () {
  // console.log(this.test)
  // console.log(this.a, this.b, this.c) // 11 22 undefined
  // }
}
</script>

<style lang="scss" scoped>
//相对路径 绝对路径都是可以的
// @import './assets/styles/globle.scss';
// @import '@/assets/styles/globle.scss';
// .aa{
//   font-family: 'Days One';
//   font-size: px2rem(20);
// }

#app{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
