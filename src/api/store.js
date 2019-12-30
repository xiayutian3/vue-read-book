import axios from 'axios'
import { setLocalForage } from '../utils/localForage'
// import { setLocalForage } from '../utils/localForage'

export function flatList () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/flat-list`
  })
}

export function shelf () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
  })
}

export function home () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  })
}

// 图书详情，线上地址
export function detail (book) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
}

// list接口，在mockjs中已经写好了
export function list () {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}
// 实现电子书的缓存方法
export function download (book, onSuccess, onError, onProgress) {
  // 如果不存在第四个参数，就把第三个参数，赋值给第四个参数
  if (!onProgress) {
    onProgress = onError
    onError = null
  }
  // axios.create返回axios实例，调用get方法
  return axios.create({
    baseURL: process.env.VUE_APP_EPUB_URL, // 基本路径
    method: 'get',
    responseType: 'blob', // 返回的格式，这个epub电子书的格式
    timeout: 180 * 1000, // 响应时间
    onDownloadProgress: ProgressEvent => { // axios提供的回调，用于进度条
      if (onProgress) onProgress(ProgressEvent)
    }
  }).get(`${book.categoryText}/${book.fileName}.epub`).then(res => {
    // console.log(res)
    const blob = new Blob([res.data]) // new出 blob对象，epubjs是可以直接打开的
    setLocalForage(book.fileName, blob, () => {
      if (onSuccess) onSuccess(book)
    }, err => {
      if (onError) onError(err)
    })
  }).catch(err => {
    if (onError) onError(err)
  })
}

// export function download (book, onSucess, onError, onProgress) {
//   if (onProgress == null) {
//     onProgress = onError
//     onError = null
//   }
//   return axios.create({
//     baseURL: process.env.VUE_APP_EPUB_URL,
//     method: 'get',
//     responseType: 'blob',
//     timeout: 180 * 1000,
//     onDownloadProgress: progressEvent => {
//       if (onProgress) onProgress(progressEvent)
//     }
//   }).get(`${book.categoryText}/${book.fileName}.epub`)
//     .then(res => {
//       const blob = new Blob([res.data])
//       setLocalForage(book.fileName, blob,
//         () => onSucess(book),
//         err => onError(err))
//     }).catch(err => {
//       if (onError) onError(err)
//     })
// }
