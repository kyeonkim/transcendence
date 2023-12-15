import React, { useState } from 'react';
import ProfilePage from './profile';
import Matching from './match';

const MainBox = (props: any) => {
  const { mod, search, setProfile } = props;
  const [status, setStatus] = useState('');

  const changeStat = (stat: string) => {
    setStatus(stat)
  }

  const handleRender = () => {
    if (mod === 1)
      return <ProfilePage nickname={search} setProfile={setProfile}/>;
    else
		  return <Matching changeStat={changeStat}/>;
  };	

  return <div>{handleRender()}</div>;
};

export default MainBox;