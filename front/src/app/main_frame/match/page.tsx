'use client';

import styles from '@/components/matching/match.module.css';
import React, { useRef, useEffect, useState } from 'react';

import { Grid } from '@mui/material';
import { useChatSocket } from '@/app/main_frame/socket_provider';
import { axiosToken } from '@/util/token';
import { useCookies } from 'next-client-cookies';

import MatchHome from '@/components/matching/matchHome';
import GameRoom from '@/components/matching/gameroom';
import RankMatch from '@/components/matching/rankmatch';
import Pong from '@/components/game/pong'

export default function Matching(props: any) {
	const [render, setRender] = useState(0);
	const [isRank, setIsRank] = useState(false);
	const [isMode, setIsMode] = useState(false);
	const socket = useChatSocket();
	const cookies = useCookies();
	const [data, setData] = useState<any>([]);
	const myRef = useRef(null);

	useEffect(() => {

		const fetchData = async () => {

			await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}game/checkroom`, {
				user1_id: Number(cookies.get('user_id')),
			})
			.then((res) => {

			})
		}
		
		socket.on('render-gameroom', (data: any) => {

			if (data.status === 'matching')
			{
				setIsRank(true);
				setRender(1);
			}
			else if (data.status === 'gameroom')
			{
				setIsMode(data.game_mode);
				setRender(2);
			}
			else if (data.status === 'ingame')
			{
				setRender(3);
			}
			else 
			{
				setIsRank(false);
				setIsMode(false);
				setRender(0);
			}
			setData(data);
		});
		fetchData();

	}, []);

	const exitGame = async () => {
		setRender(0);
	}

	if (myRef === null)
		return <div>loading...</div>

	const handleRender = () => {
		if (render === 1)
			return <RankMatch setRender={setRender}/>
		else if (render === 2)
			return <GameRoom setRender={setRender} userData={data}/>
		else if (render === 3)
			return <Pong exitGame={exitGame} rank={isRank} mode={isMode} containerRef={myRef} />
		else
			return <MatchHome setRender={setRender}/>
	}

	return (
		<Grid container className={styles.matchroom} ref={myRef}>
			{handleRender()}
		</Grid>
	)
}
