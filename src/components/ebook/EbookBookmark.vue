<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed?fixedStyle:{}">
      <bookmark :width="15" :height="35" :color="color"></bookmark>
    </div>
  </div>
</template>

<script>
import { realPx } from '@/utils/utils'
import Bookmark from '@/components/common/Bookmark.vue'
import { ebookMixin } from '@/utils/mixin'
const BLUE = '#346cbc'
const WHITE = '#fff'
export default {
  name: 'ebook-bookmark',
  mixins: [ebookMixin],
  props: {},
  data () {
    return {
      text: this.$t('book.pulldownAddMark'),
      color: WHITE,
      isFixed: false
    }
  },
  created () {},
  mounted () {
    setTimeout(() => {
      console.log('w', window.innerWidth)
      console.log('b', this.$refs.bookmark.clientWidth)
      console.log((window.innerWidth - this.$refs.bookmark.clientWidth) / 2)
    }, 1000)
  },
  computed: {
    // 第一阶段，随者下拉往下走
    // 第二阶段高度，吸顶效果的临界值（下拉到多少的时候，吸顶，不再往下走）
    height () {
      return realPx(35)
    },
    // 第三节阶段高度（临界值），箭头，文字，书签改变
    threshold () {
      return realPx(55)
    },
    fixedStyle () {
      return {
        position: 'fixed',
        top: 0,
        right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
      }
    }
  },
  methods: {
    addBookmark () {

    },
    removeBookmark () {

    },
    // 重置操作（状态4）
    restore () {
      // 因为有过渡动画的缘故。所以加个延迟 200
      setTimeout(() => {
        // 重置bookmark top 值
        this.$refs.bookmark.style.top = `${-this.height}px`
        // 重置 图标
        this.$refs.iconDown.style.transform = 'rotate(0deg)'
      }, 200)

      // 固定的时候，所以当前页 它就是书签了
      if (this.isFixed) {
        this.setIsBookmark(true)
        // 添加书签的操作
        this.addBookmark()
      } else {
        // 当它又拉上去，就是没有收藏的时候,就不是书签
        this.setIsBookmark(false)
        // 删除书签的操作
        this.removeBookmark()
      }
    },
    // 状态一(未超过书签的高度)
    beforeHeight () {
      // 判断当前页是否是书签页
      if (this.isBookmark) {
        this.text = this.$t('book.pulldownDeleteMark')
        this.color = BLUE
        this.isFixed = true
      } else {
        this.text = this.$t('book.pulldownAddMark')
        this.color = WHITE
        this.isFixed = false
      }
    },
    // 状态二
    beforeThreshold (v) {
      // （第二阶段） 在相对方向在移动，保持相对静止（达到吸顶效果）
      this.$refs.bookmark.style.top = `${-v}px`

      // 判断当前页是否是书签页
      if (this.isBookmark) {
        this.text = this.$t('book.pulldownDeleteMark')
        this.color = BLUE
        this.isFixed = true
      } else {
        this.text = this.$t('book.pulldownAddMark')
        this.color = WHITE
        this.isFixed = false
      }

      // 图标旋转
      const iconDown = this.$refs.iconDown
      if (iconDown.style.transform === 'rotate(180deg)') {
        iconDown.style.transform = 'rotate(0deg)'
      }
    },
    // 状态三 到达 临界点
    afterThreshold (v) {
      // （第三阶段）不再往下走了,保持相对静止（达到吸顶效果）
      this.$refs.bookmark.style.top = `${-v}px`

      // 判断当前页是否是书签页
      if (this.isBookmark) {
        this.text = this.$t('book.releaseDeleteMark')
        this.color = WHITE
        this.isFixed = false
      } else {
        this.text = this.$t('book.releaseAddMark')
        this.color = BLUE
        this.isFixed = true
      }

      // 图标旋转
      const iconDown = this.$refs.iconDown
      if (iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
        iconDown.style.transform = 'rotate(180deg)'
      }
    }

  },
  components: {
    Bookmark
  },
  watch: {
    offsetY (v) {
      // 电子书还在解析的时候，菜单栏出现 ，设置面板出现，（会引起很多的监听事件）
      if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
        return
      }

      if (v >= this.height && v < this.threshold) {
        // console.log('到达第二个阶段')
        this.beforeThreshold(v)
      } else if (v >= this.threshold) {
        // （第三阶段）不再往下走了,保持相对静止（达到吸顶效果）
        // console.log('到达第三个阶段')
        this.afterThreshold(v)
      } else if (v > 0 && v < this.height) {
        // 状态一
        this.beforeHeight()
      } else if (v === 0) {
        // （状态4）
        // （做一些重置的操作）
        this.restore()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/globle.scss';
  .ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 200;
    width: 100%;
    height: px2rem(35);
    .ebook-bookmark-text-wrapper {
      position: absolute;
      right: px2rem(45);
      bottom: 0;
      display: flex;
      .ebook-bookmark-down-wrapper {
        font-size: px2rem(14);
        color: white;
        transition: all .2s linear;
        @include center;
      }
      .ebook-bookmark-text {
        font-size: px2rem(14);
        color: white;
      }
    }
    .ebook-bookmark-icon-wrapper {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(15);
    }
  }
</style>
