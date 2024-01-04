'use client';

import styles from '@/components/matching/match.module.css';
import React, { useRef, useEffect, useState } from 'react';

import { Grid } from '@mui/material';

import { useChatSocket } from '@/app/main_frame/socket_provider';
import { useUserDataContext } from '@/app/main_frame/user_data_context';
import { useMainBoxContext } from '@/app/main_frame/mainbox_context';

import { axiosToken } from '@/util/token';
import { useCookies } from "next-client-cookies"


import MatchHome from '@/components/matching/matchHome';
import GameRoom from '@/components/matching/gameroom';
import RankMatch from '@/components/matching/rankmatch';
import Pong from '@/components/game/pong'



export default function Matching(props: any) {
	const [render, setRender] = useState(0);
	const socket = useChatSocket();
	const cookies = useCookies();
	const [data, setData] = useState<any>([]);
	const myRef = useRef(null);

	const { nickname, user_id } = useUserDataContext();

	const { setGameState } = useMainBoxContext();


	useEffect(() => {

		const fetchData = async () => {

            // console.log('matching - fetch data called');

			await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}game/checkroom`, {
				user1_id: user_id,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${cookies.get('access_token')}`,
				},
			})
			.then((res) => {

			})
		}
		
		//setIsMode와 gameRoom의 setMod의 차이점 질문하기
        const listenRenderGameRoom = (data :any) => {
            // console.log('mode check', data);
			setData(data);
        }

		socket.on('render-gameroom', listenRenderGameRoom);

		fetchData();

        return () => {
            // console.log('matchinglist unmounting');
            socket.off('render-gameroom', listenRenderGameRoom);
			socket.emit('game-cancelmatch');
        }

	}, []);


	useEffect(() => {
		if(data.status === 'matching')
		{
			setRender(1);
		}
		else if (data.status === 'gameroom')
		{
			setRender(2);
			setGameState(true);
		}
		else if (data.status === 'ingame')
		{
			setRender(3);
			setGameState(true);
		}
		else 
			setRender(0);
	}, [data])

	const exitGame = async () => {
		setRender(0);
	}

	if (myRef === null)
		return <div>loading...</div>

	const handleRender = () => {
		if (render === 1)
			return <RankMatch setRender={setRender}/>
		else if (render === 2)
			return <GameRoom render={render} setRender={setRender} userData={data} />
		else if (render === 3)
			return <Pong exitGame={exitGame} data={data} containerRef={myRef} />
		else
			return <MatchHome setRender={setRender}/>
	}

	return (
		<Grid container className={styles.matchroom} ref={myRef}>
			{handleRender()}
		</Grid>
	)
}
