const Base64 = require('js-base64').Base64
const md5 = require('js-md5')
const qs = require('qs')
const http = require('http')
const fs = require('fs')
const mp3FilePath = require('./const').mp3FilePath
const resUrl = require('./const').resUrl

function createVoice (req, res) {
  const text = req.query.text
  const lang = req.query.lang
  // const text = '讯飞科大语音测试'
  // const lang = 'cn'

  // 引擎类型
  let engineType = 'intp65'
  if (lang.toLowerCase() === 'en') {
    engineType = 'intp65_en'
  }
  // 语速，
  const speed = '30'
  // 1音频采样率 2音频编码 3发音人 4语速 5音量 6音高 7引擎类型 8文本类型
  const voiceParam = {
    auf: 'audio/L16;rate=16000',
    aue: 'lame',
    voice_name: 'xiaoyan',
    speed,
    volume: '50',
    pitch: '50',
    engine_type: engineType,
    text_type: 'text'
  }

  // utc时间
  const currentTime = Math.floor(new Date().getTime() / 1000)
  const appId = '5e118836'
  // apiKey
  const apiKey = '0ee06ec829deeebfd01b9b0082d15845'
  // param
  const xParam = Base64.encode(JSON.stringify(voiceParam))
  const checkSum = md5(apiKey + currentTime + xParam)
  const headers = {}
  headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8'
  headers['X-Param'] = xParam
  headers['X-Appid'] = appId
  headers['X-CurTime'] = currentTime
  headers['X-CheckSum'] = checkSum
  headers['X-Real-Ip'] = '127.0.0.1'
  const data = qs.stringify({
    text: text
  })
  const options = {
    host: 'api.xfyun.cn',
    path: '/v1/service/v1/tts',
    method: 'POST',
    headers
  }

  // http原生的方法
  const request = http.request(options, response => {
    let mp3 = ''
    // 查看返回内容的长度
    const contentLength = response.headers['content-length']
    // 将编码格式置为二进制文件
    response.setEncoding('binary')
    // 原生方法监听，接受到的内容
    response.on('data', data => {
      mp3 += data
      // 获取进度
      const process = data.length / contentLength * 100
      const percent = parseInt(process.toFixed(2))
      console.log(percent)
    })
    response.on('end', () => {
      // console.log(response.headers)
      // console.log(mp3)
      // 判断返回内容的类型
      const contentType = response.headers['content-type']
      if (contentType === 'text/html') {
        res.send(mp3)
      } else if (contentType === 'text/plain') {
        res.send(mp3)
      } else {
        // 保存文件到mp3，保存到nginx中 每次文件的名字都不一样
        const fileName = new Date().getTime()
        // 保存路径(实际的mp3输出路径)
        const filePath = `${mp3FilePath}/${fileName}.mp3`
        // 实际下载的路径
        const downloadUrl = `${resUrl}/mp3/${fileName}.mp3`
        // console.log(filePath, downloadUrl)
        // 写入数据 (参数：1 保存的路径，2数据 3文件的类型 4回调)
        fs.writeFile(filePath, mp3, 'binary', err => {
          if (err) {
            res.json({
              error: 1,
              msg: '下载失败'
            })
          } else {
            res.json({
              error: 0,
              msg: '下载成功',
              path: downloadUrl
            })
          }
        })
      }
    })
  })
  request.write(data)
  request.end()
}

module.exports = createVoice
