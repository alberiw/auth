import express, { Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import yaml from 'yamljs'
import path from 'path'
import helmet from 'helmet'
import morgan from 'morgan'

global.appRoot = path.resolve(__dirname)

import { router as users } from './routes/user.router'
import { router as auth } from './routes/auth.router'
import { tempDb } from './temp.db'

const app = express()
const port = process.env.PORT || 8080

app.use(helmet())
app.use(morgan('tiny'))
app.use(express.json({ strict: false }))

app.use('/users', users)

app.use('/auth', auth)

app.use('/swagger-ui.html', swaggerUi.serve, swaggerUi.setup(yaml.load('./api.yml')))

app.get('', (req: Request, res: Response) => res.redirect('/swagger-ui.html'))

// app.use ((error, req, res, next) => {
//   console.log(error)
//   res.sendStatus(500)
// });

app.listen(port, () => {
	tempDb()
	console.log(`Listening on port ${port}!`)
})
