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

const MainChatRoomList = styled(Grid) ({
	position: 'absolute',
	top: 0,
	left: 0,
	width: 560,
	height: 1332
  });
  
  // 채팅 방 1개
  const ChatRoom = styled(Card) ({
	// width: 400,
	height: 200,
	backgroundColor: 'white'
  })

export default function ChatList(props: any) {
	const [inRoom, setInRoom] = useState(false);
	const [roomList, setRoomList] = useState([
		{
			name: 'string',
			is_secret: false,
		}
	]);

	const nowInRoom = () => {
		setInRoom(true);
	}

	useEffect(() => {

		setRoomList([
		{name: 'good', is_secret: false},
		{name: 'great', is_secret: false},
		{name: 'nice', is_secret: true},
		{name: 'excellent', is_secret: true},
		{name: 'brilliant', is_secret: false},
		{name: 'mavelous', is_secret: false},
		{name: 'tremendous', is_secret: true}
		]);

		// 조건에 맞으면 nowInroom
		nowInRoom();

	}, [])

	const { setMTbox } = props;

	// 채널 리스트
	
	// '특정 사건' 발생하면  Chat을 렌더링
	
	return (
		<div>
		{inRoom ? (
			<Chat setMTbox={setMTbox}/>
		) : (
			<AppBar position="static">
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
			</AppBar>
		)}
		{/* {roomList ? (
			<MainChatRoomList container rowSpacing={5} columnSpacing={5}>
			{roomList.map((room) => {
				return (
					<Grid item xs={4}>
					<CardContent>
						<ChatRoom elevation={8}>
						<Typography variant='h4' gutterBottom>
							{room.name}
						</Typography>
						<IconButton>
							<CommentIcon />
						</IconButton>
						</ChatRoom>
					</CardContent>
					</Grid>
				);
			})}
			</MainChatRoomList>
			) : (
			<p> 방이 없습니다 </p>
			)} */}
		</div>
	);
}

{/* 			
			{roomList ? (

				<MainChatRoomList container rowSpacing={5} columnSpacing={5}>
				{roomList.map((room) => {
					return (
						<Grid item xs={4}>
						<CardContent>
							<ChatRoom elevation={8}>
							<Typography variant='h4' gutterBottom>
								{room.name}
							</Typography>
							<IconButton>
								<CommentIcon />
							</IconButton>
							</ChatRoom>
						</CardContent>
						</Grid>
					);
				})}
				</MainChatRoomList>
			) : (
				<p> 방이 없습니다 </p>
			)} */}