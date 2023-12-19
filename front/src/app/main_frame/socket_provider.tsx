'use client'
import React, { memo, createContext, useContext, useEffect, useState } from 'react';
import { Socket } from "socket.io-client"
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies"
import { io } from "socket.io-client";
import { axiosToken } from '@/util/token';

const ChatSocketContext = createContext<Socket>(null);


export const useChatSocket = () => {
  return useContext(ChatSocketContext);
};

export function ChatSocket ({ children, my_name, my_id }: any) {
  const cookies = useCookies();
  const route = useRouter();
  const [socket, setSocket] = useState<Socket>();
  const [ userId, setUserId ] = useState(0);
  const [prevUserId, setPrevUserId] = useState(0);

  const [userData, setUserData] = useState({});
  const [fetchDone, setFetchDone] = useState(false);

  const [socketLoading, setSocketLoading] = useState(false);
  console.log('in socket compo==',my_id);



  // useEffect(() => {
  //     // api로 nickname 가져오기
  //     const fetchUserData = async () => {
  //       await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/mydata`,{
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${cookies.get('access_token')}`
  //           },        
  //       }) 
  //       .then((res :any) => {
  //           console.log(`====================\nchatsocket context - fetchi\n====================`,res);
  //           if (res.data.status === true)
  //           {
  //               setUserData(res.data.userData);
  //               setFetchDone(true);
  //           }
  //       })
  //     }
  //   fetchUserData();
  // }, []);

  // useEffect(() => {
  //   console.log("res after fetchDone : ", fetchDone);
  //   if (fetchDone)
  //   {
  //     const tmpSocket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`,
  //     {
  //       query: {
  //           user_id: my_id,
  //       },
  //       extraHeaders: {
  //           token: cookies.get('access_token'),
  //       },
  //     });

  //     console.log('tmpSocket - ', tmpSocket);

  //     tmpSocket.on("connect" , () => {
  //         console.log('socket connected');
  //     })
    
  //     tmpSocket.on("disconnect", () => {
  //       console.log("서버와 연결이 끊김");
  //       // route.replace("/");
  //       // window.alert('서버와 연결이 끊어졌습니다.');
  //     });

  //     setSocket(tmpSocket);

  //     return () => {
  //       if (tmpSocket)
  //         tmpSocket.disconnect();
  //     }
  //   }
  // }, [fetchDone]);
  
    useEffect(() => {
          // let tmpSocket : any;
          // if(my_id) {
            console.log('my_id - ', my_id.toString());
            console.log('access_token - ', cookies.get('access_token'));
            // setPrevUserId(userId);
            const tmpSocket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`,
            {
              query: {
                  user_id: my_id,
              },
              extraHeaders: {
                  token: cookies.get('access_token'),
              },
            });
            console.log('tmpSocket - ', tmpSocket);
  
            tmpSocket.on("connect" , () => {
                console.log('socket connected');
            })
          
            tmpSocket.on("disconnect", () => {
              console.log("서버와 연결이 끊김");
              // route.replace("/");
              // window.alert('서버와 연결이 끊어졌습니다.');
            });
  
            setSocket(tmpSocket);
          // }

          return () => {
            if (tmpSocket)
              tmpSocket.disconnect();
          }
      }, []);
    
    useEffect(() => {
      console.log("before socket : ", socket);
      if (socket)
      {
        console.log("after socket : ", socket);
        console.log('socket ready');
      }
    }, [socket])



  //   useEffect(() => {
  //     let tmpSocket : any;
  //     // if(my_id) {
  //       console.log('my_id - ', userId);
  //       setPrevUserId(userId);
  //       tmpSocket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`,
  //       {
  //         query: {
  //             user_id: my_id,
  //         },
  //         extraHeaders: {
  //             token: cookies.get('access_token'),
  //         },
  //       });

  //       console.log('tmpSocket - ', tmpSocket);

  //       tmpSocket.on("connect" , () => {
  //           console.log('socket connected');
  //       })
      
  //       tmpSocket.on("disconnect", () => {
  //         console.log("서버와 연결이 끊김");
  //         // route.replace("/");
  //         // window.alert('서버와 연결이 끊어졌습니다.');
  //       });

  //       setSocket(tmpSocket);
  //     }

  //     return () => {
  //       if (tmpSocket)
  //         tmpSocket.disconnect();
  //     // }
  // }, [my_id]);


  // useEffect(() => {
  //   console.log("fetchDone: ", fetchDone);
  //   if (fetchDone === true)
  //   {
  //       // let tmpSocket :any;

  //       console.log('chatsocket context - user_id : ', userData.user_id);
  //       console.log('access_token - ', cookies.get('access_token'));

  //       const tmpSocket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`,
  //       {
  //         query: {
  //             user_id: userData.user_id,
  //         },
  //         extraHeaders: {
  //             token: cookies.get('access_token'),
  //         },
  //       });

  //       console.log('tmpSocket - ', tmpSocket);

  //       tmpSocket.on("connect" , () => {
  //           console.log('socket connected');
  //       })
      
  //       tmpSocket.on("disconnect", () => {
  //         console.log("서버와 연결이 끊김");
  //         // route.replace("/");
  //         // window.alert('서버와 연결이 끊어졌습니다.');
  //       });

  //       setSocket(tmpSocket);

  //       return () => {
  //         if (tmpSocket)
  //           tmpSocket.disconnect();
  //       }
  //   }
  // }, [fetchDone]);


  //   useEffect(() => {

  //     // api로 nickname 가져오기
  //     let tmpSocket :any;

  //     const fetchUserData = async () => {
  //       setSocketLoading(true);

  //       await axiosToken.get(`${process.env.NEXT_PUBLIC_API_URL}user/getdata/mydata`,{
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${cookies.get('access_token')}`
  //           },        
  //       }) 
  //       .then((res :any) => {
  //           console.log(`====================\nchatsocket context - fetchi\n====================`,res);
  //           if (res.data.status === true)
  //           {
  //               let userId = res.data.userData.user_id;

  //               console.log('chatsocket context - user_id : ', userId);
  //               console.log('access_token - ', cookies.get('access_token'));
        
  //               tmpSocket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`,
  //               {
  //                 query: {
  //                     user_id: userId,
  //                 },
  //                 extraHeaders: {
  //                     token: cookies.get('access_token'),
  //                 },
  //               });
        
  //               console.log('tmpSocket - ', tmpSocket);
        
  //               tmpSocket.on("connect" , () => {
  //                   console.log('socket connected');
  //               })
              
  //               tmpSocket.on("disconnect", () => {
  //                 console.log("서버와 연결이 끊김");
  //                 // route.replace("/");
  //                 // window.alert('서버와 연결이 끊어졌습니다.');
  //               }).finally(() => {
  //                  setSocketLoading(false);
  //                  setSocket(tmpSocket);
  //               });
        

                
  //           }
  //       })
  //     }

  //     fetchUserData();

  //     return () => {
  //         tmpSocket.disconnect();
  //     }
      
  // }, []);



  return (
    <div>
      {socket && 
          <ChatSocketContext.Provider value={socket}>
            {children}
          </ChatSocketContext.Provider>
      }
    </div>
  );
}

export const memoChatSocket = memo(ChatSocket);

export default ChatSocket;


