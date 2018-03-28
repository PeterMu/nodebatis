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
    cache: {
        store: {
            type: 'memory'
        },
        cacheList: [{
            name: 'test.find',
            refresh: [{
                type: 'table',
                action: ['insert', 'update', 'delete']
            }, {
                type: 'sql',
                action: 'test.update'
            }]
        }]
    }
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

let updateTest = async () => {
	let ret = await nodebatis.update('test', { id: 1, age: 21, name: 'bezos' }, 'id')
	console.log('updateTest', ret)
}

let deleteTest = async () => {
	let ret = await nodebatis.del('test', 1, 'id')
	console.log('deleteTest', ret)
}

let whereUnionTest = async () => {
	let ret = await nodebatis.query('test.whereUnionTest', {})
	console.log('whereUnionTest:', ret)
}

insertTest()
updateTest()
deleteTest()
queryTest()
whereUnionTest()
