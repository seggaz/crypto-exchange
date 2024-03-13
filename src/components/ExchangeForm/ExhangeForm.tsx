import React, { useState, useEffect } from 'react'
import './ExchangeForm.css'

const ExchangeForm: React.FC = () => {
	const [ethAmount, setEthAmount] = useState<number>(0) // Holds the amount of Ethereum (ETH)
	const [action, setAction] = useState<'Sell' | 'Buy'>('Sell') // Represents the action selected by the user
	const [usdtAmount, setUsdtAmount] = useState<number | null>(null) // Holds the calculated amount of USDT
	const [ws, setWs] = useState<WebSocket | null>(null) // WebSocket connection instance

	// useEffect hook to establish WebSocket connection and handle incoming data
	useEffect(() => {
		const socket = new WebSocket('ws://localhost:3001')

		socket.onopen = () => {
			console.log('WebSocket connection established.')
			setWs(socket)
		}

		socket.onmessage = event => {
			const data = JSON.parse(event.data)
			const ethUsdtPrice = data.ethUsdtPrice

			let usdt
			if (action === 'Sell') {
				usdt = ethAmount * ethUsdtPrice
			} else {
				usdt = ethAmount / ethUsdtPrice
			}
			setUsdtAmount(parseFloat(usdt.toFixed(2)))
		}

		socket.onerror = error => {
			console.error('WebSocket error:', error)
		}

		socket.onclose = () => {
			console.log('WebSocket connection closed.')
		}

		// Cleanup function to close WebSocket connection
		return () => {
			if (ws) {
				ws.close()
			}
		}
	}, [ethAmount, action])

	// Event handler for ETH amount input change
	const handleEthAmountChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setEthAmount(parseFloat(event.target.value))
	}

	// Event handler for action (Sell/Buy) change
	const handleActionChange = (selectedAction: 'Sell' | 'Buy') => {
		setAction(selectedAction)
	}

	// Event handler for Update button click
	const handleUpdateButtonClick = () => {
		if (ws) {
			ws.send('getExchangeRate')
		}
	}

	return (
		<div className='exchange-form'>
			<div className='form-group'>
				<label>ETH amount:</label>
				<input
					type='number'
					step='0.01'
					value={ethAmount.toString()}
					onChange={handleEthAmountChange}
				/>
			</div>
			<div className='form-group'>
				<label>Action:</label>
				<div className='select-wrapper'>
					<select
						value={action}
						onChange={e => handleActionChange(e.target.value as 'Sell' | 'Buy')}
					>
						<option value='Sell'>Sell</option>
						<option value='Buy'>Buy</option>
					</select>
				</div>
			</div>
			<div className='form-group'>
				<label>You will receive:</label>
				<input
					type='number'
					step='0.01'
					value={usdtAmount !== null ? usdtAmount.toFixed(2) : ''}
					readOnly
				/>
			</div>
			<div className='form-group'>
				<button onClick={handleUpdateButtonClick}>Update</button>
			</div>
		</div>
	)
}

export default ExchangeForm
