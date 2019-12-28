<template>
  <div class="shelf-item" :class="{'shelf-item-shadow':data.type === 1 || data.type === 2}"
        @click="onItemClick">
    <!-- 动态组件 -->
    <component class="shelf-item-comp"
              :class="{'is-edit':isEditMode && data.type === 2}"
              :is="item" :data="data"></component>
    <div class="icon-selected" v-show="isEditMode && data.type === 1"></div>
  </div>
</template>

<script>
import { gotoStoreHome } from '@/utils/store'
import { storeShelfMixin } from '@/utils/mixin'
import book from './ShelfItemBook'
import category from './ShelfItemCategory'
import add from './ShelfItemAdd'
export default {
  name: '',
  mixins: [storeShelfMixin],
  props: {
    data: Object
  },
  data () {
    return {
    }
  },
  created () {},
  mounted () {},
  computed: {
    item () {
      return this.data.type === 1 ? book : (this.data.type === 2 ? category : add)
    }
  },
  methods: {
    onItemClick () {
      if (this.data.type === 1) {
        this.showBookDetail(this.data)
      } else if (this.data.type === 2) {

      } else {
        // 去到书城首页
        gotoStoreHome(this)
      }
    }
  },
  components: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/globle.scss';
  .shelf-item {
    position: relative;
    width: 100%;
    height: 100%;
    &.shelf-item-shadow {
      box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, .3);
    }
    .shelf-item-comp {
      opacity: 1;
      &.is-edit {
        opacity: .5;
      }
    }
    .icon-selected {
      position: absolute;
      bottom: px2rem(2);
      right: px2rem(2);
      font-size: px2rem(18);
      color: rgba(0, 0, 0, .4);
      &.is-selected {
        color: $color-blue;
      }
    }
  }

</style>
