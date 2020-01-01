<template>
<!-- 1.新增状态,2.不是新增状态 -->
  <ebook-dialog :title="title" ref="dialog">
    <div class="dialog-list-wrapper" v-if="!ifNewGroup">
      <div class="dialog-list-item"
           :class="{'is-add': item.edit  ? item.edit === 1 : false}"
           v-for="(item, index) in categoryList"
           :key="index"
           @click="onGroupClick(item)"
           v-show="(item.edit === 2 && isInGroup) || item.edit !== 2 || !item.edit">
        <div class="dialog-list-item-text">{{item.title}}</div>
        <div class="dialog-list-icon-wrapper" v-if="isInGroup && shelfCategory.id === item.id">
          <span class="icon-check"></span>
        </div>
      </div>
    </div>
    <div class="dialog-new-group-wrapper" v-else>
      <div class="dialog-input-title-wrapper">
        <span class="dialog-input-title">{{$t('shelf.groupName')}}</span>
      </div>
      <div class="dialog-input-wrapper">
        <div class="dialog-input-inner-wrapper">
          <input type="text" class="dialog-input" v-model="newGroupName" ref="dialogInput">
          <div class="dialog-input-clear-wrapper" @click="clear" v-show="newGroupName && newGroupName.length > 0">
            <span class="icon-close-circle-fill"></span>
          </div>
        </div>
      </div>
    </div>
    <div slot="btn" class="group-dialog-btn-wrapper">
      <div class="dialog-btn" @click="hide">{{$t('shelf.cancel')}}</div>
      <div class="dialog-btn" @click="createNewGroup" :class="{'is-empty': newGroupName && newGroupName.length === 0}"
           v-if="ifNewGroup">{{$t('shelf.confirm')}}
      </div>
    </div>
  </ebook-dialog>
</template>

<script>
import EbookDialog from '../common/Dialog'
import { storeShelfMixin } from '../../utils/mixin'
import { removeAddFromShelf, appendAddToShelf } from '../../utils/store'
import { saveBookShelf } from '../../utils/localStorage'

