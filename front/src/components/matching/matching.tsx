import Button from '@mui/material/Button';
import styles from './match.module.css';
import { Grid, Typography } from '@mui/material';


interface MyProfileProps {
    setMTbox: (num: number, searchTarget: string) => void;
  
}

export default function MatchingButton({ setMTbox }: MyProfileProps) {

    const handleMTbox = (num: number) => () => {
        setMTbox(num, '');
    }

    return (
        <Grid className={styles.matchButton}>
            <Button sx={{border: 7, borderColor: '#2196f3',background: '#1565c0', width: '100%'}} variant="contained" onClick={handleMTbox(3)}>
                <Typography fontSize={100} style={{fontWeight: 'bold'}}>
                    PLAY
                </Typography>
            </Button>
        </Grid>
    );
}