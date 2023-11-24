import Button from '@mui/material/Button';

import { styled } from '@mui/system';


const MainMatchingButton = styled(Button) ({
  backgroundColor: '#4fca35',
  position: 'absolute',
  alignItems: 'center',
  textAlign: 'center',
  top: '35%',
  left: '12.5%',
  width: '75%',
  height: '20%',
  color: "black",
  borderRadius: '100%',
});

interface MyProfileProps {
    setMTbox: (num: number, searchTarget: string) => void;
  
}

export default function MatchingButton({ setMTbox }: MyProfileProps) {

    const handleMTbox = (num: number) => () => {
        setMTbox(num, '');
    }

    return (
        <MainMatchingButton variant="outlined" onClick={handleMTbox(3)}>
            START
        </MainMatchingButton>
    );
}