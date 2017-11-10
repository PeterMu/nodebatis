const NodeBatis = require('../../dist/nodebatis')
const path = require('path')

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
        acquireIncrement: 5,
    },
})

let transationTest = async () => {
    let tdao = await nodebatis.getTransation()
    try {
        let result3 = await tdao.update('test', { id: 2, name: 'peter', age: 18 })
        let result1 = await tdao.insert('test', { name123: 'peter', age: 28 })
        let result2 = await tdao.query('test.query', { name: 'peter' })
        await tdao.commit()
        return result2
    } catch (e) {
        console.log(e)
        await tdao.rollback()
    }
}
;(async function() {
    try {
        let result = await transationTest()
        console.log(result)
    } catch (err) {
        console.log(err)
    }
})()
