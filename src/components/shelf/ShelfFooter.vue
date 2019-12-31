<template>
  <div class="shelf-footer" v-show="isEditMode">
    <div class="shelf-footer-tab-wrapper" v-for="item in tabs"
     :key="item.index"
     @click="onTabClick(item)"
     >
      <div class="shelf-footer-tab" :class="{'is-selected':isSelected}">
        <div class="icon-private tab-icon" v-if="item.index === 1 && !isPrivate"></div>
        <div class="icon-private-see tab-icon" v-if="item.index === 1 && isPrivate"></div>
        <div class="icon-download tab-icon" v-if="item.index === 2 && !isDownload"></div>
        <div class="icon-download-remove tab-icon" v-if="item.index === 2 && isDownload"></div>
        <div class="icon-move tab-icon" v-if="item.index === 3"></div>
        <div class="icon-shelf tab-icon" v-if="item.index === 4"></div>
        <div class="tab-text" :class="{'remove-text':item.index === 4}">{{label(item)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { storeShelfMixin } from '@/utils/mixin'
import { saveBookShelf, removeLocalStorage } from '@/utils/localStorage'
import { removeLocalForage } from '@/utils/localForage'
import { download } from '@/api/store'
export default {
  name: '',
  mixins: [storeShelfMixin],
  props: {},
  data () {
    return {
      popupMenu: null
    }
  },
  created () {},
  mounted () {},
  computed: {
    isSelected () {
      return this.shelfSelected && this.shelfSelected.length > 0
    },
    // 因为国际化文本，所以需放在computed中，不能放在data中，不然不能随时变化文本
    tabs () {
      return [
        {
          label: this.$t('shelf.private'),
          label2: this.$t('shelf.noPrivate'),
          index: 1
        },
        {
          label: this.$t('shelf.download'),
          label2: this.$t('shelf.delete'),
          index: 2
        },
        {
          label: this.$t('shelf.move'),
          index: 3
        },
        {
          label: this.$t('shelf.remove'),
          index: 4
        }
      ]
    },
    // 是否是隐私阅读（数据里边有相应的字段对应）
    isPrivate () {
      // 先判断是否有选中的图书
      if (!this.isSelected) {
        return false
      } else {
        return this.shelfSelected.every(item => item.private)
      }
    },
    // 数据中有download字段,表示是否缓存过？
    isDownload () {
      if (!this.isSelected) {
        return false
      } else {
        return this.shelfSelected.every(item => item.cache)
      }
    }

  },
  methods: {
    // 选中的电子书下载（离线缓存功能）|加async await 后，主要是为了采取同步执行方法
    async downloadSelectedBook () {
      for (let i = 0; i < this.shelfSelected.length; i++) {
        await this.downloadBook(this.shelfSelected[i]).then((book) => {
          // 将电子书的缓存设为true，
          book.cache = true
        }
        )
      }
    },
    downloadBook (book) {
      // console.log('book', book)
      // 用book里边的数据拼出下载路径
      return new Promise((resolve, reject) => {
        download(book, (res) => {
          // console.log('res', res)

          // 下载完毕后关闭toast
          // this.toastCC.hide()

          // 直接用create api里的方法，将DOM remove掉
          this.toastCC.remove()

          resolve(book)
        }, reject, progressEvent => {
          // console.log('progressEvent', progressEvent)
          const progress = Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%'
          const text = this.$t('shelf.progressDownload').replace('$1', `${book.fileName}.epub(${progress})`)
          // console.log(text)
          this.toastCC = this.toast({ text })
          this.toastCC.continueShow()
        })
      })
    },
    // 删除缓存的电子书
    removeSelectedBook () {
      Promise.all(this.shelfSelected.map(book => this.removeBook(book)))
        .then(books => {
          books.map(book => {
            book.cache = false
          })
          this.simpleToast(this.$t('shelf.removeDownloadSuccess'))
          // 保存shelfList在本地
          saveBookShelf(this.shelfList)
        })
    },
    removeBook (book) {
      return new Promise((resolve, reject) => {
        // 删除本地记录（阅读进度等）
        removeLocalStorage(`${book.categoryText}/${book.fileName}-info`)
        // 删除电子书缓存
        removeLocalForage(`${book.fileName}`)
        resolve(book)
      })
    },
    hidePopub () {
      this.popupMenu.hidePopub()
    },
    onComplete () {
      this.hidePopub()
      // 将编辑状态置为false
      this.setIsEditMode(false)
      // 保存到本地
      /** w
       * 保存的是shelfList，而不是shelfSelected？，
       * 因为shelfSelected是对shelfList的一部分引用，shelfSelected变化，shelfList里也会变化，真正的值都是在shelfList里边
       */
      saveBookShelf(this.shelfList)
    },
    // 设置隐私
    setPrivate () {
      let isPrivate
      if (this.isPrivate) {
        isPrivate = false
      } else {
        isPrivate = true
      }
      // 设置所有书的隐私属性
      this.shelfSelected.forEach(book => {
        book.private = isPrivate
      })
      this.onComplete()
      // set置后提示信息
      if (isPrivate) {
        this.simpleToast(this.$t('shelf.setPrivateSuccess'))
      } else {
        this.simpleToast(this.$t('shelf.closePrivateSuccess'))
      }
    },
    // 缓存
    async setDownload () {
      this.onComplete()
      if (this.isDownload) {
        // 删除缓存的电子书
        this.removeSelectedBook()
      } else {
        // 实际的电子书下载，
        await this.downloadSelectedBook()
        // 保存shelfList在本地
        saveBookShelf(this.shelfList)
        this.simpleToast(this.$t('shelf.setDownloadSuccess'))
      }
    },
    // 从书架移除图书的方法
    removeSelected () {
      // 从选中的图书中看看是否存在书架中，存在就移除
      this.shelfSelected.forEach(selected => {
        this.setShelfList(this.shelfList.filter(book => book !== selected))
      })
      // 操作完成，把选中的置为空
      this.setShelfSelected([])
      this.onComplete()
    },
    // 显示隐私，弹窗
    showPrivate () {
      // 显示pupop(后面调用的方法与组件里的方法相对应)
      this.popupMenu = this.popup(
        {
          title: this.isPrivate ? this.$t('shelf.closePrivateTitle') : this.$t('shelf.setPrivateTitle'),
          btn: [
            {
              text: this.isPrivate ? this.$t('shelf.close') : this.$t('shelf.open'),
              click: () => {
                this.setPrivate()
              }
            },
            {
              text: this.$t('shelf.cancel'),
              click: () => {
                this.hidePopub()
              }
            }
          ]
        }
      )
      this.popupMenu.showPopup()
    },
    // 显示download,表示是否缓存过？
    showDownload () {
      this.popupMenu = this.popup(
        {
          title: this.isDownload ? this.$t('shelf.removeDownloadTitle') : this.$t('shelf.setDownloadTitle'),
          btn: [
            {
              text: this.isDownload ? this.$t('shelf.delete') : this.$t('shelf.open'),
              click: () => {
                this.setDownload()
              }
            },
            {
              text: this.$t('shelf.cancel'),
              click: () => {
                this.hidePopub()
              }
            }
          ]
        }
      )
      this.popupMenu.showPopup()
    },
    // 移出书架的方法
    showRemove () {
      // 标题设置
      let title
      if (this.shelfSelected.length === 1) {
        title = this.$t('shelf.removeBookTitle').replace('$1', `《${this.shelfSelected[0].title}》`)
      } else {
        title = this.$t('shelf.removeBookTitle').replace('$1', this.$t('shelf.selectedBooks'))
      }
      // popup弹窗设置
      this.popupMenu = this.popup(
        {
          title: title,
          btn: [
            {
              text: this.$t('shelf.removeBook'),
              type: 'danger',
              click: () => {
                this.removeSelected()
              }
            },
            {
              text: this.$t('shelf.cancel'),
              click: () => {
                this.hidePopub()
              }
            }
          ]
        }
      )
      this.popupMenu.showPopup()
    },
    onTabClick (item) {
      if (!this.isSelected) {
        return
      }
      switch (item.index) {
        case 1:
          this.showPrivate()
          break
        case 2:
          this.showDownload()
          break
        case 3:
          this.dialog().show()
          break
        case 4:
          this.showRemove()
          break
        default:
          break
      }

      // vue-create-api的使用案例 (公用组件)
      // this.$createToast({
      //   $props: {
      //     text: 'hello createToast'
      //   }
      // }).show()
      // 简化后的使用
      // this.toast({ text: 'hello createToast' }).show()

      // 显示pupop(后面调用的方法与组件里的方法相对应)
      // const popup = this.popup(
      //   {
      //     title: '123',
      //     btn: [
      //       {
      //         text: '确认',
      //         click: () => {
      //           this.toast({ text: '正在确认。。。' }).show()
      //           // 关闭pupop
      //           // console.log('popup', popup)
      //           // this.popup().hidePopub() // 这种方式也可以
      //           popup.hidePopub()
      //         }
      //       },
      //       {
      //         text: '取消',
      //         click: () => {
      //           this.toast({ text: '正在取消。。。' }).show()
      //           // 关闭pupop
      //           popup.hidePopub()
      //         }
      //       },
      //       {
      //         text: '删除',
      //         type: 'danger',
      //         click: () => {
      //           this.toast({ text: '正在删除。。。' }).show()
      //           // 关闭pupop
      //           popup.hidePopub()
      //         }
      //       }
      //     ]
      //   }
      // )
      // popup.showPopup()
    },
    label (item) {
      // switch中 用了return 后面再写break的话会报错，就不需要添加break了
      switch (item.index) {
        case 1:
          return this.isPrivate ? item.label2 : item.label
        case 2:
          return this.isDownload ? item.label2 : item.label
        default:
          return item.label
      }
    }
  },
  components: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/globle.scss';
  .shelf-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 120;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: white;
    box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, .1);
    .shelf-footer-tab-wrapper {
      flex: 1;
      width: 25%;
      height: 100%;
      .shelf-footer-tab {
        width: 100%;
        height: 100%;
        opacity: .5;
        @include columnCenter;
        &.is-selected {
          opacity: 1;
        }
        .tab-icon {
          font-size: px2rem(20);
          color: #666;
        }
        .tab-text {
          margin-top: px2rem(5);
          font-size: px2rem(12);
          color: #666;
          &.remove-text {
            color: $color-pink;
          }
        }
        .icon-shelf {
          color: $color-pink;
        }
      }
    }
  }

</style>
