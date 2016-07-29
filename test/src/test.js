import NodeBatis from '../../dist/nodebatis'
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
    password: 'root'
})

nodebatis.define('test.findAll', {
    name: /^\d+/,
    age: Types.INT
})

let findAll = async () => {
    try {
        let result = await nodebatis.query('test.findAll')
        console.log('result', JSON.stringify(result))
    } catch (e) {
        console.log(e)
    }
}

findAll()

let findByAge = async () => {
    let result = await nodebatis.query('test.findByAge', {
        age: 20
    })
    console.log('result', JSON.stringify(result))
}

findByAge()
