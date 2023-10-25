import React from 'react';
import Card from '@mui/material/Card';

// 이미지나 영상등 담기
import CardMedia from '@mui/material/CardMedia';

// card 동작들 (card 안에 뭘 넣기)
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';

// styled component (컴포넌트 고정 style로 보임)
import { styled } from '@mui/system';
import Image from 'next/image';
import styles from '../mainbox/mainbox.module.css'

// 왼쪽 위에 Card 놓기

// sx props 공부
// gutterBottom이 무엇인가? variant의 값으로 가능한건? component="div"의 의미는?

interface MyProfileProps {
  setMTbox: (num: number, searchTarget: string) => void;
  myNickname: string;
}

export default function MyProfile({ setMTbox, myNickname}: MyProfileProps) {

  const handleMTbox = (num: number) => () => {
    setMTbox(num, myNickname);
  }

  const imageLoader = ({ src }: any) => {
    return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
  }
    return (
       <Image
        loader={imageLoader}
        src={`${myNickname}`}
        className={styles.myprofilelink}
        alt="User Image"
        width={0}
        height={0}
        onClick={handleMTbox(1)}
        />
  );
}