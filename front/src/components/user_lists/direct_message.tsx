import { useState, useRef , useEffect } from 'react';
import React from 'react';

import Popper, { PopperPlacementType } from '@mui/material/Popper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List'
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

// 로딩되기 전에 그림자 띄울 수 있음. 아직 적용하지 않았음. 
import Skeleton from '@mui/material/Skeleton';
import styles from './dm.module.css';
// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';

import axios from "axios";

import { useCookies } from 'next-client-cookies';

import { useChatSocket } from "../../app/main_frame/socket_provider"

import DmMessageBlock from './direct_message_block';

export default function DirectMessage( {dmAlarmCount, dmAlarmMessageList, dmAlarmRemover, dmOpenId, handleChatTarget, setMTbox, tapref} :any) {
    
    const [dmList, setDmList] = useState([]);
    const [message, setMessage] = useState('');
    
    const cookies = useCookies();
    const messageAreaRef = useRef(null);
    const scrollRef = useRef(null)
    const socket = useChatSocket();
    
    // direct message 목록 받아오기
    
    const user_id = Number(cookies.get('user_id'));
    const nick_name = cookies.get('nick_name');

    const getNewDm = async (dmOpenId :number) => {

        console.log('check');

        // HTTP 읽지 않은 DM 요청 api
            // 존재 - idx 스스로 추출
            // 없음 - 비어있음
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}chat/unreaddm`,{
            params: {
                user_id: user_id,
                from_id: dmOpenId
            }
        }).then(async function (res) {
            // callback으로 res의 idx 파트 인자로 받는 동작
                // HTTP 이전 DM 이력 요청 (idx 받았으면 넘기고, 안 받았으면 안 넘김)
            // res의 data를 반환

            const new_dms = res.data;

            console.log('new_dms res.data - ', res.data);

            if (res.data.status === true)
            {
                // idx -1부터 시작하지 않나?
                var idx = 0;

                if (res.data.dm.length !== 0)
                {
                    idx = res.data.dm[length - 1].idx;
                }
                
                await axios.get(`${process.env.NEXT_PUBLIC_API_URL}chat/dm`, {
                    params: {
                        // user_id가 아닌 이유?
                        id: user_id,
                        from_id: dmOpenId,
                        idx: idx
                    }
                }).then((res) => {
                    const dms = res.data;

                    console.log('dms res.data - ', res.data);
                    if (res.data.status === true)
                    {
                        // 전체를 dmList에 저장
                    }

                }).catch((err) => {

                });
            }
            else
            {
                // res는 존재하지만 백 서버에서 실패로 판단한 경우
            }
        }).catch((err) => {

        });

    };

	const handleSendMessage = () => {
		console.log('send message:==== \n', message);
		if (message.trim() === '') {
			return;
		}
		
		const newMessage = {
			from: user_id,
            to: dmOpenId,
			message: message,
		};
        console.log('message sent! - ', newMessage);
		// socket.emit("tmp_dm", newMessage);
		setMessage('');
	};

    const handleOpen = () => {
        if (dmOpenId === -1)
            return false;
        else
            return true;
    }

    useEffect(() => {

        getNewDm(dmOpenId
        ).then((res) => {
            socket.on('dm', (data:any) => {
                if (data.from_id === dmOpenId)
                {
                    // 이미 dm 있으니 아무것도 하지 않는다.
                    console.log('dm message to dmOpenId');
                    // 목록 뒤에 추가하고 그리기
                    setDmList((prevDmList :any) => 
                        [...prevDmList, data]);
                    
                }
                else
                {
                    console.log('dm message to different id');
                    // 아무 것도 안하기
                }
            });
        }).catch((err) => {

        });

    }, [socket]);

    return (
        <div>
                <Popper open={handleOpen()} anchorEl={tapref.current} placement="right-start" style={{width: '500px'}}>
                    <AppBar position="static">
                        <Typography variant="h6" sx={{ flexGrow: 1 ,align: 'center' }}>
                            {dmOpenId}
                        </Typography>
                    </AppBar>
                    <Grid container component={Paper}>
                        <List className={styles.messageArea} ref={messageAreaRef}>
                            <DmMessageBlock
                                my_name={cookies.get('nick_name')}
                                socket={socket}
                                setMTbox={setMTbox}
                                scrollref={messageAreaRef}
                            />
                        </List>
                        <Divider />
                        <Grid container style={{ padding: "20px" }}>
                            <Grid item xs={11}>
                                <TextField
                                    id="direct-message-input-block"
                                    label="Input message"
                                    fullWidth 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    inputProps={{ maxLength: 50 }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            if (e.nativeEvent.isComposing) return;
                                            handleSendMessage();
                                        }}}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Popper>
        </div>
    );
}
  