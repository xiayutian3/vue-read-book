<template>
  <div class="store-home">
    <search-bar></search-bar>
    <flap-card :data="random"></flap-card>
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <div class="banner-wrapper">
        <!-- <img class="banner-img" :src="banner" alt=""> -->
        <div class="banner-img" :style="{backgroundImage:`url('${banner}')`}"></div>
      </div>
      <guess-you-like :data="guessYouLike"></guess-you-like>
      <recommend :data="recommend" class="recommend"></recommend>
      <featured :data="featured" :titleText="$t('home.featured')"
      :btnText="$t('home.seeAll')" class="featured"></featured>
      <div class="categoty-list-wrapper" v-for="(item,index) in categoryList" :key="index">
        <category-book :data="item"></category-book>
      </div>
      <category class="categories" :data="categories"></category>
   </scroll>
  </div>
</template>

<script>
import { home } from '@/api/store'
import SearchBar from '@/components/home/SearchBar.vue'
import FlapCard from '@/components/home/FlapCard.vue'
import GuessYouLike from '@/components/home/GuessYouLike.vue'
import Recommend from '@/components/home/Recommend.vue'
import Featured from '@/components/home/Featured.vue'
import CategoryBook from '@/components/home/CategoryBook.vue'
import Category from '@/components/home/Category.vue'
import Scroll from '@/components/common/Scroll.vue'
import { storeHomeMixin } from '@/utils/mixin'
export default {
  name: '',
  mixins: [storeHomeMixin],
  props: {},
  data () {
    return {
      scrollTop: 94,
      random: null,
      banner: '',
      guessYouLike: null,
      recommend: null,
      featured: null,
      categoryList: null,
      categories: null
    }
  },
  created () {},
  mounted () {
    home().then(res => {
      if (res && res.data) {
        const data = res.data
        // console.log(data)
        // 随机获取一本电子书
        const randomIndex = Math.floor(Math.random() * data.random.length)
        this.random = data.random[randomIndex]
        this.banner = data.banner
        this.guessYouLike = data.guessYouLike
        this.recommend = data.recommend
        this.featured = data.featured
        this.categoryList = data.categoryList
        this.categories = data.categories
      }
      // res.guessYouLike
    }).catch(err => {
      if (err) {}
      // console.log(err)
    })
  },
  computed: {},
  methods: {
    // 处理滚动事件
    onScroll (offsetY) {
      // 设置vuex的offsetY
      // SearchBar组件会进行监听
      this.setOffsetY(offsetY)
      if (offsetY > 0) {
        // 如果滚动超过0，则隐藏标题，滚动条距顶部为52像素
        this.scrollTop = 52
      } else {
        // 如果滚动为0，则显示标题，滚动条距顶部为94像素
        this.scrollTop = 94
      }
      // 从新计算滚动列表高度
      this.$refs.scroll.refresh()
    }
  },
  components: {
    SearchBar,
    Scroll,
    FlapCard,
    GuessYouLike,
    Recommend,
    Featured,
    CategoryBook,
    Category
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
