<template>
  <div class="shelf-footer" v-show="isEditMode">
    <div class="shelf-footer-tab-wrapper" v-for="item in tabs"
     :key="item.index"
     @click="onTabClick(item)"
     >
      <div class="shelf-footer-tab" :class="{'is-selected':isSelected}">
        <div class="icon-private tab-icon" v-if="item.index === 1 && !isPrivate"></div>
        <div class="icon-private-see tab-icon" v-if="item.index === 1 && isPrivate"></div>
        <div class="icon-download tab-icon" v-if="item.index === 2"></div>
        <div class="icon-move tab-icon" v-if="item.index === 3"></div>
        <div class="icon-shelf tab-icon" v-if="item.index === 4"></div>
        <div class="tab-text">{{label(item)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { storeShelfMixin } from '@/utils/mixin'
import { saveBookShelf } from '@/utils/localStorage'
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
    }

  },
  methods: {
    hidePopub () {
      this.popupMenu.hidePopub()
    },
    // 设置
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
      this.hidePopub()
      // 将编辑状态置为false
      this.setIsEditMode(false)
      // 保存到本地
      /** w
       * 保存的是shelfList，而不是shelfSelected？，
       * 因为shelfSelected是对shelfList的一部分引用，shelfSelected变化，shelfList里也会变化，真正的值都是在shelfList里边
       */
      saveBookShelf(this.shelfList)
      // set置后提示信息
      if (isPrivate) {
        this.simpleToast(this.$t('shelf.setPrivateSuccess'))
      } else {
        this.simpleToast(this.$t('shelf.closePrivateSuccess'))
      }
    },
    // 显示隐私，弹窗
    showPrivate () {
      // 显示pupop(后面调用的方法与组件里的方法相对应)
      this.popupMenu = this.popup(
        {
          title: this.$t('shelf.setPrivateTitle'),
          btn: [
            {
              text: this.$t('shelf.open'),
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
    onTabClick (item) {
      if (!this.isSelected) {
        return
      }
      switch (item.index) {
        case 1:
          this.showPrivate()
          break
        case 2:
          break
        case 3:
          break
        case 4:
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
