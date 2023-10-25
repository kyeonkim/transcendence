import React from 'react';
import styles from './mainbox.module.css';
import Button from '@mui/material/Button';
import axios from 'axios';
import Matchlist from './matchlist';

const ProfilePage = (props: any) => {
	const search = props.id;

  const handleAddfriend = (id: string) => async () => {
<<<<<<< HEAD
    await axios.post("http://10.13.9.2:4242/user/addfriend",
=======
    await axios.post("http://10.13.9.4:4242/user/addfriend",
>>>>>>> FRONT-kshim
      {
        "user_id": 0,
        "friend_id": 0
      })
    .catch(function (error) {
      console.log(error);
    });
    // 다른 클라이언트에게 친구추가알림
  }

  const handleBlock = (id: string) => () => {
    //차단 로직
    console.log('차단: ', id);
  }

  return (  
      <div className={styles.mainContainer}>
        <div className={styles.topComponent}>
          <div className={styles.imageContainer}>
            <img src="./favicon.ico" alt="User Image" className={styles.userImage} />
            <div className={styles.userName}>{search ? `${search}` : 'MY_PROFILE'}'s page</div>
              {search ? (
                <><Button variant="outlined" className={styles.roundButton} onClick={handleAddfriend(search)}>
              친구 추가
            </Button><Button variant="outlined" className={styles.roundButton} onClick={handleBlock(search)}>
                차단
              </Button></>
              ) : (
              <><Button variant="outlined" className={styles.roundButton}>
                프로필 수정
              </Button><Button variant="outlined" className={styles.roundButton}>
                  로그아웃
                </Button><Button variant="outlined" className={styles.roundButton}>
                  회원탈퇴
                </Button></>
              )}
            {/* <Button variant="outlined" className={styles.roundButton}>Button 3</Button> */}
          </div>
        </div>
          <div className={styles.bottomHalfContainer}>
            <div className={styles.leftHalfComponent}>
            </div>
          
            <div className={styles.rightHalfComponent}>
              <Matchlist /> {/* 여기에 props로 id를 넘겨주고 id에따라 전적요청 및 일정부분 넘어가면 스크롤방식? 구현 or 갯수제한*/}
            </div>
          </div>
      </div>
		)
}

export default ProfilePage;
