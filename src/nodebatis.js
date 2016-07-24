import Pool from './lib/pool'

export default class {
    constructor(config) {
        if (!config) {
            throws new Error('please set config!')
        }
        this.pool = new Pool(config)
    }
}
