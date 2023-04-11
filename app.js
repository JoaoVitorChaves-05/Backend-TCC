import express from 'express'

class App {
    constructor() {
        this.app = express()
        this.middleware()
        this.routes()
        this.app.use(express.static('./src/public'))
        this.app.set('view engine', 'ejs')
        this.app.set('views', './src/views')
    }

    middleware() {
        this.app.use(express.urlencoded({ extended: false}))
        this.app.use(express.json())
    }

    routes() {
        this.app.use('/')
        this.app.use('/user')
    }
}