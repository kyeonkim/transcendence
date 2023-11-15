'use client'
import { useState, useEffect } from 'react';

import ChatRoomCreate from './chat_room_create';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import IconButton from '@mui/material/IconButton';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';



import { styled } from '@mui/system';

// import { useCookies } from 'next-client-cookies';

import axios from 'axios';

const ChatRoomAppBar = styled(AppBar) ({
	backgroundColor: "white",
	opacity: 0.7,
	borderRadius: '10px', // 옵션: 모서리를 둥글게 설정
});

export default function ChatRoomBar(props: any) {
	// const cookies = useCookies();
	// const user_id = cookies.get("user_id")

    const { setMTbox, handleRenderMode } = props;

    function handleNewChat() {
        handleRenderMode('newChat');    
    };

	// useEffect(() => {

	// }, [])

    // 새 채팅 핸들러


	return (
		<div>
            <ChatRoomAppBar position="static">
				<Toolbar>
                    <Typography sx={{flexGrow: 1, color: 'black'}}variant="h6" component="div">
                        채팅방 목록
                    </Typography>
                    <Button sx={{ background: "white", color: "black"}} variant='contained' onClick={handleNewChat}>
                        새 채팅
                    </Button>
				</Toolbar>
			</ChatRoomAppBar>
		</div>
	);
}
