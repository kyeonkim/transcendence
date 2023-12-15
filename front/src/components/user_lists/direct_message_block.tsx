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

    const handleRenderAppend = () => {
        if (renderAppend === true)
            setRenderAppend(false);
        else
            setRenderAppend(true);
    }


    const getNewDm = async (dmOpenId :number) => {
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
                var idx = 0;
                
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
                })
                // .catch((err) => {
                //     console.log('chat/dm Error catched - ', err);
                // });
            }
        })
        // .catch((err) => {
        //     console.log('chat/unreaddm Error catched - ', err)
        // });
    };



    useEffect(() => {

        const dmListener = (data :any) => {

            if (data.from_id === dmOpenIdRef.current || data.from_id === user_id)
            {
                const newMessage = renderMessage(data);
                
                setDmList(prevMessages => [...prevMessages, newMessage]);
                
                setScrollTop(false);
                handleRenderDmBlock();
            }
        }

        getNewDm(dmOpenIdRef.current
        ).then((res) => {

            socket.on('dm', dmListener);

        }).catch((err) => {

        });

        return () => {
            socket.off('dm', dmListener);
        }

    }, [socket]);


    useEffect(() => {
        dmOpenIdRef.current = dmOpenId;
    }, [dmOpenId]);


    useEffect(() => {
        setDmList([]);
        if (tmpOldDm.length !== 0)
        {
            // 역순으로 추가
            setTmpOldDm(tmpOldDm.reverse());
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
        getNewDm(dmOpenIdRef.current);
    }, [dmBlockTriggerRender])


    useEffect(() => {
        const handleScroll = (e:any) => {
          if (messageAreaRef.current && e.currentTarget.scrollTop === 0)
          {
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
            })
            .then((res) => {
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
                        
                        const tmpResDm = res.data.dm.reverse();
                        const tmpNowDm = dmList;

                        setAppendLength(tmpResDm.length);
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
            })
        }
        getMoreDm()
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