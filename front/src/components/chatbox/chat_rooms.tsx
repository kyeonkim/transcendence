'use client'
import { useState, useEffect } from 'react';

import ChatRoomBar from './chat_room_bar'
import ChatRoomBlock from './chat_room_block'

import Grid from '@mui/material/Grid';

import Card from '@mui/material/Card';

import { styled } from '@mui/system';

import { useCookies } from 'next-client-cookies';

import axios from 'axios';

import { useChatSocket } from "../../app/main_frame/socket_provider"
import { useUserDataContext } from '@/app/main_frame/user_data_context';

import { axiosToken } from '@/util/token';
import { Typography } from '@mui/material';


const MainChatRoomList = styled(Grid) ({
	position: 'absolute',
	top: '7.5%',
	left: '4%',
	overflowY: "scroll",
	height: '92.5%',
	width: '92%',
	borderRadius: '10px',
	scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  });
  

  export default function ChatRoomList({handleRenderMode }: any) {
	const socket = useChatSocket();
	const cookies = useCookies();
	const { nickname, user_id } = useUserDataContext();
	const [roomList, setRoomList] = useState([]);
	const [data, setData] = useState<any>();
	const [openModal, setOpenModal] = useState(false);
	const [selectedIdx, setSelectedIdx] = useState(-1);

	const user_nickname = nickname;


	async function handleRoomList() {
		setRoomList([]);
		await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}chat/roomlist/${user_id}`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${cookies.get('access_token')}`
			  },
		}) 
		.then((res) => {
			if (res.data.rooms.length !== 0)
			{
				setRoomList(res.data.rooms);
			}
		})
	}

	async function handleJoin(idx :number, inPassword :string) {

		await axiosToken.patch(`${process.env.NEXT_PUBLIC_API_URL}chat/joinroom`, 
		{
			user_id : user_id,
			user_nickname: user_nickname,
			room_id: idx,
			password: inPassword,
		},
		{
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${cookies.get('access_token')}`
			  },
		})
		.then((res) => {
		if (res.status === 200)
		{
			handleRenderMode('chatRoom');
		}
		else
		{
			// 다른 종류의 성공에 대한 분기
		}
		})
		.catch ((error) => {

		});

	}

	useEffect(() => {

		const doRenderChatRooms = (data :any) => {
			setData(data);
		}

		socket.on('render-chat', doRenderChatRooms)
		
		return () => {
			socket.off('render-chat', doRenderChatRooms);
		}

	}, [socket]);

	useEffect(() => {

		handleRoomList();

	}, [data])

	return (
		<div>
			<ChatRoomBar handleRenderMode={handleRenderMode} />
            {roomList ? (
			<div>
				<MainChatRoomList>
				{roomList.map((room) => {
					return (
							<ChatRoomBlock
								key={room.idx}
								room={room}
								roomidx={room.idx}
								openModal={openModal}
								setOpenModal={setOpenModal}
								selectedIdx={selectedIdx}
								setSelectedIdx={setSelectedIdx}
								handleJoin={handleJoin}
								/>
					);
				})}
				</MainChatRoomList>
			</div>
			) : (
				<></>
		   )}

		</div>
	);
}
