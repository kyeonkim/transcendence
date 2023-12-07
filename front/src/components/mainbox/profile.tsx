'use client';
import React, { use } from 'react';
import styles from './mainbox.module.css';
import Button from '@mui/material/Button';
import Matchlist from './matchlist';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCookies } from 'next-client-cookies';
import OtpModal from '../profile/otp';
import TwoFAPass from '@/app/login/twoFAPass';
import { Avatar, Grid, Typography, Unstable_Grid2 } from '@mui/material';
import { useChatSocket } from "../../app/main_frame/socket_provider"
import { axiosToken } from '@/util/token';
import { render } from 'react-dom';

const ProfilePage = (props: any) => {
  const [isFriend, setIsFriend] = useState(false);
  const [isBlock, setIsBlock] = useState(false);
  const [isOTP, setIsOTP] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [userId, setUserId] = useState(0);
  const [rendering, setRendering] = useState('');
  const [file, setFile] = useState<File>();
  const cookies = useCookies();
  const socket = useChatSocket();
  const formData = new FormData();
  const userNickname = props.nickname;
  const my_id = Number(cookies.get('user_id'));
  const my_nick = cookies.get('nick_name');

  useEffect(() => {
    const fetchData = async () => {
      await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/nickname/${userNickname}`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('access_token')}`
          },        
      }) 
        .then((res) => {
        if (res.data.userData)
        {
          setUserId(res.data.userData.user_id);
          if (res.data.userData.nick_name === my_nick && res.data.userData.twoFA)
            setIsActivated(true);
          else
            setIsActivated(false);
        }})
      }

    const fetchFriendData = async () => {
      await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}social/checkFriend`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('access_token')}`
          },
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
    if (userNickname !== my_nick)
      fetchFriendData();
  }, [userNickname, isFriend, isOTP, rendering]);

	useEffect(() => {

    const renderProfile = (data :any) => {
        console.log('render-profile',data);
        if (data === 'false')
          setIsFriend(false)
        else
          setIsFriend(true)
    }

		socket.on(`render-profile`, renderProfile);
	
		return () => {
			socket.off("render-profile", renderProfile);
		};
	}, [socket]) 

  const handleFriend = async () => {
    if (isFriend) {
      console.log("delete friend!!!");
      await axiosToken.delete(`${process.env.NEXT_PUBLIC_API_URL}social/DeleteFriend`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('access_token')}`,
        },
        data: {
          user_id: my_id,
          user_nickname: my_nick,
          friend_nickname: userNickname
        }})
      .then((res) => {
        console.log(res.data)
        setIsFriend(false);
      })
      .catch((err) => {
        //토큰이 만료되었을때
        //리프레쉬토큰을들고 토큰 재발급후 쿠키에 저장해야함
        console.log(err);
      })
    }
    else {
      console.log("add friend!!!");
      console.log(my_id, my_nick, userNickname);
      await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}social/addFriend`,{
        user_id: my_id,
        user_nickname: my_nick,
        friend_nickname: userNickname
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('access_token')}`,
        },
      })
      .then((res) => {
        console.log(res.data)
      })
    }
   }
 
  const handleBlock = async() => {
    if (isBlock)
    {
      console.log("disalbe block!!!");
      await axiosToken.delete(`${process.env.NEXT_PUBLIC_API_URL}social/deleteBlockedUser`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('access_token')}`,
        },
        data: {
          user_id: my_id,
          user_nickname: my_nick,
          friend_id: Number(userId),
          friend_nickname: userNickname
        }})
      .then((res) => {
        console.log(res.data)
        setIsBlock(false);
      })
    }
    else {
      console.log("block to ", userNickname, userId);
      await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}social/addBlockedUser`,{
        user_id: my_id,
        user_nickname: my_nick,
        friend_id: Number(userId),
        friend_nickname: userNickname
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('access_token')}`,
        },
      })
      .then((res) => {
        console.log(res.data)
        setIsBlock(true);
      })
      .catch((err) => {
      })
    }
  }
  const handleClose = () => {setIsOTP(false)}
  const handleActivte = (value: boolean) => {setIsActivated(value)}
  const handleOTP = () => {
    if (isActivated)
      //나중에 비활성화 로직 넣기 -> 2차인증 비활성화 api
      setIsActivated(false)
    setIsOTP(true)
  }

  const handleImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file);
    formData.append('file', file);
    formData.append('access_token', cookies.get('access_token'));
    formData.append('nick_name', my_nick);

    await axiosToken.post( `${process.env.NEXT_PUBLIC_API_URL}user/upload`,
      formData,
      {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${formData.get('access_token')}`
          },
          params: {
              nickname: my_nick
          }
      })
      .then((res) => {
        console.log("이미지변경요청 response====", res.data)
        // window.location.reload();
        setRendering(res.data.time);
      })
  }
  const imageLoader = (src: any) => {
    console.log("image loader src===", src);
    return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
  }

  return (  
    <div>
      <Grid container className={styles.profileBox}>
        <Grid item className={styles.imageContainer}alignItems='center' display='flex' padding='1%'>
          <Avatar
            src={imageLoader(`${userNickname}?${rendering}`)}
            sx={{
              width: '100%',
              height: '80%',
              border: '2px solid white',
              boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)',
            }}
          />
          <Typography className={styles.userName} fontSize={60} sx={{color: 'white',  whiteSpace: 'nowrap', marginLeft: '10px'}}>
            {userNickname !== my_nick ? `${userNickname}` : my_nick}
          </Typography>
        </Grid>
          {userNickname !==  my_nick ? ( 
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
                {isBlock? (
                  <Button variant="outlined" className={styles.roundButton} onClick={() => handleBlock()}>
                    차단해제
                  </Button>
                  ) : (
                  <Button variant="outlined" className={styles.roundButton} onClick={() => handleBlock()}>
                    차단
                  </Button>
                  )}
              </div>
          ) : (
            <div className={styles.imageContent}>
              <div className={styles.buttons}>
                <Button variant="outlined"  component="label" className={styles.roundButton}>
                  프로필 수정
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImgChange} />
                </Button>
                <Button variant="outlined" className={styles.roundButton} onClick={() => handleOTP()}>
                  {isActivated? '2차인증 비활성화' : '2차인증 활성화'}
                </Button>
              </div>
              <OtpModal
                open={isOTP}
                isActivated={isActivated}
                setActive={handleActivte}
                onClose={handleClose}
                myId={my_id}
                myNick={my_nick}
                token={cookies.get('access_token')}
                />
              {/* <TwoFAPass/> */}
            </div>
          )}
      </Grid>
        <Grid container className={styles.matchlistBox}>
          <Matchlist id={userNickname} />
        </Grid>
    </div>
  );
}

export default ProfilePage;

    // <div className={styles.mainContainer}>
    //   <div className={styles.topComponent}>
    //   <div className={styles.imageContainer}>
    //       <Image loader={imageLoader} src={`${userNickname}`} alt="User Image" className={styles.userImage} width={0} height={0} /> 
    //       <div className={styles.userName}>
    //         {userNickname !== my_nick ? `${userNickname}` : my_nick}
    //       </div>
      //     {userNickname !==  my_nick ? ( 
      //       <div className={styles.imageContent}>
      //         <div className={styles.buttons}>
      //           {isFriend? (
      //             <Button variant="outlined" className={styles.roundButton} onClick={() => handleFriend()}>
      //               친구삭제
      //             </Button>
      //             ) : (
      //             <Button variant="outlined" className={styles.roundButton} onClick={() => handleFriend()}>
      //               친구추가
      //             </Button>
      //             )}
      //           {isBlock? (
      //             <Button variant="outlined" className={styles.roundButton} onClick={() => handleBlock()}>
      //               차단해제
      //             </Button>
      //             ) : (
      //             <Button variant="outlined" className={styles.roundButton} onClick={() => handleBlock()}>
      //               차단
      //             </Button>
      //             )}
      //         </div>
      //       </div>
      //     ) : (
      //       <div className={styles.imageContent}>
      //         <div className={styles.buttons}>
      //           <Button variant="outlined" className={styles.roundButton}>
      //             프로필 수정
      //           </Button>
      //           <Button variant="outlined" className={styles.roundButton} onClick={() => handleOTP()}>
      //             {isActivated? '2차인증 비활성화' : '2차인증 활성화'}
      //           </Button>
      //           <Button variant="outlined" className={styles.roundButton}>
      //             로그아웃
      //           </Button>
      //         </div>
      //         <OtpModal
      //           open={isOTP}
      //           isActivated={isActivated}
      //           setActive={handleActivte}
      //           onClose={handleClose}
      //           myId={my_id}
      //           myNick={my_nick}
      //           token={cookies.get('access_token')}
      //           />
      //         {/* <TwoFAPass/> */}
      //       </div>
      //     )}
      //   </div>
      // </div>
    //   <div className={styles.bottomHalfContainer}>
    //       <Matchlist id={userNickname} />
    //   </div>
    // </div>