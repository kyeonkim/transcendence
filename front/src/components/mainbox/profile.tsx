import React from 'react';
import styles from './mainbox.module.css';
import Button from '@mui/material/Button';
import axios from 'axios';

const ProfilePage = (props: any) => {
	const search = props.id;

  const handleAddfriend = (id: string) => async () => {
    const response = await axios.post("http://10.13.9.2:4242/user/addfriend",
      {
        "user_id": 0,
        "friend_id": 2,
      })
    .catch(function (error) {
      console.log(error);
    });
    // 다른 클라이언트에게 친구추가알림 어떻게 할까?
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
            <Button variant="outlined" disabled={!search} className={styles.roundButton} onClick={handleAddfriend(search)}>
              친구 추가
            </Button>
            <Button variant="outlined" disabled={!search} className={styles.roundButton} onClick={handleBlock(search)}>
              차단
            </Button>
            {/* <Button variant="outlined" className={styles.roundButton}>Button 3</Button> */}
          </div>
        </div>
          <div className={styles.bottomHalfContainer}>
            <div className={styles.leftHalfComponent}></div>
            <div className={styles.rightHalfComponent}></div>
          </div>
      </div>
		)
}

export default ProfilePage;
