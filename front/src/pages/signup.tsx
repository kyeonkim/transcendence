import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const ProfilePage: React.FC = () => {
  const router = useRouter();

  const { oauth_token } = router.query;
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');

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

  const handleSetData = () => {

    const data = {
      oauth_token, //백앤드꺼
      profileImage,
      nickname
    };
    /*
      {
        value : true or false,
        access_token: '1234',
        refresh_token: '1234'
      }
    */
    // axios.post('/api/user', data);
    // response.data ? true : false
    //true -> main
    //false ->nickname

    console.log('data: ', data);
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
        <Link href={`/main`}>
        <button onClick={handleSetData}>
          저장
        </button>
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
