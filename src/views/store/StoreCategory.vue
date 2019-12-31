<template>
  <div class="store-shelf">
    <shelf-title :title="shelfCategory.title" :ifShowBack="true"></shelf-title>
    <scroll class="store-shelf-scroll-wrapper"
            ref="scroll"
            :top="0"
            :bottom="scrollBottom"
            @onScroll="onScroll"
            v-if="ifShowList">
      <shelf-list :top="42" :data="shelfCategory.itemList"></shelf-list>
    </scroll>
    <div class="store-shelf-empty-view" v-else>{{$t('shelf.groupNone')}}</div>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
import Scroll from '@/components/common/Scroll.vue'
import ShelfTitle from '@/components/shelf/ShelfTitle.vue'
import ShelfList from '@/components/shelf/ShelfList.vue'
import ShelfFooter from '@/components/shelf/ShelfFooter.vue'
import { storeShelfMixin } from '@/utils/mixin'

export default {
  name: '',
  mixins: [storeShelfMixin],
  props: {},
  data () {
    return {
      scrollBottom: 0
    }
  },
  created () {},
  mounted () {
    // 获取分类列表图书，并设置当前状态为2，即当前在分类中
    this.getCategoryList(this.$route.query.title)
    this.setCurrentType(2)
  },
  computed: {
    ifShowList () {
      return this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
    }
  },
  methods: {
    onScroll (offsetY) {
      this.setOffsetY(offsetY)
    }

  },
  components: {
    ShelfTitle,
    Scroll,
    ShelfList,
    ShelfFooter
  },
  watch: {
    // 如果是编辑状态，底部导航应该出现
    isEditMode (isEditMode) {
      this.scrollBottom = isEditMode ? 48 : 0
      // 等界面完成后再调用，不然会出现问题，因为有可能dom没渲染出来
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/globle.scss';
  .store-shelf {
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: white;
    .store-shelf-scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
    }
    .store-shelf-empty-view {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: px2rem(14);
      color: #333;
      @include center;
    }
  }
</style>
