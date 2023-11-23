import { Box, Button, Grid } from "@mui/material";
import styles from './match.module.css';
import UserInfo from "./userInfo";
import { useEffect, useState } from "react";
import { axiosToken } from "@/util/token";
import { useCookies } from "next-client-cookies";
import { useChatSocket } from "@/app/main_frame/socket_provider";

export default function GameRoom(props: any) {
	// const [userData, setUserData] = useState<any>([]);
	const [roomState, setRoomState] = useState(false);
	const { setRender, userData } = props;
	const cookies = useCookies();

	useEffect(() => {
		const createRoom = async() => {
			await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}game/createroom`, {
					user1_id: Number(cookies.get('user_id')),
				},
				{
					headers: {
						'Authorization': `Bearer ${cookies.get('access_token')}`
					}
				})
				.then((res) => {
					console.log("create room reesponse===", res);
					setRoomState(true);
				})
				.catch((err) => {
					console.log("create room error===", err)
					setRoomState(false);
					// return;
				})
		}
		createRoom();
	}, []);

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
	useEffect(() => {
		console.log("game room data===", userData);
	}, [userData]);

	const handleReady = (user: string) => {
	}

	return (
		<>
		{userData && (
			<Grid container justifyContent="space-between" alignItems="center">
			  <Box display="flex" flexDirection="column" alignItems="center" className={styles.player1}>
				<UserInfo userId={userData?.room?.user1_id} cookies={cookies}/>
				{userData?.room?.user1_ready && <span>Ready!</span>}
			  </Box>
			  <Box display="flex" flexDirection="column" alignItems="center">
				<Grid item sx={{marginTop: '50px'}}>
				  <Button className={styles.gameButton} variant="contained" color="success" onClick={() => handleReady("my")}>
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
				{userData?.room?.user2_ready && <span>Ready!</span>}
			  </Box>
			</Grid>
		  )}
		</>
	)
}
