'use client'
import { useState, useEffect } from 'react';

import ChatRoomBar from './chat_room_bar'

import LockIcon from '@mui/icons-material/Lock';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Grid from '@mui/material/Grid';

import Box from '@mui/material/Box';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import Modal from '@mui/material/Modal';

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

  const modalStyle = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
	opacity: 0.5
  };

export default function ChatRoomList(props: any) {
	const cookies = useCookies();
	const [roomList, setRoomList] = useState([]);
	const [render, setRender] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [inPassword, setInPassword] = useState('');
	const [roomIndex, setRoomIndex] = useState(-1);
	const [roomPassword, setRoomPassword] = useState(false);

	const user_id = Number(cookies.get("user_id"));
	const user_nickname = cookies.get("nick_name");

	function handleModalOpen() {
		setOpenModal(true);
	}
	
	function handleModalClose() {
		setOpenModal(false);
	};

	function handleInPassword(event :any) {
		setInPassword(event.target.value as string);
	}

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

	function handlePasswordModal(ispassword:boolean, idx :number) {
		setRoomPassword(ispassword);
		setRoomIndex(idx);
	}

	async function handleCheckPassword()
	{
		// 백 서버에 패스워드 체크 보내는 부분 필요
		console.log('check ispassword and idx before handleJoin form Modal');
		console.log('idx - ', roomIndex);
		handleJoin(roomIndex);
	}

	// 분리 성공하면 ispassword 제거할 것
	async function handleJoin(idx :number) {

		console.log("CHL - handleJoin - room_id - ", idx);
		console.log("CHL - password - ", inPassword);
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
		setInPassword('');
		setRoomIndex(-1);
		setRoomPassword(false);
	}

	useEffect(() => {

		handleRoomList();
		// 다시 가져오는 신호는?
		setRender(false);
	}, [render])

	useEffect(() => {

		if (roomIndex !== -1)
		{
			if (roomPassword === true)
			{
				console.log('!!!!! open modal plesae');
				handleModalOpen();
				// modal 자체가 async할 가능성
			}
			else
			{
				console.log('do without modal~~');
				handleCheckPassword();
			}
		}

	}, [roomIndex])

    // 방에 들어갈 때 받아가는 것들
        // 소켓 위치
        // 방 id 

        // 유저 목록
        // 채팅 내역


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
					<Grid key={room.idx} item xs={12}>
					<CardContent>
						<ChatRoom elevation={8}>
						<Typography sx={{marginLeft: 2, marginTop: 2}} variant='h4' gutterBottom>
							{room.name}
						</Typography>
						<Typography sx={{marginLeft: 2}} gutterBottom>
							{room.owner_nickname}의 방
						</Typography>
						<Box style={{width: 450, height: 30, textAlign:'right'}}>
							{room.ispassword ? ( <LockIcon style={{fontSize: 40}}/>) : ( <p></p> )}		
						</Box>
						<CardActions>
							{/* <Button sx={{left: 10} }size="small" variant="contained" onClick={() => handleJoin(room.is_password, room.idx)}>Join</Button> */}
							<Button sx={{left: 10} }size="small" variant="contained" onClick={() => handlePasswordModal(room.is_password, room.idx)}>Join</Button>
						</CardActions>
						</ChatRoom>
					</CardContent>
					</Grid>
				);
			})}
			<Modal
				open={openModal}
				onClose={handleModalClose}
				aria-labelledby="input-password"
				aria-describedby="password-text-field"
			>
				<Box sx={modalStyle}>
					<Typography id="modal-modal-title">
						패스워드 입력
					</Typography>
					<TextField
						sx={{
								top: 10,
								width:300
						}}
						id="password_text_field"
						label="password"
						onChange={handleInPassword}
						/>
				<Button sx={{top: 20}} size="small" variant="contained" onClick={handleCheckPassword}>Join</Button>
				</Box>
			</Modal>
			</MainChatRoomList>
			) : (
				<></>
		   )}

		</div>
	);
}
