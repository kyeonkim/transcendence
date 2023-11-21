import Button from '@mui/material/Button';

// 로딩되기 전에 그림자 띄울 수 있음. 아직 적용하지 않았음. 
import Skeleton from '@mui/material/Skeleton';

// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';


const MainMatchingButton = styled(Button) ({
  position: 'absolute',
  top: 55,
  left: 0,
  width: 400,
  height: 100,
  color: "black"
});

export default function MatchingButton() {
    return (
        <MainMatchingButton variant="outlined">
            Matching
        </MainMatchingButton>
    );
}