'use client';
import React from 'react';
import styles from './mainbox.module.css';
import Button from '@mui/material/Button';
import Matchlist from './matchlist';
import Image from 'next/image';


/*
여기서 props로 넘어온 닉네임이랑 전역에 있는 내닉네임이랑 비교하고 그에따른 버튼활성화 필요 
*/



const ProfilePage = (props: any) => {
  const userNickname = props.id;

  const handleAddfriend = (id: any) => {
    console.log("add friend: " + id);
  }

  const handleBlock = (id: any) => {
    console.log('차단: ', id);
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
            {`${userNickname}`}
          </div>
          {userNickname ? (
            <div className={styles.imageContent}>
              <div className={styles.buttons}>
                <Button variant="outlined" className={styles.roundButton} onClick={() => handleAddfriend(userNickname)}>
                  친구 추가
                </Button>
                <Button variant="outlined" className={styles.roundButton} onClick={() => handleBlock(userNickname)}>
                  차단
                </Button>
              </div>
            </div>
          ) : (
            <div className={styles.imageContent}>
              <Image loader={imageLoader} src={`${userNickname}`} alt="User Image" className={styles.userImage} width={0} height={0} />
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
