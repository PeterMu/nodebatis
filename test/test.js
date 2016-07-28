import NodeBatis from '../src/nodebatis'
import util from 'util'
import Types from '../src/types'

const nodebatis = new NodeBatis('./yaml', {
    debug: true,
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'test',
    user: 'root',
    password: 'root'
})

nodebatis.define('test.findAll', {
    name: Types.STRING,
    age: Types.INT
})

let findAll = async () => {
    let result = await nodebatis.query('test.findAll')
    console.log('result', JSON.stringify(result))
}

findAll()

let findByAge = async () => {
    let result = await nodebatis.query('test.findByAge', {
        age: 20
    })
    console.log('result', JSON.stringify(result))
}

findByAge()
