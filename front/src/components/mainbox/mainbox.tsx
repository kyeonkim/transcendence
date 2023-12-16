import React, { useState, useEffect } from 'react';
// import ProfilePage from './profile';
import Matching from './match';
import { useRouter } from 'next/navigation';


const MainBox = (props: any) => {
  const route = useRouter();
  const { mod, search, setProfile } = props;
  const [status, setStatus] = useState(true);

  const changeStat = (stat: boolean) => {
    setStatus(stat)
  }

  useEffect(() => {
    handleRender();
  },[status])

  const handleRender = () => {
    if (mod === 1 && status)
    {
      route.push('/profile?nickname='+search);
      // return <ProfilePage nickname={search} setProfile={setProfile}/>;
    }
    else
      return <Matching changeStat={changeStat}/>;
  };	

  return <div>{handleRender()}</div>;
};

export default MainBox;