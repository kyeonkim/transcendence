'use client'
import React, { useState, useEffect } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Button from '@mui/material/Button';

import Box from '@mui/material/Box';

import TextField from '@mui/material/TextField';

import Alert from '@mui/material/Alert';

// import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import Select, { SelectChangeEvent } from '@mui/material/Select';

import Switch from '@mui/material/Switch';

import { useCookies } from 'next-client-cookies';

import { styled } from '@mui/system';

import { axiosToken } from '@/util/token';

import { genSaltSync, hashSync } from "bcrypt-ts";
import { Typography } from '@mui/material';

import { useUserDataContext } from '@/app/main_frame/user_data_context';

const CreateRoomAppBar = styled(AppBar) ({
	backgroundColor: "white",
	opacity: 0.7,
	borderRadius: '10px', // 옵션: 모서리를 둥글게 설정
});

const MainChatRoomCreate = styled(Box) ({
	position: 'relative',
	width: "100%",
	maxWidth: "100%",
	height: "40%",
	maxHeight: "40%",
	backgroundColor: 'white',
	borderRadius: '10px', // 옵션: 모서리를 둥글게 설정
  });

export default function ChatRoomCreate(props: any) {
	const { nickname, user_id } = useUserDataContext();
	const cookies = useCookies();

	const user_nickname = nickname;

	const [roomName, setRoomName] = useState('');
	const [roomPrivate, setRoomPrivate] = useState(false);
	const [roomPassword, setRoomPassword] = useState('');

	const [nameError, setNameError] = useState(false);

	const {handleRenderMode} = props;


	async function handleDone() {
		
		let hashRoomPassword;

		if (roomName === '')
		{
			setNameError(true);
			return ;
		}

		if (roomPassword !== '')
		{
			const salt = genSaltSync(10);
			hashRoomPassword = hashSync(roomPassword, salt);
		}

		await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}chat/createroom`, 
		{
			user_id : user_id,
			user_nickname: user_nickname,
			chatroom_name: roomName,
			password: hashRoomPassword,
			private: roomPrivate,
		},{
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${cookies.get('access_token')}`,
			},
		}) 
		.then((res) => {
		if (res.data.status === true)
		{
			handleRenderMode('chatRoom');
		}
		else
		{
			// 에러 예외처리
		}
		})
	};

	function handleRoomnameChange(event :any) {
		// if (/^[a-zA-Z0-9]+$/.test(event.target.value as string))
			setRoomName(event.target.value as string);
	}

	function handleRoomPasswordChange(event :any) {
		if (/^[a-zA-Z0-9]+$/.test(event.target.value as string))
			setRoomPassword(event.target.value as string);
	}

	function handleCancel() {
		handleRenderMode('chatList');
	};

	function handleRoomPrivate(event :any) {
		setRoomPrivate(event.target.checked);
	}

	// modal 형태 고려 - 우선순위 낮음
	return (
		<div>
			<MainChatRoomCreate>
            <AppBar sx={{borderRadius: '10px'}}>
				<Toolbar>
					<Typography component="div" sx={{flexGrow: 1, color: 'white', fontSize: '1vw'}}>
					채팅방 생성
					</Typography>
				</Toolbar>
			</AppBar>
				<TextField
					sx={{
						position: 'relative',
						left:'5%',
						top:'20%',
						width: '80%',
						height: '10%',
					}}
					id="chatroom_name_text_field"
					label="Chatroom Name"
					inputProps={{ maxLength: 30}}
					onChange={handleRoomnameChange}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							if (e.nativeEvent.isComposing) return;
							handleDone();
						}}}
				/>
				<TextField
					sx={{
						position: 'relative',
						left:'5%',
						top:'30%',
						width:'80%',
						height: '10%',
					}}
					id="password_text_field"
					label="password"
					type="password"	
					inputProps={{ maxLength: 20}}
					onChange={handleRoomPasswordChange}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							if (e.nativeEvent.isComposing) return;
							handleDone();
						}}}
					/>
				<FormControlLabel
					sx={{
						position: 'relative',
						left:'2%',
						top:'35%',
					}}
					control={
						<Switch 
							checked={roomPrivate}
							onChange={handleRoomPrivate}
						/>}
					label={
						<Typography sx={{fontSize: '0.7vw'}}>
							Private
						</Typography>
						}
					labelPlacement='start'
				/>
				<Button
				sx={{
					position: 'absolute',
					top: '85%',
					left: '55%',
					background: "white",
					color: "black",
				}}
				variant='contained'
				color='error'
				onClick={handleCancel}
				>
					<Typography sx={{color: 'black', fontSize: '0.7vw'}}>
						취소
					</Typography>
				</Button>
				<Button
				sx={{
					position: 'absolute',
					top: '85%',
					left: '75%',
					background: "white",
					color: "black",
				}}
				variant='contained'
				color='success'
				onClick={handleDone}
				>
					<Typography sx={{color: 'black', fontSize: '0.7vw'}}>
						완료
					</Typography>
				</Button>
				{nameError && <Alert
					severity="error"
					onClose={() => {setNameError(false)}}
					sx={{
						position: 'absolute',
						top: '65%',
						left: '5%',
						width: '80%',
					}}
				>
					<strong>채팅방 이름이 없습니다. 입력해주세요!</strong>
				</Alert>}
				</MainChatRoomCreate>		
	
		</div>
	);
}

