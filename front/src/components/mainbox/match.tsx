'use client';

import styles from '@/components/matching/match.module.css';
import React, { use, useEffect, useState } from 'react';

// child components
import MatchHome from '@/components/matching/matchHome';
import GameRoom from '../matching/gameroom';
import RankMatch from '../matching/rankmatch';
import { Grid } from '@mui/material';
import { useChatSocket } from '@/app/main_frame/socket_provider';


export default function Matching() {
	const [render, setRender] = useState(0);
	const socket = useChatSocket();
	const [data, setData] = useState<any>([]);

	useEffect(() => {
		socket.on('render-gameroom', (data: any) => {
			console.log("game room render data===", data); /*{user1_id, user2_id, user1_ready, user2_ready}*/
				setData(data);
		});
		// return () => {
		// 	socket.off('reder-gameroom');
		// }
	}, []);

	const handleRender = () => {
		console.log("render: ", render);
		if (render === 1)
			return <RankMatch/>
		else if (render === 2)
			return <GameRoom setRender={setRender} userData={data}/>
		else
			return <MatchHome setRender={setRender}/>
	}

	return (
		<Grid container className={styles.matchroom}>
			{handleRender()}
		</Grid>
	)
}
