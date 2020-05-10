import express, { Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import yaml from 'yamljs'
import bodyParser from 'body-parser'
import path from 'path'

global.appRoot = path.resolve(__dirname)

import { router as users } from './routes/user.router'
import { router as auth } from './routes/auth.router'

const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.json({ strict: false }))

app.use('/users', users)

app.use('/auth', auth)

app.use('/swagger-ui.html', swaggerUi.serve, swaggerUi.setup(yaml.load('./api.yml')))

app.get('', (req: Request, res: Response) => res.redirect('/swagger-ui.html'))

// app.use ((error, req, res, next) => {
//   console.log(error)
//   res.sendStatus(500)
// });

app.listen(port, () => console.log(`Listening on port ${port}!`))
