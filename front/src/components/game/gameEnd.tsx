
import styles from './pong.module.css';
import { Avatar, Grid, Typography, Button, Box } from '@mui/material';

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
            <Box display="flex" flexDirection="column" alignItems="center" className={styles.playerContainer1}>
                    <Avatar
                        src={imageLoader(`${endData.user1_nickname}`)}
                            sx={{
                            width: '10vw',
                            height: '10vw',
                            border: '2px solid white',
                            boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)',
                        }}
                    />
                    <Typography className={styles.userName} sx={{color: 'white',fontSize: '3vw',  whiteSpace: 'nowrap', marginLeft: '10px'}}>
                        {endData.user1_nickname}
                    </Typography>
            </Box>
                <Box className={styles.scoreContainer} alignItems='center' display='flex'>
                    <Typography className={styles.winLose}  sx={{color: 'white', fontSize: '4vw', fontWeight: '800'}}>
                        <span style={{ color: endData.score1 > endData.score2 ? '#2e7d32' : 'red', border: '10px soild white'}}>
                            {endData.score1 > endData.score2 ? 'W' : 'L'}
                        </span>
                        {' '}
                        <span style={{ color: endData.score1 < endData.score2 ? '#2e7d32' : 'red' }}>
                            {endData.score1 < endData.score2 ? 'W' : 'L'}
                        </span>
                    </Typography>
                    <Typography className={styles.userName}  sx={{color: 'white', fontSize: '3vw',  whiteSpace: 'nowrap'}}>
                        {endData.score1}  :  {endData.score2}
                    </Typography>
                    <Button variant="contained" color='error' onClick={exitGame} style={{position: 'absolute', top: '80%'}}>
				    <Typography  style={{fontWeight: 'bold', fontSize: '3vh'}}>
					    나가기
				    </Typography>
			</Button>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center" className={styles.playerContainer2}>
                    <Avatar
                        src={imageLoader(`${endData.user2_nickname}`)}
                            sx={{
                            width: '10vw',
                            height: '10vw',
                            border: '2px solid white',
                            boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)',
                        }}
                    />
                    <Typography className={styles.userName} sx={{color: 'white', fontSize: '3vw',  whiteSpace: 'nowrap', marginLeft: '10px'}}>
                        {endData.user2_nickname}
                    </Typography>
                </Box>
            </Grid>

        </div>
    );
};

