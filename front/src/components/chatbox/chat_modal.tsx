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
    const [inPassword, setInPassword] = useState('');

    const [errShow, setErrShow] = useState(false);
    const [errMessage, setErrMessage] = useState('');

    const cookies = useCookies();

    useEffect(() => {
        
    }, []);

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

    // ChatModal 조건부 렌더링

    const handleInPassword = (event :any) => {
		setInPassword(event.target.value as string);
    }

    const handleInChatname = (event :any) => {
		setInChatname(event.target.value as string);
    }
  
    // password, is_changePass 규칙 한 번만 더 확인
    const handleDone = async () => {
        
        let hashRoomPassword;

        if (inPassword !== '')
        {
			const salt = genSaltSync(10);
			hashRoomPassword = hashSync(inPassword, salt);
        }

        console.log('changeroom - ', roominfo.idx, my_id, my_name, inChatname, chatname);
        console.log(inPassword, hashRoomPassword, roomMode, inPassword);

		await axiosToken.patch(`${process.env.NEXT_PUBLIC_API_URL}chat/changeroom`, {
			room_idx: Number(roominfo.idx),
			user_id: my_id,
			user_nickname: my_name,
			chatroom_name: inChatname? inChatname : chatname,
			password: inPassword ? hashRoomPassword : '',
            private: roomMode,
            is_changePass : inPassword ? true : false
		},
		{
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${cookies.get('access_token')}`
			  },
		})
		.then((res) => {
			console.log('setting success');
			console.log(res);
			if (res.data.status)
            {
                handleCloseModal();
                // 성공 사실 알림창?
                if (inChatname !== '')
                    setChatname(inChatname);
            }
			else
            {
				setErrMessage(res.data.message);
                setErrShow(true);
                // 에러 알림
            }

		})
		.catch((err) => {
			console.log('setting fail');
			console.log(err);
		})

    }

    // 지금은 방 자체를 다시 그릴 수도 있다 -> 변경 사항이 즉시 반영 안될 가능성 있음
        // chat 제목은 props의 roominfo에 의존한다 -> 변경 안할 가능성 있음 state 아니라서


    const handleRoomMode = () => {
        if (roomMode === false)
            setRoomMode(true);
        else
            setRoomMode(false);
    }

    useEffect(() => {

    }, [roomMode]);

    // console.log('ChatModalCondition - ', modalCondition);
    // console.log('ChatModal roominfo - ', roominfo);

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
            {modalCondition === 'change_name' && 
                <TextField
                    className={styles.modalTextField}
                    id="chatname_text_field"
                    label="Enter new Name"
                    onChange={handleInChatname}
                />
            }
            {(modalCondition === 'remove_password') && 
                <Typography id="double-check">
                    정말 제거하시겠습니까?
                </Typography>
            }
            {(modalCondition === 'change_password') && 
                <TextField
                    className={styles.modalTextField}
                    id="password_text_field"
                    label="Enter new Password"
                    onChange={handleInPassword}
                />
            }
            {modalCondition === 'change_visibility' && 
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