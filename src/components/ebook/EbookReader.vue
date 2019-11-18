<template>
  <div class="e-reader">
    <div id="read"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Epub from 'epubjs'
global.ePub = Epub
// nginx静态服务器的路径
// const baseUrl = 'http://自己的IP:8081/epub/'  //也可以用localhost
const baseUrl = 'http://localhost:8081/epub/'
export default {
  name: 'ebook-reader',
  props: [],
  data () {
    return {

    }
  },
  created () {},
  mounted () {
    const fileName = this.$route.params.fileName.split('|').join('/')
    // console.log(`${baseUrl}${fileName}.epub`)
    this.$store.dispatch('setFileName', fileName).then(() => {
      this.initEpub()
    })
  },
  computed: {
    ...mapGetters(['fileName'])
  },
  methods: {
    initEpub () {
      // 拼接niginx静态电子书URL
      const url = `${baseUrl}${this.fileName}.epub`
      this.book = new Epub(url)
      // 渲染电子书
      this.rendition = this.book.renderTo('read', {
        width: window.innerWidth,
        height: window.innerHeight,
        methods: 'default'// 兼容微信
      })
      // 对电子书进行展示
      this.rendition.display()
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
