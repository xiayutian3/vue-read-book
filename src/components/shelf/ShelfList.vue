<template>
  <div class="shelf-list">
    <!-- 过渡动画组 transition-group-->
    <!--
      会给.移除的当前元素添加3个class : list-leave-active list-move list-leave-to
      给需移动位置的元素添加 :.list-move  class
      -->
    <transition-group name="list" tag="div" id="shelf-list">
      <div class="shelf-list-item-wrapper" v-for="item in shelfList" :key="item.id">
        <shelf-item :data="item" :style="{height:itemHeight}"></shelf-item>
        <div class="shelf-list-title-wrapper">
          <span class="shelf-list-title title-small">{{item.title}}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { storeShelfMixin } from '@/utils/mixin'
import ShelfItem from '@/components/shelf/ShelfItem'
import { realPx } from '@/utils/utils'
export default {
  name: '',
  mixins: [storeShelfMixin],
  props: {},
  data () {
    return {
    }
  },
  created () {},
  mounted () {},
  computed: {
    itemHeight () {
      // 图片的宽高比是固定的
      // w/250 = h/350  所以: h = w/250*350
      return ((window.innerWidth - realPx(120)) / 3) / 250 * 350 + 'px'
    }
  },
  methods: {},
  components: {
    ShelfItem
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/globle.scss';
  .shelf-list {
    position: absolute;
    left: 0;
    z-index: 100;
    width: 100%;
    #shelf-list {
      // position: relative;
      display: flex;
      flex-flow: row wrap;
      width: 100%;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .shelf-list-item-wrapper {
        flex: 0 0 33.33%;
        width: 33.33%;
        padding: px2rem(15);
        box-sizing: border-box;
        // &.list-leave-active {
        //   display: none;
        // }
        //下面这种也可以
        &.list-leave-active {
          position: absolute;
          opacity: 0;
        }
        &.list-move {
          transition: transform .5s;
        }
        .shelf-list-title-wrapper {
          margin-top: px2rem(10);
        }
      }
     }
  }

</style>
