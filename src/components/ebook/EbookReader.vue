<template>
  <div class="e-reader">
    <div id="read"></div>
  </div>
</template>

<script>
import { ebookMixin } from '@/utils/mixin.js'
import { saveFontFamily, getFontFamily, getFontSize, saveFontSize } from '@/utils/localStorage'
import Epub from 'epubjs'
global.ePub = Epub
// nginx静态服务器的路径
// const baseUrl = 'http://自己的IP:8081/epub/'  //也可以用localhost
const baseUrl = 'http://localhost:8081/epub/'
export default {
  name: 'ebook-reader',
  mixins: [ebookMixin],
  props: [],
  data () {
    return {

    }
  },
  created () {},
  mounted () {
    const fileName = this.$route.params.fileName.split('|').join('/')
    // console.log(`${baseUrl}${fileName}.epub`)
    this.setFileName(fileName).then(() => {
      this.initEpub()
    })
  },
  methods: {
    prevPage () {
      if (this.rendition) {
        this.rendition.prev()
        this.hideTitleAndMenu()
      }
    },
    nextPage () {
      if (this.rendition) {
        this.rendition.next()
        this.hideTitleAndMenu()
      }
    },
    toggleTitleAndMenu () {
      // this.$store.dispatch('setMenuVisible', !this.menuVisible)
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    hideTitleAndMenu () {
      // this.$store.dispatch('setMenuVisible', false)
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },
    initFontSize () {
      let fontSize = getFontSize(this.fileName)
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize)
      } else {
        this.rendition.themes.fontSize(fontSize + 'px')
        this.setDefaultFontSize(fontSize)
      }
    },
    initFontFamily () {
      let font = getFontFamily(this.fileName)
      if (!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily)
      } else {
        this.rendition.themes.font(font)
        this.setDefaultFontFamily(font)
      }
    },
    initEpub () {
      // 拼接niginx静态电子书URL
      const url = `${baseUrl}${this.fileName}.epub`
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      // console.log(this.book)
      // 渲染电子书
      this.rendition = this.book.renderTo('read', {
        width: window.innerWidth,
        height: window.innerHeight,
        methods: 'default'// 兼容微信
      })
      // 对电子书进行展示
      this.rendition.display().then(() => {
        // 初始化字体大小
        this.initFontSize()

        // 初始化字体
        this.initFontFamily()
      })

      // 对电子书（通过iframe来加载）进行事件操作
      this.rendition.on('touchstart', event => {
        this.touchStartX = event.changedTouches[0].clientX
        this.touchStartTime = event.timeStamp
      })
      this.rendition.on('touchend', event => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX
        const time = event.timeStamp - this.touchStartTime
        // console.log(offsetX, time)
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

      // ebook阅读器通过ifram引用，通过hooks方法, 修改web字体，传入的是链接，而不是路径
      this.rendition.hooks.content.register(contents => {
        // localhost  也可以换成 192.168.xx.xx
        // 字体加载完后有promise的回调 (不使用回调也是可以的)

        //  contents.addStylesheet('http://localhost:8081/fonts/droidSans.css')
        //   contents.addStylesheet('http://localhost:8081/fonts/cabin.css')
        //   contents.addStylesheet('http://localhost:8081/fonts/daysOne.css')
        //   contents.addStylesheet('http://localhost:8081/fonts/montserrat.css')
        //   contents.addStylesheet('http://localhost:8081/fonts/tangerine.css')

        // 使用 vue-cli3 的环境变量 VUE_APP_RES_URL
        Promise.all([
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/droidSans.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
        ]).then(() => {
          // console.log('字体加载完成后需要做点什么。。。')
        })
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
