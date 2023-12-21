
import styles from './pong.module.css';
import { Avatar, Grid, Typography, Button, Box } from '@mui/material';
import { useChatSocket } from '@/app/main_frame/socket_provider';
import { useEffect } from 'react';
import { useStatusContext } from "@/app/main_frame/status_context";
import { useUserDataContext } from '@/app/main_frame/user_data_context';

export default function GameEnd({endData, exitGame} :any) {

    const   socket = useChatSocket();
    const   { nickname, user_id } = useUserDataContext();
    const { status } = useStatusContext();



    useEffect(() => {
        socket.emit('status', { user_id: user_id, status: status });
    }, [])

    const imageLoader = (src: any) => {
        return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
      }

    return (
        <div>
            <Grid container className={styles.profileBoxGameEnd}>
            <Box display="flex" flexDirection="column" alignItems="center" className={styles.playerContainer1}>
                    <Avatar
                        src={imageLoader(`${endData.user1_nickname}?${new Date()}`)}
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
                        src={imageLoader(`${endData.user2_nickname}?${new Date()}`)}
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

