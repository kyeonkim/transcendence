"use client"


import Main from './containers';

import  ChatSocket  from './socket_provider';



export default function MainFrame () {

  console.log("Main Frame");

  return (
        <ChatSocket>
             <Main />
        </ChatSocket>
  );
}
