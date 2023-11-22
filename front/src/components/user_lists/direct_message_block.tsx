'use client'
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Grid, List, ListItem, Stack, Chip, Typography, Avatar } from "@mui/material";
import { useCookies } from 'next-client-cookies';
import { useChatSocket } from "../../app/main_frame/socket_provider"
import { useChatBlockContext } from '@/app/main_frame/shared_state';

import { axiosToken } from '@/util/token';

export default function DmMessageBlock({dmOpenId, dmOpenNickname, scrollref, setMTbox} :any) {
    const [tmpNewDm, setTmpNewDm] = useState([]);
    const [tmpOldDm, setTmpOldDm] = useState([]);
	const [dmList, setDmList] = useState([]);
    const [lastIdx, setLastIdx] = useState(-1);
    const [page, setPage] = useState(0);
    const dmListRef = useRef<HTMLUListElement>(null);
    const socket = useChatSocket();
    const cookies = useCookies();


    const user_id = Number(cookies.get('user_id'));
    const nick_name = cookies.get('nick_name');

    const { dmBlockTriggerRender, setDmBlockTriggerRender } = useChatBlockContext();


    const getNewDm = async (dmOpenId :number) => {

        console.log('DmMessageBlock getNewD');

        // HTTP 읽지 않은 DM 요청 api
            // 존재 - idx 스스로 추출
            // 없음 - 비어있음
        
            // 메시지가 아예 없으면 idx -1로 보내야하는거 아닌가? 0으로 관리하는 이유는?

        console.log(dmOpenId);
        await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}chat/unreaddm`,{
            params: {
                user_id: user_id,
                from_id: dmOpenId
            },
            headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${cookies.get('access_token')}`
			},
        }).then(async function (res) {

            const new_dms = res.data;

            if (res.data.status === true)
            {
                // idx -1부터 시작하지 않나?
                var idx = 0;
                console.log('unread dms - ', res.data.dm);
                if (res.data.dm.length !== 0)
                {
                    idx = res.data.dm[res.data.dm.length - 1].idx - 1;
                    setLastIdx(idx + 1);

                    setTmpNewDm([]);
                    res.data.dm.map((data :any) => {
                        const newMessage = renderMessage(data);


                        setTmpNewDm((prevTmpDmList :any) => 
                        [...prevTmpDmList, newMessage]);
                    })
                }

                await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}chat/dm`, {
                    params: {
                        id: user_id,
                        from_id: dmOpenId,
                        idx: idx
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${cookies.get('access_token')}`
                    },
                }).then((res) => {
                    const dms = res.data;

                    if (res.data.status === true)
                    {
                        console.log('old dms - ', res.data.dm);
                        if (res.data.dm.lenth !== 0)
                        {
                            setLastIdx(res.data.dm[res.data.dm.length - 1].idx);

                            setTmpOldDm([]);
                            res.data.dm.map((data :any) => {
                                const newMessage = renderMessage(data);
    
                                setTmpOldDm((prevTmpOldDm :any) => 
                                [...prevTmpOldDm, newMessage]);
                            });
                        }
                    }

                }).catch((err) => {
                    console.log('is it err in dm get?');
                });
            }
            else
            {
                // res는 존재하지만 백 서버에서 실패로 판단한 경우
            }
        }).catch((err) => {

        });


    };


    useEffect(() => {

        getNewDm(dmOpenId
        ).then((res) => {

            socket.on('dm', (data:any) => {
                if (data.from_id === dmOpenId || data.from_id === user_id)
                {
                    const newMessage = renderMessage(data);

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
            console.log('dm block unmounted');
            socket.off("dm");
        }

    }, [socket]);



    useEffect(() => {

        console.log('set tmp to dmList');
        setDmList([]);
        if (tmpOldDm.length !== 0)
        {
            // 역순으로 추가
            setTmpOldDm(tmpOldDm.reverse());
            console.log('tmpOldDm list - ', tmpOldDm);
            tmpOldDm.map((data :any) => { setDmList((prevDmList :any) => [...prevDmList, data])})
        }

        if (tmpNewDm.length !== 0)
        {
            // 역순으로 넣기
            setTmpNewDm(tmpNewDm.reverse());
            tmpNewDm.map((data :any) => { setDmList((prevDmList :any) => [...prevDmList, data])})
        }

    }, [tmpOldDm]);



    useEffect(() => {
        console.log('get dms for new target');
        getNewDm(dmOpenId);
    }, [dmBlockTriggerRender])


    useEffect(() => {
        const handleScroll = () => {
          if (dmListRef.current && dmListRef.current.scrollTop === dmListRef.current.scrollHeight) {
            setPage((prevPage) => prevPage + 1);
          }
        };
      
        if (dmListRef.current) {
          dmListRef.current.addEventListener('scroll', handleScroll);
        }
      
        return () => {
          if (dmListRef.current) {
            dmListRef.current.removeEventListener('scroll', handleScroll);
          }
        };
      }, [page]);


    useEffect(() => {
        // page 값 변경 - idx 당겨서 새로 리스트 만들기 ()
        const getMoreDm = async () => {
            await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}chat/dm`, {
                params: {
                    id: user_id,
                    from_id: dmOpenId,
                    idx: lastIdx - 1
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.get('access_token')}`
                },
            }).then((res) => {
                const dms = res.data;
    
                if (res.data.status === true)
                {
                    if (res.data.dm.lenth !== 0)
                    {   
                        // 가져온 리스트 임시 저장
                        // 현재 리스트 복사 보관
                        // 빈 현재 리스트에 가져온 리스트 저장
                        // 보관된 리스트를 현재 리스트에 추가
                        setLastIdx(res.data.dm[res.data.dm.length - 1].idx);
                        
                        const tmpResDm = res.data.dm.reverse;
                        const tmpNowDm = dmList;

                        setDmList([]);

                        tmpResDm.map((data :any) => {
                            const newMessage = renderMessage(data);

                            setDmList((prevDmList :any) => [...prevDmList, newMessage]);
                        });
                        
                        tmpNowDm.map((data :any) => {
                            const newMessage = renderMessage(data);

                            setDmList((prevDmList :any) => [...prevDmList, newMessage]);
                        });

                    }
                }
    
            }).catch((err) => {
                console.log('is it err in dm get?');
            });
        }

    }, [page]);


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
				<ListItem style={{ padding: '5px', paddingBottom: '0px', marginLeft: dmOpenNickname === nick_name? '380px' : '0px'}}>
					<Stack direction="row" spacing={1}>
						<Chip
							avatar={<Avatar src={imageLoader({src: dmOpenNickname})} />}
							label={dmOpenNickname}
							component='div'
							onClick={() => handleClick(dmOpenNickname)}
						/>
					</Stack>
				</ListItem>
				<ListItem
					style={{
						display: 'flex',
						justifyContent: dmOpenNickname === nick_name ? 'flex-end' : 'flex-start',
						paddingRight: dmOpenNickname === nick_name ? '25px' : '0px',
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
            <List ref={dmListRef}>
			    {dmList}
            </List>
		</div>
	);
};