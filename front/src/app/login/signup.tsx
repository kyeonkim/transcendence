'use client'
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function Signup (props:any) {
  const [profileImage, setFile] = useState<File>();
  const [nickname, setNickname] = useState('');
  const [ImageUrl, setImageUrl] = useState<string | null>(null);

  const router = useRouter();
  const formData = new FormData()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const imageURL = URL.createObjectURL(file);
      setImageUrl(imageURL)
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleSetData = async () => {
    formData.append('nick_name', nickname);
    if (profileImage) {
      formData.append('file', profileImage);
    }
    await axios.post( `${process.env.NEXT_PUBLIC_FRONT_URL}api/user_create`, {
        access_token: props.access_token,
        nick_name: nickname,
      })
    .then(async (response) => {
      console.log('sign up response - ', response);
      formData.append('access_token', response.data.access_token);
      await axios.post(`${process.env.NEXT_PUBLIC_FRONT_URL}api/send_image`, formData,)
      .then((res) => {
        if(res.data.success)
          router.replace('/main_frame');
        else
          window.alert('Image upload failed')
      })
    })
    .catch((error) => {
      console.log ('sign up error =',error.response.data)
      window.alert('중복된 닉네임이거나 특수문자가 포함되어있습니다! 다시 입력해주세요.');
    })
  }
  return (
      <div>
          <div>this is server component - SendImage.</div>
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
                      src={ImageUrl}
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