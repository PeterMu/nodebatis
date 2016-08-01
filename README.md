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

# 如何编写 SQL 语句定义文件

定义 SQL 语句采用 yaml 语法。一个 SQL 语句定义文件就是一个 yaml 文档。

如果你还不熟悉 yaml，可以参考这篇教程：[YAML 语言教程](http://www.ruanyifeng.com/blog/2016/07/yaml.html)

SQL yaml 文档的约定的规则很简单。

1. 开头需要写 `namespace: xxx`, `xxx` 为自己定义的命名空间。
2. 定义 SQL 语句 `key: sql` , `namespace.key` 就是定义的 SQL 语句的唯一索引。
3. SQL 语句中的参数。
    * `:paramName`, `paramName` 为执行 SQL 语句时传递的参数名。 
    * `::ddl`, `ddl` 为 DDL 语句，不会对参数进行过滤。 
    * `{{namespace.key}}`, SQL 语句继承，会获取到 `namespace.key` 的 SQL 语句填充到此处。
4. 条件判断。

```
if:
    test: expression
    sql: statements
```
当 expression 为 true 是，对应的 sql 会添加到 sql 语句中。 expression 就是一个 JS 语句, 可以通过 `:paramName` 传递参数。

Demo:

demo.yml

```
//namespace: xxx
namespace: 'demo'

//key: sql
test: 'select * from demo'

// param
paramDemo:
    - select * from demo
    - where name = :paramName
    - and age > 18

// ddl param
ddlDemo: create table {{tableName}} (id int primary key, name vachar(32))

//expression
expressionDemo:
    - select * from demo where
    - if:
        test: :paramName == 'nodebatis' && :age > 18
        sql: and sex = 'man'

//当传入的参数 paramName 为 nodebatis 并且 age 大于 18 时，生成的 SQL 语句为: select * from demo where sex = 'man'

// extends

attrs: id, name, age

extendsDemo: select {{ demo.attrs }} from demo // select id ,name, age from demo

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
