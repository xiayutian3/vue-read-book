import CreateAPI from 'vue-create-api'
import Vue from 'vue'
import Toast from '@/components/common/Toast'
import Popup from '@/components/common/Popup'
import GroupDialog from '@/components/shelf/ShelfGroupDialog'

Vue.use(CreateAPI)
Vue.createAPI(Toast, true)
Vue.createAPI(Popup, true)
Vue.createAPI(GroupDialog, true)

// vue-create-api的使用案例(公用组件，创建的dom是挂载在body下的，
//           和app并行，建议组件是全屏的时候使用，如果想让组件挂在vue实例中，建议不使用该方法)

// this.$createToast({
//   $props: {
//     text: 'hello createToast'
//   }
// }).show()  //（后面调用的方法与组件里的方法相对应)

// 全局的mixin（进一步简化）(在shelfFooter中有使用demo)
Vue.mixin({
  methods: {
    toast (settings) {
      return this.$createToast({
        $props: settings
      })
    },
    popup (settings) {
      return this.$createPopup({
        $props: settings
      })
    },
    // 简单的Toast方法（后面调用的方法与组件里的方法相对应)
    simpleToast (text) {
      this.toast({
        text: text
      }).show()
    },
    dialog (settings) {
      return this.$createGroupDialog({
        $props: settings
      })
    }
  }
})
