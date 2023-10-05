"use client"
import React from 'react';
import axios from 'axios';

function handleLogin() {
	axios.get('http://10.13.9.4:3000/hello')
		.then(function (response) {
			console.log(response.data);
		})
		.catch(function (error) {
			console.log(error.response.data);
		})
}

export const Login = () => {
	return (
		<div>
			<button onClick={handleLogin}>login button</button>
		</div>
	);
};