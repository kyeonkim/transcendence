'use client';
import React from 'react';
import styles from './mainbox.module.css';
import Button from '@mui/material/Button';
import Matchlist from './matchlist';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'next-client-cookies';
/*
여기서 props로 넘어온 닉네임이랑 전역에 있는 내닉네임이랑 비교하고 그에따른 버튼활성화 필요 
*/



const ProfilePage = (props: any) => {
  const [isFriend, setIsFriend] = useState(false);
  const [isBlock, setIsBlock] = useState(false);
  const cookies = useCookies();
  
  const userNickname = props.nickname;
  const my_id = Number(cookies.get('user_id'));
  const my_nick = cookies.get('nick_name');
  const access_token = cookies.get('access_token');
  
  console.log("==================22222322222222222222=====================");
  console.log("my_id: " + my_id);
  console.log("userNickname: " + userNickname);
  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}social/checkFriend`,{
        params: { user1: my_id , user2: userNickname},
      })
      .then((res) => {
        console.log(res.data)
        if (res.data.status)
          setIsFriend(true);
        else
          setIsFriend(false);
        console.log(isFriend);
      });
    };
    fetchData();
  }, [userNickname, isFriend]);
  
  const handleFriend = async () => {
    if (isFriend) {
      console.log("delete friend!!!");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}social/DeleteFriend`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        data: {
          user_id: my_id,
          friend_nick_name: userNickname
        }})
      .then((res) => {
        console.log(res.data)})
      .catch((err) => {
          // 토큰발급 함수?컴포?
      })
      setIsFriend(false);
    }
    else {
      console.log("add friend!!!");
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}social/addFriend`,{
        user_id: my_id,
        friend_nick_name: userNickname
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
      })
      .then((res) => {
        console.log(res.data)})
       setIsFriend(true);
    }
   }
 
   const handleBlock = () => {
     console.log("block: " + id);
     setIsBlock(true);
   }
  
  const imageLoader = ({ src }: any) => {
    return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
  }

  return (  
    <div className={styles.mainContainer}>
      <div className={styles.topComponent}>
      <div className={styles.imageContainer}>
          <Image loader={imageLoader} src={`${userNickname}`} alt="User Image" className={styles.userImage} width={0} height={0} /> 
          <div className={styles.userName}>
            {userNickname !== my_nick ? `${userNickname}` : my_nick}
          </div>
          {userNickname !==  my_nick ? ( 
            <div className={styles.imageContent}>
              <div className={styles.buttons}>
                <Button variant="outlined" className={styles.roundButton} onClick={() => handleFriend()}>
                  {isFriend? '친구삭제' : '친구추가'}
                </Button>
                <Button variant="outlined" className={styles.roundButton} onClick={() => handleBlock()}>
                  차단
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.imageContent}>
              <div className={styles.buttons}>
                <Button variant="outlined" className={styles.roundButton}>
                  프로필 수정
                </Button>
                <Button variant="outlined" className={styles.roundButton}>
                  로그아웃
                </Button>
                <Button variant="outlined" className={styles.roundButton}>
                  회원탈퇴
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.bottomHalfContainer}>
        <div className={styles.leftHalfComponent}></div>
        <div className={styles.rightHalfComponent}>
          <Matchlist id={userNickname} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
