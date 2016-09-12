import yaml from 'js-yaml'
import fs from 'fs'

export default class {
    constructor(file) {
        this.doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'))
        this.namespace = this.doc.namespace
        this.rawSql = new Map() 
        this.getAllSql()
    }

    getAllSql() {
        for (let key in this.doc) {
            if (key != 'namespace') {
                this.getSql(key, this.doc[key])
            }
        }
    }

    getSql(name, sql) {
        let sqls = [], cond = {}
        if (typeof sql == 'string') {
            sqls.push(sql.replace(/\n/g, '').trim())
        } else {
            for (let s of sql) {
                if (typeof s == 'string') {
                    sqls.push(s.replace(/\n/g, '').trim())
                } else {
                    for (let key in s) {
                        cond = {}
                        cond.name = key
                        switch (key) {
                            case 'if':
                                cond.test = s['if'].test
                        }
                        cond.sql = s['if'].sql
                    }
                    sqls.push(cond)
                }
            }
        }
        this.rawSql.set(name, sqls)
    }
}

