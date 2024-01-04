import { useState, useEffect } from 'react';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Grid from '@mui/material/Grid';

import Box from '@mui/material/Box';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import Modal from '@mui/material/Modal';

import LockIcon from '@mui/icons-material/Lock';

import { styled } from '@mui/system';
import { Paper } from '@mui/material';

import Marquee from "react-fast-marquee";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '88%',
    transform: 'translate(-50%, -50%)',
    width: '10%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 0,
    p: 4,
};

export default function ChatRoomBlock({room, roomidx,openModal, setOpenModal, selectedIdx, setSelectedIdx, handleJoin} :any) {

	const [inPassword, setInPassword] = useState('');

	function handleModalOpen(idx :number) {
        setSelectedIdx(idx);
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
		handleJoin(selectedIdx, inPassword);
        setInPassword('');
	}

    function handlePasswordModal(ispassword:boolean, idx :number) {
        if (ispassword === true)
        {
            handleModalOpen(idx);
        }
        else
        {
            handleJoin(idx, inPassword);
        }
	}

    return (
        <>
            <CardContent
              sx = {{
                width: '80%',
                minWidth: 300,
                maxHeight: 180,
                margin: '5%',
                background: 'transparent',
                border: '2px solid #fff',
                borderRadius: 3,
              }} 
            >
                <Marquee
                pauseOnHover>
                    <Typography sx={{marginLeft: 2, marginTop: 2, color: 'white', }} variant='h4' gutterBottom>
                            {room.name}
                    </Typography>
                </Marquee>
                <Typography sx={{marginLeft: 2, color: 'white'}} gutterBottom>
                    {room.owner_nickname}의 방
                </Typography>	
                <CardActions>
                    <Button sx={{marginTop: 2,}}size="small" variant="contained" onClick={() => handlePasswordModal(room.is_password, room.idx)}>Join</Button>
                    {room.is_password ? ( <LockIcon style={{fontSize: 20, color: 'white', marginLeft: 2, marginTop: 15}}/>) : ( <p></p> )}		
                </CardActions>
            </CardContent>
            <Modal
                open={openModal}
                onClose={handleModalClose}
                aria-labelledby="input-password"
                aria-describedby="password-text-field"
                BackdropProps={{
                    invisible: false,
                  }}
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title">
                        패스워드 입력
                    </Typography>
                    <TextField
                        sx={{
                                top: 10,
                                width:'80%'
                        }}
                        id="password_text_field"
                        label="password"
                        onChange={handleInPassword}
                        />
                <Button sx={{top: 20}} size="small" variant="contained" onClick={() => handleCheckPassword()}>Join</Button>
                </Box>
            </Modal>
            </>
    );
}