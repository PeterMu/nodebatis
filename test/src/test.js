const NodeBatis = require('../../src/nodebatis')
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

let queryTest = async (name, age) => {
	try {
		let ret = await nodebatis.query('test.query', { name, age })
		console.log('queryTest:', JSON.stringify(ret))
	} catch (e) {
		console.log(e)
	}
}

let insertTest = async () => {
	let ret = await nodebatis.insert('test', { age: 29, name: 'peter' })
	console.log('insertTest:', ret)
}

let batchInsertTest = async () => {
	let ret = await nodebatis.query('test.batchInsert', {
        data: [{
            name: 'batch-' + parseInt(Math.random() * 10),
            age: 18
        },{
            name: 'batch-' + parseInt(Math.random() * 10),
            age: 18
        },{
            name: 'batch-' + parseInt(Math.random() * 10),
            age: 18
        }]
    })
	console.log('bathInsertTest:', ret)
}

let updateTest = async () => {
	let ret = await nodebatis.update('test', { id: 1, age: 21, name: 'bezos' }, 'id')
	console.log('updateTest', ret)
}

let deleteTest = async () => {
	let ret = await nodebatis.del('test', 36, 'id')
	console.log('deleteTest', ret)
}

let whereUnionTest = async () => {
	let ret = await nodebatis.query('test.whereUnionTest', {})
	console.log('whereUnionTest:', ret)
}

let forTest = async () => {
	try {
        let ids = [{
            id: 1
        },{
            id: 2
        },{
            id: 3
        }]
		let ret = await nodebatis.query('test.forTest', { ids })
		console.log('forTest:', JSON.stringify(ret))
	} catch (e) {
		console.log(e)
	}
}

//insertTest()
//batchInsertTest().then(() => {
//    queryTest()
//})
//updateTest()
//deleteTest()
//queryTest('batch-2')
//queryTest()
queryTest('peter', 29)
//whereUnionTest()
//forTest()

