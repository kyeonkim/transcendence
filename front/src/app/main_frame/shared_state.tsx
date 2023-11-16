'use client'
import { memo, useMemo, createContext, useState, useContext } from 'react';

export const ChatBlockContext = createContext();

export const ChatBlockProvider = ({ children } :any) => {
    const [chatBlockRenderMode, setChatBlockRenderMode] = useState('chatList');

    const value = useMemo(() => ({
        chatBlockRenderMode,
        setChatBlockRenderMode
    }), [chatBlockRenderMode])

//     return (
//         <ChatBlockContext.Provider value={value}>
//             {children}
//         </ChatBlockContext.Provider>
//   );

    return (
         <ChatBlockContext.Provider value={{chatBlockRenderMode, setChatBlockRenderMode}}>
            {children}
         </ChatBlockContext.Provider>
    );
};

export const useChatBlockContext = () => {
  return useContext(ChatBlockContext);
};

export default ChatBlockProvider;