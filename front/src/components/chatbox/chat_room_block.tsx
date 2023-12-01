import { useState } from 'react';

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

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '1%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    opacity: 0.5
};

export default function ChatRoomBlock({room, openModal, setOpenModal, selectedIdx, setSelectedIdx, handleJoin} :any) {

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
		// 백 서버에 패스워드 체크 보내는 부분 필요
		console.log('check ispassword and idx before handleJoin form Modal');
		console.log('idx - ', selectedIdx);
		handleJoin(selectedIdx, inPassword);
        setInPassword('');
	}

    function handlePasswordModal(ispassword:boolean, idx :number) {
        if (ispassword === true)
        {
            console.log('!!!!! open modal plesae');
            console.log('idx is - ', idx);
            handleModalOpen(idx);
            // modal 자체가 async할 가능성
        }
        else
        {
            console.log('do without modal~~');
            handleJoin(idx, inPassword);
        }
	}


    return (
        <Grid item>
            <CardContent
              sx = {{
                width: '100%',
                minWidth: 300,
                margin: '5%',
                background: 'transparent',
                border: '2px solid #fff',
                borderRadius: 3,
              }} 
            >
                <Typography sx={{marginLeft: 2, marginTop: 2, color: 'white'}} variant='h4' gutterBottom>
                    {room.name}
                </Typography>
                <Typography sx={{marginLeft: 2, color: 'white'}} gutterBottom>
                    {room.owner_nickname}의 방
                </Typography>
                <Box style={{width: 150, height: 30, textAlign:'right'}}>
                    {room.ispassword ? ( <LockIcon style={{fontSize: 40}}/>) : ( <p></p> )}		
                </Box>
                <CardActions>
                    <Button sx={{ position: 'absolute', }}size="small" variant="contained" onClick={() => handlePasswordModal(room.is_password, room.idx)}>Join</Button>
                </CardActions>
            </CardContent>
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
        </Grid>
    );
}