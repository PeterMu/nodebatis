const path = require('path')
const Rule = require('../../src/lib/rule')

const ymlPath = path.resolve(__dirname, '../test.yml')
const rule = new Rule(ymlPath)

describe('new Rule', () => {
  test('load yml file', () => {
    expect(rule.doc).toBeDefined()
  })

  test('get namespace', () => {
    expect(rule.namespace).toBe('test')
  })
})

describe('getSql', () => {
  test('plain sql', () => {
    let sql = 'select * from test'
    rule.getSql('plainSql', sql)
    expect(rule.rawSql.get('plainSql')).toEqual([sql])
  })

  test('has if', () => {
    let sql = ['select * from test', {
      if: {
        test: ':name',
        sql: 'and name = :name'
      }
    }]
    rule.getSql('ifSql', sql)
    expect(rule.rawSql.get('ifSql')).toEqual([
      'select * from test',
      { name: 'if', test: ':name', sql: 'and name = :name' }
    ])
  })

  test('has for', () => {
    let sql = ['select * from test where id in (', {
      for: {
        array: ':ids',
        sql: ':id',
        seperator: ','
      }
    }, ')']
    rule.getSql('forSql', sql)
    expect(rule.rawSql.get('forSql')).toEqual([
      'select * from test where id in (',
      { name: 'for', array: ':ids', sql: ':id', seperator: ',' },
      ')'
    ])
  })
})

