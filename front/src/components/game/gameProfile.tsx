
import styles from './pong.module.css';
import { Avatar, Grid, Typography} from '@mui/material';

export default function GameProfile({inGameData} :any) {

    console.log('inGameData data - ', inGameData);

    const imageLoader = (src: any) => {
        console.log("image loader src===", src);
        return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
      }


    return (
        <div>
            <Grid container className={styles.profileBox}>
                <Grid item className={styles.playerContainer1}alignItems='center' display='flex' padding='1%'>
                    <Avatar
                        src={imageLoader(`${inGameData.user1_nickname}`)}
                            sx={{
                            width: '100%',
                            height: '50%',
                            border: '2px solid white',
                            boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)',
                        }}
                    />
                    <Typography className={styles.userName} sx={{color: 'white',fontSize: '3vh',  whiteSpace: 'nowrap', marginLeft: '10px'}}>
                        {inGameData.user1_nickname}
                    </Typography>
                </Grid>
                <Grid item className={styles.playerContainer2}alignItems='center' display='flex' padding='1%'>
                    <Avatar
                        src={imageLoader(`${inGameData.user2_nickname}`)}
                            sx={{
                            width: '100%',
                            height: '50%',
                            border: '2px solid white',
                            boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)',
                        }}
                    />
                    <Typography className={styles.userName} sx={{color: 'white', fontSize: '3vh',  whiteSpace: 'nowrap', marginLeft: '10px'}}>
                        {inGameData.user2_nickname}
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
};

