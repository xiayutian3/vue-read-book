// 扩充数据的方法，添加的元素，是数组中不存在，存在的就不添加
/* eslint-disable no-extend-native */
Array.prototype.pushWithoutDuplicate = function () {
  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i]
    // 查找是否已存在数组中
    if (this.indexOf(arg) === -1) {
      // this 值得是调用函数的数组
      this.push(arg)
    }
  }
}
