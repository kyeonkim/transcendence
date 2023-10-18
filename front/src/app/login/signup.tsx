'use client'

import axios from 'axios';

import { useState } from 'react';

import { permanentRedirect } from 'next/navigation';


export default function Signup (props:any) {

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [nickname, setNickname] = useState('');

  const access_token = props.access_token;

  let success = false;

  console.log('access_token in props', access_token);


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            setProfileImage(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    };

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(event.target.value);
  };


  const handleSetData = async () => {

    const data = {
      access_token: access_token,
      nick_name: nickname,
      img_name: profileImage
    };
   console.log('data: ', data);
   try
   {
      // const response = await axios.post('http://10.13.9.2:4242/user/create', data);
      //  console.log('response: ', response);

      // client component에서 하면, 외부로 드러난다. 감춰야 함.

      // const response = await axios.post('http://10.13.8.1:3000/login/api', {  
      //     access_token: data.access_token,
      //     nick_name: nickname,
      //     img_name: 'default'
      //   });

      const response = await fetch('http://10.13.8.1:3000/login/api', {
          method: "POST",
          body: JSON.stringify({
              access_token: data.access_token,
              nick_name: data.nick_name,
              img_name: data.img_name
        })
      });

      if (!response.ok)
      {
          throw new Error ("axios post login/api - response error");
      }
      console.log('axios post login/api - response:', response);
      success = true;
      // 성공하면 여기서 main_frame으로?

   }
   catch (error)
   {
      // axios는 catch 가능한 객체 던짐
      // fetch는 자체 확인 필요 (response.ok를 체크)
      // next.js 13에서 axios로도 app router의 api 접근 가능한지 확인
      // 예외 처리 후 entrance로?
   }

  }


  return (
      <div>
          <p>this is server component - SendImage.</p>
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
    </div>
  );
  
}