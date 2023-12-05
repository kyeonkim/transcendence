'use client'

import { Button, Grid, Typography } from "@mui/material";
import styles from './match.module.css';
import { useCookies } from "next-client-cookies";
import { useEffect } from "react";
import { axiosToken } from "@/util/token";

export default function RankMatch(props: any) {
	const { setRender } = props;

	const cookies = useCookies();

	useEffect(() => {
		const fetchMatch = async () => {
			console.log("Call Match Service");
			await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}game/match`, {
				user_id: Number(cookies.get('user_id')),
			},
			{
				headers: {
					'Authorization': `Bearer ${cookies.get('access_token')}`
				}
			})
			.then((res) => {
				console.log("Match Response===", res);
			})
		}
		fetchMatch();
	}, []);

	const cancelMatch = async () => {
		console.log("cancelMatch");
		await axiosToken.patch(`${process.env.NEXT_PUBLIC_API_URL}game/cancelmatch`,
		{
			headers: {
				'Authorization': `Bearer ${cookies.get('access_token')}`
			}
		})
		.then((res) => {
			console.log("Cancel Match Response===", res);
			setRender(0);
		})
		setRender(0);
	}

	return (
		<Grid container direction="column" alignItems="center" justifyContent="center">
			<Typography variant="h1" color="white" style={{fontWeight: 'bold'}}>
				Matching...
			</Typography> 
			<Button className={styles.cancelButton} sx={{border: 7, borderColor: '#ff3d00'}} variant="contained" color='error' onClick={cancelMatch}>
				<Typography fontSize={50} style={{fontWeight: 'bold'}}>
					Cancel
				</Typography>
        	</Button>
		</Grid>
	)
}
