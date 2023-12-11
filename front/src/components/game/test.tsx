import { axiosToken } from "@/util/token";
import { Button, Typography } from "@mui/material";
import { useCookies } from "next-client-cookies";
import Pong from "./pong";

export default function Test(props: any) {
	const { setRender } = props;

	const exitGame = async () => {
		setRender(0);
	}

	return (
		<div>
			<Pong
				exitGame={exitGame}
				rank={props.rank}
				mode={props.mode}
			/>
			{/* <Typography variant="h1" color="white" style={{fontWeight: 'bold'}}> */}
				{/* 테스트 (게임화면임) */}
			{/* </Typography>  */}

		</div>
	)
}
