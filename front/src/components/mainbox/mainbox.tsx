import React from 'react';
import ProfilePage from './profile';
import Matching from './match';

const MainBox = (props: any) => {
  const { mod, search, setProfile } = props;

  const handleRender = () => {
    if (mod === 1)
      return <ProfilePage nickname={search} setProfile={setProfile}/>;
    else
		  return <Matching />;
  };	

  return <div>{handleRender()}</div>;
};

export default MainBox;