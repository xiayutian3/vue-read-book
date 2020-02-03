const env = require('./env')
let resUrl
let mp3FilePath
let dbHost
let dbUser
let dbPwd

if (env === 'dev') {
// 本机的nginx服务器目录
  resUrl = 'http://192.168.254.104:8081'
  // mp3文件路径(本地路径)
  mp3FilePath = 'F:/resouce/mp3'

  dbHost = 'localhost'
  dbUser = 'root'
  dbPwd = 'root'
} else if (env === 'prod') {
  // 阿里云ecs的nginx目录（因为端口号是80，所以可以忽略）
  resUrl = 'http://47.112.207.148'
  mp3FilePath = '/root/nginx/upload/mp3'

  dbHost = '47.112.207.148'
  dbUser = 'root'
  dbPwd = ''
}

// 分类名
const category = [
  'Biomedicine',
  'BusinessandManagement',
  'ComputerScience',
  'EarthSciences',
  'Economics',
  'Engineering',
  'Education',
  'Environment',
  'Geography',
  'History',
  'Laws',
  'LifeSciences',
  'Literature',
  'SocialSciences',
  'MaterialsScience',
  'Mathematics',
  'MedicineAndPublicHealth',
  'Philosophy',
  'Physics',
  'PoliticalScienceAndInternationalRelations',
  'Psychology',
  'Statistics'
]

module.exports = {
  resUrl,
  category,
  mp3FilePath,
  dbHost,
  dbUser,
  dbPwd
}
