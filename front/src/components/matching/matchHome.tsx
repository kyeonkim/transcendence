import { Grid, Button, Typography} from "@mui/material";
import styles from './match.module.css';
import { Margin } from "@mui/icons-material";

export default function MatchHome(props: any) {
	const { setRender } = props;


	const handleRankClick = () => {
		console.log("랭크 매칭 클릭");
		setRender(1);
	}

	const handleInviteClick = () => {
		console.log("초대하기 클릭");
		setRender(2);
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
					초대하기
				</Button>
			</Grid>
		</Grid>
	);
}