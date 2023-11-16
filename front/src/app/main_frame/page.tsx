"use client"


import Main from './containers';

import ChatSocket  from './socket_provider';
import ChatBlockProvider from './shared_state';


export default function MainFrame () {

  // console.log('MainFrame: access_token getCookie:', access_cookie?.value);
  // console.log('MainFrame: refresh_token getCookie:', refresh_cookie?.value);

  return (

        <ChatSocket>
          <ChatBlockProvider>
             <Main />
          </ChatBlockProvider>
        </ChatSocket>

  );
}
