import Mock from 'mockjs'
import home from './bookHome'
import shelf from './bookShelf'
import list from './bookList'
import flatList from './bookFlatList'

// url(正则匹配，字符串都行) 方法 返回的数据
Mock.mock(/\/book\/home/, 'get', home)
Mock.mock(/\/book\/shelf/, 'get', shelf)
Mock.mock(/\/book\/list/, 'get', list)
Mock.mock(/\/book\/flat-list/, 'get', flatList)

// 也可以这样
// Mock.mock('/api2/goods', {
//   code: 0,
//   data: data.goods
// })
