'use client'

import { Button, Grid, Typography } from "@mui/material";
import styles from './match.module.css';
import { useCookies } from "next-client-cookies";
import { useEffect } from "react";
import { axiosToken } from "@/util/token";

import { useUserDataContext } from "@/app/main_frame/user_data_context";
import { useChatSocket } from "@/app/main_frame/socket_provider";

export default function RankMatch(props: any) {
	const { setRender } = props;
	const socket = useChatSocket();
	const cookies = useCookies();
	const { user_id, nickname } = useUserDataContext();

	useEffect(() => {
		const fetchMatch = async () => {

			await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}game/match`, {
				user_id: user_id,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${cookies.get('access_token')}`
				}
			})
		}

		fetchMatch();
	}, []);

	const cancelMatch = async () => {
		socket.emit('game-cancelmatch');
		setRender(0);
	}

	return (
		<Grid container direction="column" alignItems="center" justifyContent="center">
			<Typography color="white" style={{fontWeight: 'bold', fontSize: '7vw'}}>
				Matching...
			</Typography> 
			<Button className={styles.cancelButton} sx={{border: 7, borderColor: '#ff3d00'}} variant="contained" color='error' onClick={cancelMatch}>
				<Typography style={{fontWeight: 'bold', fontSize: '2vw'}}>
					Cancel
				</Typography>
        	</Button>
		</Grid>
	)
}
