import SqlContainer from '../src/lib/sqlContainer'

const container = new SqlContainer('./yaml/')

console.log('test.findAll', container.get('test.findAll'))
console.log('test.findById', container.get('test.findById', {
    name: 9,
    haha: 'haha',
    order: 'order by id'
}))
