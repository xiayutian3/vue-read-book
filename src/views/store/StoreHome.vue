<template>
  <div class="store-home">
    <search-bar></search-bar>
    <flap-card :data="random"></flap-card>
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
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
import { home } from '@/api/store'
import SearchBar from '@/components/home/SearchBar.vue'
import FlapCard from '@/components/home/FlapCard.vue'
import Scroll from '@/components/common/Scroll.vue'
import { storeHomeMixin } from '@/utils/mixin'
export default {
  name: '',
  mixins: [storeHomeMixin],
  props: {},
  data () {
    return {
      scrollTop: 94,
      random: null
    }
  },
  created () {},
  mounted () {
    home().then(res => {
      if (res && res.data) {
        const data = res.data
        const randomIndex = Math.floor(Math.random() * data.random.length)
        this.random = data.random[randomIndex]
      }
      // res.guessYouLike
    }).catch(err => {
      console.log(err)
    })
  },
  computed: {},
  methods: {
    onScroll (offsetY) {
      this.setOffsetY(offsetY)
      if (offsetY > 0) {
        this.scrollTop = 52
      } else {
        this.scrollTop = 94
      }
      // 从新计算滚动列表高度
      this.$refs.scroll.refresh()
    }
  },
  components: {
    SearchBar,
    Scroll,
    FlapCard
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
