const t = require('tap')

const f = require('node-fetch')
const rf = require('fs').readFileSync

const root = 'http://localhost:8080'

t.test('GET /', t => {
  
  return f(root).then(r => {
    
    t.equal(r.headers.get('content-type'), 'text/html; charset=utf-8')
    
    return r.text()
  })
  .then(body => {
    
    t.equal(body, rf(`${__dirname}/../exports/index.html`, 'utf8'))
    t.end()
  })
})
.then(t => {
  return t.test('GET /nonexistant', t => {
    
    return f(root + '/nonexistant').then(r => {
      
      t.equal(r.headers.get('content-type'), 'text/html; charset=utf-8')
      
      return r.text()
    })
    .then(body => {
      
      t.equal(body, rf(`${__dirname}/../exports/index.html`, 'utf8'))
      t.end()
    })
  })
})
.catch(t.threw)
