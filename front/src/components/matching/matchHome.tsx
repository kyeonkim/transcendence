"use client"
import { Grid, Button, Typography} from "@mui/material";
import styles from './match.module.css';
import { axiosToken } from "@/util/token";
import { useCookies } from "next-client-cookies";
import { useEffect } from "react";

import { useUserDataContext } from "@/app/main_frame/user_data_context";

export default function MatchHome(props: any) {
	const { setRender } = props;
	const cookies = useCookies();
	const { user_id, nickname } = useUserDataContext();

	const createRoom = async() => {
		await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}game/createroom`, {
				user1_id: user_id,
			},
			{
				headers: {
					'Authorization': `Bearer ${cookies.get('access_token')}`
				}
			})
			.then((res) => {

			})
			.catch((err) => {

			})
	}

	const handleInviteClick = () => {

		createRoom();
	}

	const handleRankClick = () => {

		setRender(1);
	}

	return (
		<Grid container direction="column" alignItems="center" justifyContent="center">
			<Typography color="white" style={{fontWeight: 'bold', fontSize: '5vw'}}>
				PONG42
			</Typography> 	
			<Grid item sx={{marginTop: '50px'}}>
				<Button sx={{border: 7, borderColor: '#2196f3',background: '#1565c0'}} variant="contained" onClick={handleRankClick}>
					<Typography style={{fontWeight: 'bold', fontSize: '3vw'}}>
                		랭크
            		</Typography>
				</Button>
			</Grid>
			<Grid item sx={{marginTop: '20px'}}>
				<Button sx={{border: 7, borderColor: '#2196f3',background: '#1565c0'}} variant="contained" onClick={handleInviteClick}>
					<Typography style={{fontWeight: 'bold', fontSize: '3vw'}}>
                		일반
            		</Typography>
				</Button>
			</Grid>
		</Grid>
	);
}