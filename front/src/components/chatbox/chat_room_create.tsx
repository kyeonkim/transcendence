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

const CreateRoomAppBar = styled(AppBar) ({
	backgroundColor: "white",
	opacity: 0.7,
	borderRadius: '10px', // 옵션: 모서리를 둥글게 설정
});

const MainChatRoomCreate = styled(Box) ({
	position: 'absolute',
	top: '5.4%',
	width: "100%",
	height: "30%",
	backgroundColor: 'white',
	borderRadius: '10px', // 옵션: 모서리를 둥글게 설정
  });

export default function ChatRoomCreate(props: any) {
	const cookies = useCookies();
	const user_id = Number(cookies.get("user_id"));
	const user_nickname = cookies.get("nick_name");

	const [roomName, setRoomName] = useState('');
	const [roomPrivate, setRoomPrivate] = useState(false);
	const [roomPassword, setRoomPassword] = useState('');

	const [nameError, setNameError] = useState(false);

	const {handleRenderMode} = props;

	// TextField를 채워야 완료 활성화시키기

	async function handleDone() {
		
		var hashRoomPassword;

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
		setRoomName(event.target.value as string);
	}

	function handleRoomPasswordChange(event :any) {
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
            <AppBar position="absolute" sx={{borderRadius: '10px'}}>
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					채팅방 생성
					</Typography>
				</Toolbar>
			</AppBar>
			<MainChatRoomCreate>
				<TextField
					sx={{
						left:'5%',
						top:'10%',
						width: '80%',
					}}
					id="chatroom_name_text_field"
					label="Chatroom Name"
					inputProps={{ maxLength: 10}}
					onChange={handleRoomnameChange}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							if (e.nativeEvent.isComposing) return;
							handleDone();
						}}}
				/>
				<TextField
					sx={{
						left:'5%',
						top:'20%',
						width:'80%'
					}}
					id="password_text_field"
					label="password"
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
						left:'5%',
						top:'20%',
					}}
					control={<Switch checked={roomPrivate}
					onChange={handleRoomPrivate}/>}
					label="Private"
					labelPlacement='start'
				/>
				<Button
				sx={{
					position: 'absolute',
					top: '80%',
					left: '65%',
					background: "white",
					color: "black",
				}}
				variant='contained'
				color='error'
				onClick={handleCancel}
				>
				취소
				</Button>
				<Button
				sx={{
					position: 'absolute',
					top: '80%',
					left: '80%',
					background: "white",
					color: "black",
					marginLeft: "10px",
				}}
				variant='contained'
				color='success'
				onClick={handleDone}
				>
				완료
				</Button>
				{nameError ? (
						<Alert
							severity="error"
							sx={{
								position: 'absolute',
								top: '63%',
								left: '5%',
								width: '80%',
							}}
						>
							채팅방 이름이 없습니다. 입력해주세요!
						</Alert>
					) : (
						<div></div>
					)}
				</MainChatRoomCreate>		
	
		</div>
	);
}

