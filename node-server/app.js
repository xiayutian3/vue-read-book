const express = require('express')
const mysql = require('mysql')
const constant = require('./const')
const app = express()

app.get('/', (req, res) => {
  res.send(new Date().toDateString())
})

// 连接数据库(生成连接字符串，之后就可以生成sql语句来查询)
function connect () {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'book'
  })
}
app.get('/book/list', (req, res) => {
  // 连接数据库
  const conn = connect()
  // 查询结果
  conn.query('select * from book', (err, results) => {
    if (err) {
      console.log(err)
      res.json({
        error_code: 1,
        msg: '数据库失败'
      })
    } else {
      res.json({
        error_code: 0,
        data: results
      })
    }
    // 关闭数据库，不管成功与否，消耗内存（占用内存，导致内存泄露）
    conn.end()
  })
})

// (随机选中：如传 （1 2），就是从 0 1 中选 1个数出来 )
// 第一个参数： 选几本书，第二个：一共几本书。就是从所有的里边选出来几本
function randomArray (n, l) {
  let rnd = []
  for (let i = 0; i < n; i++) {
    rnd.push(Math.floor(Math.random() * l))
  }
  return rnd
}

// 猜你喜欢的数据在加一些个性化东西（加工一下），才符合首页需要
function createGuessYouLike (data) {
  // 返回一个整数（从1，2，3中选出一个数）
  const n = parseInt(randomArray(1, 3)) + 1
  data['type'] = n
  // 模拟的数据（猜你喜欢的推荐部分）
  switch (n) {
    case 1:
      data['result'] = data.id % 2 === 0 ? '《Executing Magic》' : '《Elements Of Robotics》'
      break
    case 2:
      data['result'] = data.id % 2 === 0 ? '《Improving Psychiatric Care》' : '《Programming Languages》'
      break
    case 3:
      data['result'] = '《Living with Disfigurement》'
      data['percent'] = data.id % 2 === 0 ? '92%' : '97%'
      break
  }
  return data
}
// 推荐图书加工
function createRecommendData (data) {
  // 阅读人数
  data['readers'] = Math.floor(data.id / 2 * randomArray(1, 100))
  return data
}
// 找到相应的电子书（进行一些属性添加，在前端用到）
function createData (results, key) {
  return handleData(results[key])
}

function handleData (data) {
  // 处理封面图片 判断是不是以http://开头，不是的话，将路径映射到本地的nginx服务器
  if (!data.cover.startsWith('http://')) {
    data['cover'] = `${constant.resUrl}/img${data.cover}`
  }
  // 添加一些属性，提供给前端
  // 是否选中
  data['selected'] = false
  // 是否是隐私
  data['private'] = false
  // 缓存
  data['cache'] = false
  // 已读
  data['haveRead'] = 0
  return data
}

