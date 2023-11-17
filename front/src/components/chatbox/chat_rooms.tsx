'use client'
import { useState, useEffect } from 'react';

import ChatRoomBar from './chat_room_bar'
import ChatRoomBlock from './chat_room_block'

import Grid from '@mui/material/Grid';

import Card from '@mui/material/Card';

import { styled } from '@mui/system';

import { useCookies } from 'next-client-cookies';

import axios from 'axios';


const MainChatRoomList = styled(Grid) ({
	position: 'absolute',
	top: 100,
	left: 0,
	width: 560,
	height: 1332,
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


  export default function ChatRoomList(props: any) {
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

	async function handleRoomList() {
		await axios.get(`${process.env.NEXT_PUBLIC_API_URL}chat/roomlist/${user_id}`) 
		.then((res) => {
		if (res.data.rooms)
		{
			// 방 목록 배열, 순차 저장
			res.data.rooms.map((room :any) => {
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

	// 분리 성공하면 ispassword 제거할 것
	async function handleJoin(idx :number, inPassword :string) {

		await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}chat/joinroom`, 
		{
			user_id : user_id,
			user_nickname: user_nickname,
			room_id: idx,
			password: inPassword,
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
			setRender(true);
		}
		})
		.catch ((error) => {
			// request error
				// 적절하지 않은 요청입니다.
					// rerender
			// internal error
				// 종류 따라 다를 듯
			console.log('trying to render');
			setRender(true);
		});

	}

	useEffect(() => {

		handleRoomList();
		// 다시 가져오는 신호는?
		setRender(false);
	}, [render])

	const	setMTbox = props.setMTbox;
	const	handleRenderMode = props.handleRenderMode;
	
	return (
		<div>
			<ChatRoomBar setMTbox={setMTbox} handleRenderMode={handleRenderMode} />
            {roomList ? (
			<MainChatRoomList container rowSpacing={1} columnSpacing={5}>
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
			) : (
				<></>
		   )}

		</div>
	);
}
