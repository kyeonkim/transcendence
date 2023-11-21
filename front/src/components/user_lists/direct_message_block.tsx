'use client'
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Grid, ListItem, Stack, Chip, Typography, Avatar } from "@mui/material";
import { useCookies } from 'next-client-cookies';
import { useChatSocket } from "../../app/main_frame/socket_provider"

import axios from "axios";

export default function DmMessageBlock({dmOpenId, dmOpenNickname, scrollref, setMTbox} :any) {
	const [dmList, setDmList] = useState([]);
	const [index, setIndex] = useState(0);
    const socket = useChatSocket();
    const cookies = useCookies();

    const user_id = Number(cookies.get('user_id'));
    const nick_name = cookies.get('nick_name');


    // !!!!! dmOpenNickname, myName 사용할 방법 고려

    const getNewDm = async (dmOpenId :number) => {

        console.log('DmMessageBlock getNewD');

        // HTTP 읽지 않은 DM 요청 api
            // 존재 - idx 스스로 추출
            // 없음 - 비어있음
        
        console.log(dmOpenId);
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
                    idx = res.data.dm[length - 1].idx - 1;
                    
                    
                    // dmList에 추가
                    res.data.map((data :any) => {
                        setDmList((prevDmList :any) => 
                        [...prevDmList, data]);
                    })
                }

                console.log('so dm msg idx is - ', idx);
                
                await axios.get(`${process.env.NEXT_PUBLIC_API_URL}chat/dm`, {
                    params: {
                        // user_id가 아닌 이유?
                        id: user_id,
                        from_id: dmOpenId,
                        idx: idx
                    }
                }).then((res) => {
                    const dms = res.data;

                    // 백에서 알아서 is_read를 true로 만들고 계신가?
                    console.log('dms res.data - ', res.data);
                    if (res.data.status === true)
                    {
                        // 전체를 dmList에 저장
                        res.data.map((data :any) => {
                            setDmList((prevDmList :any) => 
                            [...prevDmList, data]);
                        });
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

        console.log();

    };


    useEffect(() => {

        getNewDm(dmOpenId
        ).then((res) => {
            socket.on('dm', (data:any) => {
                if (data.from_id === dmOpenId || data.from_id === user_id)
                {
                    // 이미 dm 있으니 아무것도 하지 않는다.
                    const newMessage = renderMessage(data);
                    console.log('dm on dm block', newMessage);
                    setDmList(prevMessages => [...prevMessages, newMessage]);
                }
                else
                {
                    console.log('dm message to different id');
                    // 아무 것도 안하기
                }
            });
        }).catch((err) => {

        });

        return () => {
            socket.off("dm");
        }

    }, [socket]);


	useLayoutEffect(() => {
		moveScroll();
	}, [dmList]);

	const moveScroll = () => {
		if (scrollref.current) {
			scrollref.current.scrollTop = scrollref.current.scrollHeight;
		}
	};

	const imageLoader = useCallback(({ src }: any) => {
		return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
	}, []);

	const handleClick = (name: any) => {
		setMTbox(1, name);
	};

	const renderMessage = (message: any) => {
		return (
			<Grid container key={message.created_at}>
				<ListItem style={{ padding: '5px', paddingBottom: '0px', marginLeft: message.from_id === user_id? '380px' : '0px'}}>
					<Stack direction="row" spacing={1}>
						<Chip
							avatar={<Avatar src={imageLoader({src: message.from_id})} />}
							label={message.from_id}
							component='div'
							onClick={() => handleClick(message.from_id)}
						/>
					</Stack>
				</ListItem>
				<ListItem
					style={{
						display: 'flex',
						justifyContent: message.from_id === user_id ? 'flex-end' : 'flex-start',
						paddingRight: message.from_id === user_id ? '25px' : '0px',
						wordBreak: 'break-word',
					}}
				>
					<Typography style={{ overflowWrap: 'break-word' }}>
						{`${message.content}`}
					</Typography>
				</ListItem>
			</Grid>
		);
	};

	return (
		<div style={{ overflowX: 'hidden' }}>
			{dmList}
		</div>
	);
};