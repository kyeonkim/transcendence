'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import axios from 'axios';
import { setCookie } from 'cookies-next';

const ProfilePage: React.FC = () => {
  const router = useRouter();

  const { oauth_token } = router.query;
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [filename, setFilename] = useState('');
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setProfileImage(e.target.result as string);
          setFilename(file.name);
        }
      };
      reader.readAsDataURL(file);
      console.log('file: ', file.name)
    }
  };

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };

  const handleSetData = async () => {

    const data = {
      access_token: oauth_token,
      nick_name: nickname,
      img_name: filename,
      // img_data: profileImage,
    };
   console.log('data: ', data);
<<<<<<< HEAD:front/src/pages/signup.tsx
   const response = await axios.post('http://10.13.9.2:4242/user/create', data);
   console.log("sign UP: ", response) 
   if (response.data.status)
    {
      setCookie('access_token', response.data.token.access_token);
      setCookie('refresh_token', response.data.token.refresh_token);
      router.push('/main');
    }
    else
    {
      window.alert('중복된 닉네임');
    }
=======
   const response = await axios.post('http://10.13.9.4:4242/user/create', data);
  //  console.log('response: ', response);
    if (response.data)
      router.push({
        pathname: '/main',
        query: {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token
        },
      }, '/main');
>>>>>>> FRONT-kshim:front/src/app/signup/signup_proto.tsx
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Set User</h1>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="profileImage">Image: </label>
        <input
          type="file"
          id="profileImage"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>
      {profileImage && (
        <div>
          <img
            src={profileImage}
            alt="프로필 사진"
            style={{ width: '150px', height: '150px', borderRadius: '50%' }}
          />
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="nickname">Nickname: </label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={handleNicknameChange}
        />
      </div>
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSetData}>
          저장
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
