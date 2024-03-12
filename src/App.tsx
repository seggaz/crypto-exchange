import React from 'react'
import ExchangeForm from './components/ExchangeForm/ExhangeForm'
import './App.css'

const App: React.FC = () => {
	return (
		<div className='App'>
			<h1 className='title'>Exchange USDT/ETH</h1>
			<ExchangeForm />
		</div>
	)
}

export default App
