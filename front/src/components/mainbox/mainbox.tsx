import React, { useState, useEffect } from 'react';
import ProfilePage from './profile';
import Matching from './match';

const MainBox = (props: any) => {
  const { mod, search, setProfile } = props;
  const [status, setStatus] = useState(true);

  const changeStat = (stat: boolean) => {
    console.log("my stat====", stat);
    setStatus(stat)
  }

  useEffect(() => {
    handleRender();
  },[status])
  
  const handleRender = () => {
    if (mod === 1 && status)
      return <ProfilePage nickname={search} setProfile={setProfile}/>;
    else
      return <Matching changeStat={changeStat}/>;
  };	

  return <div>{handleRender()}</div>;
};

export default MainBox;