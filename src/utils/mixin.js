import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from '@/utils/book'
import { saveLocation, getBookmark } from '@/utils/localStorage'

// 和图书界面相关的mixin
export const storeHomeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      'hotSearchOffsetY'
    ])
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      'setHotSearchOffsetY'
    ])
  }
}

// 和阅读器相关的mixin
export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark'
    ]),
    themeList () {
      return themeList(this)
    },
    getSectionName () {
      return this.section ? this.navigation[this.section].label : ''
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark'
    ]),
    initGlobalStyle () {
      // 先做一次全局样式的清空
      removeAllCss()

      // addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
      }
    },
    // 更新当前的进度和保存当前的阅读进度(电子书的cfi)
    refreshLocation () {
      const currentLocation = this.currentBook.rendition.currentLocation()
      // console.log(currentLocation)
      if (currentLocation && currentLocation.start) {
        const startCfi = currentLocation.start.cfi
        // 获取进度
        const progress = this.currentBook.locations.percentageFromCfi(startCfi)
        this.setProgress(Math.floor(progress * 100))
        // 章节名字
        // console.log(currentLocation)
        this.setSection(currentLocation.start.index)
        saveLocation(this.fileName, startCfi)

        // 判断当前页是不是书签（获取本地书签页保存的数组）
        const bookmark = getBookmark(this.fileName)
        // console.log(bookmark)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }

        // 页脚分页显示
        if (this.pagelist) {
          const totalPage = this.pagelist.length
          // console.log(currentLocation)
          const currentPage = currentLocation.start.location
          if (currentPage && currentPage > 0) {
            this.setPaginate(currentPage + ' / ' + totalPage)
          } else {
            this.setPaginate('')
          }
        } else {
          this.setPaginate('')
        }
      }
    },
    // 渲染阅读进度（传入href，或者cfi都可以 EbookSettingProgress.vue中都使用了 ），所在的页面的方法
    display (target, callback) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          // 初始化阅读进度
          this.refreshLocation()
          if (callback) callback()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          // 初始化阅读进度
          this.refreshLocation()
          if (callback) callback()
        })
      }
    },
    // 隐藏菜单栏内容
    hideTitleAndMenu () {
      // this.$store.dispatch('setMenuVisible', false)
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },
    // 显示阅读时间
    getReadTimeText () {
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
    }
  }
}
