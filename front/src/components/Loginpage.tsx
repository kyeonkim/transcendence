"use client"
import React from 'react';
import axios from 'axios';

function handleLogin() {
	axios.get('http://10.13.9.4:3000/42login')
		.then(function (response) {
			console.log(response.data);
		})
		.catch(function (error) {
			console.log(error);
		})
}

export const Login = () => {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
			}}
		>
			<button
				onClick={handleLogin}
				style={{
					padding: '10px 20px',
					fontSize: '16px',
					borderRadius: '5px',
					backgroundColor: '#007BFF',
					color: 'white',
					border: 'none',
					cursor: 'pointer',
				}}
			>
			login button
			</button>
		</div>
	);
};