// 传入n，决定创建几个分类
function createCategoryIds (n) {
// 分类里边所有的id
  const arr = []
  constant.category.forEach((item, index) => {
    arr.push(index + 1)
  })
  const result = []
  for (let i = 0; i < n; i++) {
    // 获取的随机数(长度不断减少)
    const ran = Math.floor(Math.random() * (arr.length - i))
    // 获取分类相对应的序号
    result.push(arr[ran])
    // 将已经获取的随机数取代，用最后一位数。这样不断获取的arr[ran],就不会从arr数组中拿到重复的元素
    arr[ran] = arr[arr.length - i - 1]
  }
  return result
}
// 书架推荐分类图书列表
function createCategoryData (data) {
// 1先创建分类id 传入几个就创建几个
  const categoryIds = createCategoryIds(6)
  const result = []
  // 找到该分类id相同的电子书(取前4本，因为前端只显示4本)
  categoryIds.forEach(categoryId => {
    const subList = data.filter(item => item.category === categoryId).slice(0, 4)
    // 对subList数据经行一些加工
    subList.map(item => {
      return handleData(item)
    })
    result.push({
      category: categoryId,
      list: subList
    })
  })
  return result
}
app.get('/book/home', (req, res) => {
  // 连接数据库
  const conn = connect()
  // 查询封面不为空的图书
  conn.query('select * from book where cover != \'\'', (err, results) => {
    if (!err) {
      const length = results.length
      const guessYouLike = []
      const banner = ''
      // const banner = constant.resUrl + '/home_banner2.jpg'
      const recommend = []
      const featured = []
      const random = []
      const categoryList = createCategoryData(results)
      // 分类数据，内容是固定的
      const categories = [
        {
          category: 1,
          num: 56,
          img1: constant.resUrl + '/cover/cs/A978-3-319-62533-1_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/cs/A978-3-319-89366-2_CoverFigure.jpg'
        },
        {
          category: 2,
          num: 51,
          img1: constant.resUrl + '/cover/ss/A978-3-319-61291-1_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/ss/A978-3-319-69299-9_CoverFigure.jpg'
        },
        {
          category: 3,
          num: 32,
          img1: constant.resUrl + '/cover/eco/A978-3-319-69772-7_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/eco/A978-3-319-76222-7_CoverFigure.jpg'
        },
        {
          category: 4,
          num: 60,
          img1: constant.resUrl + '/cover/edu/A978-981-13-0194-0_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/edu/978-3-319-72170-5_CoverFigure.jpg'
        },
        {
          category: 5,
          num: 23,
          img1: constant.resUrl + '/cover/eng/A978-3-319-39889-1_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/eng/A978-3-319-00026-8_CoverFigure.jpg'
        },
        {
          category: 6,
          num: 42,
          img1: constant.resUrl + '/cover/env/A978-3-319-12039-3_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/env/A978-4-431-54340-4_CoverFigure.jpg'
        },
        {
          category: 7,
          num: 7,
          img1: constant.resUrl + '/cover/geo/A978-3-319-56091-5_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/geo/978-3-319-75593-9_CoverFigure.jpg'
        },
        {
          category: 8,
          num: 18,
          img1: constant.resUrl + '/cover/his/978-3-319-65244-3_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/his/978-3-319-92964-4_CoverFigure.jpg'
        },
        {
          category: 9,
          num: 13,
          img1: constant.resUrl + '/cover/law/2015_Book_ProtectingTheRightsOfPeopleWit.jpeg',
          img2: constant.resUrl + '/cover/law/2016_Book_ReconsideringConstitutionalFor.jpeg'
        },
        {
          category: 10,
          num: 24,
          img1: constant.resUrl + '/cover/ls/A978-3-319-27288-7_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/ls/A978-1-4939-3743-1_CoverFigure.jpg'
        },
        {
          category: 11,
          num: 6,
          img1: constant.resUrl + '/cover/lit/2015_humanities.jpg',
          img2: constant.resUrl + '/cover/lit/A978-3-319-44388-1_CoverFigure_HTML.jpg'
        },
        {
          category: 12,
          num: 14,
          img1: constant.resUrl + '/cover/bio/2016_Book_ATimeForMetabolismAndHormones.jpeg',
          img2: constant.resUrl + '/cover/bio/2017_Book_SnowSportsTraumaAndSafety.jpeg'
        },
        {
          category: 13,
          num: 16,
          img1: constant.resUrl + '/cover/bm/2017_Book_FashionFigures.jpeg',
          img2: constant.resUrl + '/cover/bm/2018_Book_HeterogeneityHighPerformanceCo.jpeg'
        },
        {
          category: 14,
          num: 16,
          img1: constant.resUrl + '/cover/es/2017_Book_AdvancingCultureOfLivingWithLa.jpeg',
          img2: constant.resUrl + '/cover/es/2017_Book_ChinaSGasDevelopmentStrategies.jpeg'
        },
        {
          category: 15,
          num: 2,
          img1: constant.resUrl + '/cover/ms/2018_Book_ProceedingsOfTheScientific-Pra.jpeg',
          img2: constant.resUrl + '/cover/ms/2018_Book_ProceedingsOfTheScientific-Pra.jpeg'
        },
        {
          category: 16,
          num: 9,
          img1: constant.resUrl + '/cover/mat/2016_Book_AdvancesInDiscreteDifferential.jpeg',
          img2: constant.resUrl + '/cover/mat/2016_Book_ComputingCharacterizationsOfDr.jpeg'
        },
        {
          category: 17,
          num: 20,
          img1: constant.resUrl + '/cover/map/2013_Book_TheSouthTexasHealthStatusRevie.jpeg',
          img2: constant.resUrl + '/cover/map/2016_Book_SecondaryAnalysisOfElectronicH.jpeg'
        },
        {
          category: 18,
          num: 16,
          img1: constant.resUrl + '/cover/phi/2015_Book_TheOnlifeManifesto.jpeg',
          img2: constant.resUrl + '/cover/phi/2017_Book_Anti-VivisectionAndTheProfessi.jpeg'
        },
        {
          category: 19,
          num: 10,
          img1: constant.resUrl + '/cover/phy/2016_Book_OpticsInOurTime.jpeg',
          img2: constant.resUrl + '/cover/phy/2017_Book_InterferometryAndSynthesisInRa.jpeg'
        },
        {
          category: 20,
          num: 26,
          img1: constant.resUrl + '/cover/psa/2016_Book_EnvironmentalGovernanceInLatin.jpeg',
          img2: constant.resUrl + '/cover/psa/2017_Book_RisingPowersAndPeacebuilding.jpeg'
        },
        {
          category: 21,
          num: 3,
          img1: constant.resUrl + '/cover/psy/2015_Book_PromotingSocialDialogueInEurop.jpeg',
          img2: constant.resUrl + '/cover/psy/2015_Book_RethinkingInterdisciplinarityA.jpeg'
        },
        {
          category: 22,
          num: 1,
          img1: constant.resUrl + '/cover/sta/2013_Book_ShipAndOffshoreStructureDesign.jpeg',
          img2: constant.resUrl + '/cover/sta/2013_Book_ShipAndOffshoreStructureDesign.jpeg'
        }
      ]
      // [ 455, 257, 32, 60, 167, 86, 123, 258, 155 ],通过数字从结果里边找到相应的电子书
      // (猜你喜欢图书)
      randomArray(9, length).forEach(key => {
        // 找书的方法(猜你喜欢图书)
        guessYouLike.push(createGuessYouLike(createData(results, key)))
      })
      // 推荐图书
      randomArray(3, length).forEach(key => {
        recommend.push(createRecommendData(createData(results, key)))
      })
      // 精选图书
      randomArray(6, length).forEach(key => {
        // 精选图书不需要加工，直接选出来就行了
        featured.push(createData(results, key))
      })
      // 随机图书
      randomArray(1, length).forEach(key => {
        random.push(createData(results, key))
      })

      res.json({
        guessYouLike,
        banner,
        recommend,
        featured,
        categoryList,
        categories,
        random
      })
    }
    conn.end()
  })
})

const server = app.listen(3000, () => {
  const host = server.address().address
  const port = server.address().port
  // %s表示占位符，s表示string，所以表示占位符是string
  console.log('server is listening at http://%s:%s', host, port)
})
