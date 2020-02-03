const env = require('env')
let resUrl
let mp3FilePath

if (env === 'dev') {
// 本机的nginx服务器目录
  resUrl = 'http://192.168.254.104:8081'
  // mp3文件路径(本地路径)
  mp3FilePath = 'F:/resouce/mp3'
} else if (env === 'prod') {
  // 阿里云ecs的nginx目录（因为端口号是80，所以可以忽略）
  resUrl = 'http://47.112.207.148'
  mp3FilePath = '/root/nginx/upload/mp3'
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
  mp3FilePath
}
