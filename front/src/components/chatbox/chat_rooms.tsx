'use client'
import { useState, useEffect } from 'react';

import Chat from './chat';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import IconButton from '@mui/material/IconButton';
import LockIcon from '@mui/icons-material/Lock';
import MenuIcon from '@mui/icons-material/Menu';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import Grid from '@mui/material/Grid';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import { styled } from '@mui/system';

import { useCookies } from 'next-client-cookies';

import axios from 'axios';

const MainChatRoomList = styled(Grid) ({
	position: 'absolute',
	top: 100,
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

export default function ChatRoomList(props: any) {
	const cookies = useCookies();
	const [roomList, setRoomList] = useState([]);
	const [render, setRender] = useState(false);
	const [roomId, setRoomId] = useState(0);

	const user_id = cookies.get("user_id")

	async function handleRoomList() {
		await axios.get(`${process.env.NEXT_PUBLIC_API_URL}chat/roomlist/${user_id}`) 
		.then((res) => {
		if (res.data.rooms)
		{
			// 방 목록 배열, 순차 저장
			res.data.rooms.map((room) => {
				setRoomList(prevRoomList => [...prevRoomList, room]);
			})
			console.log(roomList);
		}
		else
		{
			// 방이 없음 메시지
		}
		})
	}

	// async function handleJoin(idx :number) {

	// 	// password 입력 받아야함.
	
	// 	await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}chat/joinroom/}`, 
	// 	{
	// 		user_id: user_id,
	// 		room_id: idx,
	// 		password: '',
	// 	}) 
	// 	.then((res) => {
	// 	if ()
	// 	{

	// 	}
	// 	else
	// 	{
	// 	}
	// 	})
	// 	setRender(true);
	// }

	useEffect(() => {

		handleRoomList();
		// 다시 가져오는 신호는?
		setRender(false);
	}, [render])


    // 방에 들어갈 때 받아가는 것들
        // 소켓 위치
        // 방 id 

        // 유저 목록
        // 채팅 내역


	const { setMTbox } = props;

	// 채널 리스트
	
	// '특정 사건' 발생하면  Chat을 렌더링
	
	return (
		<div>
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
					ChatRoomList
				</Typography>
					<Button color="inherit">나가기</Button>
				</Toolbar>
			</AppBar>
            {roomList ? (
			<MainChatRoomList container rowSpacing={5} columnSpacing={5}>
			{roomList.map((room) => {
				console.log('room - ', room);
				console.log('room idx - ', room.idx);
				return (
					<Grid key={room.idx} item xs={12}>
					<CardContent>
						<ChatRoom elevation={8}>
						<Typography variant='h4' gutterBottom>
							{room.name}
						</Typography>
                        <LockIcon sx={{textAlign: 'right'}} />
						<CardActions>
							<Button size="small" variant="contained">Join</Button>
							{/* <Button size="small" variant="contained" onClick={() => handleJoin(room.idx)}>Join</Button> */}
						</CardActions>
						</ChatRoom>
					</CardContent>
					</Grid>
				);
			})}
			</MainChatRoomList>
			) : (
			<p> 방이 없습니다 </p>
            )}
		</div>
	);
}
