<template>
  <div class="ebook" ref="ebook">
    <ebook-header></ebook-header>
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
    <ebook-bookmark></ebook-bookmark>
    <ebook-footer></ebook-footer>
  </div>
</template>

<script>
import EbookFooter from '@/components/ebook/EbookFooter.vue'
import EbookHeader from '@/components/ebook/EbookHeader.vue'
import EbookReader from '@/components/ebook/EbookReader.vue'
import EbookTitle from '@/components/ebook/EbookTitle.vue'
import EbookMenu from '@/components/ebook/EbookMenu.vue'
import EbookBookmark from '@/components/ebook/EbookBookmark.vue'
import { getReadTime, saveReadTime } from '@/utils/localStorage'
import { ebookMixin } from '@/utils/mixin'
export default {
  name: 'index',
  mixins: [ebookMixin],
  props: [],
  data () {
    return {

    }
  },
  created () {},
  mounted () {
    this.startLoopReadTime()
  },
  beforeDestroy () {
    if (this.task) {
      clearInterval(this.task)
    }
  },
  computed: {},
  methods: {
    // 重置操作
    restore () {
      this.$refs.ebook.style.top = 0 + 'px'
      // 添加过渡动画
      this.$refs.ebook.style.transition = 'all .2s linear'
      // 清楚过渡动画，不然在下拉移动也会出发这个动画，就会造成页面卡顿，不流畅
      setTimeout(() => {
        this.$refs.ebook.style.transition = ''
      }, 200)
    },
    move (v) {
      this.$refs.ebook.style.top = v + 'px'
    },
    // 记录阅读时间
    startLoopReadTime () {
      let readTime = getReadTime(this.fileName)
      if (!readTime) {
        readTime = 0
      }
      this.task = setInterval(() => {
        readTime++
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime)
        }
      }, 1000)
    }
  },
  components: {
    EbookReader,
    EbookMenu,
    EbookTitle,
    EbookBookmark,
    EbookHeader,
    EbookFooter
  },
  watch: {
    offsetY (v) {
      // 如果菜单栏出现，或者电子书不没解析完的时候，不能下拉
      if (!this.menuVisible && this.bookAvailable) {
        if (v > 0) {
          this.move(v)
        } else if (v === 0) {
          this.restore()
        }
      }
    }
  }
}

</script>
<style lang='scss' scoped>
.ebook{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
