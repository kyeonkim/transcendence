
import { useEffect, useState } from 'react';
import styles from './pong.module.css';
import { Avatar, Grid, Box, Typography} from '@mui/material';

export default function GameProfile({inGameData, score1, score2, isUserPL1} :any) {
    const [p1, setScore1] = useState(0);
    const [p2, setScore2] = useState(0);

    useEffect(() => {
        setScore1(score1);
    }, [score1]);

    useEffect(() => {
        setScore2(score2);
    }, [score2]);


    const imageLoader = (src: any) => {
        return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
      }


    return (
        <div>
            <Grid container className={styles.profileBoxInGame}>
                <Box display="flex" flexDirection="column" alignItems="center" className={styles.playerContainer1}>
                        <Avatar
                            src={imageLoader(`${inGameData.user1_nickname}?${new Date()}`)}
                            style={{border: isUserPL1 ? '2px solid white' : '2px solid red'}}
                                sx={{
                                width: '10vw',
                                height: '10vw',

                                boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)',
                            }}
                        />
                        <Typography className={styles.userName}
                            style={{color: isUserPL1 ? 'white' : 'red'}}
                            sx={{

                                fontSize: '3vw',  whiteSpace: 'nowrap', marginLeft: '10px'}}>
                            {inGameData.user1_nickname}
                        </Typography>
                </Box>
                <Box className={styles.scoreContainer} alignItems='center' display='flex'>
                    <Typography className={styles.winLose}  sx={{color: 'white', fontSize: '3vw', fontWeight: '600'}}>
                        <span style={{ color: 'white', border: '10px soild white'}}>
                            {score1}
                        </span>
                        {'  -  '}
                        <span style={{ color: 'white' }}>
                            {score2}
                        </span>
                    </Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center" className={styles.playerContainer2}>
                    <Avatar
                        src={imageLoader(`${inGameData.user2_nickname}?${new Date()}`)}
                            style={{border: isUserPL1 ? '2px solid red' : '2px solid white'}}
                            sx={{
                            width: '10vw',
                            height: '10vw',

                            boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)',
                        }}
                    />
                    <Typography className={styles.userName}
                        style={{color: isUserPL1 ? 'red' : 'white'}}
                        sx={{

                            fontSize: '3vw',  whiteSpace: 'nowrap', marginLeft: '10px'}}>
                        {inGameData.user2_nickname}
                    </Typography>
                </Box>
            </Grid>
        </div>
    );
};

