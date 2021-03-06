// 还成本地node，mysql服务后，注释掉mock
// 第二种方式模拟mock
// 1：全局的aplication对象，2：模拟的url地址 3：你要传递的数据
// function mock (app, url, data) {
//   app.get(url, (request, response) => {
//     response.json(data)
//   })
// }
// const homeData = require('./src/mock/bookHome')
// const shelfData = require('./src/mock/bookShelf')
// const listData = require('./src/mock/bookList')
// const flatListData = require('./src/mock/bookFlatList')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/book'
    : './',
  devServer: {
    // before (app) {
    //   mock(app, '/book/home', homeData)
    //   mock(app, '/book/shelf', shelfData)
    //   mock(app, '/book/list', listData)
    //   mock(app, '/book/flat-list', flatListData)
    // }
  },
  // webpack配置(针对打包有些文件过大的问题)
  configureWebpack: {
    performance: {
      hints: 'warning',
      maxAssetSize: 512 * 1024,
      maxEntrypointSize: 512 * 1024
    }
  }
}
