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

export default function ChatRoomList(props: any) {
	const [roomList, setRoomList] = useState([
		{
			name: 'string',
			is_secret: false,
		}
	]);


	useEffect(() => {

		setRoomList([
            // {name: 'good', is_secret: false},
            // {name: 'great', is_secret: false},
            // {name: 'nice', is_secret: true},
            // {name: 'excellent', is_secret: true},
            // {name: 'brilliant', is_secret: false},
            // {name: 'mavelous', is_secret: false},
            // {name: 'tremendous', is_secret: true}
		]);

        // 방 목록 받아오는 함수
            // 일단은 시작할 때만 받아옴
            // + 방에 들어가기 실패했을 때
	}, [])


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
			{roomList.map((room, idx) => {
				return (
					<Grid key={idx} item xs={12}>
					<CardContent>
						<ChatRoom elevation={8}>
						<Typography variant='h4' gutterBottom>
							{room.name}
						</Typography>
                        <LockIcon sx={{textAlign: 'right'}} />
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
