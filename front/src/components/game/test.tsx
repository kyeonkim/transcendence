import { axiosToken } from "@/util/token";
import { Button, Typography } from "@mui/material";
import { useCookies } from "next-client-cookies";

export default function Test(props: any) {
	const { setRender } = props;
	const cookies = useCookies();

	const exitGame = async () => {
		await axiosToken.patch(`${process.env.NEXT_PUBLIC_API_URL}game/exitgame`,{
			user_id: Number(cookies.get('user_id')),
		},
		{	
			headers: {
				'Authorization': `Bearer ${cookies.get('access_token')}`
			}
		})
		.then((res) => {
			console.log('game exit!', res);
			if (res.data.status)
				setRender(0);
		})
	}

	return (
		<div>
			<Typography variant="h1" color="white" style={{fontWeight: 'bold'}}>
				테스트 (게임화면임)
			</Typography> 
			<Button variant="contained" color='error' onClick={exitGame}>
				<Typography fontSize={50} style={{fontWeight: 'bold'}}>
					Exit
				</Typography>
			</Button>
		</div>
	)
}
