'use client';
import React from 'react';
import styles from './mainbox.module.css';
import Button from '@mui/material/Button';
import Matchlist from './matchlist';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'next-client-cookies';
import OtpModal from '../profile/otp';


const ProfilePage = (props: any) => {
  const [isFriend, setIsFriend] = useState(false);
  const [isBlock, setIsBlock] = useState(false);
  const [isOTP, setIsOTP] = useState(false);
  const cookies = useCookies();
  
  const userNickname = props.nickname;
  const my_id = Number(cookies.get('user_id'));
  const my_nick = cookies.get('nick_name');
  const access_token = cookies.get('access_token');

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
  
  //test
//   useEffect(() => {
//     const sseEvents = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}event/alarmsse/${cookies.get('user_id')}`);
//     // const sseEvents = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}event/sse?id=${cookies.get('user_id')}`);

//     console.log('my user_id - ', cookies.get('user_id'));

//     sseEvents.onopen = function() {
//         // 연결 됐을 때 
//         console.log('----------established connection profile------------');
//     }

//     sseEvents.onerror = function (error) {
//         // 에러 났을 때
//     }

//     sseEvents.onmessage = function (stream) {
//         // 메세지 받았을 때
//         const parsedData = JSON.parse(stream.data);

//         // setCheck((Check) => Check + 1);

//         //AlarmList에 append 하기


        
        
//         // console.log('sseEvents occured!!! - ', Check);
//         console.log(' and these are datas!!! - ', parsedData);
//         // console.log('add job to queue');
//         // const job = alarmQueue.add(parsedData);
//     }


//     return () => {
//         sseEvents.close();
//         console.log('close connection profile');
//     };
    
// }, [])

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
          user_nickname: my_nick,
          friend_nick_name: userNickname
        }})
      .then((res) => {
        console.log(res.data)
        setIsFriend(false);
      })
    }
    else {
      console.log("add friend!!!");
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}social/addFriend`,{
        user_id: my_id,
        user_nickname: my_nick,
        friend_nick_name: userNickname
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
      })
      .then((res) => {
        console.log(res.data)
        setIsFriend(true);
      })
    }
   }
 
  const handleBlock = () => {setIsBlock(true)}
  const handleOTP = () => {setIsOTP(true)}
  const handleClose = () => {setIsOTP(false)}

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
                {isFriend? (
                  <Button variant="outlined" className={styles.roundButton} onClick={() => handleFriend()}>
                    친구삭제
                  </Button>
                  ) : (
                  <Button variant="outlined" className={styles.roundButton} onClick={() => handleFriend()}>
                    친구추가
                  </Button>
                  )}
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
                <Button variant="outlined" className={styles.roundButton} onClick={() => handleOTP()}>
                  2차인증 활성화
                </Button>
                <Button variant="outlined" className={styles.roundButton}>
                  로그아웃
                </Button>
              </div>
              <OtpModal
                open={isOTP}
                onClose={handleClose}
                myId={my_id}
                myNick={my_nick}
                token={access_token}
                />
            </div>
          )}
        </div>
      </div>
      <div className={styles.bottomHalfContainer}>
          <Matchlist id={userNickname} />
      </div>
    </div>
  );
}

export default ProfilePage;
