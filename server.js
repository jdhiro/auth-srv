import Koa from 'Koa'
import Router from '@koa/router'
import cors from '@koa/cors'
import jwt from 'koa-jwt'
import logger from 'koa-logger'
import koaBody from 'koa-body'

import getToken from './token.js'

const app = new Koa()
const router = new Router()

router.post('/oauth/token', getToken)

app
    .use(logger())
    .use(koaBody())
    .use(router.routes())
    .use(router.allowedMethods())
    app.use(ctx => {
      console.log(`Request Body: ${JSON.stringify(ctx.request.body)}`)
    })


const PORT = process.env.port || 8081
console.log(`App started (port: ${PORT})`)
app.listen(PORT)