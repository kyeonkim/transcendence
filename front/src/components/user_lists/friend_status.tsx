import { useState, useEffect } from "react";
import { useChatSocket } from "@/app/main_frame/socket_provider";
import axios from "axios";

export function useFriendList(myId: any) {
  const [apiResponse, setApiResponse] = useState([]);
  const socket = useChatSocket();

  useEffect(() => {
    const fetchData = async () => {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}social/getFriendList/${myId}`)
        .then((response) => {
          console.log('friend list response ', response.data);
          if (response.data.status) {
            const newResponse = response.data.data.map((user: any) => {
              user.status = 'offline';
              return user;
            });
            setApiResponse(newResponse);
          } else {
            setApiResponse([]);
          }
        })
        .catch((err) => {
          console.log('friend list error ', err);
        });
    };

    const handleRenderFriend = () => {
      fetchData();
    };

    socket.on(`render-friend`, handleRenderFriend);

    fetchData();

    return () => {
      socket.off(`render-friend`, handleRenderFriend);
    };
  }, [myId, socket]);

  useEffect(() => {
    const handleStatusUpdate = (data: any) => {
      updateStatus(data.user_id, data.status);
    };

    socket.on('status', handleStatusUpdate);
    return () => {
      socket.off('status', handleStatusUpdate);
    };
  }, [apiResponse, socket]);

  const updateStatus = (userId: any, status: any) => {
    setApiResponse((prevState) =>
      prevState.map((user: any) => {
        if (user.followed_user_id == Number(userId)) {
          console.log('update status ', user, status);
          return { ...user, status };
        }
        return user;
      })
    );
    if (status === 'login') {
      socket.emit('status', { user_id: myId, status: 'online', target: userId });
    }
  };

  return apiResponse;
}
