<template>
  <div class="store-shelf">
    <shelf-title></shelf-title>
    <scroll class="store-shelf-scroll-wrapper" :top="0" @onScroll="onScroll">
      <shelf-search></shelf-search>
      <shelf-list></shelf-list>
    </scroll>
  </div>
</template>

<script>
import { shelf } from '@/api/store'
import Scroll from '@/components/common/Scroll.vue'
import ShelfSearch from '@/components/shelf/ShelfSearch.vue'
import ShelfTitle from '@/components/shelf/ShelfTitle.vue'
import ShelfList from '@/components/shelf/ShelfList.vue'
import { storeShelfMixin } from '@/utils/mixin'
export default {
  name: '',
  mixins: [storeShelfMixin],
  props: {},
  data () {
    return {
    }
  },
  created () {},
  mounted () {
    this.getShelfList()
  },
  computed: {},
  methods: {
    onScroll (offsetY) {
      this.setOffsetY(offsetY)
    },
    // 获取书架列表数据
    getShelfList () {
      shelf().then(res => {
        if (res.status === 200 && res.data && res.data.bookList) {
          this.setShelfList(res.data.bookList)
        }
      })
    }
  },
  components: {
    ShelfTitle,
    Scroll,
    ShelfSearch,
    ShelfList
  },
  watch: {}
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
