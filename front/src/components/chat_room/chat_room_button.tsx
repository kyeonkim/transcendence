import Button from '@mui/material/Button';

// 로딩되기 전에 그림자 띄울 수 있음. 아직 적용하지 않았음. 
import Skeleton from '@mui/material/Skeleton';

// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';


const MainChatRoomButton = styled(Button) ({
  position: 'absolute',
  top: 55,
  left: 0,
  width: 400,
  height: 100,
  color: "black"
});

interface MyProfileProps {
    setMTbox: (num: number, searchTarget: string) => void;
  
}

export default function ChatRoomButton({ setMTbox }: MyProfileProps) {

    const handleMTbox = (num: number) => () => {
        setMTbox(num, '');
    }

    return (
        <MainChatRoomButton variant="outlined" onClick={handleMTbox(2)}>
            Chat Room List
        </MainChatRoomButton>
    );
}