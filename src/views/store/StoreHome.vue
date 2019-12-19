<template>
  <div class="store-home">
    <search-bar></search-bar>
    <scroll :top="94" @onScroll="onScroll">
    <div>1111</div>
      <div>1111</div>
        <div>1111</div>
          <div>1111</div>
            <div>1111</div>
              <div>1111</div>
               <div>1111</div>
                <div>1111</div>
                  <div>1111</div>
                    <div>1111</div>
                      <div>1111</div>
                        <div>1111</div>
                        <div>1111</div>
                            <div>1111</div>
              <div>1111</div>
               <div>1111</div>
              <div>1111</div>
                <div>1111</div>
                  <div>1111</div>
                    <div>1111</div>
                      <div>1111</div>
                      <div>1111</div>

    </scroll>
  </div>
</template>

<script>
import SearchBar from '@/components/home/SearchBar.vue'
import Scroll from '@/components/common/Scroll.vue'
import { storeHomeMixin } from '@/utils/mixin'
export default {
  name: '',
  mixins: [storeHomeMixin],
  props: {},
  data () {
    return {
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    onScroll (offsetY) {
      this.setOffsetY(offsetY)
    }
  },
  components: {
    SearchBar,
    Scroll
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
