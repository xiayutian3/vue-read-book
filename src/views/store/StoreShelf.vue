<template>
  <div class="store-shelf">
    <shelf-title :title="$t('shelf.title')"></shelf-title>
    <scroll class="store-shelf-scroll-wrapper" ref="scroll" :top="0" :bottom="scrollBottom" @onScroll="onScroll">
      <shelf-search></shelf-search>
      <shelf-list :data="shelfList"></shelf-list>
    </scroll>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
import Scroll from '@/components/common/Scroll.vue'
import ShelfSearch from '@/components/shelf/ShelfSearch.vue'
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
    this.getShelfList()
    // 在书架列表中，// 书架分类列表数据，/ 书架列表为1 表示当前在书架，
    this.setShelfCategory([])
    this.setCurrentType(1)
  },
  computed: {},
  methods: {
    onScroll (offsetY) {
      this.setOffsetY(offsetY)
    }

  },
  components: {
    ShelfTitle,
    Scroll,
    ShelfSearch,
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
  }
</style>
