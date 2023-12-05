'use client';

import styles from '@/components/matching/match.module.css';
import React, { use, useEffect, useState } from 'react';

// child components
import MatchHome from '@/components/matching/matchHome';
import GameRoom from '../matching/gameroom';
import RankMatch from '../matching/rankmatch';
import Pong from '../game/pong'
import { Grid } from '@mui/material';
import { useChatSocket } from '@/app/main_frame/socket_provider';
import { axiosToken } from '@/util/token';
import { useCookies } from 'next-client-cookies';

//게임화면 test
import Test from '../game/test';


export default function Matching() {
	const [render, setRender] = useState(0);
	const socket = useChatSocket();
	const cookies = useCookies();
	const [data, setData] = useState<any>([]);

	useEffect(() => {
		const fetchData = async () => {
			console.log("게임방확인 api call");
			await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}game/checkroom`, {
				user1_id: Number(cookies.get('user_id')),
			})
			.then((res) => {
				console.log("게임방확인 api response===", res);
			})
		}
		
		socket.on('render-gameroom', (data: any) => {
			console.log("game render data===", data);
			if (data.status === 'matching')
				setRender(1);
			else if (data.status === 'gameroom')
				setRender(2);
			else if (data.status === 'ingame')
				setRender(3);
			else 
				setRender(0);
			setData(data);
		});
		fetchData();
	}, []);

	const handleRender = () => {
		console.log("render: ", render);
		if (render === 1)
			return <RankMatch setRender={setRender}/>
		else if (render === 2)
			return <GameRoom setRender={setRender} userData={data}/>
		else if (render === 3)
		{
			return <Test setRender={setRender}/>;
			{/* return <Pong setRender={setRender} /> */}
		}

		else
			return <MatchHome setRender={setRender}/>
	}

	return (
		<Grid container className={styles.matchroom}>
			{handleRender()}
		</Grid>
	)
}
