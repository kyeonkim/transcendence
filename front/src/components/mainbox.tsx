import React from 'react';
import ProfilePage from './mainbox/profile';
import ChatRoomPage from './mainbox/chatroom';
import MatchingButton from './mainbox/match';

const MainBox = (props: any) => {
  const value = props.mod;
  const search = props.search;

  const handleRender = () => {
    if (value === 1)
      return <ProfilePage id={search}/>;
    else if (value === 2)
		  return <ChatRoomPage />;
    else
		  return <MatchingButton />;
  };	

  return <div>{handleRender()}</div>;
};

export default MainBox;