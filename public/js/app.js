const socketStatusElement = document.querySelector('#socketStatus')
const protocol = window.location.protocol.includes('https') ? 'wss' : 'ws'

console.log(location.host)

const ws = new WebSocket(`${protocol}://${location.hostname}:5000`)
const messages = document.querySelector('#messages')

const firstLoad = { value: true }
const me = { value: null }

function focusLast() {
	messages.scrollTop = messages.scrollHeight
	console.log(messages.scrollTop, messages.scrollHeight, messages.clientHeight)
}

function sendMessage() {
	const messageContain = document.createElement('p')
	messageContain.innerText = document.querySelector('#inputMessage').value
	messageContain.setAttribute('data-me', true)
	messages.appendChild(messageContain)

	ws.send(document.querySelector('#inputMessage').value)
	focusLast()
}

function updateWebSocketStatus() {
	function setWebSocketStatus(status) {
		socketStatusElement.innerHTML = status
	}

	const key = ws.readyState

	const status = {
		[ws.CONNECTING]: () => setWebSocketStatus('Connecting...'),
		[ws.OPEN]: () => setWebSocketStatus('Connection established!'),
		[ws.CLOSING]: () => setWebSocketStatus('Closing the connection...'),
		[ws.CLOSED]: () => setWebSocketStatus('Connection closed.')
	}

	status[key]
}

updateWebSocketStatus()

document.querySelector('#sendMessage').addEventListener('click', sendMessage)

document.addEventListener('keypress', (e) => {
	e.key === 'Enter' && sendMessage()
})

ws.onmessage = (message) => {
	const messageObject = JSON.parse(message.data)
	console.log(messageObject)

	if (firstLoad.value) {
		me.value = messageObject.from
		firstLoad.value = false
	}

	if (messageObject.data) {
		const messageContain = document.createElement('p')
		
		if (messageObject.from && me.value) {
			messageObject.from === me.value ? (
				messageContain.setAttribute('data-me', true)
			) : (
				messageContain.removeAttribute('data-me'),

				messageObject.type.isConnectionMessage === true
					? messageContain.setAttribute('data-clientConnected', true)
					: messageContain.removeAttribute('data-clientConnected'),
				
				messageObject.type.isDisconnectionMessage === true
					? messageContain.setAttribute('data-clientDisconnected', true)
					: messageContain.removeAttribute('data-clientDisconnected')
			)
		}

		messageObject.innerText = messageObject.data
		document.querySelector('#messages').appendChild(messageContain)
	}

	focusLast()
}

ws.onopen = () => updateWebSocketStatus()
ws.onclose = () => updateWebSocketStatus()
