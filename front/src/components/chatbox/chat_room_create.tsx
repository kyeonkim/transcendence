'use client'
import React, { useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import Button from '@mui/material/Button';

import Box from '@mui/material/Box';

import TextField from '@mui/material/TextField';

// import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import Select, { SelectChangeEvent } from '@mui/material/Select';

import Switch from '@mui/material/Switch';

import { useCookies } from 'next-client-cookies';

import { styled } from '@mui/system';

import axios from 'axios';

import { genSaltSync, hashSync } from "bcrypt-ts";

const CreateRoomAppBar = styled(AppBar) ({
	backgroundColor: "white",
	opacity: 0.7,
	borderRadius: '10px', // 옵션: 모서리를 둥글게 설정
});

const MainChatRoomCreate = styled(Box) ({
	position: 'absolute',
	top: 65,
	left: 0,
	width: 560,
	height: 1332,
	backgroundColor: 'white',
	opacity: 0.7,
	borderRadius: '10px', // 옵션: 모서리를 둥글게 설정
  });

export default function ChatRoomCreate(props: any) {
	const cookies = useCookies();
	const user_id = Number(cookies.get("user_id"));
	const user_nickname = cookies.get("nick_name");

	const	[roomName, setRoomName] = useState('');
	const	[roomPrivate, setRoomPrivate] = useState(false);
	const 	[roomPassword, setRoomPassword] = useState('');

	const {handleRenderMode} = props;

	// TextField를 채워야 완료 활성화시키기

	async function handleDone() {
		
		var hashRoomPassword;

		if (roomName === '')
		{
			return ;
		}

		if (roomPassword !== '')
		{
			const salt = genSaltSync(10);
			hashRoomPassword = hashSync(roomPassword, salt);
		}

		await axios.post(`${process.env.NEXT_PUBLIC_API_URL}chat/createroom`, 
		{
			user_id : user_id,
			user_nickname: user_nickname,
			chatroom_name: roomName,
			password: hashRoomPassword,
			private: roomPrivate,
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

	// useEffect(() => {

	// }, [])

	// modal 형태 고려 - 우선순위 낮음
	return (
		<div>
            <CreateRoomAppBar position="static">
				<Toolbar>
                    <Button sx={{ background: "white", color: "black"}} variant='contained' onClick={handleCancel}>
                        취소
                    </Button>
					<Button sx={{ background: "white", color: "black", left: 375}} variant='contained' onClick={handleDone}>
                        완료
                	</Button>
				</Toolbar>
			</CreateRoomAppBar>
			<MainChatRoomCreate>
				<TextField
					sx={{
						left:30,
						top:30,
						width:400
					}}
					id="chatroom_name_text_field"
					label="Chatroom Name"
					onChange={handleRoomnameChange}
				/>
				<TextField
					sx={{
						left:30,
						top:60,
						width:400
					}}
					id="password_text_field"
					label="password"
					onChange={handleRoomPasswordChange}
					/>
				<FormControlLabel
					sx={{
						left:100,
						top:100,
						width:400
					}}
					control={<Switch checked={roomPrivate} onChange={handleRoomPrivate}/>} label="Private" labelPlacement='end'
					style={{ marginLeft: '20px', marginTop: '90px' }}
					/>
			</MainChatRoomCreate>
		</div>
	);
}

