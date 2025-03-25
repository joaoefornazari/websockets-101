import express from 'express'
import { fileURLToPath } from 'node:url'

const app = express()
app.use(express.static('public'))

app.get('/', (req, res) => {
	res.sendFile('index.html', { root: fileURLToPath(new URL('public', import.meta.url)) })
})

app.listen(3000, () => console.log('Listening at 3000'))
