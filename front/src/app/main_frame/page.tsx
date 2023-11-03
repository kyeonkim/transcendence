"use client"


import Main from './containers';

import  ChatSocket  from './socket_provider';



export default function MainFrame () {


  return (
        <ChatSocket>
             <Main />
        </ChatSocket>
  );
}
