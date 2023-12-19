'use client';
import React from 'react';
import styles from './mainbox.module.css';
import Button from '@mui/material/Button';

import { useState, useEffect } from 'react';
import { useCookies } from 'next-client-cookies';
import { Avatar, Grid, Tooltip, Typography } from '@mui/material';
import { axiosToken } from '@/util/token';
import MedalIcon from '@mui/icons-material/WorkspacePremium';
import { useSearchParams } from 'next/navigation'

import OtpModal from '@/components/profile/otp';
import Matchlist from '@/app/main_frame/profile/matchlist';

import { useChatSocket } from "@/app/main_frame/socket_provider"
import { useMainBoxContext } from '@/app/main_frame/mainbox_context';

const ProfilePage = () => {

  const [isFriend, setIsFriend] = useState(false);
  const [isBlock, setIsBlock] = useState(false);
  const [isOTP, setIsOTP] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [rendering, setRendering] = useState('');
  const [data, setData] = useState<any>();
  const [file, setFile] = useState<File>();
  const cookies = useCookies();
  const socket = useChatSocket();
  const formData = new FormData();
  const [ userNickname, setUserNickname ] = useState('');
  const { setProfile } = useMainBoxContext();
  const my_id = Number(cookies.get('user_id'));
  const my_nick = cookies.get('nick_name');

  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  console.log('profilepage - ', id);

  useEffect(() => {
    if (id)
      setUserNickname(id);
  }, [id])

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
          setData(res.data)
          if (res.data.userData.nick_name === my_nick && res.data.userData.twoFA)
            setIsActivated(true);
          else
            setIsActivated(false);
          if (res.data.userData.nick_name !== my_nick) {
            setIsBlock(res.data.userData.blocks.some((block: any)=> block.blocked_user_id === my_id));
          }
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
        console.log('friend info', res);
        if (res.data.status)
          setIsFriend(true);
        else
          setIsFriend(false);
      });
    };

    if (userNickname)
    {
      fetchData(); 
      if (userNickname !== my_nick)
        fetchFriendData();
    }
    
  }, [userNickname, isFriend, isOTP, rendering]);

	useEffect(() => {

    const renderProfile = (data :any) => {
      setRendering(data.data);
    }
    console.log(`socket Effect : ${socket}`)
    if (socket)
  		socket.on(`render-profile`, renderProfile);
	
		return () => {
      if(socket)
  			socket.off("render-profile", renderProfile);
		};
	}, [socket]) 

  const handleFriend = async () => {
    if (isFriend) {
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
        setIsFriend(false);
      })
      .catch((err) => {
      })
    }
    else {
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
      })
    }
   }
 
  const handleBlock = async() => {
    if (isBlock)
    {
      await axiosToken.delete(`${process.env.NEXT_PUBLIC_API_URL}social/deleteBlockedUser`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('access_token')}`,
        },
        data: {
          user_id: my_id,
          user_nickname: my_nick,
          friend_id: Number(data.userData.user_id),
          friend_nickname: userNickname
        }})
      .then((res) => {
        setIsBlock(false);
      })
    }
    else {
      await axiosToken.post(`${process.env.NEXT_PUBLIC_API_URL}social/addBlockedUser`,{
        user_id: my_id,
        user_nickname: my_nick,
        friend_id: Number(data.userData.user_id),
        friend_nickname: userNickname
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('access_token')}`,
        },
      })
      .then((res) => {
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
    if (file && file.size > 1024 * 1024 * 1) {
      window.alert('1MB 이하의 이미지만 업로드 가능합니다.');
      return;
    }
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
        setRendering(res.data.time);
        setProfile(res.data.time);
      })
  }

  const imageLoader = (src: any) => {
    return `${process.env.NEXT_PUBLIC_API_URL}user/getimg/nickname/${src}`
  }

  if (!data)
    return <div>loading...</div>;

  return (  
    <div>
      <Grid container className={styles.profileBox}>
        <Grid item className={styles.imageContainer} alignItems='center' display='flex'padding='1%' flexDirection='column'>
          <Avatar
            src={imageLoader(`${userNickname}?${rendering}`)}
            sx={{
              width: '80%',
              height: '80%',
              border: '2px solid white',
              boxShadow: '0px 0px 10px 0px rgba(255,255,255,0.5)',
            }}
          />
          <Typography sx={{color: 'white',  whiteSpace: 'nowrap', marginLeft: '5%', fontSize: '1.5vw'}}>
            {userNickname !== my_nick ? `${userNickname}` : my_nick}
          </Typography>
        </Grid>
        <Grid container justifyContent="center" spacing={4}>
        <Grid item>
          <Grid container direction="column" alignItems="flex-end">
          <Typography sx={{ color: 'green', fontSize: '3vw' }}>
              Ladder
            </Typography>
            <Typography sx={{ color: 'white', fontSize: '1.5vw' }}>
              Win
            </Typography>
            <Typography sx={{ color: 'white', fontSize: '1.5vw' }}>
              Lose
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="column" alignItems="flex-start">
            <Typography sx={{ color: 'green', fontSize: '3vw' }}>
              {Math.round(data.userData.ladder)}
            </Typography>
            <Typography sx={{ color: 'white', fontSize: '1.5vw' }}>
              {data.userData.win}
            </Typography>
            <Typography sx={{ color: 'white', fontSize: '1.5vw' }}>
              {data.userData.lose}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
          {userNickname !==  my_nick ? ( 
              <div className={styles.buttons}>
                {isFriend? (
                  <Button variant="contained" onClick={() => handleFriend()}>
                    <Typography sx={{ color: 'white', fontSize: '1vw' }}>
                      친구삭제
                    </Typography>
                  </Button>
                  ) : (
                  <Button variant="contained" onClick={() => handleFriend()} sx={{marginLeft: '1vw'}}>
                    <Typography sx={{ color: 'white', fontSize: '1vw' }}>
                      친구추가
                    </Typography>
                  </Button>
                  )}
                {isBlock? (
                  <Button variant="contained" onClick={() => handleBlock()}>
                    <Typography sx={{ color: 'white', fontSize: '1vw' }}>
                      차단해제
                    </Typography>
                  </Button>
                  ) : (
                  <Button variant="contained" onClick={() => handleBlock()} sx={{marginLeft: '1vw'}}>
                    <Typography sx={{ color: 'white', fontSize: '1vw' }}>
                      차단
                    </Typography>
                  </Button>
                  )}
              </div>
          ) : (
            <div className={styles.imageContent}>
              <div className={styles.buttons}>
                <Button variant="contained"  component="label" >
                  <Typography sx={{ color: 'white', fontSize: '1vw' }}>
                  프로필 수정
                  </Typography>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImgChange} />
                </Button>
                <Button variant="contained" onClick={() => handleOTP()} sx={{marginLeft: '1vw'}}>
                  <Typography sx={{ color: 'white', fontSize: '1vw' }}>
                  {isActivated? '2차인증 비활성화' : '2차인증 활성화'}
                  </Typography>
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
          {(data.achievements && data.achievements[0]) && (
            <Tooltip title="도전과제: 첫승하기">
              <MedalIcon sx={{
                fontSize: '5vw',
                position: 'absolute',
                top: '0',
                left: '73%',
                color: 'brown',
              }}/>
            </Tooltip>
          )}
          {(data.achievements && data.achievements[1]) && (
            <Tooltip title="도전과제: 10승하기">
              <MedalIcon sx={{
                fontSize: '5vw',
                position: 'absolute',
                top: '0',
                left: '80%',
                color: 'silver',
              }}/>
            </Tooltip>
          )}
          {(data.achievements && data.achievements[2]) && (
            <Tooltip title="도전과제: 50승하기">
              <MedalIcon sx={{
                fontSize: '5vw',
                position: 'absolute',
                top: '0',
                left: '87%',
                color: 'gold',
              }}/>
            </Tooltip>
          )}
      </Grid>
        <Grid container className={styles.matchlistBox}>
          <Matchlist key={data.userData.user_id} id={data.userData.user_id} name={userNickname}/>
        </Grid>
    </div>
  );
}

export default ProfilePage;


// 'use client';
// import ProfilePage from '@/components/mainbox/profile';
// import { useRouter, useSearchParams } from 'next/navigation';
// import ChatSocket  from '@/app/main_frame/socket_provider';
// import ChatBlockProvider from '@/app/main_frame/shared_state';
// import StatusContextProvider from '@/app/main_frame/status_context';

// import { useMainBoxContext } from '@/app/main_frame/mainbox_context';

// export default function Profile() {

// 	return (
// 		<ProfilePage />
// 	)

// 	// return <div>ProfilePage to {search}</div>;
// }