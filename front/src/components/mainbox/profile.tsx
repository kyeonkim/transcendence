'use client';
import React, { useState, useEffect } from 'react';
import styles from './mainbox.module.css';
import Button from '@mui/material/Button';
import axios from 'axios';
import Matchlist from './matchlist';

const ProfilePage = (props: any) => {
  const [data, setData] = useState(null);
  const search = props.id;

  useEffect(() => {
    console.log('in profile page=========================================');
    console.log('search: ', search);
    const fetchData = async () => {
      if (search) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/nickname/${search}`);
          console.log(response);
          setData(response.data);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchData();
  }, [search]);

  const handleAddfriend = (id) => {
    console.log("add friend: " + id);
  }

  const handleBlock = (id) => {
    console.log('차단: ', id);
  }

  return (  
    <div className={styles.mainContainer}>
      <div className={styles.topComponent}>
        <div className={styles.imageContainer}>
          <img src="./favicon.ico" alt="User Image" className={styles.userImage} />
          <div className={styles.userName}>
            {search ? (data ? data.nick_name : '사용자 정보 없음') : 'MY_PROFILE'}
          </div>
          {search ? (
            <div>
              <Button variant="outlined" className={styles.roundButton} onClick={() => handleAddfriend(search)}>
                친구 추가
              </Button>
              <Button variant="outlined" className={styles.roundButton} onClick={() => handleBlock(search)}>
                차단
              </Button>
            </div>
          ) : (
            <div>
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
          )}
        </div>
      </div>
      <div className={styles.bottomHalfContainer}>
        <div className={styles.leftHalfComponent}></div>
        <div className={styles.rightHalfComponent}>
          <Matchlist id={search} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
