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
import { axiosToken } from '@/util/token';

const MainChatRoomList = styled(Grid) ({
	position: 'absolute',
	top: 100,
	left: 0,
	width: 560,
	overflowY: "scroll",
	maxHeight: "1200px" 
	// height: 1332,
	// backgroundColor: 'white',
	// borderRadius: '10px',
  });
  
  // 채팅 방 1개
  const ChatRoom = styled(Card) ({
	// width: 400,
	height: 200,
	backgroundColor: 'white',
	opacity: 0.7
  })


  export default function ChatRoomList({setMTbox, handleRenderMode }: any) {
	const socket = useChatSocket();
	const cookies = useCookies();
	const [roomList, setRoomList] = useState([]);
	const [render, setRender] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [selectedIdx, setSelectedIdx] = useState(-1);

	const user_id = Number(cookies.get("user_id"));
	const user_nickname = cookies.get("nick_name");

	console.log("ChatRoomList");
	console.log("CHL - user_id - ", user_id);
	console.log("CHL - nickname - ", user_nickname);
	
	const handleRender = () => {
		if (render === true)
			setRender(false);
		else 
			setRender(true);
	}

	async function handleRoomList() {
		setRoomList([]);
		await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}chat/roomlist/${user_id}`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${cookies.get('access_token')}`
			  },
		}) 
		.then((res) => {
			console.log(res.data);
			if (res.data.rooms.length !== 0)
			{
				// 방 목록 배열, 순차 저장
				res.data.rooms.map((room :any) => {
					setRoomList(prevRoomList => [...prevRoomList, room]);
				})
				console.log('room list for chat_rooms - ', roomList);
			}
			else
			{
				// 방이 없음 메시지
				console.log('no rooms for chat_rooms');
			}
		}).catch((err) => {
			console.log('handle room list error');
		});
	}

	// 분리 성공하면 ispassword 제거할 것
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
			// 방 들어가졌으니 방으로 이동하기
				
			console.log('success to join !!! === data', res);
			handleRenderMode('chatRoom');
		}
		else
		{
			// 200 말고 다른 종류의 '성공'이 존재하나?
			// !!!!! 방 인원이 가득 찬 경우 - 방에 들어가지 못하고, 목록 다시 렌더링
				// 에러로 뺄 수도 있을 것 같은데, 협의 필요.
			console.log('trying to render');
			handleRender();
		}
		})
		.catch ((error) => {
			// request error
				// 적절하지 않은 요청입니다.
					// rerender
			// internal error
				// 종류 따라 다를 듯
			console.log('trying to render');
			handleRender();
		});

	}

	useEffect(() => {

		const doRenderChatRooms = (data :any) => {
			handleRender();
		}

		socket.on('render-chat', doRenderChatRooms)

		return () => {
			socket.off('render-chat', doRenderChatRooms);
		}

	}, [socket]);

	useEffect(() => {

		console.log('do handleRoomList');
		handleRoomList();
		// 다시 가져오는 신호는?
		// handleRenderList(false);
	}, [render])

	// useEffect(() => {

	// 	handleRoomList();
	// 	// 다시 가져오는 신호는?
	// 	// handleRenderList(false);
	// }, [renderChild])

	// const	setMTbox = props.setMTbox;

	return (
		<div>
			<ChatRoomBar setMTbox={setMTbox} handleRenderMode={handleRenderMode} />
            {roomList ? (
			<div>
				<MainChatRoomList container spacing={2}>
				{roomList.map((room) => {
					console.log('room data - ', room);
					return (
						<ChatRoomBlock
							key={room.idx}
							room={room}
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
