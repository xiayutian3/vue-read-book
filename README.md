# vue-read-book
- 1.打开本地nginx服务器
- 1.1运行mysql数据库(数据库装在电脑上，默认是是开启状态（和mongoodb一样，默认都是开启的），这步可以忽略)
- 1.2打开node+express 服务器：npm run dev  
- 2.运行项目 npm run serve
- 3.输入地址（例如）localhost 或者IP
- http://localhost:8080/#/ebook/History|2018_Book_GlobalHistoryAndNewPolycentric
## tips：
- 换成本地服务node+express +mysql 后，除了语音功能外，其他功能都没有问题，
- 科大讯飞语音文档，api接口都更新了，所以换成本地服务后，语音用不了(2020/1/7)

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
