// 'use client'
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import Chat from './chat';
import ChatRoomCreate from './chat_room_create';

import { styled } from '@mui/system';
import ChatRoomList from './chat_rooms';

import { useCookies } from 'next-client-cookies';

import { useChatBlockContext } from '../../app/main_frame/shared_state';
import { useUserDataContext } from '@/app/main_frame/user_data_context';
import { axiosToken } from '@/util/token';


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

	const { nickname, user_id } = useUserDataContext();

	async function getUserData() {
		await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/nickname/${nickname}`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${cookies.get('access_token')}`
			  },
		}) 
		.then((res) => {

			if (res.data.userData.roomuser !== null)
			{
				if (res.data.userData.roomuser.chatroom)
				{

					setRoominfo(res.data.userData.roomuser.chatroom);

					// setRenderMode('chatRoom');
				}
			}
			else
			{

				setRenderMode('chatList');
			}
		})
	}

	useEffect(() => {
		getUserData();
	}, [])

	useEffect(() => {
		
		if (renderMode !== 'newChat')
		{

			getUserData();
		}

	}, [render])

	useEffect(() => {
		setRenderMode('chatRoom');

	}, [roominfo]);

	if (renderMode === 'chatList')
		return <ChatRoomList handleRenderMode={handleRenderMode}/>;
	else if (renderMode === 'newChat')
		return <ChatRoomCreate handleRenderMode={handleRenderMode} />;
	else if (renderMode === 'chatRoom')
		return <Chat handleRenderMode={handleRenderMode} roominfo={roominfo}/>;
}

