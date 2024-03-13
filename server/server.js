const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const axios = require('axios')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

// Handler for requests to the main page
app.get('/', (req, res) => {
	res.send('WebSocket server is running!')
})

// Message handler from client
wss.on('connection', ws => {
	ws.on('message', async message => {
		if (message === 'getExchangeRate') {
			try {
				const response = await axios.get(
					'https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT'
				)
				const ethUsdtPrice = parseFloat(response.data.price)
				ws.send(JSON.stringify({ ethUsdtPrice }))
			} catch (error) {
				console.error('Error fetching exchange rate:', error.message)
			}
		}
	})
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
	console.log(`WebSocket server listening on port ${PORT}`)
})
