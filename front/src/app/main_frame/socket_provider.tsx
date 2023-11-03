
"use client"

import React, { memo, createContext, useContext } from 'react';
import { Socket } from "socket.io-client"

import { useCookies } from "next-client-cookies"
import { io } from "socket.io-client";

import { getCookie } from 'cookies-next';


const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`,
{
  query: {
      user_id: getCookie('user_id'),
  },
  extraHeaders: {
      token: getCookie('access_token'),
  },
});

const ChatSocketContext = createContext<Socket>(null);


export const useChatSocket = () => {
  return useContext(ChatSocketContext);
};

export function ChatSocket ({ children }: any) {


  socket.on("connect" , () => {
    console.log('socket connected - ', socket.id); // value
  })

  socket.on("disconnect", () => {
    console.log('socket diconnected - ', socket.id); // undefined
  });

  return (
    <ChatSocketContext.Provider value={socket}>
      {children}
    </ChatSocketContext.Provider>
  );
}

export const memoChatSocket = memo(ChatSocket);

export default ChatSocket;



// "use client"

// import React, { memo, createContext, useContext } from 'react';
// import { Socket } from "socket.io-client"

// import { useCookies } from "next-client-cookies"
// import { io } from "socket.io-client";

// const ChatSocketContext = createContext<Socket>(null);


// export const useChatSocket = () => {
//   return useContext(ChatSocketContext);
// };

// export function ChatSocket ({ children }: any) {

//   // const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`);

//   const cookies = useCookies();

//   const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`,
//   {
//     query: {
//         user_id: cookies.get('user_id'),
//     },
//     extraHeaders: {
//         token: cookies.get('access_token'),
//     },
//   });

//   socket.on("connect" , () => {
//     console.log('socket connected - ', socket.id); // value
//   })

//   socket.on("disconnect", () => {
//     console.log('socket diconnected - ', socket.id); // undefined
//   });

//   return (
//     <ChatSocketContext.Provider value={socket}>
//       {children}
//     </ChatSocketContext.Provider>
//   );
// }

// export const memoChatSocket = memo(ChatSocket);

// export default ChatSocket;