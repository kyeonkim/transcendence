import Card from '@mui/material/Card';

// 이미지나 영상등 담기
import CardMedia from '@mui/material/CardMedia';

// card 동작들 (card 안에 뭘 넣기)
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';

// card 안에 텍스트 등 넣기
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

// 로딩되기 전에 그림자 띄울 수 있음. 아직 적용하지 않았음. 
import Skeleton from '@mui/material/Skeleton';

// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';

// 왼쪽 위에 Card 놓기

// sx props 공부
// gutterBottom이 무엇인가? variant의 값으로 가능한건? component="div"의 의미는?


const MyProfileCard = styled(Card) ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: 400
});

export default function MyProfile() {
  return (
    <MyProfileCard sx={{ maxWidth: 400, maxHeight: 500 }}>
    <CardMedia
      component="img"
      alt="favicon"
      height="355"
     // image 나중에 변경하기
      image="./favicon.ico"
    />
    {/* <CardContent>
      <Typography gutterBottom variant="body1" component="div">
        Test Name Typo body1
      </Typography>
      <Typography variant="body2" color="text.secondary">
        introduction type body2
      </Typography>
    </CardContent> */}
    <CardActions>
      <Button size="small">button1</Button>
      <Button size="small">button2</Button>
      <Button size="small">button3</Button>
    </CardActions>
  </MyProfileCard>
);
}