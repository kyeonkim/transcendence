// 'use client'
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import Chat from './chat';
import ChatRoomCreate from './chat_room_create';

import { styled } from '@mui/system';
import ChatRoomList from './chat_rooms';

import { useCookies } from 'next-client-cookies';

import  { useChatBlockContext } from '../../app/main_frame/shared_state';
import { axiosToken } from '@/util/token';
// chatroomlist에서 요청의 결과로 받은 응답에 채팅방의 데이터가 들어있는가?
// chat에서 한 번 더 요청하여 채팅방의 데이터를 받아오는가?

export default function ChatBlock(props: any) {
	const cookies = useCookies();

	const { handleRenderChatBlock } = useChatBlockContext();

	const { chatBlockRenderMode, setChatBlockRenderMode,
			chatBlockTriggerRender, setChatBlockTriggerRender } = useChatBlockContext();

	const setRenderMode = setChatBlockRenderMode;
	const renderMode = chatBlockRenderMode;
	const render = chatBlockTriggerRender;
	const setRender = setChatBlockTriggerRender;


	const [roominfo, setRoominfo] = useState({});

	const handleRenderMode = handleRenderChatBlock;

	async function getUserData() {
		await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/nickname/${cookies.get("nick_name")}`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${cookies.get('access_token')}`
			  },
		}) 
		.then((res) => {
			console.log('userData in chat==',res);
			if (res.data.userData.roomuser !== null)
			{
				if (res.data.userData.roomuser.chatroom)
				{
					console.log("ChatBlock - user is in chatroom");
					setRoominfo(res.data.userData.roomuser.chatroom);
					console.log("roominfo - ", roominfo);
					setRenderMode('chatRoom');;
				}
			}
			else
			{
				console.log("user is not in chat room");
				setRenderMode('chatList');
			}
		})
	}

	useEffect(() => {
		getUserData();
	}, [])

	useEffect(() => {
		
		console.log('useEffect - render');

		if (renderMode !== 'newChat')
		{
			console.log('rerendered');
			getUserData();
		}
	}, [render])

	// useEffect(() => {
	// 	socket.on(`render-chat`, (data) => {
	// 		console.log('render-chat', data);
	// 		handleRenderMode(chatBlockRenderMode);

	// 	})
	// }, [socket])


	const { setMTbox } = props;

	if (renderMode === 'chatList')
		return <ChatRoomList handleRenderMode={handleRenderMode}/>;
	else if (renderMode === 'newChat')
		return <ChatRoomCreate handleRenderMode={handleRenderMode} />;
	else if (renderMode === 'chatRoom')
		return <Chat setMTbox={setMTbox} handleRenderMode={handleRenderMode} roominfo={roominfo}/>;
}

