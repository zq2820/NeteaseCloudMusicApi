// 歌曲分片数据

const crypto = require('crypto')
const { resolve } = require('path')
const { cookieToJson } = require('../util/index')
module.exports = (query, request) => {
  if (typeof query.cookie === 'string') {
    query.cookie = cookieToJson(query.cookie)
  }
  if (!('MUSIC_U' in query.cookie))
    query.cookie._ntes_nuid = crypto.randomBytes(16).toString('hex')
  query.cookie.os = 'pc'
  const data = {
    ids: '[' + query.id + ']',
    br: parseInt(query.br || 320000),
  }
  return request(
    'POST',
    `https://interface3.music.163.com/eapi/song/enhance/player/url`,
    data,
    {
      crypto: 'eapi',
      cookie: query.cookie,
      proxy: query.proxy,
      realIP: query.realIP,
      url: '/api/song/enhance/player/url',
    },
  ).then((res) => {
    console.log(res.body.data[0].url)
    return request(
      'GET',
      res.body.data[0].url,
      {},
      {},
      {
        range: `bytes=${query.begin}-${query.end}`,
      },
      'arraybuffer',
    )
  })
}
