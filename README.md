# nodebatis [![npm](https://img.shields.io/npm/v/nodebatis.svg)](https://www.npmjs.com/package/nodebatis)  [![npm](https://img.shields.io/npm/dt/nodebatis.svg)](https://www.npmjs.com/package/nodebatis)

A sql style orm lib for nodejs(similar to mybatis on java)

Only support mysql, others are under development.

Only support node > v7.6.0. If you use node(< v7.6.0), you can use nodebatis(<= v2.2.1)(NOT RECOMMENDED).

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
    let result = await nodebatis.execute('test.findByAge', {
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
ddlDemo: create table ::tableName (id int primary key, name vachar(32))

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

#### config.debug { Boolean }
默认为 false，当为 true 时，会打印执行的 sql 语句

#### config.dialect { String }
支持的数据库方言，目前支持的配置有：mysql

#### config.host { String }
数据库地址

#### config.port { Int }
数据库端口地址

#### config.database { String }
要连接的数据库名称

#### config.user { String }
连接数据库的用户名

#### config.password { String }
连接数据库的用户密码

#### config.charset { String }
默认为：utf8，数据库连接的字符编码

#### config.camelCase { Boolean }
默认为：false ，为 true 时将结果集中下划线分割的属性名(比如：user_name)，映射为小驼峰的形式(userName)

#### pool
连接池配置, 连接池的配置支持情况取决于数据库连接驱动的支持情况。

#### pool.minSize { Int }
连接池的最小连接数, 默认为 5

#### pool.maxSize { Int }
连接池的最大连接数, 默认为 20

#### pool.acquireIncrement { Int }
连接数不够时，一次创建连接的数量，默认为 5

## nodebatis.beginTransation()
获取一个支持事务的链接

## nodebatis.getTransation()
获取一个支持事务的 nodebatis 实例，其实就是一系列的语法糖。使用方法相见 test 目录。

* 返回一个数据库连接

## nodebatis.commit(connection)
提交事务

* connection 为要操作的数据库连接

## nodebatis.rollback(connection)
回滚事务

* connection 为要操作的数据库连接

## nodebatis.releaseConn(connection)
释放数据库连接

* connection 为要操作的数据库连接

## nodebatis.query(key, data[, connection])
执行 SQL 语句

* key 为要执行的 sql 语句的 key，即：namespace.xxx
* data 为传递的数据
* connection 为开启事务时，获取的支持事务的链接
* 返回对应数据库驱动执行 sql 语句后的结果集

## nodebatis.execute(key, data)
执行 SQL 语句 建议使用更语义化的 query 方法

## nodebatis.insert(tableName, data[, connection])
执行插入数据

* tablename 为要操作的表名
* data 为传递的数据对象，data 的 key 为对应表的字段，值为要插入的值
* connection 为开启事务时，获取的支持事务的链接


## nodebatis.update(tableName, data, idKey = "id"[, connection])
更新数据

* tablename 为要操作的表名
* data 为传递的数据对象，data 的 key 为对应表的字段，值为要插入的值
* idKey 为主键名称
* connection 为开启事务时，获取的支持事务的链接


## nodebatis.del(tableName, id, idKey = "id"[, connection])
删除数据

* tablename 为要操作的表名
* id 为要删除的主键值
* idKey 为主键名称
* connection 为开启事务时，获取的支持事务的链接

## NodeBatis.Types
支持的数据类型，用户验证返回的结果集是否符合定义的数据模型。

```
STRING
NUMBER
INT
FLOAT
DECIMAL
BOOLEAN
DATE
UUID
URL
IP
EMAIL
MONGOID
JSON
MATCHES //正则匹配，default is /\.*/
```

## nodebatis.define(key, model)
定义数据模型，用于校验对象属性的数据类型

* key 为对应的 sql 语句的 key，支持正则匹配
* model 为要定义的数据模型

```
nodebatis.define('namespace.xxx', {
    name: NodeBatis.Types.STRING,
    age: NodeBatis.Types.INT
})
```
