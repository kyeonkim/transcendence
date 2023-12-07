'use client'
import { useState, useEffect, use } from 'react';
import React from 'react';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';

import AddCommentIcon from '@mui/icons-material/AddComment';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

import Skeleton from '@mui/material/Skeleton';


import Box from '@mui/material/Box';

import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { axiosToken } from '@/util/token';
// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';

// get cookie
import { useCookies } from 'next-client-cookies';

import axios from 'axios';

import  { useChatBlockContext } from '../../app/main_frame/shared_state';

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

export default function AlarmInviteChat (
    {
        alarm, alarmReducer, handleProfile, imageLoader, denyRequest,
        openModal, setOpenModal, selectedAlarm, setSelectedAlarm
    } :any
    ) {

    const [inPassword, setInPassword] = useState('');

	const { setChatBlockRenderMode, setChatBlockTriggerRender, handleRenderChatBlock } = useChatBlockContext();

    const cookies = useCookies();
	const user_id = Number(cookies.get("user_id"));
	const user_nickname = cookies.get("nick_name");

	function handleModalOpen(alarm :any) {
        setSelectedAlarm(alarm);
		setOpenModal(true);
	}
	
	function handleModalClose() {
		setOpenModal(false);
	};

    function handleInPassword(event :any) {
		setInPassword(event.target.value as string);
	}
  
    async function handleCheckPassword()
	{
		// 백 서버에 패스워드 체크 보내는 부분 필요
		console.log('check ispassword and idx before handleJoin form Modal');
		console.log('idx - ', selectedAlarm);
		handleJoin(selectedAlarm, inPassword);
        setInPassword('');
	}

    function handlePasswordModal(alarm :any) {
        if (alarm.is_password === true)
        {
            console.log('!!!!! open modal plesae');
            console.log('idx is - ', alarm.chatroom_id);
            handleModalOpen(alarm);
            // modal 자체가 async할 가능성
        }
        else
        {
            console.log('do without modal~~');
            handleJoin(alarm, inPassword);
        }
	}

    const acceptInviteChat = (alarm :any) => () => {
        
        checkUserInChat(alarm)
        .then((res :any) => {
            console.log('room check - ', res);
            if (res.data.userdata.roomuser === null)
            {
                // 방 들어가기 함수
                console.log('get in room');
                handlePasswordModal(alarm);
            }
            else
            {
                // 이미 채팅방에 들어가있습니다!
                // 예외 처리
                // 일단 아무것도 안함
            }
        })
        .catch();
    }

    async function handleJoin(alarm :any, inPassword :string) {

		await axiosToken.patch(`${process.env.NEXT_PUBLIC_API_URL}chat/joinroom`, 
		{
			user_id : user_id,
			user_nickname: user_nickname,
			room_id: alarm.chatroom_id,
			password: inPassword,
		}) 
		.then((res) => {
		if (res.status === 200)
		{
            console.log('handlejoin alarm data - ', alarm);
            // 성공 했는데 방이 없을 수도 있다.
            if (res.data.status === false)
            {
                // 방 없음. 실패. 제거.
                console.log('fail to find room');
                denyRequest(alarm);
            }
            else
            {
			    // 방 들어가졌으니 방으로 이동하기
			    console.log('success to join !!! === data', res);
                alarmReducer(alarm);
                setChatBlockRenderMode('chatRoom');
                setChatBlockTriggerRender(true);
                // handleRenderChatBlock('chatRoom');
            }

		}
		else
		{
			// 200 말고 다른 종류의 '성공'이 존재하나?
			// !!!!! 방 인원이 가득 찬 경우 - 방에 들어가지 못하고, 목록 다시 렌더링
				// 에러로 뺄 수도 있을 것 같은데, 협의 필요.
			console.log('do nothing');
		}
		})
		.catch ((error) => {
			// request error
				// 적절하지 않은 요청입니다.
					// rerender
			// internal error
				// 종류 따라 다를 듯
			console.log('do nothing');
		});

	}

    const checkUserInChat = async (alarm :any) => {
        return (await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/id/${alarm.to_id}`, {
            headers: {
                Authorization: `Bearer ${cookies.get("access_token")}`,
            },
        }));
    };

    const labelId = `comment-list-secondary-label-${alarm.from_nickname}`;
    console.log('alamr type - ', alarm);
    
    return (
      <div>
                <ListItem
                //    key={alarm.from_nickname}
                   disablePadding
                >
                   <AddCommentIcon sx={{color: 'white'}}/>
                   <ListItemButton onClick={handleProfile(alarm)}>
                       <ListItemAvatar>
                       <Avatar
                         src={alarm.from_nickname ? imageLoader({src: alarm.from_nickname}) : null}
                       />
                       </ListItemAvatar>
                       <ListItemText id={labelId} sx={{color: 'white'}} primary={`${alarm.from_nickname}`} />
                   </ListItemButton>
                    <IconButton sx={{color: 'green'}}onClick={acceptInviteChat(alarm)}>
                       <CheckCircleOutlineRoundedIcon />
                   </IconButton>
                   <IconButton sx={{color: 'red'}}onClick={denyRequest(alarm)}>
                       <ClearRoundedIcon />
                   </IconButton>
                 </ListItem>
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
                        <Button sx={{top: 20}} size="small" variant="contained" onClick={() => handleCheckPassword()}>Join</Button>
                        </Box>
                    </Modal>
        </div>
    );
  }
  