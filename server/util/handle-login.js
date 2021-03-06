const router = require('express').Router()
const axios = require('axios')

const baseUrl = ' https://cnodejs.org/api/v1'

router.post('/login', function (req, res, next) {
  axios.post(`${baseUrl}/accesstoken`, {
    accesstoken: req.body.accessToken
  })
    .then(resp => {
      if (resp.status === 200 && resp.data.success) {
        req.session.user = {
          accessToken: req.body.accessToken,
          loginname: resp.data.loginname,
          id: resp.data.id,
          avatar_url: resp.data.avatar_url
        }
        res.json({
          success: true,
          data: resp.data
        })
      }
    })
    .catch(err => {
      if (err.response) {
        res.json({
          success: false,
          data: err.response.data
        })
      } else {
        next(err)
      }
    })
})

module.exports = router

//  登陆接口文件 首先post accesstoken请求给 cnode /accesstoken api
//  然后如果返回200 则获取来自 /accesstoken接口的用户相关数据 并且以json格式接受
//  如果有报错 接受以json格式返回的报错
