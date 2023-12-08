
import styles from './pong.module.css';
import { Avatar, Grid, Typography, Button } from '@mui/material';

export default function GameEnd({endData, exitGame} :any) {

    // user, opponent 위치 이전 컴포넌트에서 받아와야하나?

    console.log('gameEnd data - ', endData);

    const imageLoader = (src: any) => {
        console.log("image loader src===", src);
        return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
      }

    

    return (
        <div>
            <Grid container className={styles.profileBoxGameEnd}>
                <Grid item className={styles.playerContainer1}alignItems='center' display='flex' direction='colum' padding='1%'>
                    <Avatar
                        src={imageLoader(`${endData.user1_nickname}`)}
                            sx={{
                            width: '100%',
                            height: '50%',
                            border: '2px solid white',
                            boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)',
                        }}
                    />
                    <Typography className={styles.userName} sx={{color: 'white',fontSize: '3vh',  whiteSpace: 'nowrap', marginLeft: '10px'}}>
                        {endData.user1_nickname}
                    </Typography>
                </Grid>
                <Grid item className={styles.scoreContainer}alignItems='center' display='flex' padding='1%'>
                    <Typography className={styles.userName}  sx={{color: 'white', fontSize: '5vh',  whiteSpace: 'nowrap', marginLeft: '10px'}}>
                        {endData.score1}  -  {endData.score2}
                    </Typography>
                </Grid>
                <Grid item className={styles.playerContainer2}alignItems='center' display='flex' padding='1%'>
                    <Avatar
                        src={imageLoader(`${endData.user2_nickname}`)}
                            sx={{
                            width: '100%',
                            height: '50%',
                            border: '2px solid white',
                            boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)',
                        }}
                    />
                    <Typography className={styles.userName} sx={{color: 'white', fontSize: '3vh',  whiteSpace: 'nowrap', marginLeft: '10px'}}>
                        {endData.user2_nickname}
                    </Typography>
                </Grid>
            </Grid>
            <Button variant="contained" color='error' onClick={exitGame}>
				<Typography  style={{fontWeight: 'bold', fontSize: '3vh'}}>
					Exit
				</Typography>
			</Button>
        </div>
    );
};

