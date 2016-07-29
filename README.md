nodebatis
=========

支持原生 SQL 的轻量化 ORM 框架。

目前只支持 Mysql，其它数据库的支持正在开发中...

# 适用场景

如果你觉得传统 ORM 框架笨笨的，恭喜你找到了答案。
在 NodeBatis 里，SQL 作为一等公民对待，直接写 SQL 是最灵活的方式。

# Getting Started 

## Installation 

```
npm install nodebatis --save
```

## 创建连接池

```
import NodeBatis from 'nodebatis'
import path from 'path'

const nodebatis = new NodeBatis(path.resolve(__dirname, '../yaml'), {
    debug: true,
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'test',
    user: 'root',
    password: 'root'
})
```

## 定义 SQL 语句

test.yml

```
namespace: 'test'

findByAge:
    - select name, age from test where
    - age > :age
```

## 执行 SQL 语句 

model.js

```
let findByAge = async () => {
    let result = await nodebatis.query('test.findByAge', {
        age: 18 
    })
    return result
}

findbyAge() //return [{name: 'name1', age: 20}]

```

# API

约定 `NodeBatis` 是类，`nodebatis` 是 `NodeBatis` 实例化的一个对象。

## NodeBatis(ymlDir, config)
使用 NodeBatis 时，要做的第一件事就是实例化 NodeBatis 对象

### ymlDir { String }
定义 SQL 的 yml 文件存放目录

### config { Object }
配置信息

#### config.dialect { String }

## nodebatis.query(key, data) 
执行 SQL 语句

## nodebatis.beginTransation() 
## nodebatis.commit(connection)
## nodebatis.rollback(connection)
## nodebatis.releaseConn(connection)
## NodeBatis.Types
## nodebatis.define(key, model) 
定义数据模型，用于校验对象属性的数据类型


coming soon ...
