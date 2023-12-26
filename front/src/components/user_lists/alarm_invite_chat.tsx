'use client'
import { useState, useEffect, use } from 'react';
import React from 'react';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';

import AddCommentIcon from '@mui/icons-material/AddComment';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

import Box from '@mui/material/Box';

import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { axiosToken } from '@/util/token';

import { useCookies } from 'next-client-cookies';

import  { useChatBlockContext } from '../../app/main_frame/shared_state';
import { useUserDataContext } from '@/app/main_frame/user_data_context';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    border: '2px solid #000',
    boxShadow: 30,
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

    const { user_id, nickname } = useUserDataContext();
	const user_nickname = nickname;
    const [error, setError] = useState(false);
    const [errMessage, setErrMessage] = useState('');

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
		handleJoin(selectedAlarm, inPassword);
        setInPassword('');
	}

    const acceptInviteChat = (alarm :any) => async () => {
        await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/id/${alarm.to_id}`, {
            headers: {
                Authorization: `Bearer ${cookies.get("access_token")}`,
            },
        })
        .then((res :any) => {
            // console.log('success acceptInviteChat', res);
            handleinvite(alarm);
        });
    }
    // const acceptInviteChat = (alarm :any) => {
    //     handleinvite(alarm);
    // }

    async function handleinvite(alarm :any) {
        // console.log('in handleInvite - ', alarm);
        await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}chat/acceptinvite`,
        {
            user_id : user_id,
            user_nickname: user_nickname,
            from_nickname: alarm.from_nickname,
            room_id: alarm.chatroom_id,
            event_id: alarm.idx,
        },
        {
            headers: {
                Authorization: `Bearer ${cookies.get("access_token")}`,
            },
        })
        .then((res) => {
            // console.log('accept res===', res);
            if (res.data.status === false)
            {
                // console.log("in err");
                // setError(true);
                // setErrMessage(res.data.message);
                denyRequest(alarm);
            }
            else
            {
                // console.log('success');
                alarmReducer(alarm);
                setChatBlockRenderMode('chatRoom');
                setChatBlockTriggerRender(true);
            }
        })
    }
    const handleCloseErr = () => {
        setError(false);
        setErrMessage('');
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
            if (res.data.status === false)
            {
                setError(true);
                setErrMessage(res.data.message);
            }
            else
            {
                alarmReducer(alarm);
                setChatBlockRenderMode('chatRoom');
                setChatBlockTriggerRender(true);
            }
		}
	    })
    }

    const labelId = `comment-list-secondary-label-${alarm.from_nickname}`;
    
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
                        sx={modalStyle}
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
  
    // {error && <Alert
    //     severity="error"
    //     onClose={handleCloseErr}
    // >
    // <strong>{errMessage}</strong>
    // </Alert>}