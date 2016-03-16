const t = require('tap')

const f = require('node-fetch')
const rf = require('fs').readFileSync

const root = 'http://localhost:8080/api'

t.test('GET /api', t => {
  
  return f(root).then(r => {
    
    t.equal(r.headers.get('content-type'), 'application/json; charset=utf-8')
    
    return r.json()
  })
  .then(t.end)
})
.then(t => {
  
  return t.test('GET /api/content/index', t => {
    
    return f(root + '/content/index').then(r => {
      
      t.equal(r.headers.get('content-type'), 'application/json; charset=utf-8')
      
      return r.json()
    })
    .then(data => {
      
      t.deepEqual(data, JSON.parse(rf(`${__dirname}/../content/index.json`, 'utf8')))
      t.end()
    })
  })
})
.catch(t.threw)
