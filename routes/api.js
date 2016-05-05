'use strict'

module.exports = [
  
  {
    method: 'GET',
    path: '/api',
    handler(request, respondWith) {
      respondWith({
        lang: request.pre.language,
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
