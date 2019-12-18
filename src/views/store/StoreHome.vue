<template>
  <div class="store-home">
    <search-bar></search-bar>
  </div>
</template>

<script>
import SearchBar from '@/components/home/SearchBar.vue'
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
  components: {
    SearchBar
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/globle.scss';
  .store-home {
    width: 100%;
    height: 100%;
    .banner-wrapper {
      width: 100%;
      padding: px2rem(10);
      box-sizing: border-box;
      .banner-img {
        width: 100%;
        height: px2rem(150);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .recommend {
      margin-top: px2rem(20);
    }
    .featured {
      margin-top: px2rem(20);
    }
    .category-list-wrapper {
      margin-top: px2rem(20);
    }
    .categories {
      margin-top: px2rem(20);
    }
  }
</style>
