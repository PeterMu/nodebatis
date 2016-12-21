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
    password: 'root',
    pool: {
        minSize: 5,
        maxSize: 20,
        acquireIncrement: 5
    }
})

nodebatis.define(/^test.findAll$/, {
    name: /^\d+/,
    age: Types.INT
})

let findAll = async () => {
    try {
        let result = await nodebatis.execute('test.findAll')
        console.log('result', JSON.stringify(result))
    } catch (e) {
        console.log(e)
    }
}

let findByAge = async () => {
    let result = await nodebatis.execute('test.findByAge', {
        age: 20
    })
    console.log('result', JSON.stringify(result))
}

let insertTest = async () => {
    let ret = await nodebatis.insert('test', {
        age: 18,
        name: 'haha'
    })
    console.log(ret)
}

let updateTest = async () => {
    let ret = await nodebatis.update('test', {
        id: 3,
        age: 19,
        name: 'haha'
    })
    console.log(ret)
}

let deleteTest = async () => {
    let ret = await nodebatis.del('test', 5)
    console.log(ret)
}

deleteTest()

