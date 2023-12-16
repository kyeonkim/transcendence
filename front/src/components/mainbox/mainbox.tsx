import React, { useState, useEffect } from 'react';
import ProfilePage from './profile';
import Matching from './match';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Profile from './profile';
import { useMainBoxContext } from '../../app/main_frame/mainbox_context';

// const MainBox = (props: any) => {
export default function MainBox(props: any)
{
  const route = useRouter();
  const { clicked, id, setProfile } = useMainBoxContext();
  const [status, setStatus] = useState(true);

  const changeStat = (stat: boolean) => {
    setStatus(stat)
  }

  useEffect(() => {
    handleRender();
  },[status])

  const handleRender = () => {
    if (clicked === 1 && status)
    {
      // return 
      // (
      //   <Link href="/profile">
      //     <ProfilePage nickname={id} setProfile={null}/>
      //   </Link>
      // );

      route.push('/main_frame/profile?nickname='+id);
      // return <ProfilePage nickname={id} setProfile={setProfile}/>;
    }
    else
      return <Matching changeStat={changeStat}/>;
  };	

  return <div>{handleRender()}</div>;
};
