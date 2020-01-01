<template>
<transition name="fade">
  <div class="shelf-title" :class="{'hide-shadow':ifHideShadow}" v-show="shelfTitleVisible">
    <div class="shelf-title-text-wrapper">
      <span class="shelf-title-text">{{title}}</span>
      <span class="shelf-title-sub-text" v-show="isEditMode">{{selectedText}}</span>
    </div>
    <div  class="shelf-title-btn-wrapper shelf-title-left" v-if="showClear">
      <span class="shelf-title-btn-text" @click="clearCache">{{$t('shelf.clearCache')}}</span>
    </div>
    <div class="shelf-title-btn-wrapper shelf-title-right" v-if="showEdit">
      <span class="shelf-title-btn-text" @click="onEditClick">{{isEditMode?$t('shelf.cancel'):$t('shelf.edit')}}</span>
    </div>
    <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showBack">
      <span class="icon-back" @click="back"></span>
    </div>
    <div class="shelf-title-btn-wrapper"
      :class="{'shelf-title-left': changeGroupLeft, 'shelf-title-right': changeGroupRight}" @click="changeGroup"
      v-if="showChangeGroup">
      <span class="shelf-title-btn-text">{{$t('shelf.editGroup')}}</span>
    </div>
  </div>
</transition>
</template>

