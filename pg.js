const pg = require('pg')
const assert = require('assert')

pg.defaults.ssl = true

pg.connect(process.env.DATABASE_URL, (err, client, done) => {
  assert(!err, 'Error')

  client.query('select * from sessions', (err, res) => {
    if(err) {
      throw err
    }
    console.log(res)
    client.end()
  })
  
})
