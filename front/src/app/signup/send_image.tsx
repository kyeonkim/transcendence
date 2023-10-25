'use client'

import { useState } from 'react';


export default async function SendImage () {

const [profileImage, setProfileImage] = useState<string | null>(null);

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
        {/* <div style={{ marginTop: '20px' }}>
            <label htmlFor="nickname">Nickname: </label>
            <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={handleNicknameChange}
            />
        </div> */}
        {/* <div style={{ marginTop: '20px' }}>
            <button onClick={handleSetData}>
            저장
            </button>
        </div> */}
      </div>
      </div>
    );
  
  }