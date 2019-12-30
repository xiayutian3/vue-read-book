// localForage是用来操作indexedDB数据库的（250m 以上）（全部是异步操作）（key-value形式noSQL，类似mongooseDB）
// 该项目现在用来做电子图书的缓存
import localForage from 'localforage'

// key：键值，data：value，cb：回调
export function setLocalForage (key, data, cb, cb2) {
  localForage.setItem(key, data).then((value) => {
    if (cb) cb(value)
  }).catch(function (err) {
    if (cb2) cb2(err)
  })
}

export function getLocalForage (key, cb) {
  localForage.getItem(key, (err, value) => {
    cb(err, value)
  })
}
// 移除
export function removeLocalForage (key, cb, cb2) {
  localForage.removeItem(key).then(function () {
    if (cb) cb()
  }).catch(function (err) {
    if (cb2) cb2(err)
  })
}
// 清空所有数据
export function clearLocalForage (cb, cb2) {
  localForage.clear().then(function () {
    if (cb) cb()
  }).catch(function (err) {
    if (cb2) cb2(err)
  })
}
// 长度的遍历，获取indexedDB中一共有多少个key
export function lengthLocalForage (cb) {
  localForage.length().then(
    numberOfKeys => {
      if (cb) cb(numberOfKeys)
      // console.log(numberOfKeys)
    }).catch(function (err) {
    if (err) {}
    // console.log(err)
  })
}
// key -value 的遍历，遍历indexedDB中的每一项，拿到他们的key，value
export function iteratorLocalForage () {
  localForage.iterate(function (value, key, iterationNumber) {
    // console.log([key, value])
  }).then(function () {
    // console.log('Iteration has completed')
  }).catch(function (err) {
    if (err) {}
    // console.log(err)
  })
}
// 判断浏览器是否支持indexedDB，不支持的话，是不能支持离线缓存的功能的
export function support () {
  const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || null
  if (indexedDB) {
    return true
  } else {
    return false
  }
}
