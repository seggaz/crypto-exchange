import React, { useState, useEffect, ChangeEvent } from 'react'
import axios from 'axios'
import './ExchangeForm.css'

// Define props interface for ExchangeForm component
interface ExchangeFormProps {}

const ExchangeForm: React.FC<ExchangeFormProps> = () => {
	// State variables to manage form data
	const [ethAmount, setEthAmount] = useState<number>(0) // Holds the amount of Ethereum (ETH)
	const [action, setAction] = useState<'Sell' | 'Buy'>('Sell') // Represents the action selected by the user
	const [usdtAmount, setUsdtAmount] = useState<number | null>(null) // Holds the calculated amount of USDT

	// useEffect hook to fetch exchange rate when ethAmount or action changes
	useEffect(() => {
		// Function to fetch exchange rate from Binance API
		const fetchExchangeRate = async () => {
			try {
				// Fetch exchange rate from Binance API
				const response = await axios.get(
					'https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT'
				)
				const ethUsdtPrice = parseFloat(response.data.price)

				// Calculate USDT amount based on action
				let usdt: number
				if (action === 'Sell') {
					usdt = ethAmount * ethUsdtPrice
				} else {
					usdt = ethAmount / ethUsdtPrice
				}
				// Update usdtAmount state variable with calculated value
				setUsdtAmount(parseFloat(usdt.toFixed(2)))
			} catch (error) {
				console.error('Error fetching exchange rate:', error)
			}
		}

		// Call fetchExchangeRate function
		fetchExchangeRate()
	}, [ethAmount, action])

	// Event handler for ETH amount input change
	const handleEthAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value =
			event.target.value.trim() !== '' ? parseFloat(event.target.value) : 0
		// Update ethAmount state variable
		setEthAmount(value)
	}

	// Event handler for action (Sell/Buy) change
	const handleActionChange = (selectedAction: 'Sell' | 'Buy') => {
		// Update action state variable
		setAction(selectedAction)
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
		</div>
	)
}

export default ExchangeForm
