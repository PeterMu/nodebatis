const rewire = require('rewire')
const sqlBuilder = require('../../src/lib/sqlBuilder')

describe('getInsertSql', () => {
  test('normal', () => {
    let ret = sqlBuilder.getInsertSql('test', {
      column1: '1',
      column2: '2'
    })
    expect(ret).toMatchObject({
      sql: 'insert into `test` (`column1`,`column2`) values (?,?)',
      params: ['1', '2']
    })
  })

  test('tableName is null', () => {
    expect(() => {
      sqlBuilder.getInsertSql(null, {
        column1: '1'
      })
    }).toThrow()
  })

  test('data is null', () => {
    expect(() => {
      sqlBuilder.getInsertSql('test', null)
    }).toThrow()
  })
})

describe('getUpdateSql', () => {
  test('normal', () => {
    let ret = sqlBuilder.getUpdateSql('test', {
      id: 'id',
      column1: 'column1'
    })
    expect(ret).toMatchObject({
      sql: 'update `test` set `column1` = ? where `id` = ?',
      params: ['column1', 'id']
    })
  })

  test('idKey is null', () => {
    let ret = sqlBuilder.getUpdateSql('test', {
      column1: 'column1'
    }, null)
    expect(ret).toMatchObject({
      sql: 'update `test` set `column1` = ? ',
      params: ['column1']
    })
  })

  test('idKey does not exist', () => {
    expect(() => {
      sqlBuilder.getUpdateSql('test', {
        column1: 'column1'
      })
    }).toThrow()
  })

  test('tableName or data is null', () => {
    expect(() => {
      sqlBuilder.getUpdateSql(null, null)
    }).toThrow()
  })
})

describe('getDelSql', () => {
  test('normal', () => {
    let ret = sqlBuilder.getDelSql('test', 1)
    expect(ret).toMatchObject({
      sql: 'delete from `test` where `id` = ?',
      params: [1]
    })
  })

  test('idKey is null', () => {
    let ret = sqlBuilder.getDelSql('test', 'any', null)
    expect(ret).toMatchObject({
      sql: 'delete from `test`',
      params: []
    })
  })

  test('tableName is null', () => {
    expect(() => {
      sqlBuilder.getDelSql(null)
    }).toThrow()
  })
})

describe('getSqlFromObject', () => {
  test('normal', () => {
    let _sqlBuilder = rewire('../../src/lib/sqlBuilder')
    let ret = _sqlBuilder.__get__('getSqlFromObject')({
      equal: 'equal',
      neq: {
        $neq: 'neq'
      }
    })
    expect(ret).toMatchObject({
      sql: [ '`equal` = ?', '`neq` <> ?' ],
      params: [ 'equal', 'neq' ]
    })
  })

  test('$in', () => {
    let _sqlBuilder = rewire('../../src/lib/sqlBuilder')
    let ret = _sqlBuilder.__get__('getSqlFromObject')({
      inTest: {
        $in: [1, 2, 3]
      }
    })
    expect(ret).toMatchObject({
      sql: ['`inTest` in (?,?,?)'],
      params: [1, 2, 3]
    })
  })
})

describe('getSelectSql', () => {
  test('normal', () => {
    let ret = sqlBuilder.getSelectSql('test', {
      equal: 'equal',
      neq: {
        $neq: 'neq'
      },
      like: {
        $like: '%like%'
      },
      in: {
        $in: [1, 2, 3]
      }
    })
    expect(ret).toMatchObject({
      sql: 'select * from `test` where `equal` = ? and `neq` <> ? and `like` like ? and `in` in (?,?,?)',
      params: [ 'equal', 'neq', '%like%', 1, 2, 3 ]
    })
  })

  test('normalByPage', () => {
    let ret = sqlBuilder.getSelectSql('test', {
      equal: 'equal',
      neq: {
        $neq: 'neq'
      },
      like: {
        $like: '%like%'
      },
      in: {
        $in: [1, 2, 3]
      }
    }, 0 , 10, 'orderName', 'desc')
    expect(ret).toMatchObject({
      sql: 'select * from `test` where `equal` = ? and `neq` <> ? and `like` like ? and `in` in (?,?,?) order by ? ? limit ? offset ?',
      params: [ 'equal', 'neq', '%like%', 1, 2, 3, 'orderName', 'desc', 10, 0 ]
    })
  })

  test('data is null', () => {
    let ret = sqlBuilder.getSelectSql('test')
    expect(ret).toMatchObject({
      sql: 'select * from `test`',
      params: []
    })
  })
})

describe('getCountSql', () => {
  test('normal', () => {
    let ret = sqlBuilder.getCountSql('test', {
      equal: 'equal',
      neq: {
        $neq: 'neq'
      },
      like: {
        $like: '%like%'
      },
      in: {
        $in: [1, 2, 3]
      }
    })
    expect(ret).toMatchObject({
        sql: 'select count(*) count from `test` where `equal` = ? and `neq` <> ? and `like` like ? and `in` in (?,?,?)',
        params: [ 'equal', 'neq', '%like%', 1, 2, 3 ]
    })
  })

  test('data is null', () => {
    let ret = sqlBuilder.getCountSql('test')
    expect(ret).toMatchObject({
      sql: 'select count(*) count from `test`',
      params: []
    })
  })
})