export default {
  name: 'group-dialog',
  mixins: [storeShelfMixin],
  components: {
    EbookDialog
  },
  props: {
    showNewGroup: {
      type: Boolean,
      default: false
    },
    groupName: String
  },
  computed: {
    isInGroup () {
      return this.currentType === 2
    },
    defaultCategory () {
      return [
        {
          title: this.$t('shelf.newGroup'),
          edit: 1
        },
        {
          title: this.$t('shelf.groupOut'),
          edit: 2
        }
      ]
    },
    category () {
      return this.shelfList.filter(item => item.type === 2)
    },
    categoryList () {
      return [...this.defaultCategory, ...this.category]
    },
    title () {
      return !this.ifNewGroup ? this.$t('shelf.moveBook') : this.$t('shelf.newGroup')
    }
  },
  data () {
    return {
      ifNewGroup: false,
      newGroupName: ''
    }
  },
  methods: {
    show () {
      this.ifNewGroup = this.showNewGroup
      this.newGroupName = this.groupName
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
      // 动画持续200ms后再重置ifNewGroup为false，不然动画没关闭完，
      // ifNewGroup置为了false，就会显示，移动到的弹框
      setTimeout(() => {
        this.ifNewGroup = false
      }, 200)
    },
    onGroupClick (item) {
      if (item.edit && item.edit === 1) {
        // 点击新建分组
        this.ifNewGroup = true
      } else if (item.edit && item.edit === 2) {
        // 点击移除分组
        this.moveOutFromGroup(item)
      } else {
        // 点击要移入的分组
        this.moveToGroup(item)
      }
    },
    clear () {
      this.newGroupName = ''
    },
    moveToGroup (group) {
      // (书架过滤)先把选中的图书从原先的书架过滤掉,在添加到相应的分组中
      this.setShelfList(this.shelfList
        .filter(book => {
          if (book.itemList) {
            // 把选中要移出分类的数据过滤掉
            book.itemList = book.itemList.filter(subBook => this.shelfSelected.indexOf(subBook) < 0)
          }
          return this.shelfSelected.indexOf(book) < 0
        }))
        .then(() => {
          // console.log('group', group)
          // 把选中的图书与相应的分组里边的图书进行合并
          if (group && group.itemList) {
            group.itemList = [...group.itemList, ...this.shelfSelected]
          }
          // 重新更改下图书的id,重新排序
          group.itemList.forEach((item, index) => {
            item.id = index + 1
          })
          this.simpleToast(this.$t('shelf.moveBookInSuccess').replace('$1', group.title))
          this.onComplete()
        })
    },
    // 只在分组中才能使用，移出分组方法（1先从分类图书中过滤掉，2.再在书架图书中添加）
    moveOutFromGroup () {
      this.moveOutOfGroup(this.onComplete)
    },
    // 点击新建分组
    createNewGroup () {
      if (!this.newGroupName || this.newGroupName.length === 0) {
        return
      }
      // 判断是新建分组还是修改分组名字
      if (this.showNewGroup) {
        this.shelfCategory.title = this.newGroupName
        this.onComplete()
      } else {
        const group = {
          // 新增的元素id为:倒数第二个元素的id加1,因为最后一个是add图标.id为负
          id: this.shelfList[this.shelfList.length - 2].id + 1,
          itemList: [],
          selected: false,
          title: this.newGroupName,
          type: 2
        }
        // 把数组中的add图标移除
        let list = removeAddFromShelf(this.shelfList)
        list.push(group)
        // 往数组中添加add图标
        list = appendAddToShelf(list)
        this.setShelfList(list).then(() => {
          // 移动到相应的分组
          this.moveToGroup(group)
        })
      }
    },
    onComplete () {
      // 保存书架信息
      saveBookShelf(this.shelfList)
      // 隐藏弹出
      this.hide()
      // 关闭编辑模式
      this.setIsEditMode(false)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '@/assets/styles/globle.scss';

  .dialog-list-wrapper {
    width: 100%;
    padding: 0 px2rem(20);
    box-sizing: border-box;
    font-size: px2rem(14);
    @include scroll;
    .dialog-list-item {
      display: flex;
      padding: px2rem(15) 0;
      box-sizing: border-box;
      color: #666;
      &.is-add {
        color: $color-blue;
        &:active {
          color: $color-blue-transparent;
        }
      }
      &:active {
        color: rgba(102, 102, 102, .5)
      }
      .dialog-list-item-text {
        flex: 1;
      }
      .dialog-list-icon-wrapper {
        flex: 0 0 px2rem(30);
        color: $color-blue;
        @include right;
      }
    }
  }

  .dialog-new-group-wrapper {
    width: 100%;
    padding: 0 px2rem(20);
    box-sizing: border-box;
    .dialog-input-title-wrapper {
      font-size: px2rem(10);
      margin-top: px2rem(20);
    }
    .dialog-input-wrapper {
      width: 100%;
      padding: 0 0 px2rem(30) 0;
      box-sizing: border-box;
      .dialog-input-inner-wrapper {
        display: flex;
        width: 100%;
        padding: px2rem(10) 0;
        box-sizing: border-box;
        border-bottom: px2rem(1) solid #eee;
        font-size: px2rem(14);
        color: #666;
        .dialog-input {
          flex: 1;
          border: none;
          &:focus {
            outline: none;
          }
        }
        .dialog-input-clear-wrapper {
          flex: 0 0 px2rem(30);
          color: #ccc;
          @include center;
          &:active {
            color: #999;
          }
        }
      }
    }
  }

  .group-dialog-btn-wrapper {
    width: 100%;
    @include center;
  }

  .dialog-btn {
    flex: 1;
    &.is-empty {
      color: rgba(255, 255, 255, .5);
    }
    &:active {
      color: rgba(255, 255, 255, .5)
    }
  }
</style>
