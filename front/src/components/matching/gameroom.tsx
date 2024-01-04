import { Box, Button, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import styles from './match.module.css';
import UserInfo from "./userInfo";
import { useEffect, useState } from "react";
import { axiosToken } from "@/util/token";
import { useCookies } from "next-client-cookies";
import { useChatSocket } from "@/app/main_frame/socket_provider";
import { useUserDataContext } from "@/app/main_frame/user_data_context";
import { useMainBoxContext } from "@/app/main_frame/mainbox_context";

export default function GameRoom(props: any) {
	const { render, setRender, userData } = props;
	const [ready, setReady] = useState(false);
	const [gameStart, setGameStart] = useState(false);
	const [mod, setMod] = useState(false);
	const cookies = useCookies();
	const { user_id, nickname } = useUserDataContext();
	const { setGameState } = useMainBoxContext();

	useEffect(() => {

		
		return () => {
			
			handleExit();
			setGameState(false);

		}
	}, [])

	useEffect(() => {
		if (userData.room && userData.room.user2_ready && userData.room.user1_ready)
			setGameStart(true);
		else
			setGameStart(false);

		// userData에 game_mode가 추가되는 시점이 다른 것 같음.
		if (userData.game_mode != undefined)
			setMod(userData.game_mode);

	}, [userData]);

	const handleExit = async () => {
		await axiosToken.patch(`${process.env.NEXT_PUBLIC_API_URL}game/leaveroom`, {
			user_id: user_id,
		},
		{
			headers: {
				'Authorization': `Bearer ${cookies.get('access_token')}`
		}
		})
		.then((res) => {
			// console.log('handle Exit done - ', res.data);
			if (res.data.status === true && render === 2)
				setRender(0);
		})
	}

	useEffect(() => {
		const updateStates = async () => {
			await axiosToken.patch(`${process.env.NEXT_PUBLIC_API_URL}game/ready`,
				{
					user_id: user_id,
					ready: ready? true : false,
					game_mode: mod? true : false
				},
				{
					headers: {
						'Authorization': `Bearer ${cookies.get('access_token')}`
					}
				}
			)
			.then((res) => {

			})
			.catch((error) => {

			});
		};
		if (mod !== null && ready !== null)
			updateStates();
	}, [mod, ready]);

	const handleReady = () => {
		setReady(!ready);
	}

	const handleMod = (e: any) => {
		setMod(e.target.checked);
	}

	const handleStart = async () => {

		await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}game/start`, {
			user_id: user_id,
		},
		{
			headers: {
				'Authorization': `Bearer ${cookies.get('access_token')}`
			}
		})
		.then((res) => {
		})
	}

	return (
		<>
		{userData && (
			<Grid container justifyContent="space-between" alignItems="center">
			  <Box display="flex" flexDirection="column" alignItems="center" className={styles.player1}>
				<UserInfo userId={userData?.room?.user1_id} cookies={cookies}/>
				{userData?.room?.user1_ready && <Typography style={{ color: 'green', fontWeight: 'bold', fontSize: '2vw'}}>Ready!</Typography>}
			  </Box>	
			  <Box
			  	display="flex"
				flexDirection="column"
				alignItems="center"
				sx={{
					position: 'absolute',
					width: '20%',
					left: '41%',
				}}
			>
				 <FormControlLabel
				 	control={<Checkbox
						sx={{color: 'white'}}
						checked={mod}
						onChange={handleMod}
						disabled={userData.room.user1_id !== user_id ? true : false}
						/>}
					label={
						<Typography sx={{ color: mod ? 'blue' : 'red', fontSize: '1.5vw' }}>
							Revers Mod
						</Typography>}
					sx={{color: 'white'}}
				/>
				<Button
				variant="contained"
				color="primary"
				onClick={handleStart}
				size="large"
				disabled={!gameStart || user_id !== userData?.room?.user1_id}
				sx={{
					position: 'relative',
					width: '100%',
					marginTop: '40%',
					'&:disabled': {
						backgroundColor: 'gray'
					},
					}}
				>
				<Typography sx={{ color: 'white', fontSize: '1.5vw' }}>
					Start
				</Typography>
				</Button>
				<Button sx={{position: 'relative', marginTop: '40%', width: '100%'}} variant="contained" color="success" onClick={handleReady}>
					<Typography sx={{ color: 'white', fontSize: '1.5vw' }}>
						Ready
					</Typography>
				</Button>
				<Button sx={{position: 'relative', marginTop: '40%', width: '100%'}} variant="contained" color="error" onClick={handleExit}>
					<Typography sx={{ color: 'white', fontSize: '1.5vw' }}>
						Exit
					</Typography>
				</Button>
			  </Box>
			  <Box display="flex" flexDirection="column" alignItems="center" className={styles.player2}>
				<UserInfo userId={userData?.room?.user2_id} cookies={cookies}/>
				{userData?.room?.user2_ready && <Typography style={{ color: 'green', fontWeight: 'bold', fontSize: '2vw'}}>Ready!</Typography>}
			  </Box>
			</Grid>
		  )}
		</>
	)
}
