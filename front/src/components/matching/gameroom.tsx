import { Box, Button, Grid, Typography } from "@mui/material";
import styles from './match.module.css';
import UserInfo from "./userInfo";
import { useEffect, useState } from "react";
import { axiosToken } from "@/util/token";
import { useCookies } from "next-client-cookies";
import { useChatSocket } from "@/app/main_frame/socket_provider";

export default function GameRoom(props: any) {
	const { setRender, userData } = props;
	const [ready, setReady] = useState(false);
	const [gameStart, setGameStart] = useState(false);
	const cookies = useCookies();

	useEffect(() => {
		console.log("game room data===", userData);
		if (userData.room && userData.room.user2_ready && userData.room.user1_ready)
			setGameStart(true);
		else
			setGameStart(false);
		
	}, [userData]);

	const handleExit = async () => {
		console.log ("나가기 클릭");
		await axiosToken.patch(`${process.env.NEXT_PUBLIC_API_URL}game/leaveroom`, {
			user_id: Number(cookies.get('user_id')),
		},
		{
			headers: {
				'Authorization': `Bearer ${cookies.get('access_token')}`
		}
		})
		.then((res) => {
			console.log("leave room reesponse===", res);
			setRender(0);
		})
	}

	const handleReady = async () => {
		console.log("레디 클릭");
		await axiosToken.patch(`${process.env.NEXT_PUBLIC_API_URL}game/ready`, {
			user_id: Number(cookies.get('user_id')),
			ready: !ready
		},
		{
			headers: {
				'Authorization': `Bearer ${cookies.get('access_token')}`
			}
		})
		.then((res) => {
			console.log("ready reesponse===", res);
			setReady(!ready);
		})
	}

	const handleStart = async () => {
		console.log("스타트 클릭");
	}

	return (
		<>
		{userData && (
			<Grid container justifyContent="space-between" alignItems="center">
			  <Box display="flex" flexDirection="column" alignItems="center" className={styles.player1}>
				<UserInfo userId={userData?.room?.user1_id} cookies={cookies}/>
				{userData?.room?.user1_ready && <Typography style={{ color: 'green', fontWeight: 'bold' }}>Ready!</Typography>}
			  </Box>	
			  <Box display="flex" flexDirection="column" alignItems="center">
			  	<Grid item sx={{marginTop: '50px'}}>
				  <Button
				  	className={styles.gameStart}
					variant="contained"
					color="primary"
					onClick={handleStart}
					disabled={!gameStart || Number(cookies.get('user_id')) !== userData?.room?.user1_id}
					sx={{
						'&:disabled': {
						  backgroundColor: 'gray'
						},
					  }}
				  	>
					Start
				  </Button>
				</Grid>
				<Grid item sx={{marginTop: '50px'}}>
				  <Button className={styles.gameButton} variant="contained" color="success" onClick={handleReady}>
					Ready
				  </Button>
				</Grid>
				<Grid item sx={{marginTop: '50px'}}>
				  <Button className={styles.gameButton} variant="contained" color="error" onClick={handleExit}>
					Exit
				  </Button>
				</Grid>
			  </Box>
			  <Box display="flex" flexDirection="column" alignItems="center" className={styles.player2}>
				<UserInfo userId={userData?.room?.user2_id} cookies={cookies}/>
				{userData?.room?.user2_ready && <Typography style={{ color: 'green', fontWeight: 'bold' }}>Ready!</Typography>}
			  </Box>
			</Grid>
		  )}
		</>
	)
}
