'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

import { useEffect } from 'react';
import particlesOptions from "./particles.json";
import TwoFAPass from './42login/twoFAPass';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { Box, TextField, Typography} from '@mui/material';

import axios from 'axios';

import Image from 'next/image'


export default function Home() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(false);
	const [showTwoFAPass, setTwoFAPass] = useState(false);
	const router = useRouter();
	const [ init, setInit ] = useState(false);
	
	let response;

	useEffect(() => {
		initParticlesEngine(async (engine) => {
				await loadSlim(engine);
		}).then(() => {
				setInit(true);
		});
	}, []);

	const particlesLoaded = async (container: Container) => {
	};

	const handleLogin = async () => {

		await axios.post(`${process.env.NEXT_PUBLIC_API_DIRECT_URL}auth/login`, {
			nick_name: username,
			password: password
		}).then(async (res: any) => {
			response = res;
			if (res.data.status === false) {
				setError(true);
				return ;
			} else {
				if (res.data.twoFAPass === false) {
					setTwoFAPass(true);
					return ;
				}
				await axios.post(`${process.env.NEXT_PUBLIC_FRONT_URL}api/set_cookie`, {
					access_token: res.data.token.access_token,
					refresh_token: res.data.token.refresh_token,
					nick_name: res.data.userdata.nick_name,
					user_id: res.data.userdata.user_id
				}).then(async (res: any) => {
					router.push('main_frame');
				})
			}}).catch((err: any) => {
				// console.log(err);
			})
	}

	const handle42Login = () => {
		window.location.href = process.env.NEXT_PUBLIC_REDIRECT_URL;
	};

	const handleGLogin = () => {
		window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL}&scope=https://www.googleapis.com/auth/userinfo.email`;
	};
	
	const handleSignUp = () => {
		router.push('/signup');
	};

	// const handleGuestLogin = (value :number) => {
	//   // console.log('handlerGusetLogin - ', value);
	//   router.push(`/guest?value=${value}`);
	//   // console.log('router push has done');
	// };


	return (
	<Box sx={{ position: 'relative', height: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
		{init && <Particles id="tsparticles" options={particlesOptions as ISourceOptions} particlesLoaded={particlesLoaded}/>}
		{showTwoFAPass && <TwoFAPass res={response}/>}
		<Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
			<Typography color="white" style={{ fontWeight: 'bold', fontSize: '5vw' }}>
				PONG42
			</Typography>
			<Box sx={{ display: 'flex', alignItems: 'center', marginTop: '16px',justifyContent: 'center'}}>
				<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px'}}>
					<TextField
						label="Nickname"
						color={error ? "error" : "primary"}
						value={username}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setError(false);
							setUsername(e.target.value);
						}}
						variant="outlined"
						sx={{
							marginBottom: '8px',
							width: '100%',
							bgcolor: 'white',
						}}
						onKeyDown={(e: any) => {
							if (e.key === 'Enter') {
								if (e.nativeEvent.isComposing) return;
								handleLogin();
							}
						}}
					/>
					<TextField
						color={error ? "error" : "primary"}
						label="Password"
						type="password"
						value={password}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							setError(false);
							setPassword(e.target.value);
						}}
						variant="outlined"
						sx={{
							marginBottom: '8px',
							width: '100%',
							bgcolor: 'white',
						}}
						onKeyDown={(e: any) => {
							if (e.key === 'Enter') {
								if (e.nativeEvent.isComposing) return;
								handleLogin();
							}
						}}
					/>
				</Box>
				<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px', marginLeft:'10px'}}>
					<Button variant="contained" onClick={handleLogin} sx={{marginBottom: '20px', width: '100%', height: '100%',  backgroundColor: error ? '#f44336' : ''}}>
						로그인
					</Button>
					<Button variant="contained" onClick={handleSignUp} sx={{width: '100%'}}>
					회원 가입
					</Button>
				</Box>
			</Box>
			<Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', width: '10vw', justifyContent: 'center'}}>
				<Button variant="contained" onClick={handle42Login} className={styles.button}>
					<Image src={`https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg`} alt="42 logo" className={styles.Logo42}/>
					<span>42 로그인</span>
				</Button>
				<Button variant="contained" onClick={handleGLogin} className={styles.button}>
					<Image src={`https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg`} alt="google logo" className={styles.LogoGoogle}/>
					<span>구글 로그인</span>
				</Button>
			</Box>
		</Box>
	</Box>
	)
}

