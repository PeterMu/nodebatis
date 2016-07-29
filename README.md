nodebatis
=========

支持原生 SQL 的轻量化 ORM 框架。

# 适用场景

如果你觉得传统 ORM 框架笨笨的，恭喜你找到了答案。
在 NodeBatis 里，SQL 作为一等公民对待，直接写 SQL 是最灵活的方式。

# 使用样例

## 定义 SQL 语句

test.yml

```
namespace: 'test'

findByAge:
    - select name, age from test where
    - if:
        test: :age > 19
        sql: and name = 'name1'
```

## 定义 Model

model.js

```
import NodeBatis from 'nodebatis'

const nodebatis = new NodeBatis(path.resolve(__dirname, '../yaml'), {
    debug: true,
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'test',
    user: 'root',
    password: 'root'
})

let findByAge = async () => {
    let result = await nodebatis.query('test.findByAge', {
        age: 20
    })
    return result
}

findbyAge() // return [{name: 'name1', age: 18}, {name: 'name2', age: 20}]

```
# GET START

...

coming soon ...
