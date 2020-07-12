var express = require('express')
var md5 = require('blueimp-md5')
var User = require('./models/user')
var router = express.Router()

router.get('/', function (req, res) {
    res.render('index.html', {
        user: req.session.user
    })
})

//登录
router.get('/login', function (req, res) {
    res.render('login.html')
})

router.post('/login', function (req, res, next) {
    // 1. 获取表单数据
    // 2. 查询数据
    // 3. 发送响应
    var body = req.body
    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, (err, user) => {
        if (err) {
            // return res.status(500).json({
            //     err_code: 500,
            //     message: err.message
            // })
            return next(err)
        } 

        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: "Email or password is invalid."
            })
        }
        //用户存在登录成功
        req.session.user = user

        res.status(200).json({
            err_code: 0,
            message: 'Ok'
        })
    })
})

//注册
router.get('/register', function (req, res) {
    res.render('register.html')
})

router.post('/register', function (req, res, next) {
    //1.获取表单提交的数据
    //2.操作数据库
    //  判断该用户是否存在
    //  若存在，则不允许注册
    //  若不存在，则注册新用户
    //3.发送响应
    var body = req.body
    User.findOne({
        $or: [
            { email: body.email }, 
            { nickname: body.nickname }
        ]
    }, (err, data) => {
        if (err) {
            // return res.status(500).json({
            //     err_code: 500,
            //     message: 'Server Error'
            // })
            return next(err)
        } 
        if (data) {
            // 邮箱或者昵称已存在
            return res.status(200).json({
                err_code: 1,
                message: 'Email or nick name already exists!'
            })
        }
        //保存注册的数据
        //重复加密
        body.password = md5(md5(body.password))

        new User(body).save( (err, user) => {
            if (err) {
                return res.status(500).json({
                    err_code: 500,
                    message: 'Server Error'
                })
            }
            //注册成功，使用session 记录用户的登录状态
            req.session.user = user

            res.status(200).json({
                err_code: 0,
                message: 'Ok'
            })

        })
    })
})

//退出
router.get('/logout', (req, res) => {
    //清楚登录状态
    //返回首页
    req.session.user = null
    res.redirect('/login')
})

module.exports = router

// router.post('/register', async function (req, res) {
//     var body = req.body
//     console.log(body)
//     try {
//         if (await User.findOne({
//                 email: body.email
//             })) {
//             return res.status(200).json({
//                 err_code: 1,
//                 message: 'Email name already exists!'
//             })
//         }

//         if (await User.findOne({
//                 nickname: body.nickname
//             })) {
//             return res.status(200).json({
//                 err_code: 2,
//                 message: 'nickname already exists!'
//             })
//         }


//         //保存注册的数据
//         //重复加密
//         body.password = md5(md5(body.password))

//         //创建用户
//         await new User(body).save()

//         res.status(200).json({
//             err_code: 0,
//             message: 'Ok'
//         })
//     } catch (err) {
//         res.status(500).json({
//             err_code: 500,
//             message: err.message
//         })
//     }
// })