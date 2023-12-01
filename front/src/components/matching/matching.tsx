import Button from '@mui/material/Button';
import styles from './match.module.css';
import { Typography } from '@mui/material';


interface MyProfileProps {
    setMTbox: (num: number, searchTarget: string) => void;
  
}

export default function MatchingButton({ setMTbox }: MyProfileProps) {

    const handleMTbox = (num: number) => () => {
        setMTbox(num, '');
    }

    return (
        <Button sx={{border: 7, borderColor: '#2196f3',background: '#1565c0'}} className={styles.matchButton} variant="contained" onClick={handleMTbox(3)}>
            <Typography fontSize={100} style={{fontWeight: 'bold'}}>
                PLAY
            </Typography>
        </Button>
    );
}