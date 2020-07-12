const express = require('express')
const path = require('path')
const router = require('./router')
const bodyParser = require('body-parser')
const session = require('express-session')

const app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

app.engine('html', require('express-art-template'))

// 默认就是./views目前，若想改，则修改此行代码即可
app.set('views', path.join(__dirname, './views/'))

//配置解析表单POST请求体插件
app.use(bodyParser.urlencoded({ extended:false }))
app.use(bodyParser.json())

app.use(session({
    secret: 'itcast',
    resave: false,
    saveUninitialized: true
  }))

app.use(router)

//配置一个处理404的中间件
app.use( (req, res) => {
    res.render('404.html')
})

//配置一个全局错误处理中间件
app.use( (err, req, res, next) =>{
    res.status(500).json({
        err_code: 500,
        message: err.message
    })
})

app.listen(3000, () => {
    console.log('Server is Running...')
})