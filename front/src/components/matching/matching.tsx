import Button from '@mui/material/Button';
import styles from './match.module.css';
import { Grid, Typography } from '@mui/material';
import { headers } from 'next/headers';


interface MyProfileProps {
    setMTbox: (num: number, searchTarget: string) => void;
  
}

export default function MatchingButton({ setMTbox }: MyProfileProps) {

    const handleMTbox = (num: number) => () => {
        setMTbox(num, '');
    }

    return (
        <Grid className={styles.matchButton}>
            <Button 
                variant="contained" 
                onClick={handleMTbox(3)}
                sx={{
                border: 7,
                borderColor: '#2196f3',
                background: '#1565c0', 
                width: '100%',
                height: '100%',
                }} 
            >
                <Typography style={{fontWeight: 'bold', fontSize: '5vw'}}>
                    PLAY
                </Typography>
            </Button>
        </Grid>
    );
}