<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div class="flap-card-bg" :class="{animation:runFlapCardAnimation}">
      <div class="flap-card" v-for="(item,index) in flapCardList" :key="index" :style="{zIndex: item.zIndex}">
        <div class="flap-card-circle">
          <div class="flap-card-semi-circle flap-card-semi-circle-left" :style="semiCircleStyle(item,'left')"
          ref="left"></div>
          <div class="flap-card-semi-circle flap-card-semi-circle-right" :style="semiCircleStyle(item,'right')"
          ref="right"></div>
        </div>
      </div>
      <!-- //烟花 -->
      <div class="point-wrapper">
        <div class="point" :class="{animation:runPointAnimation}" v-for="item in pointList" :key="item"></div>
      </div>
    </div>
    <div class="close-btn-wrapper" @click="close">
      <div class="icon-close"></div>
    </div>
  </div>
</template>

<script>
import { storeHomeMixin } from '@/utils/mixin'
import { flapCardList } from '@/utils/store'
export default {
  name: '',
  mixins: [storeHomeMixin],
  props: {},
  data () {
    return {
      flapCardList,
      front: 0,
      back: 1,
      intervalTime: 25,
      runFlapCardAnimation: false,
      pointList: [],
      runPointAnimation: false
    }
  },
  created () {
    this.createPoint()
  },
  mounted () {
    // this.startFlapCardAnimation()
  },
  computed: {},
  methods: {
    // c创建烟花小球
    createPoint () {
      for (let i = 0; i < 18; i++) {
        this.pointList.push(`point${i}`)
      }
    },
    close () {
      this.setFlapCardVisible(false)
    },
    // 左半边圆和右半边圆的样式设置
    semiCircleStyle (item, dir) {
      return {
        backgroundColor: `rgba(${item.r},${item.g},${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
      }
    },
    // 第一个参数表示第几个圆，第二个表示正面或背面圆（设置相应圆的样式）
    rotate (index, type) {
      const item = this.flapCardList[index]
      let dom
      if (type === 'front') {
        dom = this.$refs.right[index]
      } else {
        dom = this.$refs.left[index]
      }
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`
      dom.style.backgroundColor = `rgb(${item.r},${item._g},${item.b})`
    },
    // 旋转动画实现
    flapCardRotate () {
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      // 正面颜色不断加深
      frontFlapCard.rotateDegree += 10
      frontFlapCard._g -= 5
      // 背面颜色不断变浅
      backFlapCard.rotateDegree -= 10
      // 小于90后才显示背面，才开始颜色变浅（后变浅）
      if (backFlapCard.rotateDegree < 90) {
        backFlapCard._g += 5
      }

      // ******第一个临界点（转动到90deg）,显示相应背面的半圆********
      if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
        backFlapCard.zIndex += 2
      }

      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')

      //* **第二个；临界点（切换下一组卡片）***** */
      if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
        this.next()
      }
    },
    // 切换下一组卡片实现
    next () {
      // 在进行下一组之前，先把当前组卡片还原回来(重置操作)
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      frontFlapCard.rotateDegree = 0
      frontFlapCard._g = frontFlapCard.g
      backFlapCard.rotateDegree = 0
      backFlapCard._g = backFlapCard.g
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')

      // 进行下一组卡片
      this.front++
      this.back++
      let len = this.flapCardList.length
      if (this.front >= len) {
        this.front = 0
      }
      if (this.back >= len) {
        this.back = 0
      }
      // 动态改变z-index
      // 100 -> 96 -> 97
      // 99 -> 100 -> 96
      // 98 -> 99 -> 100
      // 97 -> 98 -> 99
      // 96 -> 97 -> 98
      // (0 - 1 + 5) % 5 = 4
      // (1 - 1 + 5) % 5 = 0
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - ((index - this.front + len) % len)
      })
      // 移动完后做一次 this.prepare() 归为完后，做准备工作
      this.prepare()
    },
    // 动画初始化的时候，让背面的卡片与正面的卡片实现重叠
    prepare () {
      const backFlapCard = this.flapCardList[this.back]
      // 实现重叠
      backFlapCard.rotateDegree = 180
      // 颜色也要做相应的变化（先加深）
      backFlapCard._g = backFlapCard.g - 5 * 9
      this.rotate(this.back, 'back')
    },
    // 卡片动画 开始
    startFlapCardAnimation () {
      // 这个初始化没有放到定时器里边，所以每次还要再this.next()中做 一次 this.prepare()
      this.prepare()
      this.task = setInterval(() => {
        this.flapCardRotate()
      }, this.intervalTime)

      // 模仿 api请求，关闭卡片翻转动画
      setTimeout(() => {
        this.stopAnimation()
      }, 2500)
    },
    // 开始烟花动画
    startPointAnimation () {
      this.runPointAnimation = true
      // 烟花结束后，去掉css animation
      setTimeout(() => {
        this.runPointAnimation = false
      }, 750)
    },
    // 重置所有卡片的样式
    reset () {
      this.front = 0
      this.back = 1
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - index
        // 颜色重置
        item._g = item.g
        item.rotateDegree = 0
        // 位置重置
        this.rotate(index, 'front')
        this.rotate(index, 'back')
      })
    },
    // 停止动画
    stopAnimation () {
      // 关闭卡片
      this.runFlapCardAnimation = false
      // 停止卡片翻转的定时器
      if (this.task) {
        clearInterval(this.task)
      }
      this.reset()
    },
    runAnimation () {
      this.runFlapCardAnimation = true
      // 先执行入场动画结束后，再执行翻转动画
      setTimeout(() => {
        this.startFlapCardAnimation()
        this.startPointAnimation()
      }, 300)
    }
  },
  components: {},
  watch: {
    flapCardVisible (v) {
      if (v) {
        this.runAnimation()
      } else {
        this.stopAnimation()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/globle.scss';
@import '@/assets/styles/flapCard.scss';
  .flap-card-wrapper {
    z-index: 1000;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    @include center;
    @include absCenter;
    .flap-card-bg {
      position: relative;
      width: px2rem(64);
      height: px2rem(64);
      border-radius: px2rem(5);
      background: white;
      transform: scale(0);
      opacity: 0;
      &.animation {
        animation: flap-card-move .3s ease-in both;
      }
      @keyframes flap-card-move {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.2);
          opacity: 1;
        }
        75% {
          transform: scale(.9);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      .flap-card {
        width: px2rem(48);
        height: px2rem(48);
        @include absCenter;
        .flap-card-circle {
          display: flex;
          width: 100%;
          height: 100%;
          .flap-card-semi-circle {
            flex: 0 0 50%;
            width: 50%;
            height: 100%;
            background-repeat: no-repeat;
            //设置转到背面的时候不显示
            backface-visibility: hidden;
          }
          .flap-card-semi-circle-left {
            border-radius: px2rem(24) 0 0 px2rem(24);
            background-position: center right;
            transform-origin: right;
          }
          .flap-card-semi-circle-right {
            border-radius: 0 px2rem(24) px2rem(24) 0;
            background-position: center left;
            transform-origin: left;
          }
        }
      }
      .point-wrapper {
        z-index: 1500;
        @include absCenter;
        .point {
          border-radius: 50%;
          @include absCenter;
          &.animation {
            // scss中的循环
            @for $i from 1 to length($moves) {
              &:nth-child(#{$i}) {
                @include move($i);
              }
            }
          }
        }
      }
    }
    .book-card {
      position: relative;
      width: 65%;
      max-width: px2rem(400);
      box-sizing: border-box;
      border-radius: px2rem(15);
      background: white;
      &.animation {
        animation: scale .3s ease-in both;
        @keyframes scale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      }
      .book-card-wrapper {
        width: 100%;
        height: 100%;
        margin-bottom: px2rem(30);
        @include columnTop;
        .img-wrapper {
          width: 100%;
          margin-top: px2rem(20);
          @include center;
          .img {
            width: px2rem(90);
            height: px2rem(130);
          }
        }
        .content-wrapper {
          padding: 0 px2rem(20);
          margin-top: px2rem(20);
          .content-title {
            color: #333;
            font-weight: bold;
            font-size: px2rem(18);
            line-height: px2rem(20);
            max-height: px2rem(40);
            text-align: center;
            @include ellipsis2(2)
          }
          .content-author {
            margin-top: px2rem(10);
            text-align: center;
          }
          .content-category {
            color: #999;
            font-size: px2rem(14);
            margin-top: px2rem(10);
            text-align: center;
          }
        }
        .read-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1100;
          width: 100%;
          border-radius: 0 0 px2rem(15) px2rem(15);
          padding: px2rem(15) 0;
          text-align: center;
          color: white;
          font-size: px2rem(14);
          background: $color-blue;
        }
      }
    }
    .close-btn-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(30);
      z-index: 1100;
      width: 100%;
      @include center;
      .icon-close {
        width: px2rem(45);
        height: px2rem(45);
        border-radius: 50%;
        background: #333;
        font-size: px2rem(25);
        color: white;
        @include center;
      }
    }
  }
</style>
