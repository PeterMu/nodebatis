import validator from 'validator'

export default class {
    constructor() {
        this.map = new Map()
    }

    set(key, model) {
        if (key instanceof RegExp) {
            key = '__reg__' + key.toString()
        }
        this.map.set(key, model)
    }

    get(key) {
        let realKey = key
        let keys = this.map.keys()
        for (let value of keys) {
            if (value.indexOf('__reg__') != -1) {
                if (new RegExp(value.replace('__reg__', '').slice(1, -1)).test(key)) {
                    realKey = value
                    break
                }
            }
        }
        return this.map.get(realKey)
    }

    validate(key, data) {
        let errors = [] 
        let model = this.get(key)
        if (typeof data == 'object') {
            if (Object.prototype.toString.call(data) == '[object Array]') {
                data = data[0]
            }
            if (model) {
                for (let name in model) {
                    let dataType = model[name]
                    if (dataType instanceof RegExp) {
                        if (!dataType.test(data[name])) {
                            errors.push(key + ': ' + name + ' should match ' + model[name].toString())
                        }
                    } else {
                        if (dataType != 'isString' && !validator[dataType](data[name].toString())) {
                            errors.push(key + ': ' + name + ' should ' + model[name].replace('is', 'be '))
                        }
                    }
                }
            }
        }
        if (errors.length > 0) {
            return errors
        } else {
            return null
        }
    }
}

