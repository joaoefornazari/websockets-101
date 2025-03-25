import { WebSocketServer } from 'ws'
const wsServer = new WebSocketServer({  port: 5000 })

wsServer.on('connection', (req, ws) => {
	const currentClient = req.headers['sec-websocket-key']
	console.log(`\n\n${currentClient} connected.`)
	console.log(`Clients connected: ${wsServer.clients.size}`)
})
