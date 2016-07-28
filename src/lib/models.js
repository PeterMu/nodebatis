import validator from 'validator'

export default class {
    constructor() {
        this.map = new Map()
    }

    set(key, model) {
        this.map.set(key, model)
    }

    get(key) {
        return this.map.get(key)
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

