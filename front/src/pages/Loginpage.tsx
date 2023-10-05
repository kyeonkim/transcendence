"use client";
import React from 'react';

async function handleLogin() {
	try {
		const url = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a530d138cf1c33d448191cb250ee026f61f01d4d4cbbe62e0ff18ee285f9f290&redirect_uri=http%3A%2F%2F10.13.8.3%3A3000%2Foauth%2FCallback&response_type=code';
	
		window.location.href = url;
	}
	catch (err) {
		console.error('Error1: ', err);
	}
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