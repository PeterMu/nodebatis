import Rule from './rule'
import path from 'path'

export default class {
    constructor(dir) {
        this.container = new Map() 
        let files = fs.readdirSync(dir)
        for (var file of files) {
            if(file.indexOf('.swp') == -1) {
                rule = new Rule(path.join(dir, file))
                this.container.set(rule.namespace, rule.rawSQL)
            }
        }
    }

    get(key, data) {
    }

    getRaw(key) {
        let keys = key.split('.'), sql = null 
        if (keys.length < 2) {
            console.error('wrong key, the right key is xxx.xxx')
            return
        }
        let namespace = keys[0]
        let sqlKey = keys.slice(1).join('')
        let sqlMap = this.container.get(namespace)
        if (sqlMap) {
            sql = sqlMap.get(sqlKey)
            if (!sql) {
                console.error('The sql:', key, 'not exists!')
            }
        } else {
            console.error('The namespace:', namespace, 'not exists!')
        }
        return sql
    }
}

