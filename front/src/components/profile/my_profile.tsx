import React from 'react';
import Card from '@mui/material/Card';

// 이미지나 영상등 담기
import CardMedia from '@mui/material/CardMedia';

// card 동작들 (card 안에 뭘 넣기)
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';

// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';

import styles from '../mainbox/mainbox.module.css'

// 왼쪽 위에 Card 놓기

// sx props 공부
// gutterBottom이 무엇인가? variant의 값으로 가능한건? component="div"의 의미는?

interface MyProfileProps {
  setMTbox: (num: number, searchTarget: string) => void;

}

export default function MyProfile({ setMTbox }: MyProfileProps) {

  const handleMTbox = (num: number) => () => {
    setMTbox(num, '');
  }
    return (
    //   <MyProfileCard sx={{ maxWidth: 400, maxHeight: 500 }}>
    //   <CardMedia onClick={handleMTbox(1)}
    //     component="img"
    //     alt="favicon"
    //     height="355"
    //    // image 나중에 변경하기
    //     image="./favicon.ico"
    //   />
    //   {/* <CardContent>
    //     <Typography gutterBottom variant="body1" component="div">
    //       Test Name Typo body1
    //     </Typography>
    //     <Typography variant="body2" color="text.secondary">
    //       introduction type body2
    //     </Typography>
    //   </CardContent> */}
    //   <CardActions>
    //     <Button size="small" onClick={handleMTbox(1)}>button1</Button>
    //     <Button size="small" onClick={handleMTbox(2)}>button2</Button>
    //     <Button size="small" onClick={handleMTbox(3)}>button3</Button>
    //   </CardActions>
    // </MyProfileCard>
      <div className={styles.myprofilelink}>
        <img src="./favicon.ico" alt="favicon" onClick={handleMTbox(1)}/>
      </div>
  );
}