<template>
  <div class="e-reader">
    <div id="read"></div>
  </div>
</template>

<script>
import { flatten } from '@/utils/book'
import { ebookMixin } from '@/utils/mixin.js'
import { saveFontFamily, getFontFamily, getFontSize, saveFontSize, getTheme, saveTheme, getLocation } from '@/utils/localStorage'
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
  created () {
    // 树状结构，需转化为一维数组，才好解析（例如）
    // const nav = [
    //   {
    //     id: 1,
    //     subitems: [
    //       {
    //         id: 2,
    //         subitems: [
    //           {
    //             id: 3,
    //             subitems: []
    //           },
    //           {
    //             id: 4,
    //             subitems: []
    //           }
    //         ]
    //       }, {
    //         id: 5,
    //         subitems: []
    //       }
    //     ]
    //   },
    //   {
    //     id: 6,
    //     subitems: []
    //   }
    // ]
    // console.log([0].concat(...[1, 2])) // [0,1,2]
    // 采取递归操作，拍扁
    // function flatten (array) {
    //   // 二维数组
    //   // return array.map(item => [].concat(item, ...flatten(item.subitems)))

    //   // 一维数组
    //   return [].concat(...array.map(item => [].concat(item, ...flatten(item.subitems))))
    // }
    // console.log(flatten(nav))
  },
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
        this.rendition.prev().then(() => {
          // 初始化阅读进度
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    nextPage () {
      if (this.rendition) {
        this.rendition.next().then(() => {
          // 初始化阅读进度
          this.refreshLocation()
        })
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
    initTheme () {
      let defaultTheme = getTheme(this.fileName)
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name
        saveTheme(this.fileName, defaultTheme)
      }
      this.setDefaultTheme(defaultTheme)
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style)
      })
      // defaultTheme 不从vuex获取，因为vuex是异步获取的。可能会获取不到
      this.rendition.themes.select(defaultTheme)
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
    initRendition () {
      // 渲染电子书
      this.rendition = this.book.renderTo('read', {
        width: window.innerWidth,
        height: window.innerHeight,
        methods: 'default'// 兼容微信
      })
      // 对电子书进行展示(刚开始没有阅读进度，所以传null)
      const location = getLocation(this.fileName)
      // console.log(location)
      // 会自动判断location是否存在，不存在为null
      this.display(location, () => {
        // 初始化电子书主题
        this.initTheme()

        // 初始化全局样式主题
        this.initGlobalStyle()

        // 初始化字体大小
        this.initFontSize()

        // 初始化字体
        this.initFontFamily()
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
    },

    // 手势操作
    initGesture () {
      // 对电子书（通过iframe来加载）进行事件(手势操作)操作
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
    },
    parseBook () {
      // 电子书正在加载的状态，获取封面信息,获取封面图片url,格式blog，一种资源文件
      this.book.loaded.cover.then((cover) => {
        this.book.archive.createUrl(cover).then((url) => {
          // console.log(url)
          this.setCover(url)
        })
      })
      // 获取标题，作者信息等
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata)
      })
      // 获取目录信息(树状结构的目录信息，可能有多级嵌套)
      this.book.loaded.navigation.then(nav => {
        let navItem = flatten(nav.toc)
        navItem = flatten(navItem)
        function find (item, level = 0) {
          return !item.parent ? level : find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
        }

        navItem.forEach(item => {
          item.level = find(item)
        })
        console.log(navItem)
        this.setNavigation(navItem)

        // 实现树状目录结构（例子）
        // let navigation = [
        //   {
        //     id: 1,
        //     subitems: [
        //       {
        //         id: 2,
        //         subitems: [
        //           {
        //             id: 3,
        //             subitems: [],
        //             parent: 2
        //           },
        //           {
        //             id: 4,
        //             subitems: [],
        //             parent: 2
        //           }
        //         ],
        //         parent: 1
        //       }, {
        //         id: 5,
        //         subitems: [],
        //         parent: 1
        //       }
        //     ],
        //     parent: undefined
        //   },
        //   {
        //     id: 6,
        //     subitems: [],
        //     parent: undefined
        //   }
        // ]
        // navigation = flatten(navigation)
        // function find (item, level = 0) {
        //   if (!item.parent) {
        //     return level
        //   } else {
        //     return find(navigation.filter(parentItem => parentItem.id === item.parent)[0], ++level)
        //   }
        // }

        // navigation.forEach(item => {
        //   item.level = find(item)
        // })
        // console.log(navigation)
      })
    },
    initEpub () {
      // 拼接niginx静态电子书URL
      const url = `${baseUrl}${this.fileName}.epub`
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      // console.log(this.book)

      // 初始化rendition
      this.initRendition()

      // 初始化Gesture(手势操作)
      this.initGesture()

      // 获取封面信息
      this.parseBook()

      // epub电子书解析全部结束后调用(钩子函数)
      this.book.ready.then(() => {
        // 一页显示的文字数量 默认是150个数一页，可以帮我们拿到 阅读的进度，做百分比
        // 电子书分页
        return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
          .then(locations => {
            // console.log(locations)

            // 分页结束后，就可以设置电子书可用了
            this.setBookAvailable(true)

            // 分页完成后也调用一次refreshLocation，才能获取到 阅读进度(不然 refreshLocation方法中打印的progress为null)
            this.refreshLocation()
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
