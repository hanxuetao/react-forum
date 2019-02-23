const axios = require('axios')
const queryString = require('query-string')
const baseUrl = ' https://cnodejs.org/api/v1'

module.exports = function (req, res, next) {
  const paramUrl = req.url
  console.log(paramUrl)
  const user = req.session.user || {}
  const needAccessToken = req.query.needAccessToken

  if (needAccessToken && !user.accessToken) {
    res.status(401).send({
      success: false,
      msg: 'need login'
    })
  }

  const query = Object.assign({}, req.query, {
    accesstoken: (needAccessToken && req.method === 'GET') ? user.accessToken : ''
  })
  if (query.needAccessToken) delete query.needAccessToken

  axios({
    url: `${baseUrl}${paramUrl}`,
    method: req.method,
    parms: req.query,
    //  {'accesstoken: xxxx'} 转化后 'accesstoken=xxx'
    data: queryString.stringify(Object.assign({}, req.body, {
      accesstoken: (needAccessToken && req.method === 'POST') ? user.accessToken : ''
    })),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(resp => {
    if (resp.status === 200) {
      res.send(resp.data)
    } else {
      res.status(resp.status).send(resp.data)
    }
  })
    .catch(err => {
      if (err.response) {
        res.status(500).send(err.response.data)
      } else {
        res.status(500).send({
          success: false,
          msg: 'Uknown Error'
        })
      }
    })
}
