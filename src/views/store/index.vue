<template>
  <div class="store">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: '',
  props: {},
  data () {
    return {
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {},
  components: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/globle.scss';
.store{
  width: 100%;
  height: 100%;
  background: white;
}
</style>
