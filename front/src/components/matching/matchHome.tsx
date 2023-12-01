import { Grid, Button, Typography} from "@mui/material";
import styles from './match.module.css';
import { axiosToken } from "@/util/token";
import { useCookies } from "next-client-cookies";
import { useEffect } from "react";

export default function MatchHome(props: any) {
	const { setRender } = props;
	const cookies = useCookies();

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
			})
			.catch((err) => {
				console.log("create room error===", err);
			})
	}

	const handleInviteClick = () => {
		console.log("방만들기 클릭");
		createRoom();
	}

	const handleRankClick = () => {
		console.log("랭크 매칭 클릭");
		setRender(1);
	}

	return (
		<Grid container direction="column" alignItems="center" justifyContent="center">
			<Typography variant="h1">
				PONG42
			</Typography> 	
			<Grid item sx={{marginTop: '50px'}}>
				<Button className={styles.homeButton} variant="contained" onClick={handleRankClick}>
					랭크 매칭
				</Button>
			</Grid>
			<Grid item sx={{marginTop: '20px'}}>
				<Button className={styles.homeButton}variant="contained" onClick={handleInviteClick}>
					방 만들기
				</Button>
			</Grid>
		</Grid>
	);
}