module.exports = [
  
  {
    method: 'GET',
    path: '/{path*}',
    handler(request, respondWith) {
      respondWith.file('./exports/index.html')
    },
  },
  
  {
    method: 'GET',
    path: '/use/{path*}',
    handler(request, respondWith) {
      respondWith.file(`./exports/${request.params.path}`)
    },
  },
  
]