<script>
import { storeShelfMixin } from '@/utils/mixin'
import { clearLocalStorage, saveBookShelf } from '@/utils/localStorage'
import { clearLocalForage } from '@/utils/localForage'
export default {
  name: '',
  mixins: [storeShelfMixin],
  props: {
    title: String
    // ifShowBack: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data () {
    return {
      ifHideShadow: true
    }
  },
  created () {},
  mounted () {},
  computed: {
    selectedText () {
      const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
      return selectedNumber <= 0 ? this.$t('shelf.selectBook') : (
        selectedNumber === 1 ? this.$t('shelf.haveSelectedBook').replace('$1', selectedNumber)
          : this.$t('shelf.haveSelectedBooks').replace('$1', selectedNumber)
      )
    },
    emptyCategory () {
      return !this.shelfCategory || !this.shelfCategory.itemList || this.shelfCategory.itemList.length === 0
    },
    showEdit () {
      return this.currentType === 1 || !this.emptyCategory
    },
    showClear () {
      return this.currentType === 1
    },
    showBack () {
      return this.currentType === 2 && !this.isEditMode
    },
    showChangeGroup () {
      return this.currentType === 2 && (this.isEditMode || this.emptyCategory)
    },
    changeGroupLeft () {
      return !this.emptyCategory
    },
    changeGroupRight () {
      return this.emptyCategory
    },
    popupCancelBtn () {
      return this.createPopupBtn(this.$t('shelf.cancel'), () => {
        this.hidePopup()
      })
    }
  },
  methods: {
    // 完成的时候，做一些收尾的工作
    onComplete () {
      this.hidePopup()
      // 删除分组
      this.setShelfList(this.shelfList.filter(book => book.id !== this.shelfCategory.id)).then(() => {
        // 保存图书
        saveBookShelf(this.shelfList)
        // 返回上一页(不加定时器的话，返回上一页后，toast卡死在页面中) (router的跳转不能和this.simpleToast()同步执行，不能然toast会停留在跳转后的页面)

        //* ****第一种****（先显示toast，再关闭toast，在跳转）
        // setTimeout(() => {
        //   this.$router.go(-1)
        // }, 1500)

        //* ****第二种****（先跳转，再显示toast，再关闭toast。***这里的话，就不需要mixin moveOutOfGroup方法中再调用this.simpleToast()）
        // this.$router.go(-1)
        // let text = this.$t('shelf.moveBookOutSuccess')
        // setTimeout(() => {
        //   this.simpleToast('新的' + text)
        // }, 0)

        //* ***推荐*****第三种****（先显示toast，再关闭toast，在跳转，*******推荐******）
        this.$router.go(-1)

        // 取消编辑模式
        this.setIsEditMode(false)
      })
    },
    // 删除分组（利用移除分组的方法，先全部选中分组的图书，将他们移出去，再删除分组）
    deleteGroup () {
      if (!this.emptyCategory) {
        // 将分组数据全选
        this.setShelfSelected(this.shelfCategory.itemList)
        // 移出分组
        this.moveOutOfGroup(this.onComplete)
      }
    },
    // 修改分组
    changeGroupName () {
      this.hidePopup()
      this.dialog({
        showNewGroup: true,
        groupName: this.shelfCategory.title
      }).show()
    },
    hidePopup () {
      this.popupMenu.hidePopub()
    },
    // 创建popup按钮函数
    createPopupBtn (text, onClick, type = 'normal') {
      return {
        text,
        click: onClick,
        type
      }
    },
    // 删除popupGroup
    showDeleteGroup () {
      // 关闭之前的popup
      this.hidePopup()
      // 200ms后动画结束，创建新的popup
      setTimeout(() => {
        this.popupMenu = this.popup({
          title: this.$t('shelf.deleteGroupTitle'),
          btn: [
            this.createPopupBtn(this.$t('shelf.confirm'), () => {
              this.deleteGroup()
            }, 'danger'),
            this.popupCancelBtn
          ]
        })
        this.popupMenu.showPopup()
      }, 200)
    },
    changeGroup () {
      this.popupMenu = this.popup({
        btn: [
          this.createPopupBtn(this.$t('shelf.editGroupName'), () => {
            this.changeGroupName()
          }),
          this.createPopupBtn(this.$t('shelf.deleteGroup'), () => {
            this.showDeleteGroup()
          }, 'danger'),
          this.popupCancelBtn
        ]
      })
      this.popupMenu.showPopup()
    },
    back () {
      this.$router.go(-1)
      this.setIsEditMode(false)
    },
    onEditClick () {
      // 如果不是编辑状态，做一些重置，选中的图书清空，每本书的选中状态也置为false
      if (!this.isEditMode) {
        this.setShelfSelected([])
        this.shelfList.forEach(item => {
          item.selected = false
          // 可能是图书分类里的情况
          if (item.itemList) {
            item.itemList.forEach(subItem => {
              subItem.selected = false
            })
          }
        })
      }
      this.setIsEditMode(!this.isEditMode)
    },
    // 还原数据（清空缓存）
    clearCache () {
      clearLocalStorage()
      clearLocalForage()
      // 清空书架
      this.setShelfList([])
      // 清空选中的图书
      this.setShelfSelected([])
      // 最后重新获取下数据
      this.getShelfList()
      // 提示信息
      this.simpleToast(this.$t('shelf.clearCacheSuccess'))
    }
  },
  components: {},
  watch: {
    offsetY (offsetY) {
      if (offsetY > 0) {
        this.ifHideShadow = false
      } else {
        this.ifHideShadow = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/globle.scss';
  .shelf-title {
    position: relative;
    z-index: 130;
    width: 100%;
    height: px2rem(42);
    background: white;
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
    &.hide-shadow {
      box-shadow: none;
    }
    .shelf-title-text-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(42);
      @include columnCenter;
      .shelf-title-text {
        font-size: px2rem(16);
        line-height: px2rem(20);
        font-weight: bold;
        color: #333;
      }
      .shelf-title-sub-text {
        font-size: px2rem(10);
        color: #333;
      }
    }
    .shelf-title-btn-wrapper {
      position: absolute;
      top: 0;
      box-sizing: border-box;
      height: 100%;
      @include center;
      .shelf-title-btn-text {
        font-size: px2rem(14);
        color: #666;
      }
      .icon-back {
        font-size: px2rem(20);
        color: #666;
      }
      &.shelf-title-left {
        left: 0;
        padding-left: px2rem(15);
      }
      &.shelf-title-right {
        right: 0;
        padding-right: px2rem(15);
      }
    }
  }

</style>
