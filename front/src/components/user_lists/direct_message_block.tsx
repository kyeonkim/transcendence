'use client'
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Grid, List, ListItem, Stack, Chip, Typography, Avatar } from "@mui/material";
import { useCookies } from 'next-client-cookies';
import { useChatSocket } from "../../app/main_frame/socket_provider"
import { useChatBlockContext } from '@/app/main_frame/shared_state';

import { axiosToken } from '@/util/token';

export default function DmMessageBlock({dmOpenId, dmOpenNickname, messageAreaRef, scrollref, setMTbox} :any) {
    const [tmpNewDm, setTmpNewDm] = useState([]);
    const [tmpOldDm, setTmpOldDm] = useState([]);
	const [dmList, setDmList] = useState([]);
    const [lastIdx, setLastIdx] = useState(-1);
    const [page, setPage] = useState(0);

    const [renderAppend, setRenderAppend] = useState(false);
    const [appendLength, setAppendLength] = useState(0);
    const [scrollTop, setScrollTop] = useState(false);

    const socket = useChatSocket();
    const cookies = useCookies();

    const dmOpenIdRef = useRef(dmOpenId);

    const user_id = Number(cookies.get('user_id'));
    const nick_name = cookies.get('nick_name');

    const { dmBlockTriggerRender, handleRenderDmBlock } = useChatBlockContext();

    // console.log('nick_name - ', nick_name);
    // console.log('dmOpenNickName - ', dmOpenNickname);


    const handleRenderAppend = () => {
        if (renderAppend === true)
            setRenderAppend(false);
        else
            setRenderAppend(true);
    }


    const getNewDm = async (dmOpenId :number) => {

        console.log('DmMessageBlock getNewD');

        // HTTP 읽지 않은 DM 요청 api
            // 존재 - idx 스스로 추출
            // 없음 - 비어있음
        
            // 메시지가 아예 없으면 idx -1로 보내야하는거 아닌가? 0으로 관리하는 이유는?

        console.log(dmOpenIdRef.current);
        await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}chat/unreaddm`,{
            params: {
                user_id: user_id,
                from_id: dmOpenIdRef.current
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
                
                setTmpNewDm([]);
                if (res.data.dm.length !== 0)
                {
                    idx = res.data.dm[res.data.dm.length - 1].idx - 1;
                    setLastIdx(idx + 1);


                    res.data.dm.map((data :any) => {
                        const newMessage = renderMessage(data);


                        setTmpNewDm((prevTmpDmList :any) => 
                        [...prevTmpDmList, newMessage]);
                    })
                }

                await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}chat/dm`, {
                    params: {
                        id: user_id,
                        from_id: dmOpenIdRef.current,
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
                        setTmpOldDm([]);
                        if (res.data.dm.length !== 0)
                        {
                            setLastIdx(res.data.dm[res.data.dm.length - 1].idx);

                            res.data.dm.map((data :any) => {
                                const newMessage = renderMessage(data);
    
                                setTmpOldDm((prevTmpOldDm :any) => 
                                [...prevTmpOldDm, newMessage]);
                            });
                        }
                    }

                    console.log('getDm done')
            
                }).catch((err) => {
                    console.log('chat/dm Error catched - ', err);
                });
            }
            else
            {
                // res는 존재하지만 백 서버에서 실패로 판단한 경우
            }
            


        }).catch((err) => {
            console.log('chat/unreaddm Error catched - ', err)
        });

        console.log('getUnreadDm done');

    };



    useEffect(() => {

        const dmListener = (data :any) => {
            // dmOpenId 이슈가 존재한다.
            if (data.from_id === dmOpenIdRef.current || data.from_id === user_id)
            {
                const newMessage = renderMessage(data);
                
                setDmList(prevMessages => [...prevMessages, newMessage]);
                
                setScrollTop(false);
                handleRenderDmBlock();
            }
            else
            {
                console.log('dm message to different id');
                // 아무 것도 안하기
            }
        }

        getNewDm(dmOpenIdRef.current
        ).then((res) => {

            socket.on('dm', dmListener);

        }).catch((err) => {

        });

        return () => {
            console.log('dm block unmounted');
            socket.off('dm', dmListener);
        }

    }, [socket]);

    // dmOpenId 의존성 필요해짐
    useEffect(() => {
        dmOpenIdRef.current = dmOpenId;
    }, [dmOpenId]);


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
        setScrollTop(false);

    }, [tmpOldDm]);



    useEffect(() => {
        console.log('get dms for new target');
        getNewDm(dmOpenIdRef.current);
    }, [dmBlockTriggerRender])


    useEffect(() => {
        const handleScroll = (e:any) => {
          if (messageAreaRef.current && e.currentTarget.scrollTop === 0)
          {
            console.log('top reached')
            setPage((prevPage) => prevPage + 1);
            setScrollTop(true);
          }
        };
      
        if (messageAreaRef.current) {
          messageAreaRef.current.addEventListener('scroll', handleScroll);
        }
      
        return () => {
          if (messageAreaRef.current) {
            messageAreaRef.current.removeEventListener('scroll', handleScroll);
          }
        };
      }, [page]);


    useEffect(() => {
        // page 값 변경 - idx 당겨서 새로 리스트 만들기 ()
        const getMoreDm = async () => {
            await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}chat/dm`, {
                params: {
                    id: user_id,
                    from_id: dmOpenIdRef.current,
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
                    console.log('getOoooooold dm data - ', res.data.dm);

                    if (res.data.dm.lenth !== 0)
                    {   
                        // 가져온 리스트 임시 저장
                        // 현재 리스트 복사 보관
                        // 빈 현재 리스트에 가져온 리스트 저장
                        // 보관된 리스트를 현재 리스트에 추가
                        setLastIdx(res.data.dm[res.data.dm.length - 1].idx);
                        
                        const tmpResDm = res.data.dm.reverse();
                        const tmpNowDm = dmList;

                        setAppendLength(tmpResDm.length);

                        console.log('tmpResDm - ', tmpResDm);
                        console.log('tmpNowDm - ', tmpNowDm);

                        setDmList([]);

                        tmpResDm.map((data :any) => {
                            const newMessage = renderMessage(data);

                            setDmList((prevDmList :any) => [...prevDmList, newMessage]);
                        });
                        
                        tmpNowDm.map((data :any) => 
                        {
                            setDmList((prevDmList :any) => [...prevDmList, data]);
                        });

                    }
                }
    
            }).catch((err) => {
                console.log('getMoreDm error catched - ', err);
            });
        }

        getMoreDm().then((res) => {
            
            console.log('getMoreDm done');
        });

        // handleRenderAppend();

    }, [page]);


	useLayoutEffect(() => {
        if (scrollTop === true)
		    moveScrollTop(true);
        else
		    moveScrollTop(false);
	}, [dmList]);


	const moveScrollTop = (top :boolean) => {
		if (scrollref.current)
        {
            console.log('scrollTop - ', top);
            if (top === true)
            {
                // 최대 높이에서 적당한 높이 빼서 배치 (가져온 갯수만큼)
                scrollref.current.scrollTop = appendLength * 77;
            }
            else
            {
                scrollref.current.scrollTop = scrollref.current.scrollHeight;
            }

		}
	};

	const imageLoader = useCallback(({ src }: any) => {
		return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
	}, []);

	const handleClick = (name: string) => {
		setMTbox(1, name);
	};

	const renderMessage = (message: any) => {
        
        var target_name :string;

        if (message.from_id === dmOpenIdRef.current)
            target_name = dmOpenNickname;
        else
            target_name = nick_name;

		return (
			<Grid container key={message.created_at}>
				<ListItem style={{ padding: '5px', paddingBottom: '0px', marginLeft: target_name === nick_name? '380px' : '0px'}}>
					<Stack direction="row" spacing={1}>
                        <Chip
                            avatar={<Avatar src={imageLoader({src: target_name})} />}
                            label={target_name}
                            component='div'
                            onClick={() => handleClick(target_name)}
                        />
					</Stack>
				</ListItem>
				<ListItem
					style={{
						display: 'flex',
						justifyContent: target_name === nick_name ? 'flex-end' : 'flex-start',
						paddingRight: target_name === nick_name ? '25px' : '0px',
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