'use strict'

const Lang = require('accept-language')
Lang.languages(setting.languages)

module.exports = [
  
  {
    method: 'GET',
    path: '/api',
    handler(request, respondWith) {
      respondWith({
        lang: Lang.get( request.headers['accept-language'] ),
      })
    },
  },
  
  {
    method: 'GET',
    path: '/api/content/{page}',
    handler(request, respondWith) {
      respondWith.file(`${setting.root}/content/${request.params.page}.json`)
    },
  },
  
]
