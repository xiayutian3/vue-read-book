<template>
  <div class="e-reader">
    <div id="read"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Epub from 'epubjs'
global.ePub = Epub
// nginx静态服务器的路径
// const baseUrl = 'http://自己的IP:8081/epub/'  //也可以用localhost
const baseUrl = 'http://localhost:8081/epub/'
export default {
  name: 'ebook-reader',
  props: [],
  data () {
    return {

    }
  },
  created () {},
  mounted () {
    const fileName = this.$route.params.fileName.split('|').join('/')
    // console.log(`${baseUrl}${fileName}.epub`)
    this.$store.dispatch('setFileName', fileName).then(() => {
      this.initEpub()
    })
  },
  computed: {
    ...mapGetters(['fileName'])
  },
  methods: {
    prevPage () {
      if (this.rendition) {
        this.rendition.prev()
      }
    },
    nextPage () {
      if (this.rendition) {
        this.rendition.next()
      }
    },
    toggleTitleAndMenu () {

    },
    initEpub () {
      // 拼接niginx静态电子书URL
      const url = `${baseUrl}${this.fileName}.epub`
      this.book = new Epub(url)
      // 渲染电子书
      this.rendition = this.book.renderTo('read', {
        width: window.innerWidth,
        height: window.innerHeight,
        methods: 'default'// 兼容微信
      })
      // 对电子书进行展示
      this.rendition.display()

      // 对电子书（通过iframe来加载）进行事件操作
      this.rendition.on('touchstart', event => {
        this.touchStartX = event.changedTouches[0].clientX
        this.touchStartTime = event.timeStamp
      })
      this.rendition.on('touchend', event => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX
        const time = event.timeStamp - this.touchStartTime
        console.log(offsetX, time)
        if (time > 200 && offsetX > 40) {
          this.prevPage()
        } else if (time > 200 && offsetX < -40) {
          this.nextPage()
        } else {
          this.toggleTitleAndMenu()
        }
        // 禁止默认行为，禁止事件传播
        // event.preventDefault() dom2 取消事件默认行为
        event.stopPropagation()
        return false // dom0 取消事件默认行为
      })
    }
  },
  components: {},
  watch: {}
}

</script>
<style lang='scss' scoped>
.e-reader{

}
</style>
