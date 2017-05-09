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
	let conn = null
	try {
		conn = await nodebatis.beginTransation()
		let result1 = await nodebatis.insert('test', { name: 'bezos', age: 22 }, conn)
		let result2 = await nodebatis.query('test.query', { name: 'bezos', age: 19 }, conn)
		let result3 = await nodebatis.update('test', { id: 1, name: 'Air', age: 25 }, 'id', conn)
		let result4 = await nodebatis.del('test', 1, 'id', conn)
		nodebatis.commit(conn)
		return result2
	} catch (e) {
		console.log(e)
		nodebatis.rollback(conn)
	} finally {
		conn && nodebatis.releaseConn(conn)
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
