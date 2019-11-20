<template>
  <div class="wrap">
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
  </div>
</template>

<script>
import EbookReader from '@/components/ebook/EbookReader.vue'
import EbookTitle from '@/components/ebook/EbookTitle.vue'
import EbookMenu from '@/components/ebook/EbookMenu.vue'
export default {
  name: 'index',
  props: [],
  data () {
    return {

    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {},
  components: {
    EbookReader,
    EbookMenu,
    EbookTitle
  },
  watch: {}
}

</script>
<style lang='scss' scoped>
.wrap{

}
</style>
