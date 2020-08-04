const path = require('path')
const SqlContainer = require('../../src/lib/sqlContainer')

const ymlPath = path.resolve(__dirname, '..')
const sqlContainer = new SqlContainer(ymlPath)

describe('constructor', () => {
  test('create by dir', () => {
    expect(sqlContainer.container.get('test')).toBeDefined()
  })
})

describe('get', () => {
  test('get by key', () => {
    let sql = sqlContainer.get('test.query', {
      age: 10,
      name: 'test'
    })
    expect(sql).toEqual({
      sql: 'select  id, name, age  from test where name = ?',
      params: [ 'test' ]
    })
  })
})

describe('getRaw', () => {
  test('normal', () => {
    let sqls = sqlContainer.getRaw('test.whereUnionTest', {
      age: 20,
      name: 'test'
    })
    expect(sqls).toEqual([
      'select * from test where ',
      { name: 'if', test: ':age > 18', sql: 'and age = :age' },
      { name: 'if', test: 'name', sql: 'and name = :name' },
      'union all',
      'select * from test where',
      { name: 'if', test: ':name', sql: 'and name = :name' }
    ])
  })

  test('key not exists', () => {
    expect(() => {
      sqlContainer.getRaw('test.not')
    }).toThrow()
  })
})

describe('_fillParams', () => {
  test('fill ::key', () => {
    let sql = 'select * from test wehre id in (::ids)'
    let ret = sqlContainer._fillParams(sql, {
      ids: '1,2,3'
    })
    expect(ret).toEqual({
      sql: 'select * from test wehre id in (1,2,3)',
      params: null
    })
  })

  test('fill :key', () => {
    let sql = 'select * from test wehre id = :id'
    let ret = sqlContainer._fillParams(sql, {
      id: 1
    })
    expect(ret).toEqual({
      sql: 'select * from test wehre id = ?',
      params: [1]
    })
  })
})

describe('_parseCond', () => {
  test('if true', () => {
    let cond = { name: 'if', test: ':age > 18', sql: 'and age = :age' }
    let ret = sqlContainer._parseCond(cond, {
      age: 20
    })
    expect(ret).toEqual({ sql: 'and age = ?', params: [ 20 ] })
  })

  test('if false', () => {
    let cond = { name: 'if', test: ':age > 18', sql: 'and age = :age' }
    let ret = sqlContainer._parseCond(cond, {
      age: 10
    })
    expect(ret).toEqual(null)
  })

  test('for', () => {
    let cond = { name: 'for', array: ':ids', sql: ':id', seperator: ',' }
    let ret = sqlContainer._parseCond(cond, {
      ids: [{
        id: 1
      },{
        id: 2
      }]
    })
    expect(ret).toEqual({ sql: '?,?', params: [ 1, 2 ] })
  })
})

describe('_parseRawSql', () => {
  test('normal', () => {
    let sqlArray = [
      'select * from test where ',
      { name: 'if', test: ':age > 18', sql: 'and age = :age' },
      { name: 'if', test: 'name', sql: 'and name = :name' },
      'union all',
      'select * from test where ids in (',
      { name: 'for', array: ':ids', sql: ':id', seperator: ',' },
      ')'
    ]
    let ret = sqlContainer._parseRawSql(sqlArray, {
      age: 20,
      ids: [{ id: 1 }, { id: 2 }, { id: 3 }]
    })
    expect(ret).toEqual({
      sql: 'select * from test where age = ? union all select * from test where ids in ( ?,?,? )',
      params: [ 20, 1, 2, 3 ]
    })
  })
})

