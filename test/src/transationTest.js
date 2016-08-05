import NodeBatis from '../../src/nodebatis'
import util from 'util'
import path from 'path'

const Types = NodeBatis.Types

const nodebatis = new NodeBatis(path.resolve(__dirname, '../yaml'), {
    debug: true,
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'test',
    user: 'root',
    password: 'root',
    pool: {
        minSize: 5,
        maxSize: 20,
        acquireIncrement: 5
    }
})

let transationTest = async () => {
    let conn = null
    try {
        conn = await nodebatis.beginTransation()
        console.log('begin insert...')
        await conn.execute('test.insertOne', {
            name: 'name3',
            age: 19
        })
        console.log('end insert')
        console.log('begin find ...')
        let result = await conn.execute('test.findTest')
        console.log(result)
        nodebatis.commit(conn)
        return result
    } catch (e) {
        console.log(e)
        nodebatis.rollback(conn)
    } finally {
        conn && nodebatis.releaseConn(conn)
    }
}

transationTest()
