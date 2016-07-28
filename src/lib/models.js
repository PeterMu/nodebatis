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
        if (model) {
            for (let obj of data) {
                for (let name in model) {
                    let dataType = model[name]
                    if (dataType != '' && !validator[dataType](obj[name].toString())) {
                        errors.push(key + ' ' + name + ' should ' + model[name])
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

