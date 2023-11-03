'use client'
import { useState, useEffect } from 'react';

import Chat from './chat';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import MenuIcon from '@mui/icons-material/Menu';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import Grid from '@mui/material/Grid';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { styled } from '@mui/system';
import ChatRoomList from './chat_rooms';


// chatroomlist에서 요청의 결과로 받은 응답에 채팅방의 데이터가 들어있는가?
// chat에서 한 번 더 요청하여 채팅방의 데이터를 받아오는가?

export default function ChatBlock(props: any) {
	const [inRoom, setInRoom] = useState(false);
	// const [roomId, ]

	const handleInRoom = () => {
		if (inRoom === false)
			setInRoom(true);
		else
			setInRoom(false);
	}

	useEffect(() => {

		// 조건에 맞으면 handleinRoom
			// 나 자신이 채팅방에 들어가있는지 확인
			// 로그인할 때 user_data 받는데, 그걸 넘겨주면 될 수도 있음.
				// 근데 이렇게 넘겨주면, 나중에 자신이 소속된 방이 변경될 떄 어디서 받아서 어디서 저장하는가가 중요해짐
		handleInRoom();

	}, [])

	const { setMTbox } = props;

	// 채널 리스트
	
	// AppBar 다루는 방법 고민해보기. 공용 컴포넌트로 만들고 동작 함수를 밑에 넣는다?
		// 채팅방일 때, 채팅방 목록일 때의 동작 차이 이야기해보기
	return (
		<div>
			{/* <AppBar position="static">
				<Toolbar>
				<IconButton
					size="large"
					edge="start"
					color="inherit"
					aria-label="menu"
					sx={{ mr: 2 }}
					// onClick={handleDrawer}
				>
				</IconButton>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					ChatRoom1
				</Typography>
					<Button color="inherit">나가기</Button>
				</Toolbar>
			</AppBar> */}
		{inRoom ? (
			<Chat setMTbox={setMTbox} />
		) : (
			<ChatRoomList />
		)}
		</div>
	);
}

