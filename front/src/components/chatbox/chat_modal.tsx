import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import Fade from '@mui/material/Fade';
import Alert from '@mui/material/Alert';

import { useEffect, useState } from 'react';
import { axiosToken } from '@/util/token';
import { useCookies } from 'next-client-cookies';

import styles from './chat.module.css';

import { genSaltSync, hash, hashSync } from "bcrypt-ts";

export default function ChatModal({modalOpen, setModalOpen, modalCondition,
        my_id, my_name, roominfo, chatname, setChatname, roomMode, setRoomMode} :any) {
    
    const [inChatname, setInChatname] = useState('');
    const [inPassword, setInPassword] = useState<any>('');
    const [errShow, setErrShow] = useState(false);
    const [errMessage, setErrMessage] = useState('');

    const cookies = useCookies();

        
    const handleCloseModal = () => {
        setModalOpen(false);
        setInChatname('');
        setInPassword('');
        setErrShow(false);
        setErrMessage('');
    };

    const handleCloseErr = () => {
        setErrShow(false);
        setErrMessage('');
    }

    const handleInPassword = (event :any) => {
		    setInPassword(event.target.value as string);
    }

    const handleInChatname = (event :any) => {
		    setInChatname(event.target.value as string);
    }

    const handleDone = async () => {
        
        let hashRoomPassword;
        if (inPassword !== '')
        {
            if (!/^[a-zA-Z0-9]+$/.test(inPassword)) {
                setErrShow(true);
                setErrMessage('영문 숫자를 넣어 20자이내로 해주세요!');
                return ;
            }
			const salt = genSaltSync(10);
			hashRoomPassword = hashSync(inPassword, salt);
        }
        {
            await axiosToken.patch(`${process.env.NEXT_PUBLIC_API_URL}chat/changeroom`, {
                room_idx: Number(roominfo.idx),
                user_id: my_id,
                user_nickname: my_name,
                chatroom_name: inChatname? inChatname : chatname,
                password: inPassword ? hashRoomPassword : '',
                private: roomMode,
                is_changePass : modalCondition === 'change password' ? true : false
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.get('access_token')}`
                },
            })
            .then((res) => {

                if (res.data.status)
                {
                    handleCloseModal();
                    if (inChatname !== '')
                        setChatname(inChatname);
                }
                else
                {
                    setErrMessage(res.data.message);
                    setErrShow(true);
                }

            })
            .catch((err) => {
            })
        }


    }

    const handleRoomMode = () => {
        if (roomMode === false)
            setRoomMode(true);
        else
            setRoomMode(false);
    }

    return (
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="chat_modal"
          aria-describedby="chat_modal_with_condition"
        >
            <Box style={{
                position: 'absolute',
                top: '45%',
                left: '80%',
                width: '14vw',
                height: '10vw',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '5px'
                }}
            >
            <Typography id="" variant="h6" component="h2">
                {modalCondition}
            </Typography>
            {modalCondition === 'change name' && 
                <TextField
                    className={styles.modalTextField}
                    id="chatname_text_field"
                    label="Enter new Name"
                    inputProps={{ maxLength: 30}}
                    onChange={handleInChatname}
                />
            }
            {(modalCondition === 'remove_password') && 
                <Typography id="double-check">
                    정말 제거하시겠습니까?
                </Typography>
            }
            {(modalCondition === 'change password') && 
                <TextField
                    color={errShow ? "error" : "primary"}
                    className={styles.modalTextField}
                    id="password_text_field"
                    label="Enter new Password"
                    type="password"
                    inputProps={{
                        maxLength: 20

                    }}
                    onChange={handleInPassword}
                    onKeyDown={(e) => {
						if (e.key === 'Enter') {
							if (e.nativeEvent.isComposing) return;
							handleDone();
						}}}
                />
            }
            {modalCondition === 'change visibility' && 
                    <FormControlLabel
                    sx={{
                        position: 'relative',
                        left:'2%',
                        top:'35%',
                    }}
                    control={
                        <Switch 
                            checked={roomMode}
                            onChange={handleRoomMode}
                        />}
                    label={
                        <Typography sx={{fontSize: '0.7vw'}}>
                            Private
                        </Typography>
                        }
                    labelPlacement='start'
                />
            }
            <Typography id="notice">
                설정 후 완료 버튼을 눌러주세요.
            </Typography>
            <Button
				sx={{
					position: 'absolute',
					top: '80%',
					left: '60%',
					background: "white",
					color: "black",
				}}
				variant='contained'
				color='success'
				onClick={handleDone}
				>
                <Typography sx={{color: 'black', fontSize: '0.7vw'}}>
                    완료
                </Typography>
            </Button>
            <Button
				sx={{
					position: 'absolute',
					top: '80%',
					left: '80%',
					background: "white",
					color: "black",
				}}
				variant='contained'
				color='success'
				onClick={handleCloseModal}
				>
                <Typography sx={{color: 'black', fontSize: '0.7vw'}}>
                    취소
                </Typography>
            </Button>
            <Fade in={errShow}>
                <Alert
                    severity="error"
                    onClose={handleCloseErr}
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        zIndex: 9999,
                        transform: 'translate(0, 0)',
                    }}
                >
                    <strong>{errMessage}</strong>
                </Alert>
            </Fade>
            </Box>
        </Modal>
    );
  }