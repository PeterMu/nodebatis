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
        let model = this.get(key)
    }
}

