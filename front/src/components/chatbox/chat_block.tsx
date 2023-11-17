// 'use client'
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import Chat from './chat';
import ChatRoomCreate from './chat_room_create';

import { styled } from '@mui/system';
import ChatRoomList from './chat_rooms';

import { useCookies } from 'next-client-cookies';

import  { useChatBlockContext } from '../../app/main_frame/shared_state';

// chatroomlist에서 요청의 결과로 받은 응답에 채팅방의 데이터가 들어있는가?
// chat에서 한 번 더 요청하여 채팅방의 데이터를 받아오는가?

export default function ChatBlock(props: any) {
	const cookies = useCookies();
	// const [renderMode, setRenderMode] = useState('chatList');

	const { handleRenderChatBlock } = useChatBlockContext();

	const { chatBlockRenderMode, setChatBlockRenderMode,
			chatBlockTriggerRender, setChatBlockTriggerRender } = useChatBlockContext();
	
	// const { chatBlockRenderMode, setChatBlockRenderMode } = useChatBlockContext();


	const setRenderMode = setChatBlockRenderMode;
	const renderMode = chatBlockRenderMode;
	const render = chatBlockTriggerRender;
	const setRender = setChatBlockTriggerRender;

	// const [render, setRender] = useState(false);
	const [roominfo, setRoominfo] = useState({});

	// const handleRenderMode = handleRenderChatBlock;

	const handleRenderMode = (mode :string) => {

		// setChatBlockRenderMode(mode);
		setRenderMode(mode);
		setRender(true);
		
	}

	async function getUserData() {
		await axios.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/nickname/${cookies.get("nick_name")}`) 
		.then((res) => {
			console.log('userData in chat==',res);
			if (res.data.userData.roomuser !== null)
			{
				if (res.data.userData.roomuser.chatroom)
				{
					console.log("ChatBlock - user is in chatroom");
					setRoominfo(res.data.userData.roomuser.chatroom);
					console.log("roominfo - ", roominfo);
					setRenderMode('chatRoom');
				}
			}
			else
			{
				console.log("user is not in chat room");
				setRenderMode('chatList');
				// handleRenderMode('chatList');
				// setInRoom(true);
			}
		})
	}

	useEffect(() => {
		getUserData();
	}, [])

	useEffect(() => {

		// 조건에 맞으면 handleinRoom
			// 나 자신이 채팅방에 들어가있는지 확인
			// 로그인할 때 user_data 받는데, 그걸 넘겨주면 될 수도 있음.
				// 근데 이렇게 넘겨주면, 나중에 자신이 소속된 방이 변경될 떄 어디서 받아서 어디서 저장하는가가 중요해짐
		if (render === true && renderMode === 'chatRoom')
			getUserData();
		setRender(false);
	}, [render])


	const { setMTbox } = props;

	if (renderMode === 'chatList')
	{
		return (
			<div>
				<ChatRoomList handleRenderMode={handleRenderMode} />
			</div>

		);
	}
	else if (renderMode === 'newChat')
	{
		return (
			<div>
				<ChatRoomCreate handleRenderMode={handleRenderMode} />
			</div>
		);
	}
	else if (renderMode === 'chatRoom')
	{
		return (
			<div>
				<Chat setMTbox={setMTbox} handleRenderMode={handleRenderMode} roominfo={roominfo}/>
			</div>
		
		);
	}
}

